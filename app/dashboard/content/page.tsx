"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Loader2 } from "lucide-react";
import { adminService, ContentInfo } from "@/lib/api/services/admin.service";

export default function ContentPage() {
  const [privacy, setPrivacy] = useState<ContentInfo[]>([]);
  const [about, setAbout] = useState<ContentInfo[]>([]);
  const [onboarding, setOnboarding] = useState<ContentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 mx-auto pb-10 max-w-[1480px]">
      {/* About Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 px-1">About info</h2>
        {about.map((item) => (
          <Card key={item.id} className="border-slate-200 shadow-sm overflow-hidden bg-white mb-4">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">{item.name}</h3>
                <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-8 text-xs font-medium px-4 rounded-lg">
                  <Pencil className="h-3 w-3 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="text-sm text-slate-500 leading-relaxed max-w-4xl">
                <p>{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Legal & Privacy Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 px-1">Legal privacy infos</h2>
        {privacy.map((item) => (
          <Card key={item.id} className="border-slate-200 shadow-sm overflow-hidden bg-white mb-4">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
                <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-8 text-xs font-medium px-4 rounded-lg">
                  <Pencil className="h-3 w-3 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="text-sm text-slate-500 leading-relaxed max-w-4xl" dangerouslySetInnerHTML={{ __html: item.content || '' }} />
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Onboarding Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 px-1">Onboarding infos</h2>
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-8 space-y-8">
            {onboarding.map((item) => (
              <div key={item.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
                  <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-8 text-xs font-medium px-4 rounded-lg">
                    <Pencil className="h-3 w-3 mr-2" />
                    Edit
                  </Button>
                </div>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

