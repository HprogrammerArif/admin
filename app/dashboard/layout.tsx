"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth-store";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare,
  Bell,
  LogOut
} from "lucide-react";

import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/dashboard/users", icon: Users },
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

  useEffect(() => {
    initialize();
    setIsInitializing(false);
  }, [initialize]);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isInitializing, router]);

  if (isInitializing || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-500 font-medium">Checking authentication...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };


  return (
    <div className="h-screen overflow-hidden flex bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col flex-shrink-0">
        <div className="h-16 flex-shrink-0 flex items-center px-6 border-b">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 text-white font-bold">
            A
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-slate-900">Admin Panel</h1>
            <p className="text-xs text-slate-500">SaaS Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-blue-600" : "text-slate-400")} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex-shrink-0 bg-white border-b flex items-center justify-between px-8">
          <div></div> {/* Spacer */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-100 rounded-full">
              <Bell className="w-5 h-5" />
            </Button>
            
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-none mb-1">{user?.username}</p>
                <p className="text-xs text-slate-500 leading-none">{user?.email}</p>
              </div>
              <Avatar className="w-9 h-9 cursor-pointer ring-2 ring-slate-100 hover:ring-slate-200 transition-all">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.id}`} alt={user?.username} />
                <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                  {user?.username?.charAt(0).toUpperCase() || 'AD'}
                </AvatarFallback>
              </Avatar>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors ml-1"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
