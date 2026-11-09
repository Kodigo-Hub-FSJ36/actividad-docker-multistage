import type { OrderStatus } from "@/types/api";

// Record<OrderStatus, ...> obliga a cubrir todos los estados: si la API agrega uno nuevo
// y lo sumamos al tipo, TypeScript marcará error aquí hasta que le demos etiqueta y color.
const STATUS: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "Pendiente de pago", className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
  paid: { label: "Pagada", className: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" },
  cancelled: { label: "Cancelada", className: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300" },
  failed: { label: "Pago fallido", className: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = STATUS[status] ?? STATUS.pending;
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>{label}</span>;
}
