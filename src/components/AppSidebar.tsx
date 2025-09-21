import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, CreditCard, User, Settings, LogOut, Mail, MessageCircle } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Bestellungen', url: '/dashboard/orders', icon: ShoppingCart },
  { title: 'Zahlungen', url: '/dashboard/payments', icon: CreditCard },
  { title: 'Telegram', url: '/dashboard/telegram', icon: MessageCircle },
  { title: 'Resend', url: '/dashboard/resend', icon: Mail },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;

  const getNavClass = (isActive: boolean) =>
    isActive
      ? 'bg-primary/10 text-primary font-medium border-r-2 border-primary'
      : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground';

  return (
    <Sidebar className={`${collapsed ? 'w-14' : 'w-64'} transition-all duration-300`} collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">TF</span>
            </div>
            <div className="text-lg font-bold text-foreground">Total Fioul</div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">TF</span>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${getNavClass(
                        isActive(item.url)
                      )}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        {!collapsed && user && (
          <div className="mb-4 p-3 bg-muted/30 rounded-lg">
            <div className="text-sm font-medium text-foreground truncate">
              {user.email}
            </div>
            <div className="text-xs text-muted-foreground">
              Angemeldet
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          onClick={signOut}
          className={`w-full ${collapsed ? 'px-2' : 'justify-start'} text-muted-foreground hover:text-foreground hover:bg-muted/50`}
        >
          <LogOut className={`h-4 w-4 ${collapsed ? '' : 'mr-2'}`} />
          {!collapsed && 'Abmelden'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}