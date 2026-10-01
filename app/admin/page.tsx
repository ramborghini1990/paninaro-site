'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase, type MenuItem, type TruckSettings, type GalleryImage } from '@/lib/supabase-client';
import { LocationManager } from '@/components/admin/location-manager';
import { MenuManager } from '@/components/admin/menu-manager';
import { GalleryManager } from '@/components/admin/gallery-manager';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Star } from 'lucide-react';

export default function AdminPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<TruckSettings | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [menuRes, settingsRes, galleryRes] = await Promise.all([
      supabase.from('menu_items').select('*').order('category, display_order'),
      supabase.from('truck_settings').select('*').eq('id', 1).maybeSingle(),
      supabase.from('gallery_images').select('*').order('display_order'),
    ]);
    setMenuItems((menuRes.data as MenuItem[]) || []);
    setSettings((settingsRes.data as TruckSettings) || null);
    setGallery((galleryRes.data as GalleryImage[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              P
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">
                Paninaro di Sassi
              </h1>
              <p className="text-xs text-muted-foreground">Pannello di controllo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {settings && (
              <div className="hidden items-center gap-1.5 rounded-full bg-secondary/50 px-3 py-1.5 text-sm sm:flex">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-foreground">{settings.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({settings.review_count})</span>
              </div>
            )}
            <Link href="/">
              <Button variant="outline" size="sm" className="border-border hover:bg-secondary">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">Torna al sito</span>
                <span className="sm:hidden">Sito</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Admin content */}
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
        <LocationManager settings={settings} onUpdate={loadData} />
        <MenuManager items={menuItems} onUpdate={loadData} />
        <GalleryManager images={gallery} onUpdate={loadData} />
      </main>
    </div>
  );
}
