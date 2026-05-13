"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Download, Search, Loader2 } from "lucide-react";
import { adminService, AIPrompt } from "@/lib/api/services/admin.service";
import { toast } from "sonner";

export default function ChatPage() {
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchUserId, setSearchUserId] = useState("");
  
  // Edit State
  const [editingPrompt, setEditingPrompt] = useState<AIPrompt | null>(null);
  const [editPromptText, setEditPromptText] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAIPrompts();
      setPrompts(data || []);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleEditClick = (prompt: AIPrompt) => {
    setEditingPrompt(prompt);
    setEditPromptText(prompt.prompt_text || "");
  };

  const handleSave = async () => {
    if (!editingPrompt) return;
    
    setSaving(true);
    try {
      await adminService.updateAIPrompt(editingPrompt.name, {
        name: editingPrompt.name,
        prompt_text: editPromptText
      });
      toast.success(`${editingPrompt.name} updated successfully!`);
      await fetchPrompts();
      setEditingPrompt(null);
    } catch (error) {
      console.error("Error updating prompt:", error);
      toast.error("Failed to update AI Prompt.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && prompts.length === 0) {
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
                <div className="grid grid-cols-2 gap-20 flex-1 pr-10">
                  <div>
                    <div className="text-xs text-slate-400 font-medium uppercase mb-1">Name</div>
                    <div className="text-sm text-slate-600 font-medium">{prompt.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium uppercase mb-1">Description</div>
                    <div className="text-sm text-slate-600 font-medium truncate max-w-[400px]">
                      {prompt.prompt_text?.substring(0, 80) || "No prompt content available"}...
                    </div>

                  </div>
                </div>
                <Button 
                  onClick={() => handleEditClick(prompt)}
                  variant="outline" 
                  size="sm" 
                  className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-8 text-xs font-medium px-4 rounded-lg flex-shrink-0"
                >
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

      {/* Edit Prompt Dialog */}
      <Dialog open={!!editingPrompt} onOpenChange={(open) => !open && setEditingPrompt(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-slate-50">
          <DialogHeader className="px-8 py-6 bg-white border-b border-slate-100">
            <DialogTitle>Edit Prompt: {editingPrompt?.name}</DialogTitle>
          </DialogHeader>
          <div className="px-8 py-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Prompt Text</label>
              <Textarea 
                value={editPromptText}
                onChange={(e) => setEditPromptText(e.target.value)}
                className="min-h-[300px] font-mono text-sm leading-relaxed p-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500"
                placeholder="Enter prompt instructions..."
              />
              <p className="text-xs text-slate-400">
                This text acts as the system instruction for the AI model. Be clear and specific.
              </p>
            </div>
          </div>
          <DialogFooter className="px-8 py-6 bg-white border-t border-slate-100">
            <Button variant="outline" onClick={() => setEditingPrompt(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

