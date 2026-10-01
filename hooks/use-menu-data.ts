'use client';

import { useEffect, useState } from 'react';
import { supabase, type TruckSettings, type MenuItem, type GalleryImage } from '@/lib/supabase-client';

export function useMenuData() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<TruckSettings | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [menuRes, settingsRes, galleryRes] = await Promise.all([
        supabase.from('menu_items').select('*').order('display_order'),
        supabase.from('truck_settings').select('*').eq('id', 1).maybeSingle(),
        supabase.from('gallery_images').select('*').order('display_order'),
      ]);
      setMenuItems((menuRes.data as MenuItem[]) || []);
      setSettings((settingsRes.data as TruckSettings) || null);
      setGallery((galleryRes.data as GalleryImage[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  return { menuItems, settings, gallery, loading };
}
