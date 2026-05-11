"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Download, Search, Loader2 } from "lucide-react";
import { adminService, AIPrompt } from "@/lib/api/services/admin.service";
import { toast } from "sonner";

export default function ChatPage() {
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchUserId, setSearchUserId] = useState("");

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const data = await adminService.getAIPrompts();
        setPrompts(data || []);
      } catch (error) {
        console.error("Error fetching prompts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  const handleExport = async (type: "ai" | "coparent") => {
    if (!searchUserId) {
      toast.error("Please enter a User ID to export chat logs.");
      return;
    }
    
    try {
      toast.info(`Exporting ${type === "ai" ? "AI" : "Co-parent"} chat for User ${searchUserId}...`);
      // In a real scenario, this might open a new tab with the export URL
      // window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}core/export/${type}-chat/?user_id=${searchUserId}`, '_blank');
    } catch (error) {
      toast.error("Failed to export chat logs.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1480px] mx-auto pb-10">
      {/* Ai prompts Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 px-1">Ai prompts</h2>
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-8 space-y-6">
            {prompts.map((prompt, index) => (
              <div key={index} className="flex items-center justify-between pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="grid grid-cols-2 gap-20">
                  <div>
                    <div className="text-xs text-slate-400 font-medium uppercase mb-1">Name</div>
                    <div className="text-sm text-slate-600 font-medium">{prompt.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium uppercase mb-1">Description</div>
                    <div className="text-sm text-slate-600 font-medium truncate max-w-[300px]">
                      {prompt.prompt?.substring(0, 50) || "No prompt content available"}...
                    </div>

                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-8 text-xs font-medium px-4 rounded-lg">
                  <Pencil className="h-3 w-3 mr-2" />
                  Edit
                </Button>
              </div>
            ))}
            {prompts.length === 0 && (
              <div className="text-center py-4 text-slate-400">No AI prompts found.</div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Chat messages Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 px-1">Chat messages</h2>
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-8 space-y-8">
            <div className="flex justify-end">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Enter User ID to export" 
                  className="pl-10 bg-slate-50/50 border-slate-100 rounded-full h-11"
                  value={searchUserId}
                  onChange={(e) => setSearchUserId(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-slate-600">Ai chat</span>
                <Button 
                  onClick={() => handleExport("ai")}
                  variant="outline" 
                  size="sm" 
                  className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-9 text-xs font-medium px-4 rounded-lg"
                >
                  <Download className="h-3.5 w-3.5 mr-2" />
                  Export pdf
                </Button>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-slate-600">Person chat</span>
                <Button 
                  onClick={() => handleExport("coparent")}
                  variant="outline" 
                  size="sm" 
                  className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-9 text-xs font-medium px-4 rounded-lg"
                >
                  <Download className="h-3.5 w-3.5 mr-2" />
                  Export pdf
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
