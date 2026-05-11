import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Download, Search } from "lucide-react";

export default function ChatPage() {
  const prompts = [
    { name: "tone_analyzer", updatedAt: "March 7, 2026, 12:36 p.m." },
    { name: "system_prompt", updatedAt: "March 7, 2026, 12:42 p.m." },
  ];

  return (
    <div className="space-y-8 max-w-[1480px] mx-auto pb-10">
      {/* Ai prompts Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 px-1">Ai prompts</h2>
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-8 space-y-6">
            {prompts.map((prompt, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="grid grid-cols-2 gap-20">
                  <div>
                    <div className="text-xs text-slate-400 font-medium uppercase mb-1">Name</div>
                    <div className="text-sm text-slate-600 font-medium">{prompt.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium uppercase mb-1">Updated at</div>
                    <div className="text-sm text-slate-600 font-medium">{prompt.updatedAt}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-8 text-xs font-medium px-4 rounded-lg">
                  <Pencil className="h-3 w-3 mr-2" />
                  Edit
                </Button>
              </div>
            ))}
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
                  placeholder="Search by email" 
                  className="pl-10 bg-slate-50/50 border-slate-100 rounded-full h-11"
                />
              </div>
            </div>

            <div className="space-y-6">
              {["Ai chat", "Person chat"].map((chat, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-slate-600">{chat}</span>
                  <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-9 text-xs font-medium px-4 rounded-lg">
                    <Download className="h-3.5 w-3.5 mr-2" />
                    Export pdf
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}