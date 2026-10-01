'use client';

import { Card } from '@/components/ui/card';
import type { GalleryImage } from '@/lib/supabase-client';

const FALLBACK_IMAGES = [
  'https://images.pexels.com/photos/11655727/pexels-photo-11655727.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/38337105/pexels-photo-38337105.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/6416558/pexels-photo-6416558.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/5779656/pexels-photo-5779656.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/17940004/pexels-photo-17940004.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/13037133/pexels-photo-13037133.jpeg?auto=compress&cs=tinysrgb&w=800',
];

type GallerySectionProps = {
  gallery: GalleryImage[];
};

export function GallerySection({ gallery }: GallerySectionProps) {
  const images = gallery.length > 0
    ? gallery.map((g) => g.image_url)
    : FALLBACK_IMAGES;

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <div className="mb-8 text-center">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Galleria
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Una serata al Paninaro di Sassi
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {images.slice(0, 6).map((url, i) => (
            <Card
              key={i}
              className={`group relative overflow-hidden border-border bg-card p-0 ${
                i === 0 ? 'col-span-2 row-span-2 sm:col-span-2' : ''
              }`}
            >
              <div className={`relative overflow-hidden ${i === 0 ? 'aspect-square sm:aspect-[4/3]' : 'aspect-square'}`}>
                <img
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
