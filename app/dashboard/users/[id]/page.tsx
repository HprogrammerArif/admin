"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ChevronLeft, Download, Loader2 } from "lucide-react";
import { adminService, User, UserDetail } from "@/lib/api/services/admin.service";

const UserDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [data, setData] = useState<UserDetail | null>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [userDetail, childrenData] = await Promise.all([
          adminService.getUserDetails(params.id),
          adminService.getChildrenByCoparent(params.id)
        ]);
        setData(userDetail);
        setChildren(childrenData || []);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const user = data?.user;
  const coparent = children[0]?.co_parent; 

  return (
    <div className="space-y-6 max-w-[1480px] mx-auto pb-10">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Go back
      </button>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-8 space-y-10">
          {/* User Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">User</h3>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 border border-slate-100">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.id}`} />
                  <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-900">{user?.username}</span>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0 h-4 border-none uppercase">
                      {user?.is_staff ? "Staff" : "User"}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-500">{user?.email}</div>
                </div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-xs text-slate-400 font-medium uppercase mb-1">Status</div>
                <div className="text-sm text-slate-600 font-medium">{user?.is_active ? "Active" : "Inactive"}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium uppercase mb-1">Join date</div>
                <div className="text-sm text-slate-600 font-medium">
                  {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Coparent Section */}
          {coparent && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Coparent</h3>
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10 border border-slate-100">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${coparent.id}`} />
                  <AvatarFallback>{coparent.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-900">{coparent.username}</span>
                  </div>
                  <div className="text-sm text-slate-500">{coparent.email}</div>
                </div>
              </div>
            </div>
          )}

          {/* Children Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Children {children.length}</h3>
            <div className="flex items-center space-x-3">
              {children.map((child, i) => (
                <div key={i} className="flex items-center bg-blue-50/50 rounded-full pl-1 pr-3 py-1 border border-blue-100/50">
                  <Avatar className="h-6 w-6 border border-white">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=child${child.id}`} />
                    <AvatarFallback>{child.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-xs font-medium text-blue-600">{child.name}</span>
                </div>
              ))}
              {children.length === 0 && (
                <p className="text-sm text-slate-400">No children linked to this account.</p>
              )}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="pt-4">
            <Tabs defaultValue="expanse" className="w-full">
              <TabsList className="bg-transparent border-b border-slate-100 rounded-none w-full justify-start h-auto p-0 space-x-8">
                {["expanse", "document", "milestone", "schedule"].map((tab) => (
                  <TabsTrigger 
                    key={tab}
                    value={tab} 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-800 data-[state=active]:bg-transparent text-slate-400 data-[state=active]:text-slate-800 capitalize font-medium px-0 py-2 transition-all"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="expanse" className="mt-6">
                <div className="text-center py-10 text-slate-400 border border-dashed rounded-xl">
                  Expense data will be integrated here.
                </div>
              </TabsContent>

              <TabsContent value="document" className="mt-6">
                <div className="text-center py-10 text-slate-400 border border-dashed rounded-xl">
                  Document data will be integrated here.
                </div>
              </TabsContent>

              <TabsContent value="milestone" className="mt-6">
                <div className="text-center py-10 text-slate-400 border border-dashed rounded-xl">
                  Milestone data will be integrated here.
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="mt-6">
                <div className="text-center py-10 text-slate-400 border border-dashed rounded-xl">
                  Schedule data will be integrated here.
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages Section */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-8 space-y-6">
          <h3 className="text-lg font-semibold text-slate-800">Chat messages</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-50 bg-slate-50/30">
              <span className="text-sm font-medium text-slate-600">Ai chat</span>
              <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-8 text-xs font-medium">
                <Download className="h-3 w-3 mr-2" />
                Export pdf
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-50 bg-slate-50/30">
              <span className="text-sm font-medium text-slate-600">Person chat</span>
              <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-8 text-xs font-medium">
                <Download className="h-3 w-3 mr-2" />
                Export pdf
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailsPage;

