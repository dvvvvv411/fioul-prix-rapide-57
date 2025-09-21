import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bot, Trash2, Send, Plus, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface TelegramConfig {
  id: string;
  chat_id: string;
  chat_name: string | null;
  is_active: boolean;
  created_at: string;
}

const Telegram = () => {
  const { toast } = useToast();
  const [configs, setConfigs] = useState<TelegramConfig[]>([]);
  const [newChatId, setNewChatId] = useState('');
  const [newChatName, setNewChatName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testingChatId, setTestingChatId] = useState<string | null>(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    const { data, error } = await supabase
      .from('telegram_config')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching telegram configs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch Telegram configurations",
        variant: "destructive",
      });
    } else {
      setConfigs(data || []);
    }
  };

  const addChatId = async () => {
    if (!newChatId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a chat ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from('telegram_config')
      .insert({
        chat_id: newChatId.trim(),
        chat_name: newChatName.trim() || null,
        is_active: true
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message.includes('duplicate') 
          ? "This chat ID already exists" 
          : "Failed to add chat ID",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Chat ID added successfully",
      });
      setNewChatId('');
      setNewChatName('');
      fetchConfigs();
    }

    setIsLoading(false);
  };

  const deleteChatId = async (id: string) => {
    const { error } = await supabase
      .from('telegram_config')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete chat ID",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Chat ID removed successfully",
      });
      fetchConfigs();
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    const { error } = await supabase
      .from('telegram_config')
      .update({ is_active: !currentActive })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update chat ID status",
        variant: "destructive",
      });
    } else {
      fetchConfigs();
    }
  };

  const sendTestMessage = async (chatId: string) => {
    setTestingChatId(chatId);

    try {
      const { error } = await supabase.functions.invoke('telegram-bot', {
        body: { chatId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Test message sent successfully",
      });
    } catch (error) {
      console.error('Test message error:', error);
      toast({
        title: "Error",
        description: "Failed to send test message",
        variant: "destructive",
      });
    } finally {
      setTestingChatId(null);
    }
  };

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          
          <main className="flex-1 overflow-auto">
            {/* Header */}
            <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
              <div className="h-full flex items-center px-6 gap-4">
                <SidebarTrigger />
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold text-foreground">Telegram Bot</h1>
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6">
              <div className="flex items-center gap-3">
                <Bot className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Telegram Bot</h1>
                  <p className="text-muted-foreground">
                    Manage Telegram notifications for payment monitoring
                  </p>
                </div>
              </div>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Bot Setup Instructions
          </CardTitle>
          <CardDescription>
            Follow these steps to set up your Telegram bot for notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Create a Telegram Bot</h4>
            <p className="text-sm text-muted-foreground">
              Message @BotFather on Telegram with <code>/newbot</code> and follow the instructions.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://t.me/BotFather', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open BotFather
            </Button>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">2. Get Your Chat ID</h4>
            <p className="text-sm text-muted-foreground">
              Message your bot, then visit this URL to get your chat ID:
            </p>
            <code className="block bg-muted p-2 rounded text-sm">
              https://api.telegram.org/bot&lt;YOUR_BOT_TOKEN&gt;/getUpdates
            </code>
          </div>

          <Alert>
            <Bot className="h-4 w-4" />
            <AlertDescription>
              The bot token has been configured in your environment. Add your chat IDs below to receive notifications.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Add Chat ID */}
      <Card>
        <CardHeader>
          <CardTitle>Add Chat ID</CardTitle>
          <CardDescription>
            Add Telegram chat IDs to receive payment notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chatId">Chat ID</Label>
              <Input
                id="chatId"
                placeholder="e.g., 123456789"
                value={newChatId}
                onChange={(e) => setNewChatId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chatName">Name (optional)</Label>
              <Input
                id="chatName"
                placeholder="e.g., Admin Chat"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={addChatId} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Add Chat ID
          </Button>
        </CardContent>
      </Card>

      {/* Chat IDs List */}
      <Card>
        <CardHeader>
          <CardTitle>Configured Chat IDs</CardTitle>
          <CardDescription>
            Manage your Telegram notification recipients
          </CardDescription>
        </CardHeader>
        <CardContent>
          {configs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No chat IDs configured yet. Add one above to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {configs.map((config) => (
                <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">{config.chat_id}</span>
                        <Badge variant={config.is_active ? "default" : "secondary"}>
                          {config.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {config.chat_name && (
                        <p className="text-sm text-muted-foreground">{config.chat_name}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Added: {new Date(config.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendTestMessage(config.chat_id)}
                      disabled={testingChatId === config.chat_id}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Test
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(config.id, config.is_active)}
                    >
                      {config.is_active ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteChatId(config.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>
            These notifications will be sent automatically when events occur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold">🛒 Checkout Started</h4>
              <p className="text-sm text-muted-foreground">
                When a customer starts the checkout process
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">💳 Payment Page Entered</h4>
              <p className="text-sm text-muted-foreground">
                When a customer enters payment details with action buttons
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold">✅ Verification Updates</h4>
              <p className="text-sm text-muted-foreground">
                When app confirmations or SMS codes are entered with completion buttons
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Telegram;