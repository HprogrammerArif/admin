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
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [childData, setChildData] = useState<any>(null);
  const [fetchingChildData, setFetchingChildData] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const userDetail = await adminService.getUserDetails(id);
        setData(userDetail);
        // Automatically select the first child if available
        if (userDetail?.children && userDetail.children.length > 0) {
          setSelectedChildId(userDetail.children[0].id);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id]);

  useEffect(() => {
    const fetchChildDetails = async () => {
      if (!selectedChildId) return;
      
      setFetchingChildData(true);
      try {
        const childDetails = await adminService.getChildData(selectedChildId);
        setChildData(childDetails);
      } catch (error) {
        console.error("Error fetching child data:", error);
      } finally {
        setFetchingChildData(false);
      }
    };
    fetchChildDetails();
  }, [selectedChildId]);


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

  const handleExportAI = async () => {
    try {
      await adminService.exportAIChat(id);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleExportCoparent = async (cpId: number) => {
    try {
      await adminService.exportCoparentChat(id, cpId);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors mb-4"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Go back
      </button>

      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-8 md:p-10 space-y-10">
          {/* User Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">User</h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-start">
              <div className="flex items-center space-x-4 col-span-2">
                <Avatar className="h-14 w-14 border border-slate-100 shadow-sm">
                  <AvatarImage src={user?.profile?.avatar || user?.avatar} />
                  <AvatarFallback>{(user?.profile?.full_name || user?.username || "Us")?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-[15px]">{user?.profile?.full_name || user?.username}</span>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 h-auto border-none font-medium">
                      {user?.profile?.role || user?.role || "Father"}
                    </Badge>
                  </div>
                  <div className="text-[13px] text-blue-500">{user?.email}</div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-slate-500 mb-1">Number</span>
                <span className="text-[13px] text-slate-500">{user?.profile?.phone_number || user?.phone_number || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-slate-500 mb-1">Join date</span>
                <span className="text-[13px] text-slate-500">
                  {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-slate-500 mb-1">Earnings</span>
                <span className="text-[13px] text-slate-500 font-medium">
                  {user?.profile?.total_earnings !== undefined ? `${user?.profile?.total_earnings} ${user?.profile?.currency || 'USD'}` : "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-slate-500 mb-1">Referral Code</span>
                <span className="text-[13px] text-slate-500 font-medium">
                  {user?.profile?.referral_code || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Coparent Section */}
          {coParents.length > 0 && (
            <div className="space-y-6 pt-4">
              <h3 className="text-xl font-bold text-slate-800">Coparent</h3>
              <div className="space-y-6">
                {coParents.map((cp) => (
                  <div key={cp.id} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    <div className="flex items-center space-x-4 col-span-2">
                      <Avatar className="h-14 w-14 border border-slate-100 shadow-sm">
                        <AvatarImage src={cp.profile?.avatar || cp.avatar} />
                        <AvatarFallback>{(cp.profile?.full_name || cp.username || "Us")?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-[15px]">{cp.profile?.full_name || cp.username}</span>
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 h-auto border-none font-medium">
                            {cp.profile?.role || cp.role || "Mother"}
                          </Badge>
                        </div>
                        <div className="text-[13px] text-blue-500">{cp.email}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Children Section */}
          <div className="space-y-6 pt-4">
            <h3 className="text-xl font-bold text-slate-800">Children {children.length}</h3>
            <div className="flex flex-wrap gap-3">
              {children.map((child) => (
                <button 
                  key={child.id} 
                  onClick={() => setSelectedChildId(child.id)}
                  className={`flex items-center rounded-full pl-1.5 pr-4 py-1.5 transition-all ${
                    selectedChildId === child.id 
                    ? "bg-blue-50/80 text-blue-600" 
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Avatar className="h-7 w-7 mr-2">
                    <AvatarImage src={child.photo} />
                    <AvatarFallback>{child.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-[13px] font-medium">
                    {child.full_name}
                  </span>
                </button>
              ))}
              {children.length === 0 && (
                <p className="text-[13px] text-slate-400">No children registered yet.</p>
              )}
            </div>
          </div>


          {/* Tabs Section */}
          <div className="pt-6">
            <Tabs defaultValue="expanse" className="w-full">
              <TabsList className="bg-transparent border-b border-slate-200 rounded-none w-full justify-start h-auto p-0 space-x-8 mb-6">
                {[
                  { id: "expanse", label: "Expanse" },
                  { id: "document", label: "Document" },
                  { id: "milestone", label: "Milestone" },
                  { id: "schedule", label: "Shedule" }
                ].map((tab) => (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id} 
                    className="rounded-none border-b-[3px] border-transparent data-[state=active]:border-slate-800 data-[state=active]:bg-transparent text-slate-500 data-[state=active]:text-slate-900 capitalize font-semibold px-0 py-3 transition-all text-[14px]"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {fetchingChildData ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-[#FAFAFA] rounded-2xl">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                  <p className="text-sm text-slate-500">Loading child data...</p>
                </div>
              ) : !selectedChildId ? (
                <div className="text-center py-20 text-slate-400 bg-[#FAFAFA] rounded-2xl">
                  Select a child to view their data.
                </div>
              ) : (
                <div className="bg-[#FAFAFA] rounded-[24px] p-6 overflow-x-auto">
                  <TabsContent value="expanse" className="mt-0 outline-none">
                    {childData?.expenses?.length > 0 ? (
                      <Table className="min-w-[800px]">
                        <TableHeader>
                          <TableRow className="border-none hover:bg-transparent">
                            <TableHead className="font-semibold text-slate-500 h-10">Title</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-center">Amount</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-center">Payer</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-center">Category</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-center">Split method</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-center">Receipt</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-center">Status</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-right">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {childData.expenses.map((expense: any) => (
                            <TableRow key={expense.id} className="border-none hover:bg-black/5">
                              <TableCell className="font-medium text-slate-600 py-4">{expense.title}</TableCell>
                              <TableCell className="text-slate-500 text-center py-4">${expense.amount}</TableCell>
                              <TableCell className="text-slate-500 text-center py-4">{expense.payer_email}</TableCell>
                              <TableCell className="text-slate-500 text-center py-4">{expense.category}</TableCell>
                              <TableCell className="text-slate-500 text-center py-4">{expense.split_method}</TableCell>
                              <TableCell className="text-center py-4">
                                {expense.receipt_image ? (
                                  <a href={expense.receipt_image} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-[13px] font-medium inline-flex items-center justify-center">
                                    <Avatar className="h-8 w-8 rounded-md mr-2">
                                      <AvatarImage src={expense.receipt_image} className="object-cover" />
                                      <AvatarFallback className="rounded-md">Img</AvatarFallback>
                                    </Avatar>
                                    View
                                  </a>
                                ) : (
                                  <span className="text-slate-400 text-[13px]">N/A</span>
                                )}
                              </TableCell>
                              <TableCell className="text-center py-4">
                                <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[11px] font-bold text-white ${
                                  expense.status === 'Approved' ? 'bg-[#00B47A]' : expense.status === 'Pending' ? 'bg-[#FCA311]' : 'bg-[#E63946]'
                                }`}>
                                  {expense.status === 'Approved' ? 'Approve' : expense.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-slate-500 text-right text-[13px] py-4">
                                {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, {new Date(expense.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-10 text-slate-400">No expense data available.</div>
                    )}
                  </TabsContent>

                  <TabsContent value="document" className="mt-0 outline-none">
                    {childData?.documents?.length > 0 ? (
                      <Table className="min-w-[600px]">
                        <TableHeader>
                          <TableRow className="border-none hover:bg-transparent">
                            <TableHead className="font-semibold text-slate-500 h-10">Title</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-center">Category</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-center">File</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-right">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {childData.documents.map((doc: any) => (
                            <TableRow key={doc.id} className="border-none hover:bg-black/5">
                              <TableCell className="font-medium text-slate-600 py-4">{doc.title}</TableCell>
                              <TableCell className="text-slate-500 text-center py-4">{doc.category}</TableCell>
                              <TableCell className="text-center py-4">
                                {doc.file ? (
                                  <a href={doc.file} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-[13px] font-medium">
                                    View File
                                  </a>
                                ) : (
                                  <span className="text-slate-400 text-[13px]">N/A</span>
                                )}
                              </TableCell>
                              <TableCell className="text-slate-500 text-right text-[13px] py-4">
                                {new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, {new Date(doc.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-10 text-slate-400">No documents found.</div>
                    )}
                  </TabsContent>

                  <TabsContent value="milestone" className="mt-0 outline-none">
                    {childData?.milestones?.length > 0 ? (
                      <Table className="min-w-[600px]">
                        <TableHeader>
                          <TableRow className="border-none hover:bg-transparent">
                            <TableHead className="font-semibold text-slate-500 h-10">Title</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-center">child</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-center">Photo</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-right">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {childData.milestones.map((milestone: any) => (
                            <TableRow key={milestone.id} className="border-none hover:bg-black/5">
                              <TableCell className="font-medium text-slate-600 py-4">{milestone.title}</TableCell>
                              <TableCell className="text-slate-500 text-center py-4">Activity</TableCell> {/* Assuming child/category field mapping based on image */}
                              <TableCell className="text-center py-4">
                                {milestone.photo ? (
                                  <a href={milestone.photo} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-[13px] font-medium inline-flex items-center justify-center">
                                    <Avatar className="h-8 w-8 rounded-md mr-2">
                                      <AvatarImage src={milestone.photo} className="object-cover" />
                                      <AvatarFallback className="rounded-md">Img</AvatarFallback>
                                    </Avatar>
                                    View
                                  </a>
                                ) : (
                                  <span className="text-slate-400 text-[13px]">N/A</span>
                                )}
                              </TableCell>
                              <TableCell className="text-slate-500 text-right text-[13px] py-4">
                                {new Date(milestone.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, {new Date(milestone.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-10 text-slate-400">No milestones shared yet.</div>
                    )}
                  </TabsContent>

                  <TabsContent value="schedule" className="mt-0 outline-none">
                    {childData?.schedules?.length > 0 ? (
                      <Table className="min-w-[800px]">
                        <TableHeader>
                          <TableRow className="border-none hover:bg-transparent">
                            <TableHead className="font-semibold text-slate-500 h-10">Title</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-center">Date</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-center">Start time</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-center">Category</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-center">Image</TableHead>
                            <TableHead className="font-semibold text-slate-500 h-10 text-right">Creator</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {childData.schedules.map((schedule: any) => (
                            <TableRow key={schedule.id} className="border-none hover:bg-black/5">
                              <TableCell className="font-medium text-slate-600 py-4">{schedule.title}</TableCell>
                              <TableCell className="text-slate-500 text-center text-[13px] py-4">
                                {new Date(schedule.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, {new Date(schedule.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}
                              </TableCell>
                              <TableCell className="text-slate-500 text-center py-4 text-[13px]">
                                {new Date(`2000-01-01T${schedule.start_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase().replace(' ', '.')}
                              </TableCell>
                              <TableCell className="text-slate-500 text-center py-4">{schedule.category}</TableCell>
                              <TableCell className="text-center py-4">
                                {schedule.image || schedule.photo ? (
                                  <a href={schedule.image || schedule.photo} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-[13px] font-medium inline-flex items-center justify-center">
                                    <Avatar className="h-8 w-8 rounded-md mr-2">
                                      <AvatarImage src={schedule.image || schedule.photo} className="object-cover" />
                                      <AvatarFallback className="rounded-md">Img</AvatarFallback>
                                    </Avatar>
                                    View
                                  </a>
                                ) : (
                                  <span className="text-slate-400 text-[13px]">N/A</span>
                                )}
                              </TableCell>
                              <TableCell className="text-slate-500 text-right py-4">{schedule.creator_name || "Activity"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-10 text-slate-400">No schedules found.</div>
                    )}
                  </TabsContent>
                </div>
              )}
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages Section */}
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-3xl overflow-hidden bg-white mt-8">
        <CardContent className="p-8 md:p-10 space-y-6">
          <h3 className="text-xl font-bold text-slate-800">Chat messages</h3>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-[14px] text-slate-600">Ai chat</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportAI}
                className="bg-[#F0F5FF] text-blue-600 border-none hover:bg-[#E1EDFF] h-9 px-4 text-[13px] font-medium rounded-lg"
              >
                <Download className="h-3.5 w-3.5 mr-2" />
                Export pdf
              </Button>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-[14px] text-slate-600">Person chat</span>
              {coParents.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {coParents.map(cp => (
                    <Button 
                      key={cp.id}
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleExportCoparent(cp.id)}
                      className="bg-[#F0F5FF] text-blue-600 border-none hover:bg-[#E1EDFF] h-9 px-4 text-[13px] font-medium rounded-lg"
                    >
                      <Download className="h-3.5 w-3.5 mr-2" />
                      Export pdf
                    </Button>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">No co-parents available</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailsPage;

