import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type MenuItem = {
  id: string;
  category: 'panini' | 'contorni' | 'salse' | 'drinks';
  name: string;
  price: number;
  in_stock: boolean;
  display_order: number;
  created_at: string;
};

export type TruckSettings = {
  id: number;
  current_location: string;
  whatsapp_number: string;
  email: string;
  rating: number;
  review_count: number;
};

export type GalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
};

export type CategoryKey = 'panini' | 'contorni' | 'salse' | 'drinks';

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  panini: 'Panini',
  contorni: 'Contorni',
  salse: 'Salse',
  drinks: 'Bibite & Birre',
};

export const CATEGORY_ICONS: Record<CategoryKey, string> = {
  panini: '🥪',
  contorni: '🥗',
  salse: '🫙',
  drinks: '🍺',
};
