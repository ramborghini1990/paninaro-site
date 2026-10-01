'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingCart, MessageCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import type { TruckSettings } from '@/lib/supabase-client';

type CartDrawerProps = {
  settings: TruckSettings | null;
};

export function CartDrawer({ settings }: CartDrawerProps) {
  const { items, isOpen, closeCart, updateQuantity, removeItem, clearCart, total } = useCart();

  const buildWhatsAppMessage = () => {
    let msg = 'Ciao Paninaro di Sassi! Vorrei ordinare:%0A%0A';
    items.forEach((item) => {
      const extras = [
        ...item.contorni.map((c) => c.name),
        ...item.salse.map((s) => s.name),
      ];
      const extraStr = extras.length > 0 ? ` (${extras.join(', ')})` : '';
      const unitPrice =
        Number(item.menuItem.price) +
        item.contorni.reduce((s, c) => s + Number(c.price), 0) +
        item.salse.reduce((s, c) => s + Number(c.price), 0);
      msg += `• ${item.quantity}x ${item.menuItem.name}${extraStr} - €${(unitPrice * item.quantity).toFixed(2)}%0A`;
    });
    msg += `%0ATotale: €${total.toFixed(2)}`;
    return msg;
  };

  const whatsappUrl = settings?.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=${buildWhatsAppMessage()}`
    : '#';

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col border-border bg-card p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 font-display text-xl font-bold">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Il tuo ordine
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold text-foreground">Carrello vuoto</p>
            <p className="text-sm text-muted-foreground">
              Aggiungi qualche panino dal menu per iniziare.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="space-y-4">
              {items.map((item) => {
                const unitPrice =
                  Number(item.menuItem.price) +
                  item.contorni.reduce((s, c) => s + Number(c.price), 0) +
                  item.salse.reduce((s, c) => s + Number(c.price), 0);
                return (
                  <div
                    key={item.key}
                    className="rounded-lg border border-border bg-secondary/30 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">
                          {item.menuItem.name}
                        </p>
                        {item.contorni.length > 0 && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            + {item.contorni.map((c) => c.name).join(', ')}
                          </p>
                        )}
                        {item.salse.length > 0 && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            + {item.salse.map((s) => s.name).join(', ')}
                          </p>
                        )}
                        <p className="mt-1 text-sm font-medium text-primary">
                          €{(unitPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.key)}
                        className="flex-shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.key, -1)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-foreground transition-colors hover:bg-secondary/70"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.key, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-foreground transition-colors hover:bg-secondary/70"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {items.length > 0 && (
          <SheetFooter className="border-t border-border px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Totale</span>
              <span className="font-display text-2xl font-bold text-primary">
                €{total.toFixed(2)}
              </span>
            </div>
            <div className="space-y-2">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-[#25D366] text-white hover:bg-[#25D366]/90" size="lg">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Ordina via WhatsApp
                </Button>
              </a>
              <Button
                variant="ghost"
                onClick={clearCart}
                className="w-full text-muted-foreground hover:text-destructive"
              >
                Svuota carrello
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
