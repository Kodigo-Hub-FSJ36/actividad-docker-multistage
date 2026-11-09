import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import type { MaybeWrapped, Product } from "@/types/api";
import { apiFetch } from "./client";
import { isApiError } from "./errors";
import { unwrap } from "./unwrap";

// Etiquetas de caché: las invalidaremos con updateTag() después de crear o pagar una orden,
// porque esas mutaciones cambian el stock.
export const PRODUCTS_TAG = "products";
export const productTag = (id: number) => `product-${id}`;

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag(PRODUCTS_TAG);
  cacheLife("hours");

  const products = unwrap(await apiFetch<MaybeWrapped<Product[]>>("/products"));
  return products.filter((product) => product.is_active);
}

export async function getProduct(id: number): Promise<Product | null> {
  "use cache";
  cacheTag(PRODUCTS_TAG, productTag(id));
  cacheLife("hours");

  try {
    return unwrap(await apiFetch<MaybeWrapped<Product>>(`/products/${id}`));
  } catch (error) {
    // Un 404 no es un error de la app: el producto no existe y mostraremos not-found.
    if (isApiError(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}
