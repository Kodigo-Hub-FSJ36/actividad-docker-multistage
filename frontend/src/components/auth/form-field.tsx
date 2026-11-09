import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  errors?: string[];
};

// Input con su label y los errores de validación que devolvió Laravel para ese campo.
export function FormField({ name, label, errors, ...inputProps }: FormFieldProps) {
  const errorId = `${name}-error`;
  const hasError = Boolean(errors?.length);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 aria-invalid:border-red-500 dark:border-zinc-700"
        {...inputProps}
      />
      {hasError && (
        <p id={errorId} className="text-sm text-red-600">
          {errors?.[0]}
        </p>
      )}
    </div>
  );
}
