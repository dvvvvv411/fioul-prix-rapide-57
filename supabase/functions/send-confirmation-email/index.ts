import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  orderId: string;
  orderData: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, orderData }: EmailRequest = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get order details
    const { data: order } = await supabase
      .from("orders")
      .select("email")
      .eq("id", orderId)
      .single();

    if (!order) {
      throw new Error("Order not found");
    }

    // Get global Resend configuration
    const { data: resendConfig, error: configError } = await supabase
      .from("resend_config")
      .select("*")
      .limit(1)
      .single();

    if (configError || !resendConfig) {
      console.error("No resend configuration found:", configError);
      throw new Error("Email configuration not found. Please configure Resend settings first.");
    }

    // Initialize Resend with user's API key
    const resend = new Resend(resendConfig.api_key);

    // Generate email HTML content
    const emailHtml = generateEmailHtml(orderData);

    const emailResponse = await resend.emails.send({
      from: `${resendConfig.sender_name} <${resendConfig.sender_email}>`,
      to: [order.email],
      subject: `Bestellbestätigung #${orderData.orderNumber}`,
      html: emailHtml,
    });

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateEmailHtml(orderData: any): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bestellbestätigung</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #ea580c, #dc2626);
            color: white;
            padding: 32px 24px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
          }
          .content {
            padding: 24px;
          }
          .success-badge {
            background: linear-gradient(135deg, #ea580c, #dc2626);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            text-align: center;
            margin-bottom: 24px;
            font-weight: 600;
          }
          .order-details {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
            font-weight: bold;
          }
          .steps {
            margin: 24px 0;
          }
          .step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 16px;
          }
          .step-number {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ea580c, #dc2626);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            margin-right: 12px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .step-text {
            color: #6b7280;
            font-size: 14px;
          }
          .footer {
            background-color: #f9fafb;
            padding: 20px 24px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
          .delivery-time {
            background: linear-gradient(135deg, #ea580c, #dc2626);
            color: white;
            padding: 12px;
            border-radius: 6px;
            text-align: center;
            margin: 16px 0;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
        <div class="header">
          <h1>Total Fioul - Bestellbestätigung</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">Bestellung #${orderData.orderNumber}</p>
        </div>
          
          <div class="content">
          <div class="success-badge">
            Kartenautorisierung erfolgreich - Zahlung bei Lieferung
          </div>
            
            <p>Vielen Dank für Ihre Bestellung! Ihre Kartenautorisierung war erfolgreich und die Bezahlung erfolgt direkt bei der Betankung.</p>
            
          <div class="delivery-time">
            Geschätzte Lieferzeit: 2-3 Werktage
          </div>
            
            <h3>Bestellübersicht</h3>
            <div class="order-details">
              <div class="detail-row">
                <span>Produkt:</span>
                <span>${orderData.product.displayName}</span>
              </div>
              <div class="detail-row">
                <span>Menge:</span>
                <span>${orderData.quantity} Liter</span>
              </div>
              <div class="detail-row">
                <span>Preis pro Liter:</span>
                <span>${orderData.product.pricePerLiter.toFixed(2)} €</span>
              </div>
              <div class="detail-row">
                <span>Zwischensumme:</span>
                <span>${orderData.subtotal.toFixed(2)} €</span>
              </div>
              <div class="detail-row">
                <span>Liefergebühr:</span>
                <span>${orderData.deliveryFee > 0 ? `${orderData.deliveryFee.toFixed(2)} €` : 'Kostenlos'}</span>
              </div>
              <div class="detail-row">
                <span>Gesamtpreis (inkl. MwSt.):</span>
                <span>${orderData.totalPrice.toFixed(2)} €</span>
              </div>
            </div>
            
            <h3>Lieferadresse</h3>
            <div class="order-details">
              <p style="margin: 0;">
                ${orderData.firstName} ${orderData.lastName}<br>
                ${orderData.street}<br>
                ${orderData.zipCode} ${orderData.city}
              </p>
            </div>
            
            <h3>Nächste Schritte</h3>
            <div class="steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-text">Wir prüfen Ihre Bestellung und bestätigen den Liefertermin per E-Mail</div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-text">Unser Lieferteam kontaktiert Sie vor der Anlieferung</div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-text">Die Bezahlung erfolgt direkt bei der Betankung</div>
              </div>
            </div>
          </div>
          
        <div class="footer">
          <p>Bei Fragen zu Ihrer Bestellung können Sie uns jederzeit kontaktieren.</p>
          <div style="margin: 20px 0; padding: 16px; background-color: #f3f4f6; border-radius: 6px; font-size: 12px; color: #6b7280;">
            <strong>Total Pacifique Sàrl</strong><br />
            5 rue Michel-Ange, 75016 Paris, France<br />
            SIREN: 775744998 | SIRET: 77574499800037<br />
            E-Mail: info@total-fioul.fr | Website: https://total-fioul.fr
          </div>
        </div>
        </div>
      </body>
    </html>
  `;
}

serve(handler);