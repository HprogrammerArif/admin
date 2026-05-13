"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Loader2, Save } from "lucide-react";
import { adminService, ContentInfo } from "@/lib/api/services/admin.service";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { toast } from "sonner";

export default function ContentPage() {
  const [privacy, setPrivacy] = useState<ContentInfo[]>([]);
  const [about, setAbout] = useState<ContentInfo[]>([]);
  const [onboarding, setOnboarding] = useState<ContentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ContentInfo | null>(null);
  const [editType, setEditType] = useState<"privacy" | "about" | "onboarding" | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchData = async () => {
    try {
      const [privacyData, aboutData, onboardingData] = await Promise.all([
        adminService.getPrivacyInfo(),
        adminService.getAboutInfo(),
        adminService.getOnboardingInfo()
      ]);
      setPrivacy(privacyData || []);
      setAbout(aboutData || []);
      setOnboarding(onboardingData || []);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item: ContentInfo, type: "privacy" | "about" | "onboarding") => {
    setEditingItem(item);
    setEditType(type);
    setEditTitle(item.title || item.name || "");
    setEditContent(item.content || item.description || "");
    setSelectedFile(null);
  };

  const handleSave = async () => {
    if (!editingItem || !editType) return;

    setSaving(true);
    try {
      if (editType === "privacy") {
        await adminService.updatePrivacyInfo(editingItem.id, { 
          title: editTitle,
          content: editContent 
        });
        toast.success("Privacy info updated successfully");
      } else if (editType === "about") {
        const formData = new FormData();
        formData.append("name", editTitle);
        formData.append("description", editContent);
        if (selectedFile) {
          formData.append("image", selectedFile);
        }
        await adminService.updateAboutInfo(editingItem.id, formData);
        toast.success("About info updated successfully");
      } else if (editType === "onboarding") {
        const formData = new FormData();
        // Use the title from the input field
        formData.append("title", editTitle);
        formData.append("description", editContent);
        
        // If a new image is selected, add it
        if (selectedFile) {
          formData.append("image", selectedFile);
        }
        
        await adminService.updateOnboardingInfo(editingItem.id, formData);
        toast.success("Onboarding info updated successfully");
      }
      
      await fetchData();
      setEditingItem(null);
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Error updating content:", error);
      // Log the specific error response from the server to help debugging
      if (error.response?.data) {
        console.error("Server validation error:", error.response.data);
        const errorMsg = typeof error.response.data === 'string' 
          ? error.response.data 
          : JSON.stringify(error.response.data);
        toast.error(`Update failed: ${errorMsg}`);
      } else {
        toast.error("Failed to update content");
      }
    } finally {
      setSaving(false);
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
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">

      {/* Legal & Privacy Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 px-1">Legal privacy infos</h2>
        {privacy.map((item) => (
          <Card key={item.id} className="border-slate-200 shadow-sm overflow-hidden bg-white mb-4">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-8 text-xs font-medium px-4 rounded-lg"
                  onClick={() => handleEdit(item, "privacy")}
                >
                  <Pencil className="h-3 w-3 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="text-sm text-slate-500 leading-relaxed max-w-4xl markdown-content prose prose-slate prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {item.content || ""}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 px-1">Onboarding infos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {onboarding.map((item) => (
            <Card key={item.id} className="border-slate-200 shadow-sm overflow-hidden bg-white flex flex-col">
              <div className="aspect-video w-full bg-slate-100 relative group">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    No image
                  </div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="h-8 w-8 p-0 rounded-full bg-white/90 shadow-md hover:bg-white"
                    onClick={() => handleEdit(item, "onboarding")}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
                </div>
                <div className="text-sm text-slate-500 markdown-content prose prose-slate prose-sm max-w-none flex-1">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {item.description || ""}
                  </ReactMarkdown>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-9 text-xs font-medium rounded-lg mt-auto"
                  onClick={() => handleEdit(item, "onboarding")}
                >
                  <Pencil className="h-3 w-3 mr-2" />
                  Edit Content
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit {editingItem?.title || editingItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                {editType === "about" ? "Name" : "Title"}
              </label>
              <Input 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder={`Enter ${editType === "about" ? "name" : "title"}...`}
                className="bg-white"
              />
            </div>

            {(editType === "onboarding" || editType === "about") && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center justify-between">
                  <span>Display Image</span>
                  {editingItem?.image && !selectedFile && <span className="text-xs text-slate-400">Current image will be kept if none selected</span>}
                </label>
                <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                  <div className="h-24 w-24 rounded-md overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                    {selectedFile ? (
                      <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="h-full w-full object-cover" />
                    ) : editingItem?.image ? (
                      <img src={editingItem.image} alt="Current" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-300 text-xs">No image</div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="cursor-pointer bg-white"
                    />
                    <p className="text-[10px] text-slate-400">Recommended: Transparent PNG or high-quality JPG (16:9 ratio)</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Content</label>
              {editType === "onboarding" ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[150px]"
                  placeholder="Type your onboarding description here..."
                />
              ) : (
                <RichTextEditor
                  value={editContent}
                  onChange={setEditContent}
                  placeholder="Type your content here..."
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

