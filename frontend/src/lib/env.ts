import "server-only";

// Lee una variable de entorno obligatoria y falla rápido si no existe.
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}. Revisa tu .env.local`);
  }
  return value;
}

export const env = {
  // Sin barra final para poder concatenar rutas como `${API_BASE_URL}/products`
  API_BASE_URL: required("API_BASE_URL").replace(/\/+$/, ""),
};
