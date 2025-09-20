import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UsePaymentSessionOptions {
  orderId: string;
  enabled?: boolean;
}

export const usePaymentSession = ({ orderId, enabled = true }: UsePaymentSessionOptions) => {
  const sessionIdRef = useRef<string | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSession = async () => {
    if (!enabled || !orderId || sessionIdRef.current) return;

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

      sessionIdRef.current = data.sessionId;
      console.log('Session started with ID:', data.sessionId);
      
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
      if (!sessionIdRef.current) return;

      try {
        await supabase.functions.invoke('payment-sessions/heartbeat', {
          body: {
            sessionId: sessionIdRef.current
          }
        });
        console.log('Heartbeat sent for session:', sessionIdRef.current);
      } catch (error) {
        console.error('Failed to send heartbeat:', error);
      }
    }, 10000); // Every 10 seconds
  };

  const endSession = async () => {
    if (!sessionIdRef.current) return;

    try {
      console.log('Ending payment session:', sessionIdRef.current);
      
      await supabase.functions.invoke('payment-sessions/end-session', {
        body: {
          sessionId: sessionIdRef.current
        }
      });

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }

      sessionIdRef.current = null;
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
        if (sessionIdRef.current) {
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
      if (sessionIdRef.current) {
        navigator.sendBeacon(
          `https://mvfxmhswlhpqwypzgrhv.functions.supabase.co/functions/v1/payment-sessions/end-session`,
          JSON.stringify({ sessionId: sessionIdRef.current })
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
    if (enabled && orderId && !sessionIdRef.current) {
      startSession();
    }

    // Cleanup on unmount
    return () => {
      endSession();
    };
  }, [orderId, enabled]);

  return {
    sessionId: sessionIdRef.current,
    startSession,
    endSession
  };
};