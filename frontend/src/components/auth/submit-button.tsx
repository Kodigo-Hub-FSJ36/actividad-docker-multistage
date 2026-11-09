import type { ReactNode } from "react";

type SubmitButtonProps = {
  pending: boolean;
  children: ReactNode;
  pendingText: string;
};

export function SubmitButton({ pending, children, pendingText }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
    >
      {pending ? pendingText : children}
    </button>
  );
}
