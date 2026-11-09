// Forma típica de un error de Laravel (por ejemplo un 422 de validación)
export type LaravelErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string[]>;

  constructor(status: number, body: LaravelErrorBody | null) {
    super(body?.message ?? `Error ${status} al llamar a la API`);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = body?.errors ?? {};
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
