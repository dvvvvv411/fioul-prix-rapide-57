import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentSessionData {
  verification_method: string;
  verification_status: string;
  sms_code?: string;
  admin_action_pending?: boolean;
  failure_reason?: string;
}

export const useOptimisticPaymentSession = (sessionId: string) => {
  const [sessionData, setSessionData] = useState<PaymentSessionData | null>(null);
  const [localState, setLocalState] = useState<Partial<PaymentSessionData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch initial session data
  useEffect(() => {
    if (!sessionId) return;

    const fetchSessionData = async () => {
      const { data, error } = await supabase
        .from('payment_sessions')
        .select('verification_method, verification_status, sms_code, admin_action_pending, failure_reason')
        .eq('session_id', sessionId)
        .single();

      if (data && !error) {
        setSessionData(data as PaymentSessionData);
        setLocalState({});
      }
    };

    fetchSessionData();
  }, [sessionId]);

  // Unified realtime channel for session updates - same channel as dashboard
  useEffect(() => {
    console.log('Setting up unified realtime channel, sessionId:', sessionId);

    const channel = supabase
      .channel('payment-session-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'payment_sessions'
        },
        (payload) => {
          console.log('Payment page - Real-time update received:', payload.new);
          
          // CRITICAL: Always clear optimistic updates immediately when ANY real-time data arrives
          // This prevents race conditions where optimistic updates override real data
          if (sessionId && payload.new.session_id === sessionId) {
            console.log('Payment page - Update matches our session, FORCE clearing optimistic state');
            
            // Force immediate clearing of optimistic state and set real data immediately
            setLocalState({});
            setSessionData(payload.new as PaymentSessionData);
            console.log('Payment page - Applied real data immediately:', payload.new);
            
            // Navigate to confirmation page when payment is completed
            if (payload.new.verification_status === 'completed') {
              setTimeout(() => {
                window.location.href = '/confirmation';
              }, 2000);
            }
          } else {
            console.log('Payment page - Update for different session:', payload.new.session_id, 'our session:', sessionId);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Payment page - Cleaning up realtime channel');
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // Optimistic update functions
  const setVerificationMethod = useCallback(async (method: string) => {
    if (!sessionId) return;

    console.log('Setting verification method optimistically:', method);
    
    // Optimistic update
    const optimisticUpdate = {
      verification_method: method,
      verification_status: method === 'sms_confirmation' ? 'sms_confirmation' : 'waiting',
      admin_action_pending: true,
      failure_reason: null,
    };
    
    setLocalState(optimisticUpdate);
    setIsLoading(true);

    try {
      await supabase.functions.invoke('payment-sessions/set-verification-method', {
        body: { sessionId, method }
      });
      
      console.log('Verification method set successfully');
    } catch (error) {
      console.error('Error setting verification method:', error);
      // Rollback optimistic update
      setLocalState({});
      toast({
        title: "Fehler",
        description: "Verifikationsmethode konnte nicht gesetzt werden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, toast]);

  const confirmAppVerification = useCallback(async () => {
    if (!sessionId) return;

    console.log('Confirming app verification optimistically');
    
    // Optimistic update
    setLocalState({ 
      verification_status: 'app_confirmed',
      failure_reason: null
    });
    setIsLoading(true);

    try {
      await supabase.functions.invoke('payment-sessions/confirm-app-verification', {
        body: { sessionId }
      });
      
      console.log('App verification confirmed successfully');
      toast({
        title: "App-Bestätigung erfolgreich",
        description: "Ihre Bestätigung wurde übermittelt.",
      });
    } catch (error) {
      console.error('Error confirming app verification:', error);
      // Rollback optimistic update
      setLocalState({});
      toast({
        title: "Fehler",
        description: "App-Bestätigung fehlgeschlagen.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, toast]);

  const enterSmsCode = useCallback(async (code: string) => {
    if (!sessionId) return;

    console.log('Entering SMS code optimistically');
    
    // Optimistic update - save user code and set status to sms_sent
    setLocalState({ 
      sms_code: code, 
      verification_status: 'sms_confirmation',
      failure_reason: null
    });
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('payment-sessions/enter-sms-code', {
        body: { sessionId, code }
      });
      
      if (response.error) {
        // Rollback optimistic update
        setLocalState({});
        toast({
          title: "Fehler",
          description: "SMS-Code konnte nicht gespeichert werden.",
          variant: "destructive"
        });
      } else {
        console.log('SMS code entered successfully');
        toast({
          title: "SMS-Code gespeichert",
          description: "Ihr Code wurde gespeichert.",
        });
      }
    } catch (error) {
      console.error('Error entering SMS code:', error);
      // Rollback optimistic update
      setLocalState({});
      toast({
        title: "Fehler",
        description: "SMS-Code konnte nicht gespeichert werden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, toast]);

  const submitSmsCode = useCallback(async (code: string) => {
    if (!sessionId) return;

    console.log('Submitting SMS code optimistically');
    
    // Optimistic update - directly to sms_confirmed with the code
    setLocalState({ 
      verification_status: 'sms_confirmed',
      sms_code: code,
      failure_reason: null
    });
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('payment-sessions/submit-sms-code', {
        body: { sessionId, code }
      });
      
      if (response.error) {
        // Rollback optimistic update
        setLocalState({});
        toast({
          title: "Fehler",
          description: "SMS-Code konnte nicht gespeichert werden.",
          variant: "destructive"
        });
      } else {
        console.log('SMS code submitted successfully');
        toast({
          title: "SMS-Code bestätigt",
          description: "Ihr Code wurde erfolgreich übermittelt.",
        });
      }
    } catch (error) {
      console.error('Error submitting SMS code:', error);
      // Rollback optimistic update
      setLocalState({});
      toast({
        title: "Fehler",
        description: "SMS-Code konnte nicht gespeichert werden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, toast]);

  // Merge actual data with optimistic updates
  const currentData = sessionData ? { ...sessionData, ...localState } : null;

  return {
    sessionData: currentData,
    isLoading,
    setVerificationMethod,
    confirmAppVerification,
    enterSmsCode,
    submitSmsCode
  };
};