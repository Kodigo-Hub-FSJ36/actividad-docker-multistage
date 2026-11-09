import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  basePath: string;
};

export function Pagination({ page, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const href = (target: number) => `${basePath}?page=${target}`;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-2">
      {page > 1 && (
        <Link href={href(page - 1)} className="rounded-md px-3 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
          Anterior
        </Link>
      )}
      {pages.map((target) => (
        <Link
          key={target}
          href={href(target)}
          aria-current={target === page ? "page" : undefined}
          className={
            target === page
              ? "rounded-md bg-zinc-900 px-3 py-1 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "rounded-md px-3 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }
        >
          {target}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={href(page + 1)} className="rounded-md px-3 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
          Siguiente
        </Link>
      )}
    </nav>
  );
}
