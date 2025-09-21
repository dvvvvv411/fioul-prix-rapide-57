import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TestEmailRequest {
  sender_name: string;
  sender_email: string;
  api_key: string;
  test_email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sender_name, sender_email, api_key, test_email }: TestEmailRequest = await req.json();
    
    const resend = new Resend(api_key);

    const emailResponse = await resend.emails.send({
      from: `${sender_name} <${sender_email}>`,
      to: [test_email],
      subject: "Test-E-Mail von Ihrer Resend-Konfiguration",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
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
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Test erfolgreich!</h1>
              </div>
              <div class="content">
                <div class="success-badge">
                  Ihre Resend-Konfiguration funktioniert einwandfrei!
                </div>
                <p>Diese Test-E-Mail wurde erfolgreich über Ihre Resend-Konfiguration versendet:</p>
                <ul>
                  <li><strong>Absendername:</strong> ${sender_name}</li>
                  <li><strong>Absender-E-Mail:</strong> ${sender_email}</li>
                  <li><strong>Test-E-Mail:</strong> ${test_email}</li>
                </ul>
                <p>Sie können nun automatische Bestätigungs-E-Mails für Ihre Kunden versenden.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Test email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in test-resend-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);