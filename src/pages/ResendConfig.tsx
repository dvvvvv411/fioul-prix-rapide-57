import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Mail, Save, TestTube } from "lucide-react";

interface ResendConfig {
  id?: string;
  sender_name: string;
  sender_email: string;
  api_key: string;
}

export default function ResendConfig() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [config, setConfig] = useState<ResendConfig>({
    sender_name: "",
    sender_email: "",
    api_key: "",
  });

  useEffect(() => {
    if (user) {
      loadConfig();
    }
  }, [user]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("resend_config")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setConfig({
          id: data.id,
          sender_name: data.sender_name,
          sender_email: data.sender_email,
          api_key: data.api_key,
        });
      }
    } catch (error) {
      console.error("Error loading config:", error);
      toast({
        title: "Fehler",
        description: "Konfiguration konnte nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const configData = {
        user_id: user.id,
        sender_name: config.sender_name,
        sender_email: config.sender_email,
        api_key: config.api_key,
      };

      if (config.id) {
        const { error } = await supabase
          .from("resend_config")
          .update(configData)
          .eq("id", config.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("resend_config")
          .insert(configData);

        if (error) throw error;
      }

      toast({
        title: "Erfolgreich gespeichert",
        description: "Resend-Konfiguration wurde erfolgreich gespeichert.",
      });

      // Reload config to get the ID if it's a new entry
      await loadConfig();
    } catch (error) {
      console.error("Error saving config:", error);
      toast({
        title: "Fehler",
        description: "Konfiguration konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testEmail = async () => {
    if (!config.api_key || !config.sender_email || !config.sender_name) {
      toast({
        title: "Fehler",
        description: "Bitte alle Felder ausfüllen vor dem Test.",
        variant: "destructive",
      });
      return;
    }

    try {
      setTesting(true);
      const { error } = await supabase.functions.invoke("test-resend-email", {
        body: {
          sender_name: config.sender_name,
          sender_email: config.sender_email,
          api_key: config.api_key,
          test_email: user?.email,
        },
      });

      if (error) throw error;

      toast({
        title: "Test-E-Mail versendet",
        description: "Bitte prüfen Sie Ihr E-Mail-Postfach.",
      });
    } catch (error) {
      console.error("Error sending test email:", error);
      toast({
        title: "Test fehlgeschlagen",
        description: "E-Mail konnte nicht versendet werden. Prüfen Sie Ihre Konfiguration.",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleInputChange = (field: keyof ResendConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  if (loading && !config.sender_name) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resend Konfiguration</h1>
        <p className="text-muted-foreground">
          Konfigurieren Sie Ihre E-Mail-Einstellungen für automatische Bestätigungs-E-Mails.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            E-Mail-Konfiguration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="sender_name">Absendername</Label>
              <Input
                id="sender_name"
                placeholder="z.B. Ihr Unternehmen"
                value={config.sender_name}
                onChange={(e) => handleInputChange("sender_name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sender_email">Absender-E-Mail</Label>
              <Input
                id="sender_email"
                type="email"
                placeholder="z.B. bestellungen@ihrunternehmen.de"
                value={config.sender_email}
                onChange={(e) => handleInputChange("sender_email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api_key">Resend API Key</Label>
              <Input
                id="api_key"
                type="password"
                placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={config.api_key}
                onChange={(e) => handleInputChange("api_key", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Erstellen Sie einen API Key in Ihrem{" "}
                <a 
                  href="https://resend.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Resend Dashboard
                </a>
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={saveConfig} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Konfiguration speichern
            </Button>

            <Button 
              variant="outline" 
              onClick={testEmail} 
              disabled={testing || loading}
              className="flex items-center gap-2"
            >
              {testing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4" />
              )}
              Test-E-Mail senden
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wichtige Hinweise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>
              Stellen Sie sicher, dass Ihre Domain in Resend verifiziert ist:{" "}
              <a 
                href="https://resend.com/domains" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Domains verwalten
              </a>
            </li>
            <li>E-Mails werden automatisch nach erfolgreichem Checkout versendet</li>
            <li>Ihr API Key wird sicher verschlüsselt gespeichert</li>
            <li>Testen Sie die Konfiguration bevor Sie live gehen</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}