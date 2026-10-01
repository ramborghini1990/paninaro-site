'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Check, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import {
  type MenuItem,
  type CategoryKey,
  CATEGORY_LABELS,
} from '@/lib/supabase-client';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

type MenuSectionProps = {
  menuItems: MenuItem[];
  loading: boolean;
};

const CATEGORY_ORDER: CategoryKey[] = ['panini', 'contorni', 'salse', 'drinks'];

export function MenuSection({ menuItems, loading }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('panini');
  const [selectedPanino, setSelectedPanino] = useState<MenuItem | null>(null);
  const [selectedContorni, setSelectedContorni] = useState<MenuItem[]>([]);
  const [selectedSalse, setSelectedSalse] = useState<MenuItem[]>([]);
  const { addItem, openCart } = useCart();

  const panini = menuItems.filter((i) => i.category === 'panini');
  const contorni = menuItems.filter((i) => i.category === 'contorni');
  const salse = menuItems.filter((i) => i.category === 'salse');
  const drinks = menuItems.filter((i) => i.category === 'drinks');

  const toggleContorno = (item: MenuItem) => {
    setSelectedContorni((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  const toggleSalsa = (item: MenuItem) => {
    setSelectedSalse((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  const handleAddPanino = () => {
    if (!selectedPanino) return;
    const contorniNames = selectedContorni.map((c) => c.name).join(', ');
    const salseNames = selectedSalse.map((s) => s.name).join(', ');
    const key = `${selectedPanino.id}|${contorniNames}|${salseNames}`;
    addItem({
      key,
      menuItem: selectedPanino,
      contorni: selectedContorni,
      salse: selectedSalse,
      quantity: 1,
    });
    toast({ title: 'Aggiunto al carrello', description: selectedPanino.name });
    setSelectedPanino(null);
    setSelectedContorni([]);
    setSelectedSalse([]);
  };

  const handleAddSimple = (item: MenuItem) => {
    addItem({
      key: `${item.id}|simple`,
      menuItem: item,
      contorni: [],
      salse: [],
      quantity: 1,
    });
    toast({ title: 'Aggiunto al carrello', description: item.name });
    openCart();
  };

  const currentItems =
    activeCategory === 'panini'
      ? panini
      : activeCategory === 'contorni'
      ? contorni
      : activeCategory === 'salse'
      ? salse
      : drinks;

  const renderPaninoBuilder = () => {
    if (activeCategory !== 'panini') return null;

    return (
      <Card className="mb-6 border-primary/30 bg-card/80 p-4 backdrop-blur sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-foreground">
            Crea il tuo panino
          </h3>
          {(selectedPanino || selectedContorni.length > 0 || selectedSalse.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedPanino(null);
                setSelectedContorni([]);
                setSelectedSalse([]);
              }}
            >
              <X className="mr-1 h-4 w-4" /> Reset
            </Button>
          )}
        </div>

        {/* Selected panino summary */}
        {selectedPanino && (
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge className="bg-primary text-primary-foreground">
              {selectedPanino.name} - &euro;{Number(selectedPanino.price).toFixed(2)}
            </Badge>
            {selectedContorni.map((c) => (
              <Badge key={c.id} variant="secondary" className="gap-1">
                {c.name} <span className="text-muted-foreground">+&euro;{Number(c.price).toFixed(2)}</span>
              </Badge>
            ))}
            {selectedSalse.map((s) => (
              <Badge key={s.id} variant="secondary" className="gap-1">
                {s.name} <span className="text-muted-foreground">+&euro;{Number(s.price).toFixed(2)}</span>
              </Badge>
            ))}
          </div>
        )}

        {/* Contorni multi-select */}
        {selectedPanino && (
          <>
            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold text-muted-foreground">
                Contorni (scegli quanti vuoi)
              </p>
              <div className="flex flex-wrap gap-2">
                {contorni.map((c) => {
                  const checked = selectedContorni.some((i) => i.id === c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleContorno(c)}
                      disabled={!c.in_stock}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all',
                        checked
                          ? 'border-primary bg-primary/20 text-foreground'
                          : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/50',
                        !c.in_stock && 'opacity-40 line-through'
                      )}
                    >
                      {checked && <Check className="h-3 w-3 text-primary" />}
                      {c.name} +&euro;{Number(c.price).toFixed(2)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Salse multi-select */}
            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold text-muted-foreground">
                Salse (scegli quanti vuoi)
              </p>
              <div className="flex flex-wrap gap-2">
                {salse.map((s) => {
                  const checked = selectedSalse.some((i) => i.id === s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleSalsa(s)}
                      disabled={!s.in_stock}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all',
                        checked
                          ? 'border-accent bg-accent/20 text-foreground'
                          : 'border-border bg-secondary/50 text-muted-foreground hover:border-accent/50',
                        !s.in_stock && 'opacity-40 line-through'
                      )}
                    >
                      {checked && <Check className="h-3 w-3 text-accent" />}
                      {s.name} +&euro;{Number(s.price).toFixed(2)}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={handleAddPanino}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Aggiungi al carrello
              {selectedPanino && (
                <span className="ml-2 font-bold">
                  &euro;
                  {(
                    Number(selectedPanino.price) +
                    selectedContorni.reduce((s, c) => s + Number(c.price), 0) +
                    selectedSalse.reduce((s, c) => s + Number(c.price), 0)
                  ).toFixed(2)}
                </span>
              )}
            </Button>
          </>
        )}
      </Card>
    );
  };

  return (
    <section id="menu" className="scroll-mt-0 bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        {/* Section header */}
        <div className="mb-8 text-center">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Il Menu
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Scegli, personalizza e ordina. Semplice.
          </p>
        </div>

        {/* Category tabs */}
        <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-2">
          {CATEGORY_ORDER.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'flex-shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all',
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
              )}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-xl bg-secondary"
              />
            ))}
          </div>
        ) : (
          <>
            {renderPaninoBuilder()}

            {/* Items grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              {currentItems.map((item) => {
                const isSelected = selectedPanino?.id === item.id;
                return (
                  <Card
                    key={item.id}
                    className={cn(
                      'group flex items-center justify-between gap-3 border bg-card/60 p-4 transition-all hover:border-primary/40 hover:bg-card',
                      !item.in_stock && 'opacity-50',
                      isSelected && 'border-primary bg-primary/10'
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <button
                        onClick={() => {
                          if (item.category === 'panini' && item.in_stock) {
                            setSelectedPanino(isSelected ? null : item);
                            if (!isSelected) {
                              setSelectedContorni([]);
                              setSelectedSalse([]);
                            }
                          }
                        }}
                        disabled={!item.in_stock || item.category !== 'panini'}
                        className="text-left"
                      >
                        <p className={cn(
                          'font-semibold text-foreground',
                          item.category === 'panini' && item.in_stock && 'cursor-pointer hover:text-primary'
                        )}>
                          {item.name}
                        </p>
                      </button>
                      <p className="text-sm text-muted-foreground">
                        {item.in_stock ? (
                          <span>&euro;{Number(item.price).toFixed(2)}</span>
                        ) : (
                          <span className="text-destructive">Esaurito</span>
                        )}
                      </p>
                    </div>
                    {item.in_stock && (
                      <Button
                        size="sm"
                        variant={isSelected ? 'default' : 'outline'}
                        className={cn(
                          'flex-shrink-0',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'border-primary/30 hover:border-primary hover:bg-primary/10'
                        )}
                        onClick={() => {
                          if (item.category === 'panini') {
                            setSelectedPanino(isSelected ? null : item);
                            if (!isSelected) {
                              setSelectedContorni([]);
                              setSelectedSalse([]);
                            }
                          } else {
                            handleAddSimple(item);
                          }
                        }}
                      >
                        {item.category === 'panini' ? (
                          isSelected ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
