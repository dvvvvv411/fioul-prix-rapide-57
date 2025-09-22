import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { BarChart3, Package, TrendingUp, Users, Settings } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const { isDemoMode, setDemoMode } = useDemoMode();

  const handleDemoModeToggle = (enabled: boolean) => {
    setDemoMode(enabled);
    toast.success(enabled ? 'Demo-Modus aktiviert' : 'Demo-Modus deaktiviert');
  };

  const stats = [
    {
      title: 'Gesamtbestellungen',
      value: '0',
      description: 'Alle Ihre Bestellungen',
      icon: Package,
      trend: '+0%',
    },
    {
      title: 'Aktive Bestellungen',
      value: '0',
      description: 'Bestellungen in Bearbeitung',
      icon: TrendingUp,
      trend: '+0%',
    },
    {
      title: 'Gesparte Kosten',
      value: '€0',
      description: 'Durch intelligente Preise',
      icon: BarChart3,
      trend: '+0%',
    },
    {
      title: 'Kundenstatus',
      value: 'Neu',
      description: 'Ihr aktueller Status',
      icon: Users,
      trend: 'Aktiv',
    },
  ];

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
                  <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Willkommen zurück{user?.email ? `, ${user.email}` : ''}!
                </h2>
                <p className="text-muted-foreground">
                  Hier ist Ihr persönlicher Dashboard-Überblick. Verwalten Sie Ihre Heizölbestellungen und verfolgen Sie Ihre Ersparnisse.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                          {stat.description}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {stat.trend}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Schnellaktionen</CardTitle>
                    <CardDescription>
                      Häufig verwendete Funktionen für Ihren Komfort
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <Package className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-medium text-sm">Neue Bestellung</h3>
                        <p className="text-xs text-muted-foreground">Heizöl bestellen</p>
                      </div>
                      <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <BarChart3 className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-medium text-sm">Preise vergleichen</h3>
                        <p className="text-xs text-muted-foreground">Aktuelle Preise</p>
                      </div>
                      <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <Settings className="h-8 w-8 text-primary mb-2" />
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-sm">Globaler Demo-Modus</h3>
                            <p className="text-xs text-muted-foreground">
                              Für alle Website-Besucher {isDemoMode ? 'aktiviert' : 'deaktiviert'}
                            </p>
                          </div>
                          <Switch
                            checked={isDemoMode}
                            onCheckedChange={handleDemoModeToggle}
                            className="ml-2"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Letzte Aktivitäten</CardTitle>
                    <CardDescription>
                      Ihre neuesten Bestellungen und Aktivitäten
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                        <div className="text-center">
                          <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Noch keine Aktivitäten</p>
                          <p className="text-xs text-muted-foreground">Starten Sie Ihre erste Bestellung</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Dashboard;