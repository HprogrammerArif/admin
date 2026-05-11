"use client";

import { useEffect, useState } from "react";
import NewUsersPage from "@/components/dashboardComponent/newUsersPage";
import UserCard from "@/components/dashboardComponent/userCard";
import { adminService, User, Activity } from "@/lib/api/services/admin.service";
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
  const [stats, setStats] = useState({ total_user: 0, active_user: 0, inactive_user: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, activityData] = await Promise.all([
          adminService.getUsers(),
          adminService.getRecentActivity()
        ]);

        setStats({
          total_user: usersData.total_user,
          active_user: usersData.active_user,
          inactive_user: usersData.inactive_user
        });
        setUsers(usersData.users || []);
        setRecentActivity(activityData || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1480px] mx-auto">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UserCard 
          title="Total Users" 
          value={stats.total_user.toLocaleString()} 
          icon={<Users className="w-6 h-6" />}  
          iconColor="text-blue-400 bg-blue-100" 
        />
        <UserCard 
          title="Active Users" 
          value={stats.active_user.toLocaleString()} 
          icon={<UserCheck className="w-6 h-6" />}  
          iconColor="text-emerald-500 bg-emerald-50" 
        />
        <UserCard 
          title="Inactive Users" 
          value={stats.inactive_user.toLocaleString()} 
          icon={<UserPlus className="w-6 h-6" />}  
          iconColor="text-slate-400 bg-slate-100" 
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
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
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