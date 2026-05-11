import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Pencil } from "lucide-react";

import { User } from "@/lib/api/services/admin.service";


export default function NewUsersPage({ users }: { users: User[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-slate-100">
        <h3 className="text-xl font-semibold text-slate-800">New user</h3>
        <Link href="/dashboard/users" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          View all
        </Link>
      </div>
      <div className="divide-y divide-slate-100">
        {users?.slice(0, 5).map((user) => (
          <div key={user.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-4 w-1/3">
              <Avatar className="w-10 h-10 border border-slate-200">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.username} />
                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-slate-900">{user.username || "User"}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <div className="w-1/4 flex justify-center">
              <Badge 
                variant="secondary" 
                className={`${user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'} border-none px-3 font-normal rounded-full`}
              >
                {user.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="w-1/4 flex justify-end text-sm text-slate-500">
              {new Date(user.date_joined).toLocaleDateString()}
            </div>
            <div className="w-12 flex justify-end">
              <Link href={`/dashboard/users/${user.id}`}>
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        ))}
        {(!users || users.length === 0) && (
          <div className="p-10 text-center text-slate-400">No new users found</div>
        )}
      </div>
    </div>
  );
}
