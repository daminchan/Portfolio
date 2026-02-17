# Known Issues（過去の問題と解決策）

実装時に参考にすべき既知の問題と解決策。

## モーダル: 前のデータが一瞬表示される

**症状**: モーダルA → モーダルBを開くと、一瞬モーダルAの内容が表示される

**原因**: props変更時にローカルstateがすぐに更新されない

**解決策**: IDの変更を検知して即座にリセットする

```tsx
const prevIdRef = useRef<string | null>(null);

useEffect(() => {
  const currentId = data?.id || null;
  if (currentId !== prevIdRef.current) {
    setLocalData(data?.items || []);
    prevIdRef.current = currentId;
  } else if (data?.items) {
    setLocalData(data.items);
  }
}, [data]);
```

**より良い方法**: `key` prop でコンポーネントごとリセットする（react-hooks.md 参照）

## モーダル: backdrop-blur による FPS 低下

**症状**: モーダル内で動画再生時にFPS低下

**原因**: `backdrop-blur-sm` はGPU負荷が高い（iframe動画との組み合わせで悪化）

**解決策**:
```tsx
// NG
<div className="bg-black/80 backdrop-blur-sm">
// OK
<div className="bg-black/90">
```

## モバイル: フッターにボタンが隠れる

**症状**: モーダル内の「次へ」ボタンがフッターナビに隠れて押せない

**解決策**:
```tsx
<div className="flex gap-3 pb-20 lg:pb-0">
  <Button>次へ</Button>
</div>
```

## モバイル: ドラッグ&ドロップとスワイプの競合

**症状**: モバイルでスクロールしようとするとドラッグが発動

**解決策**: タッチセンサーに長押し制約を設定する

```tsx
const touchSensor = useSensor(TouchSensor, {
  activationConstraint: { delay: 250, tolerance: 5 },
});
const mouseSensor = useSensor(MouseSensor, {
  activationConstraint: { distance: 10 },
});
const sensors = useSensors(mouseSensor, touchSensor);
```

## 楽観的UI: 削除後にアイテムが残る

**症状**: 削除操作後、リストからアイテムがすぐに消えない

**原因**: `invalidateQueries` でサーバー応答を待っている

**解決策**: `onMutate` で即座にキャッシュを更新し、エラー時にロールバックする

```tsx
onMutate: async (id) => {
  await queryClient.cancelQueries({ queryKey: ['items'] });
  const previous = queryClient.getQueryData(['items']);
  queryClient.setQueryData(['items'], (old) =>
    old?.filter((item) => item.id !== id)
  );
  return { previous };
},
onError: (err, id, context) => {
  queryClient.setQueryData(['items'], context?.previous);
},
```
