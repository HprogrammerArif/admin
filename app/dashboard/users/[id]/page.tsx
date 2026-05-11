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

const UserDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const userDetail = await adminService.getUserDetails(id);
        setData(userDetail);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const user = data?.user;
  const coParents = data?.co_parents || [];
  const children = data?.children || [];

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
                <Avatar className="h-12 w-12 border border-slate-100 shadow-sm">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.full_name?.charAt(0) || user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-900 text-lg">{user?.full_name || user?.username}</span>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0 h-4 border-none uppercase font-bold">
                      {user?.role}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-500">{user?.email}</div>
                </div>
              </div>
              <div className="text-center md:text-left bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Gender</div>
                <div className="text-sm text-slate-700 font-semibold">{user?.gender || "N/A"}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Join date</div>
                <div className="text-sm text-slate-700 font-semibold">
                  {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Coparent Section */}
          {coParents.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Co-parents</h3>
              <div className="space-y-4">
                {coParents.map((cp) => (
                  <div key={cp.id} className="flex items-center space-x-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <Avatar className="h-10 w-10 border border-white shadow-sm">
                      <AvatarImage src={cp.avatar} />
                      <AvatarFallback>{cp.full_name?.charAt(0) || cp.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-900">{cp.full_name || cp.username}</span>
                        <Badge variant="outline" className="text-[10px] h-4 px-2 border-slate-200 text-slate-500 uppercase">
                          {cp.role}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-500">{cp.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Children Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Children ({children.length})</h3>
            <div className="flex flex-wrap gap-3">
              {children.map((child) => (
                <div key={child.id} className="flex items-center bg-white rounded-full pl-1 pr-4 py-1 border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
                  <Avatar className="h-8 w-8 border border-slate-50">
                    <AvatarImage src={child.photo} />
                    <AvatarFallback>{child.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-sm font-medium text-slate-700">{child.full_name}</span>
                </div>
              ))}
              {children.length === 0 && (
                <p className="text-sm text-slate-400 italic">No children registered yet.</p>
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

