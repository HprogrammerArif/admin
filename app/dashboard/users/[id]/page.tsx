"use client";

import React from 'react';
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
import { ChevronLeft, Download } from "lucide-react";

const UserDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  // Mock data for the user
  const user = {
    name: "Alice Freeman",
    role: "Father",
    email: "alice.freeman@example.com",
    number: "0292929293030",
    joinDate: "Oct 24, 2023",
    avatar: "https://i.pravatar.cc/150?u=1"
  };

  const coparent = {
    name: "Alice Freeman",
    role: "Mother",
    email: "alice.freeman@example.com",
    avatar: "https://i.pravatar.cc/150?u=2"
  };

  const children = [
    { name: "Alex", avatar: "https://i.pravatar.cc/150?u=10" },
    { name: "Jhon", avatar: "https://i.pravatar.cc/150?u=11" },
    { name: "Jhon", avatar: "https://i.pravatar.cc/150?u=12" },
    { name: "Jhon", avatar: "https://i.pravatar.cc/150?u=13" },
  ];

  const expanseData = [
    { title: "Doctor bill", amount: "$34,295", payer: "alice.freeman@example.com", category: "Activity", split: "50/50", status: "Rejected", date: "Feb,26,2026, 7:54 am" },
    { title: "Doctor bill", amount: "$34,295", payer: "alice.freeman@example.com", category: "Activity", split: "50/50", status: "Approve", date: "Feb,26,2026, 7:54 am" },
    { title: "Doctor bill", amount: "$34,295", payer: "alice.freeman@example.com", category: "Activity", split: "50/50", status: "Approve", date: "Feb,26,2026, 7:54 am" },
    { title: "Doctor bill", amount: "$34,295", payer: "alice.freeman@example.com", category: "Activity", split: "50/50", status: "Approve", date: "Feb,26,2026, 7:54 am" },
    { title: "Doctor bill", amount: "$34,295", payer: "alice.freeman@example.com", category: "Activity", split: "50/50", status: "Pending", date: "Feb,26,2026, 7:54 am" },
  ];

  const documentData = [
    { title: "Doctor bill", category: "Activity", date: "Feb,26,2026, 7:54 am" },
    { title: "Doctor bill", category: "Activity", date: "Feb,26,2026, 7:54 am" },
    { title: "Doctor bill", category: "Activity", date: "Feb,26,2026, 7:54 am" },
    { title: "Doctor bill", category: "Activity", date: "Feb,26,2026, 7:54 am" },
    { title: "Doctor bill", category: "Activity", date: "Feb,26,2026, 7:54 am" },
  ];

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
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-900">{user.name}</span>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0 h-4 border-none uppercase">
                      {user.role}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-500">{user.email}</div>
                </div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-xs text-slate-400 font-medium uppercase mb-1">Number</div>
                <div className="text-sm text-slate-600 font-medium">{user.number}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium uppercase mb-1">Join date</div>
                <div className="text-sm text-slate-600 font-medium">{user.joinDate}</div>
              </div>
            </div>
          </div>

          {/* Coparent Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Coparent</h3>
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10 border border-slate-100">
                <AvatarImage src={coparent.avatar} />
                <AvatarFallback>{coparent.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-900">{coparent.name}</span>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0 h-4 border-none uppercase">
                    {coparent.role}
                  </Badge>
                </div>
                <div className="text-sm text-slate-500">{coparent.email}</div>
              </div>
            </div>
          </div>

          {/* Children Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Children {children.length}</h3>
            <div className="flex items-center space-x-3">
              {children.map((child, i) => (
                <div key={i} className="flex items-center bg-blue-50/50 rounded-full pl-1 pr-3 py-1 border border-blue-100/50">
                  <Avatar className="h-6 w-6 border border-white">
                    <AvatarImage src={child.avatar} />
                    <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-xs font-medium text-blue-600">{child.name}</span>
                </div>
              ))}
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
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none">
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase px-6">Title</TableHead>
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase">Amount</TableHead>
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase">Payer</TableHead>
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase">Category</TableHead>
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase">Split method</TableHead>
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase">Status</TableHead>
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase text-right pr-6">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expanseData.map((item, i) => (
                        <TableRow key={i} className="hover:bg-slate-50/30 border-slate-50">
                          <TableCell className="px-6 text-slate-700 font-medium">{item.title}</TableCell>
                          <TableCell className="text-slate-700 font-medium">{item.amount}</TableCell>
                          <TableCell className="text-slate-400 text-sm">{item.payer}</TableCell>
                          <TableCell className="text-slate-400 text-sm">{item.category}</TableCell>
                          <TableCell className="text-slate-400 text-sm">{item.split}</TableCell>
                          <TableCell>
                            <Badge className={`
                              ${item.status === 'Rejected' ? 'bg-red-600 text-white hover:bg-red-600' : ''}
                              ${item.status === 'Approve' ? 'bg-emerald-600 text-white hover:bg-emerald-600' : ''}
                              ${item.status === 'Pending' ? 'bg-amber-500 text-white hover:bg-amber-500' : ''}
                              border-none font-medium px-3 py-0.5 rounded-full text-[10px]
                            `}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-400 text-xs text-right pr-6">{item.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="document" className="mt-6">
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none">
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase px-6">Title</TableHead>
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase">Category</TableHead>
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase text-right pr-6">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documentData.map((item, i) => (
                        <TableRow key={i} className="hover:bg-slate-50/30 border-slate-50">
                          <TableCell className="px-6 text-slate-700 font-medium">{item.title}</TableCell>
                          <TableCell className="text-slate-400 text-sm">{item.category}</TableCell>
                          <TableCell className="text-slate-400 text-xs text-right pr-6">{item.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="milestone" className="mt-6">
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none">
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase px-6">Title</TableHead>
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase">Category</TableHead>
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase text-right pr-6">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documentData.map((item, i) => (
                        <TableRow key={i} className="hover:bg-slate-50/30 border-slate-50">
                          <TableCell className="px-6 text-slate-700 font-medium">{item.title}</TableCell>
                          <TableCell className="text-slate-400 text-sm">{item.category}</TableCell>
                          <TableCell className="text-slate-400 text-xs text-right pr-6">{item.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="mt-6">
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none">
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase px-6">Title</TableHead>
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase">Date</TableHead>
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase">Start time</TableHead>
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase">Category</TableHead>
                        <TableHead className="font-semibold text-slate-500 text-xs uppercase text-right pr-6">Creator</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1,2,3].map((i) => (
                        <TableRow key={i} className="hover:bg-slate-50/30 border-slate-50">
                          <TableCell className="px-6 text-slate-700 font-medium">Doctor bill</TableCell>
                          <TableCell className="text-slate-400 text-xs">Feb,26,2026, 7:54 am</TableCell>
                          <TableCell className="text-slate-400 text-xs">1:30 a.m.</TableCell>
                          <TableCell className="text-slate-400 text-sm">Medical</TableCell>
                          <TableCell className="text-slate-400 text-sm text-right pr-6">Activity</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
            {["Ai chat", "Person chat"].map((chat, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 bg-slate-50/30">
                <span className="text-sm font-medium text-slate-600">{chat}</span>
                <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-8 text-xs font-medium">
                  <Download className="h-3 w-3 mr-2" />
                  Export pdf
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailsPage;
