'use client';

import { useState, useEffect } from 'react';
import { supabase, type MenuItem, type CategoryKey, CATEGORY_LABELS } from '@/lib/supabase-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type MenuManagerProps = {
  items: MenuItem[];
  onUpdate: () => void;
};

const CATEGORY_ORDER: CategoryKey[] = ['panini', 'contorni', 'salse', 'drinks'];

export function MenuManager({ items, onUpdate }: MenuManagerProps) {
  const [activeTab, setActiveTab] = useState<CategoryKey>('panini');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredItems = items.filter((i) => i.category === activeTab);

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPrice(String(Number(item.price).toFixed(2)));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditPrice('');
  };

  const saveEdit = async (id: string) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from('menu_items')
      .update({ name: editName, price: parseFloat(editPrice) || 0 })
      .eq('id', id);
    setUpdatingId(null);
    if (error) {
      toast({ title: 'Errore', description: 'Aggiornamento non riuscito', variant: 'destructive' });
    } else {
      toast({ title: 'Articolo aggiornato' });
      cancelEdit();
      onUpdate();
    }
  };

  const toggleStock = async (item: MenuItem) => {
    setUpdatingId(item.id);
    const { error } = await supabase
      .from('menu_items')
      .update({ in_stock: !item.in_stock })
      .eq('id', item.id);
    setUpdatingId(null);
    if (error) {
      toast({ title: 'Errore', description: 'Aggiornamento non riuscito', variant: 'destructive' });
    } else {
      toast({
        title: item.in_stock ? 'Esaurito' : 'Di nuovo disponibile',
        description: item.name,
      });
      onUpdate();
    }
  };

  return (
    <Card className="border-border bg-card/60 p-6">
      <div className="mb-5">
        <h2 className="font-display text-xl font-bold text-foreground">Gestione Menu &amp; Prezzi</h2>
        <p className="text-sm text-muted-foreground">Modifica nomi, prezzi e disponibilita.</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CategoryKey)}>
        <TabsList className="mb-4 flex w-full flex-wrap gap-1 bg-secondary/50">
          {CATEGORY_ORDER.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {CATEGORY_LABELS[cat]}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Nome</TableHead>
                <TableHead className="w-28 text-muted-foreground">Prezzo</TableHead>
                <TableHead className="w-32 text-right text-muted-foreground">Disponibile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const isEditing = editingId === item.id;
                const isUpdating = updatingId === item.id;
                return (
                  <TableRow key={item.id} className="border-border">
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8 bg-secondary/50"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{item.name}</span>
                          {!item.in_stock && (
                            <Badge variant="destructive" className="text-xs">
                              Esaurito
                            </Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.10"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="h-8 w-24 bg-secondary/50"
                        />
                      ) : (
                        <span className="font-semibold text-foreground tabular-nums">
                          &euro;{Number(item.price).toFixed(2)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : isEditing ? (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-primary hover:bg-primary/10"
                              onClick={() => saveEdit(item.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:bg-secondary"
                              onClick={cancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:bg-secondary hover:text-foreground"
                              onClick={() => startEdit(item)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Switch
                              checked={item.in_stock}
                              onCheckedChange={() => toggleStock(item)}
                            />
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Tabs>
    </Card>
  );
}
