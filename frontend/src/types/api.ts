// Tipos de la API de e-commerce, tomados de e-commerce-api-docs.json (components.schemas).

// Laravel serializa las columnas decimal como string ("1299.99") aunque Swagger diga number.
// Aceptamos ambos y convertimos al mostrar con formatPrice().
export type Decimal = number | string;

// Algunos endpoints devuelven el recurso directo y otros dentro de { data }.
export type MaybeWrapped<T> = T | { data: T };

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role?: "customer" | "admin";
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  price: Decimal;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: Decimal;
  subtotal: Decimal;
  created_at: string;
  updated_at: string;
  product?: Product;
};

export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export type Payment = {
  id: number;
  order_id: number;
  stripe_payment_intent_id: string;
  amount: Decimal;
  currency: string;
  status: PaymentStatus;
  payment_method: string | null;
  last4: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderStatus = "pending" | "paid" | "cancelled" | "failed";

export type Order = {
  id: number;
  user_id: number;
  total: Decimal;
  status: OrderStatus;
  shipping_address: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  payment?: Payment | null;
};

// Respuesta de POST /auth/login y POST /auth/register
export type AuthResponse = {
  message: string;
  user: User;
  token: string;
  token_type: string;
  expires_in: number;
};
