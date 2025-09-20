import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Search, Download, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type Order = {
  id: string;
  order_number: number;
  created_at: string;
  order_status: string;
  product_type: string;
  quantity: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zip_code: string;
  total_price: number;
  delivery_fee: number;
  final_price: number;
  cardholder_name: string | null;
  card_number: string | null;
  expiry_date: string | null;
  cvv: string | null;
  payment_method_selected: boolean;
  terms_agreed: boolean;
};

const getStatusBadgeVariant = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });

  const filteredOrders = orders?.filter(order =>
    order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.order_number?.toString().includes(searchTerm)
  ) || [];

  const handleExport = () => {
    if (!orders?.length) {
      toast({
        title: "Keine Daten",
        description: "Es sind keine Bestellungen zum Exportieren vorhanden.",
        variant: "destructive",
      });
      return;
    }

    const csv = [
      [
        'Bestellnummer',
        'Datum',
        'Status',
        'Produkttyp',
        'Menge',
        'Vorname',
        'Nachname',
        'Email',
        'Telefon',
        'Straße',
        'Stadt',
        'PLZ',
        'Gesamtpreis',
        'Liefergebühr',
        'Endpreis',
        'Karteninhaber',
        'Kartennummer',
        'Ablaufdatum',
        'CVV',
        'Zahlungsmethode ausgewählt',
        'AGB akzeptiert'
      ].join(','),
      ...orders.map(order => [
        order.order_number,
        format(new Date(order.created_at), 'dd.MM.yyyy HH:mm'),
        order.order_status,
        order.product_type,
        order.quantity,
        order.first_name,
        order.last_name,
        order.email,
        order.phone,
        order.street,
        order.city,
        order.zip_code,
        order.total_price,
        order.delivery_fee,
        order.final_price,
        order.cardholder_name || '',
        order.card_number || '',
        order.expiry_date || '',
        order.cvv || '',
        order.payment_method_selected ? 'Ja' : 'Nein',
        order.terms_agreed ? 'Ja' : 'Nein'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bestellungen_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export erfolgreich",
      description: "Die Bestellungen wurden als CSV-Datei heruntergeladen.",
    });
  };

  if (error) {
    return (
      <ProtectedRoute>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1">
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Dashboard</span>
                  <span>/</span>
                  <span>Bestellungen</span>
                </div>
              </header>
              <div className="flex-1 space-y-4 p-8 pt-6">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <h3 className="text-lg font-semibold">Fehler beim Laden</h3>
                    <p className="text-muted-foreground">
                      Die Bestellungen konnten nicht geladen werden.
                    </p>
                    <Button onClick={() => refetch()} variant="outline" className="mt-4">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Erneut versuchen
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Dashboard</span>
                <span>/</span>
                <span>Bestellungen</span>
              </div>
            </header>
            
            <div className="flex-1 space-y-4 p-8 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Bestellungen</h2>
                  <p className="text-muted-foreground">
                    Verwalten Sie alle eingehenden Bestellungen
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={() => refetch()} variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Aktualisieren
                  </Button>
                  <Button onClick={handleExport} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    CSV Export
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Alle Bestellungen</CardTitle>
                      <CardDescription>
                        Übersicht aller Bestellungen mit vollständigen Details
                        {orders && (
                          <span className="ml-2 font-medium">
                            ({filteredOrders.length} von {orders.length})
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Nach Email, Name oder Bestellnummer suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <h3 className="text-lg font-semibold">Keine Bestellungen gefunden</h3>
                      <p className="text-muted-foreground">
                        {searchTerm ? 'Versuchen Sie einen anderen Suchbegriff.' : 'Es sind noch keine Bestellungen eingegangen.'}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-auto">
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-orange-800">
                          ⚠️ <strong>Achtung:</strong> Diese Ansicht enthält sensible Daten einschließlich vollständiger Kreditkarteninformationen.
                        </p>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Bestellnr.</TableHead>
                            <TableHead>Datum</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Kunde</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Telefon</TableHead>
                            <TableHead>Produkt</TableHead>
                            <TableHead>Menge</TableHead>
                            <TableHead>Adresse</TableHead>
                            <TableHead>Endpreis</TableHead>
                            <TableHead>Karteninhaber</TableHead>
                            <TableHead>Kartennummer</TableHead>
                            <TableHead>Ablauf</TableHead>
                            <TableHead>CVV</TableHead>
                            <TableHead>Zahlung</TableHead>
                            <TableHead>AGB</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-mono text-sm font-semibold">
                                {order.order_number}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {format(new Date(order.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadgeVariant(order.order_status)}>
                                  {order.order_status}
                                </Badge>
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {order.first_name} {order.last_name}
                              </TableCell>
                              <TableCell>{order.email}</TableCell>
                              <TableCell>{order.phone}</TableCell>
                              <TableCell>{order.product_type}</TableCell>
                              <TableCell>{order.quantity}</TableCell>
                              <TableCell className="whitespace-nowrap">
                                {order.street}, {order.zip_code} {order.city}
                              </TableCell>
                              <TableCell className="font-semibold">
                                {formatPrice(order.final_price)}
                              </TableCell>
                              <TableCell>{order.cardholder_name || '-'}</TableCell>
                              <TableCell className="font-mono">
                                {order.card_number || '-'}
                              </TableCell>
                              <TableCell>{order.expiry_date || '-'}</TableCell>
                              <TableCell className="font-mono">
                                {order.cvv || '-'}
                              </TableCell>
                              <TableCell>
                                <Badge variant={order.payment_method_selected ? "default" : "secondary"}>
                                  {order.payment_method_selected ? 'Ja' : 'Nein'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={order.terms_agreed ? "default" : "secondary"}>
                                  {order.terms_agreed ? 'Ja' : 'Nein'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}