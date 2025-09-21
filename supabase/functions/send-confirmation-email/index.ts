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
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bestellbestätigung</title>
      <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb; padding: 20px; min-height: 100%; table-layout: fixed;">
        <tr>
          <td align="center" style="padding: 0;">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border: 1px solid #e5e7eb; max-width: 600px; width: 100%;">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #ea580c; color: #ffffff; padding: 32px 24px; text-align: center;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="text-align: center;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff; font-family: Arial, sans-serif;">Total Fioul - Bestellbestätigung</h1>
                        <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 16px; font-family: Arial, sans-serif;">Bestellung #${orderData.orderNumber}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 24px;">
                  
                  <!-- Success Badge -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ea580c; margin: 0 0 24px 0;">
                    <tr>
                      <td style="padding: 12px 20px; text-align: center; color: #ffffff; font-weight: bold; font-family: Arial, sans-serif; font-size: 14px;">
                        Kartenautorisierung erfolgreich - Zahlung bei Lieferung
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Main Text -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 0 0 20px 0; font-family: Arial, sans-serif; font-size: 14px; color: #333333; line-height: 1.6;">
                        Vielen Dank für Ihre Bestellung! Ihre Kartenautorisierung war erfolgreich und die Bezahlung erfolgt direkt bei der Betankung.
                      </td>
                    </tr>
                  </table>

                  <!-- Delivery Time -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ea580c; margin: 16px 0;">
                    <tr>
                      <td style="padding: 12px; text-align: center; color: #ffffff; font-weight: bold; font-family: Arial, sans-serif; font-size: 14px;">
                        Geschätzte Lieferzeit: 2-3 Werktage
                      </td>
                    </tr>
                  </table>

                  <!-- Order Overview Title -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 20px 0 10px 0;">
                        <h3 style="margin: 0; font-size: 18px; color: #333333; font-family: Arial, sans-serif;">Bestellübersicht</h3>
                      </td>
                    </tr>
                  </table>

                  <!-- Order Details Section -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb; margin: 0 0 20px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        
                        <!-- Detail Rows -->
                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #333333; font-family: Arial, sans-serif;">Produkt:</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; color: #333333; font-family: Arial, sans-serif;">${orderData.product.displayName}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #333333; font-family: Arial, sans-serif;">Menge:</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; color: #333333; font-family: Arial, sans-serif;">${orderData.quantity} Liter</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #333333; font-family: Arial, sans-serif;">Preis pro Liter:</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; color: #333333; font-family: Arial, sans-serif;">${orderData.product.pricePerLiter.toFixed(2)} €</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #333333; font-family: Arial, sans-serif;">Zwischensumme:</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; color: #333333; font-family: Arial, sans-serif;">${orderData.subtotal.toFixed(2)} €</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #333333; font-family: Arial, sans-serif;">Liefergebühr:</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; color: #333333; font-family: Arial, sans-serif;">${orderData.deliveryFee > 0 ? `${orderData.deliveryFee.toFixed(2)} €` : 'Kostenlos'}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: bold; font-size: 16px; color: #333333; font-family: Arial, sans-serif;">Gesamtpreis (inkl. MwSt.):</td>
                            <td style="padding: 8px 0; text-align: right; font-weight: bold; font-size: 16px; color: #333333; font-family: Arial, sans-serif;">${orderData.totalPrice.toFixed(2)} €</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Delivery Address Title -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 10px 0;">
                        <h3 style="margin: 0; font-size: 18px; color: #333333; font-family: Arial, sans-serif;">Lieferadresse</h3>
                      </td>
                    </tr>
                  </table>

                  <!-- Delivery Address Section -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb; margin: 0 0 20px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="font-size: 14px; color: #333333; font-family: Arial, sans-serif; line-height: 1.6;">
                              <strong>${orderData.firstName} ${orderData.lastName}</strong><br>
                              ${orderData.street || ''}<br>
                              ${orderData.zipCode} ${orderData.city || ''}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Next Steps Title -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 10px 0;">
                        <h3 style="margin: 0; font-size: 18px; color: #333333; font-family: Arial, sans-serif;">Nächste Schritte</h3>
                      </td>
                    </tr>
                  </table>

                  <!-- Next Steps Section -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 10px 0 20px 0;">
                    <tr>
                      <td>
                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 8px 0; font-size: 14px; color: #333333; font-family: Arial, sans-serif; vertical-align: top; width: 30px;">
                              <table cellpadding="0" cellspacing="0" border="0" width="24" height="24" style="background-color: #ea580c;">
                                <tr>
                                  <td style="text-align: center; vertical-align: middle; color: #ffffff; font-size: 12px; font-weight: bold; font-family: Arial, sans-serif; line-height: 24px; width: 24px; height: 24px;">1</td>
                                </tr>
                              </table>
                            </td>
                            <td style="padding: 8px 0 8px 12px; font-size: 14px; color: #6b7280; font-family: Arial, sans-serif;">
                              Wir prüfen Ihre Bestellung und bestätigen den Liefertermin per E-Mail
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-size: 14px; color: #333333; font-family: Arial, sans-serif; vertical-align: top; width: 30px;">
                              <table cellpadding="0" cellspacing="0" border="0" width="24" height="24" style="background-color: #ea580c;">
                                <tr>
                                  <td style="text-align: center; vertical-align: middle; color: #ffffff; font-size: 12px; font-weight: bold; font-family: Arial, sans-serif; line-height: 24px; width: 24px; height: 24px;">2</td>
                                </tr>
                              </table>
                            </td>
                            <td style="padding: 8px 0 8px 12px; font-size: 14px; color: #6b7280; font-family: Arial, sans-serif;">
                              Unser Lieferteam kontaktiert Sie vor der Anlieferung
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-size: 14px; color: #333333; font-family: Arial, sans-serif; vertical-align: top; width: 30px;">
                              <table cellpadding="0" cellspacing="0" border="0" width="24" height="24" style="background-color: #ea580c;">
                                <tr>
                                  <td style="text-align: center; vertical-align: middle; color: #ffffff; font-size: 12px; font-weight: bold; font-family: Arial, sans-serif; line-height: 24px; width: 24px; height: 24px;">3</td>
                                </tr>
                              </table>
                            </td>
                            <td style="padding: 8px 0 8px 12px; font-size: 14px; color: #6b7280; font-family: Arial, sans-serif;">
                              Die Bezahlung erfolgt direkt bei der Betankung
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px 24px; text-align: center;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="text-align: center; font-size: 14px; color: #6b7280; font-family: Arial, sans-serif; padding: 0 0 20px 0;">
                        Bei Fragen zu Ihrer Bestellung können Sie uns jederzeit kontaktieren.
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f3f4f6; padding: 16px; text-align: center;">
                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="font-size: 12px; color: #6b7280; font-family: Arial, sans-serif; line-height: 1.5;">
                              <strong>Total Pacifique Sàrl</strong><br>
                              5 rue Michel-Ange, 75016 Paris, France<br>
                              SIREN: 775744998 | SIRET: 77574499800037<br>
                              E-Mail: info@total-fioul.fr | Website: https://total-fioul.fr
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

serve(handler);