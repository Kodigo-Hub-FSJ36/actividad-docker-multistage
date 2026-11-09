import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Dominios desde los que next/image puede optimizar imágenes.
    // Agrega aquí el dominio que usen los image_url de tus productos.
    remotePatterns: [
      new URL("http://localhost:8000/**"),
      new URL("http://127.0.0.1:8000/**"),
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
    // Si la API corre en tu máquina (localhost), permitimos optimizar imágenes de IPs locales.
    // Así también funcionan con `pnpm build && pnpm start` (necesario para medir Lighthouse).
    // En un deploy real, con la API en un dominio público, esto queda en false.
    dangerouslyAllowLocalIP: /localhost|127\.0\.0\.1/.test(process.env.API_BASE_URL ?? ""),
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
