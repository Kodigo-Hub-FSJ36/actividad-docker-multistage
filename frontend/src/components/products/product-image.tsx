import Image from "next/image";

type ProductImageProps = {
  src: string | null;
  alt: string;
  sizes: string;
  // true solo para imágenes visibles al cargar (posible LCP)
  eager?: boolean;
};

export function ProductImage({ src, alt, sizes, eager = false }: ProductImageProps) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-zinc-600 dark:text-zinc-400">
          Sin imagen
        </div>
      )}
    </div>
  );
}
