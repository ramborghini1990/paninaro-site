'use client';

import { CartProvider } from '@/lib/cart-context';
import { useMenuData } from '@/hooks/use-menu-data';
import { Hero } from '@/components/customer/hero';
import { MenuSection } from '@/components/customer/menu-section';
import { CartDrawer } from '@/components/customer/cart-drawer';
import { ContactSection } from '@/components/customer/contact-section';
import { GallerySection } from '@/components/customer/gallery-section';

export default function HomePage() {
  return (
    <CartProvider>
      <HomeContent />
    </CartProvider>
  );
}

function HomeContent() {
  const { menuItems, settings, gallery, loading } = useMenuData();

  return (
    <main className="min-h-screen bg-background">
      <Hero settings={settings} loading={loading} />
      <MenuSection menuItems={menuItems} loading={loading} />
      <GallerySection gallery={gallery} />
      <ContactSection settings={settings} />

      {/* Sticky cart button on mobile */}
      <StickyCartButton />

      <CartDrawer settings={settings} />
    </main>
  );
}

import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

function StickyCartButton() {
  const { itemCount, openCart, total } = useCart();
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 sm:bottom-6">
      <Button
        onClick={openCart}
        className="w-full bg-primary text-primary-foreground shadow-2xl shadow-primary/30 hover:bg-primary/90 animate-pulse-glow"
        size="lg"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        <span className="font-semibold">{itemCount} articoli</span>
        <span className="mx-2 opacity-50">|</span>
        <span className="font-bold">€{total.toFixed(2)}</span>
      </Button>
    </div>
  );
}
