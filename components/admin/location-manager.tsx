'use client';

import { useState } from 'react';
import { supabase, type TruckSettings } from '@/lib/supabase-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Save, Loader2, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type LocationManagerProps = {
  settings: TruckSettings | null;
  onUpdate: () => void;
};

export function LocationManager({ settings, onUpdate }: LocationManagerProps) {
  const [location, setLocation] = useState(settings?.current_location || '');
  const [whatsapp, setWhatsapp] = useState(settings?.whatsapp_number || '');
  const [email, setEmail] = useState(settings?.email || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('truck_settings')
      .update({ id: 1, current_location: location, whatsapp_number: whatsapp, email })
      .eq('id', 1);
    setSaving(false);
    if (error) {
      toast({ title: 'Errore', description: 'Salvataggio non riuscito', variant: 'destructive' });
    } else {
      setSaved(true);
      toast({ title: 'Posizione aggiornata', description: location });
      setTimeout(() => setSaved(false), 2000);
      onUpdate();
    }
  };

  return (
    <Card className="border-border bg-card/60 p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Gestione Posizione</h2>
          <p className="text-sm text-muted-foreground">Dov&apos;è il furgone stasera?</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">Posizione attuale</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="es. Piazza Vittorio Veneto, Torino"
            className="bg-secondary/50"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="whatsapp">Numero WhatsApp</Label>
            <Input
              id="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+39 333 1234567"
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="paninaro@sassi.it"
              className="bg-secondary/50"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : saved ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {saved ? 'Salvato!' : 'Salva modifiche'}
        </Button>
      </div>
    </Card>
  );
}
