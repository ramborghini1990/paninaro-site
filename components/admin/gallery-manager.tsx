'use client';

import { useState, useCallback } from 'react';
import { supabase, type GalleryImage } from '@/lib/supabase-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Trash2, Loader2, ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type GalleryManagerProps = {
  images: GalleryImage[];
  onUpdate: () => void;
};

export function GalleryManager({ images, onUpdate }: GalleryManagerProps) {
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [captionInput, setCaptionInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const addImage = useCallback(
    async (url: string, caption?: string) => {
      if (!url.trim()) return;
      setUploading(true);
      const { error } = await supabase.from('gallery_images').insert({
        image_url: url.trim(),
        caption: caption?.trim() || null,
        display_order: images.length,
      });
      setUploading(false);
      if (error) {
        toast({ title: 'Errore', description: 'Aggiunta non riuscita', variant: 'destructive' });
      } else {
        toast({ title: 'Foto aggiunta' });
        setUrlInput('');
        setCaptionInput('');
        onUpdate();
      }
    },
    [images.length, onUpdate]
  );

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        addImage(reader.result as string, file.name);
      };
      reader.readAsDataURL(file);
    },
    [addImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const deleteImage = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from('gallery_images').delete().eq('id', id);
    setDeletingId(null);
    if (error) {
      toast({ title: 'Errore', description: 'Eliminazione non riuscita', variant: 'destructive' });
    } else {
      toast({ title: 'Foto eliminata' });
      onUpdate();
    }
  };

  return (
    <Card className="border-border bg-card/60 p-6">
      <div className="mb-5">
        <h2 className="font-display text-xl font-bold text-foreground">Gestione Galleria</h2>
        <p className="text-sm text-muted-foreground">Aggiungi o rimuovi foto dal sito.</p>
      </div>

      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'mb-4 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all',
          dragActive
            ? 'border-primary bg-primary/10'
            : 'border-border bg-secondary/30 hover:border-primary/50'
        )}
      >
        {uploading ? (
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Upload className="h-7 w-7 text-primary" />
          </div>
        )}
        <div>
          <p className="font-semibold text-foreground">
            {uploading ? 'Caricamento...' : 'Trascina qui una foto'}
          </p>
          <p className="text-sm text-muted-foreground">
            oppure incolla un URL immagine qui sotto
          </p>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <span className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <Upload className="h-4 w-4" />
            Scegli file
          </span>
        </label>
      </div>

      {/* URL input */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://... (URL immagine)"
          className="bg-secondary/50"
        />
        <Input
          value={captionInput}
          onChange={(e) => setCaptionInput(e.target.value)}
          placeholder="Didascalia (opzionale)"
          className="bg-secondary/50 sm:w-48"
        />
        <Button
          onClick={() => addImage(urlInput, captionInput)}
          disabled={!urlInput.trim() || uploading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 sm:flex-shrink-0"
        >
          Aggiungi
        </Button>
      </div>

      {/* Gallery grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-lg border border-border bg-secondary/30"
            >
              <div className="aspect-square">
                <img
                  src={img.image_url}
                  alt={img.caption || 'Gallery'}
                  className="h-full w-full object-cover"
                />
              </div>
              {img.caption && (
                <p className="truncate px-2 py-1 text-xs text-muted-foreground">
                  {img.caption}
                </p>
              )}
              <button
                onClick={() => deleteImage(img.id)}
                disabled={deletingId === img.id}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/90 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive"
              >
                {deletingId === img.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-secondary/20 py-8 text-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nessuna foto nella galleria</p>
        </div>
      )}
    </Card>
  );
}
