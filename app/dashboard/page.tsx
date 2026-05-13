"use client";

import { useEffect, useState } from "react";
import NewUsersPage from "@/components/dashboardComponent/newUsersPage";
import UserCard from "@/components/dashboardComponent/userCard";
import { adminService, User, Activity, DashboardStats } from "@/lib/api/services/admin.service";

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  UserCheck, 
  UserPlus,
  Baby,
  DollarSign,
  CalendarDays,
  BellRing,
  Star,
  FileText
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const iconMap: Record<string, any> = {
  "user-plus": UserPlus,
  "bell": BellRing,
  "users": Users,
  "calendar": CalendarDays,
  "baby": Baby,
  "dollar": DollarSign,
  "star": Star,
  "file": FileText
};


const colorMap: Record<string, { color: string; bg: string }> = {
  "child_profile_created": { color: "text-purple-500", bg: "bg-purple-50" },
  "notification_sent": { color: "text-red-500", bg: "bg-red-50" },
  "parent_registered": { color: "text-blue-500", bg: "bg-blue-50" },
  "schedule_created": { color: "text-emerald-500", bg: "bg-emerald-50" },
  "expense_submitted": { color: "text-yellow-600", bg: "bg-yellow-50" },
  "milestone": { color: "text-amber-500", bg: "bg-amber-50" },
  "document_uploaded": { color: "text-indigo-500", bg: "bg-indigo-50" },
};

export default function DashboardPage() {
  const [userStats, setUserStats] = useState({ total_user: 0, active_user: 0, inactive_user: 0 });
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("1 month");

  const fetchDashboardData = async (selectedPeriod: string) => {
    try {
      const dashData = await adminService.getDashboardData(selectedPeriod);
      setDashboardStats(dashData);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, activityData, dashData] = await Promise.all([
          adminService.getUsers(),
          adminService.getRecentActivity(),
          adminService.getDashboardData(period)
        ]);

        setUserStats({
          total_user: usersData.total_user,
          active_user: usersData.active_user,
          inactive_user: usersData.inactive_user
        });
        setDashboardStats(dashData);
        setUsers(usersData.users || []);
        setRecentActivity(activityData || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
        </div>
       
      </div>

      {/* Top Stats */}
      <div className="flex  flex-wrap gap-6">
        <UserCard 
          title="Total Parents" 
          value={(dashboardStats?.total_parents || userStats.total_user).toLocaleString()} 
          icon={<Users className="w-6 h-6" />}  
          iconColor="text-blue-500 bg-blue-50" 
        />
        <UserCard 
          title="Active Users" 
          value={(dashboardStats?.active_users || userStats.active_user).toLocaleString()} 
          icon={<UserCheck className="w-6 h-6" />}  
          iconColor="text-emerald-500 bg-emerald-50" 
        />
        <UserCard 
          title="Total Children" 
          value={(dashboardStats?.total_children || 0).toLocaleString()} 
          icon={<Baby className="w-6 h-6" />}  
          iconColor="text-purple-500 bg-purple-50" 
        />
        <UserCard 
          title="Messages Today" 
          value={(dashboardStats?.today_total_messages || 0).toLocaleString()} 
          icon={<BellRing className="w-6 h-6" />}  
          iconColor="text-amber-500 bg-amber-50" 
        />
        <UserCard 
          title="Monthly Expenses" 
          value={`$${(dashboardStats?.current_month_expenses || 0).toLocaleString()}`} 
          icon={<DollarSign className="w-6 h-6" />}  
          iconColor="text-rose-500 bg-rose-50" 
        />
        <UserCard 
          title="Upcoming Events (7d)" 
          value={(dashboardStats?.upcoming_schedules_7days || 0).toLocaleString()} 
          icon={<CalendarDays className="w-6 h-6" />}  
          iconColor="text-indigo-500 bg-indigo-50" 
        />
      </div>

     

      {/* New User Section */}
      <NewUsersPage users={users} />

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-1">Recent Activity</h3>
            <p className="text-sm text-slate-500">Admin actions & user events</p>
          </div>
          <Link href="/dashboard/activity" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all
          </Link>
        </div>
 
        <div className="p-6">
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {recentActivity.map((activity, index) => {
              const Icon = iconMap[activity.icon] || Star;
              const styles = colorMap[activity.type] || { color: "text-slate-500", bg: "bg-slate-50" };
              
              return (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white ${styles.bg} ${styles.color} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-1">{activity.title}</h4>
                      <p className="text-sm text-slate-500">{activity.description}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap ml-4">
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}