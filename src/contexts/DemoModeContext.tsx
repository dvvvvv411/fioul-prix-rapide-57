import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DemoModeContextType {
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  loading: boolean;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export const DemoModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load demo mode from database on mount
  useEffect(() => {
    const loadDemoMode = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('demo_mode_enabled')
          .single();

        if (error) {
          console.error('Error loading demo mode:', error);
        } else if (data) {
          setIsDemoMode(data.demo_mode_enabled);
        }
      } catch (error) {
        console.error('Error loading demo mode:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDemoMode();

    // Set up real-time listener for demo mode changes
    const channel = supabase
      .channel('site_settings_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_settings'
        },
        (payload) => {
          if (payload.new && 'demo_mode_enabled' in payload.new) {
            setIsDemoMode(payload.new.demo_mode_enabled);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const setDemoMode = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ demo_mode_enabled: enabled })
        .eq('id', (await supabase.from('site_settings').select('id').single()).data?.id);

      if (error) {
        console.error('Error updating demo mode:', error);
      } else {
        setIsDemoMode(enabled);
      }
    } catch (error) {
      console.error('Error updating demo mode:', error);
    }
  };

  return (
    <DemoModeContext.Provider value={{ isDemoMode, setDemoMode, loading }}>
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};