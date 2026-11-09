export function OrdersSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden>
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="flex animate-pulse flex-col gap-3 rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
          <div className="flex justify-between">
            <div className="h-5 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-5 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-4 w-56 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}
