export default function Loading() {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="relative w-full max-w-sm">
        <div className="h-2.5 w-full rounded-full loading opacity-30" />
        <div className="mt-2 h-2 w-3/4 rounded-full loading opacity-50" />
      </div>
    </div>
  );
}