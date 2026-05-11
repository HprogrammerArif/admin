"use client";

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Pencil } from "lucide-react";
import Link from "next/link";
import { adminService, User } from "@/lib/api/services/admin.service";

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getUsers();
        setUsers(data.users || []);
        setTotalUsers(data.total_user || 0);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Users</h1>
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-white border-slate-200 rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none">
                  <TableHead className="w-12 px-6">
                    <Checkbox className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">User</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700">Join date</TableHead>
                  <TableHead className="font-semibold text-slate-700">Last log in</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors border-slate-100 group">
                    <TableCell className="px-6">
                      <Checkbox className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/users/${user.id}`} className="flex items-center space-x-3 cursor-pointer">
                        <Avatar className="h-10 w-10 border border-slate-100">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} />
                          <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                            {user.username || "Anonymous"}
                          </div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="secondary" 
                        className={`${user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'} border-none font-normal px-3 py-0.5 rounded-full`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 font-normal">
                      {new Date(user.date_joined).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-slate-600 font-normal">
                      {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Link href={`/dashboard/users/${user.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100">
              <div className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-900">1 to {filteredUsers.length}</span> of <span className="font-medium text-slate-900">{totalUsers}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 px-4 rounded-lg">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 px-4 rounded-lg">
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UsersPage;

