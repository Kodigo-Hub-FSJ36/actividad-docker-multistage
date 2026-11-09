import type { CartItem, CartProductInput } from "./types";

// Store del carrito: estado en memoria + copia en localStorage.
// Lo consume React con useSyncExternalStore (ver cart-provider.tsx).

const STORAGE_KEY = "kodigo-shop:cart";
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.productId === "number" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    typeof item.stock === "number" &&
    typeof item.quantity === "number"
  );
}

// localStorage guarda texto que cualquiera puede editar: validamos antes de confiar en él.
function readStorage(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function setItems(next: CartItem[]) {
  items = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Modo privado o almacenamiento lleno: el carrito sigue funcionando en memoria.
  }
  listeners.forEach((listener) => listener());
}

function clamp(quantity: number, stock: number) {
  return Math.max(1, Math.min(quantity, stock));
}

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    // Si el carrito cambia en otra pestaña, esta se entera por el evento "storage".
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        items = readStorage();
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },

  // Debe devolver el mismo arreglo mientras no cambie: React compara por referencia.
  getSnapshot(): CartItem[] {
    if (!loaded) {
      items = readStorage();
      loaded = true;
    }
    return items;
  },

  // En el servidor no existe localStorage: el HTML inicial siempre muestra el carrito vacío.
  getServerSnapshot(): CartItem[] {
    return EMPTY;
  },

  add(product: CartProductInput, quantity = 1) {
    const current = cartStore.getSnapshot();
    const existing = current.find((item) => item.productId === product.productId);
    if (existing) {
      setItems(
        current.map((item) =>
          item.productId === product.productId
            ? { ...item, ...product, quantity: clamp(item.quantity + quantity, product.stock) }
            : item,
        ),
      );
    } else {
      setItems([...current, { ...product, quantity: clamp(quantity, product.stock) }]);
    }
  },

  updateQuantity(productId: number, quantity: number) {
    setItems(
      cartStore
        .getSnapshot()
        .map((item) => (item.productId === productId ? { ...item, quantity: clamp(quantity, item.stock) } : item)),
    );
  },

  remove(productId: number) {
    setItems(cartStore.getSnapshot().filter((item) => item.productId !== productId));
  },

  clear() {
    setItems(EMPTY);
  },
};
