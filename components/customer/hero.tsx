'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, Menu as MenuIcon, ShoppingCart, Phone, Mail } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import type { TruckSettings } from '@/lib/supabase-client';

const HERO_IMAGE = 'https://images.pexels.com/photos/35120750/pexels-photo-35120750.jpeg?auto=compress&cs=tinysrgb&w=1920';

type HeroProps = {
  settings: TruckSettings | null;
  loading: boolean;
};

export function Hero({ settings, loading }: HeroProps) {
  const { itemCount, openCart } = useCart();
  const router = useRouter();

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-hero-overlay" aria-hidden />
      <div className="absolute inset-0 bg-grain opacity-50" aria-hidden />

      {/* Top nav */}
      <nav className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-lg">
            P
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Paninaro di Sassi
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-foreground hover:bg-white/10 hover:text-foreground"
            onClick={() => router.push('/admin')}
          >
            Admin
          </Button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={openCart}
          >
            <ShoppingCart className="mr-1 h-4 w-4" />
            <span className="tabular-nums">{itemCount}</span>
          </Button>
        </div>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 flex min-h-[calc(100svh-73px)] flex-col justify-end px-4 pb-12 sm:px-8 sm:pb-20">
        <div className="mx-auto w-full max-w-3xl space-y-5">
          {/* Location badge */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="animate-pulse-glow border-0 bg-primary/90 px-3 py-1.5 text-sm font-semibold text-primary-foreground">
              <MapPin className="mr-1.5 h-3.5 w-3.5" />
              {loading
                ? 'Caricamento...'
                : settings?.current_location || 'Piazza Vittorio Veneto, Torino'}
            </Badge>
            <Badge className="border border-white/20 bg-black/50 px-3 py-1.5 text-sm font-medium text-foreground backdrop-blur-sm">
              <Clock className="mr-1.5 h-3.5 w-3.5" />
              Aperto fino a tardi
            </Badge>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground drop-shadow-2xl sm:text-7xl">
              Paninaro
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                di Sassi
              </span>
            </h1>
            <p className="max-w-xl text-lg text-foreground/80 sm:text-xl">
              Il vero street food notturno di Torino. Panini freschi, salse fatte in casa e birre gelate.
            </p>
          </div>

          {/* Rating + CTA */}
          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
            <a href="#menu" className="inline-block">
              <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
                <MenuIcon className="mr-2 h-5 w-5" />
                Vedi il Menu
              </Button>
            </a>
            <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-black/50 px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(settings?.rating ?? 4.6)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-600 text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">
                {settings?.rating?.toFixed(1) ?? '4.6'}
              </span>
              <span className="text-sm text-foreground/60">
                ({settings?.review_count ?? 59} recensioni)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-sm">
          <svg className="h-4 w-4 text-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
