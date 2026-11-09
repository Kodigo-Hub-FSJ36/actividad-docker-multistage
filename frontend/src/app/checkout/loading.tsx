export default function Loading() {
  return (
    <section className="flex animate-pulse flex-col gap-8" aria-hidden>
      <div className="h-9 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <div className="h-24 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-16 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-10 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-48 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </section>
  );
}
