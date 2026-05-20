"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth-store";
import { adminService, AppNotification } from "@/lib/api/services/admin.service";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare,
  Bell,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Sparkles
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Subscribers", href: "/dashboard/subscribers", icon: User },
  { name: "Content", href: "/dashboard/content", icon: FileText },
  { name: "AI Chat", href: "/dashboard/chat", icon: MessageSquare },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, initialize, logout } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    initialize();
    setIsInitializing(false);
  }, [initialize]);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push("/");
    } else if (isAuthenticated && user?.id) {
      // Fetch latest profile info to keep sidebar updated
      adminService.getCurrentUser().then(updatedUser => {
        const { token, login } = useAuthStore.getState();
        if (token) {
          login(updatedUser, token);
        }
      }).catch(err => console.error("Failed to fetch current user", err));

      // Fetch notifications
      adminService.getNotifications().then(data => {
        setNotifications(data || []);
      }).catch(err => console.error("Failed to fetch notifications", err));
    }
  }, [isAuthenticated, isInitializing, router, user?.id]);

  if (isInitializing || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-500 text-sm font-medium">Loading...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/users": "Users",
    "/dashboard/content": "Content",
    "/dashboard/chat": "AI Chat",
  };
  const currentTitle = pageTitles[pathname] || "Dashboard";

  return (
    <div className="h-screen overflow-hidden flex bg-[#f5f7fa] ">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-100 flex flex-col flex-shrink-0 shadow-sm">
        {/* Logo */}
        <div className="h-16 flex-shrink-0 flex items-center px-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-3 shadow-md shadow-blue-200 flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-[13px] text-slate-900 leading-none">Floruit Admin</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Management Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-3">Menu</p>
          {sidebarLinks.map((link) => {
            const isActive =
              link.href === "/dashboard"
                ? pathname === "/dashboard/"
                : pathname === link.href || pathname.startsWith(link.href + "/") || pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 mr-3 flex-shrink-0",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user quick-logout */}
        <div className="p-4 border-t border-slate-100">
          <div
            className="flex items-center space-x-3 p-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer group"
            onClick={handleLogout}
          >
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={user?.profile?.avatar || undefined} alt={user?.profile?.full_name || user?.username} />
              <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                {(user?.profile?.full_name || user?.username || "Ad")?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slate-900 truncate leading-none mb-0.5">
                {user?.profile?.full_name || user?.username}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500 flex-shrink-0 transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-slate-100 flex items-center justify-between px-8">
          <div>
            <h2 className="text-[15px] font-bold text-slate-900 leading-none mb-0.5">{currentTitle}</h2>
            <p className="text-[11px] text-slate-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-slate-500 hover:bg-slate-50 rounded-xl h-9 w-9"
                >
                  <Bell className="w-[18px] h-[18px]" />
                  {notifications.some(n => !n.is_read) && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 mt-1 shadow-lg border-slate-100 rounded-xl p-1">
                <DropdownMenuLabel className="font-semibold px-3 py-2 flex justify-between items-center">
                  <span>Notifications</span>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    {notifications.length} new
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer focus:bg-slate-50 border-b border-slate-50 last:border-0 rounded-none items-start">
                        <div className="flex flex-col space-y-1 w-full">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-semibold text-slate-800">{notification.title}</span>
                            {!notification.is_read && <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>}
                          </div>
                          <span className="text-xs text-slate-500 line-clamp-2">{notification.message}</span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(notification.created_at).toLocaleDateString()} {new Date(notification.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 rounded-xl px-2 py-1.5 transition-colors">
                  <Avatar className="w-8 h-8 ring-2 ring-slate-100">
                    <AvatarImage
                      src={user?.profile?.avatar || undefined}
                      alt={user?.profile?.full_name || user?.username}
                    />
                    <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                      {(user?.profile?.full_name || user?.username || "Ad")?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-[13px] font-semibold text-slate-900 leading-none mb-0.5">
                      {user?.profile?.full_name || user?.username}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-none">Administrator</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 mt-1 shadow-lg border-slate-100 rounded-xl p-1">
                <DropdownMenuLabel className="font-normal px-2 py-2">
                  <p className="text-sm font-semibold text-slate-900">{user?.profile?.full_name || user?.username}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem 
                  className="cursor-pointer rounded-lg px-2 py-2 text-[13px]"
                  onClick={() => router.push(`/dashboard/users/${user?.id}`)}
                >
                  <User className="mr-2 h-4 w-4 text-slate-400" />
                  My Profile
                </DropdownMenuItem>
               
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg px-2 py-2 text-[13px] text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
