'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import type { TruckSettings } from '@/lib/supabase-client';

type ContactSectionProps = {
  settings: TruckSettings | null;
};

export function ContactSection({ settings }: ContactSectionProps) {
  const whatsappUrl = settings?.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`
    : '#';
  const emailUrl = settings?.email ? `mailto:${settings.email}` : '#';
  const rating = settings?.rating ?? 4.6;
  const reviewCount = settings?.review_count ?? 59;

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <div className="mb-8 text-center">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Contattaci
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Ordina, chiedi info o dicci cosa ne pensi.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* WhatsApp */}
          <Card className="group flex flex-col items-center gap-4 border-border bg-card/60 p-8 text-center transition-all hover:border-[#25D366]/40 hover:bg-card">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/10 transition-transform group-hover:scale-110">
              <MessageCircle className="h-8 w-8 text-[#25D366]" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">
                Ordina via WhatsApp
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {settings?.whatsapp_number || '+39 333 1234567'}
              </p>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="w-full bg-[#25D366] text-white hover:bg-[#25D366]/90" size="lg">
                <MessageCircle className="mr-2 h-5 w-5" />
                Invia un messaggio
              </Button>
            </a>
          </Card>

          {/* Email */}
          <Card className="group flex flex-col items-center gap-4 border-border bg-card/60 p-8 text-center transition-all hover:border-primary/40 hover:bg-card">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">
                Scrivici una email
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {settings?.email || 'paninaro@sassi.it'}
              </p>
            </div>
            <a href={emailUrl} className="w-full">
              <Button variant="outline" className="w-full border-primary/30 hover:border-primary hover:bg-primary/10" size="lg">
                <Mail className="mr-2 h-5 w-5" />
                Invia email
              </Button>
            </a>
          </Card>
        </div>

        {/* Google Reviews banner */}
        <Card className="mt-6 flex flex-col items-center gap-4 border-border bg-card/60 p-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
              <GoogleIcon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Google Reviews</p>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-bold text-foreground">
                  {rating.toFixed(1)}
                </span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-700 text-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-2xl font-bold text-foreground">{reviewCount}</p>
            <p className="text-sm text-muted-foreground">recensioni</p>
          </div>
        </Card>

        {/* Info footer */}
        <div className="mt-8 flex flex-col gap-3 rounded-xl border border-border bg-card/40 p-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {settings?.current_location || 'Piazza Vittorio Veneto, Torino'}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            Tutte le sere dalle 19:00 alle 03:00
          </div>
        </div>
      </div>
    </section>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
