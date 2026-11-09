// Solo guardamos lo necesario para mostrar el carrito sin volver a llamar a la API.
export type CartItem = {
  productId: number;
  name: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  quantity: number;
};

export type CartProductInput = Omit<CartItem, "quantity">;
