import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function ContentPage() {
  return (
    <div className="space-y-8 mx-auto pb-10 max-w-[1480px]">
      {/* About info Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 px-1">About info</h2>
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">privacy</h3>
              <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-8 text-xs font-medium px-4 rounded-lg">
                <Pencil className="h-3 w-3 mr-2" />
                Edit
              </Button>
            </div>
            <div className="text-sm text-slate-500 leading-relaxed max-w-4xl">
              <p>
                <strong>LEGAL PLACEHOLDER</strong> (Advanced Draft Lawyer-Ready Scaffold)<br />
                <strong>1. DEFINITIONS &amp; INTERPRETATION</strong><br />
                Define: Floruit, Service, User, AI Features, Content, Uploaded Content, Third-Party Services, Subscription, Free Tier, Paid Services.<br />
                <strong>2. ACCEPTANCE &amp; ELIGIBILITY</strong><br />
                By accessing or using Floruit the User: Confirms they are at least 18 years old. Has legal capacity to enter into a binding agreement. Accepts these Terms in full. Use is prohibited where not permitted by law.<br />
                <strong>3. NATURE OF THE SERVICE</strong><br />
                Floruit is a software-as-a-service (SaaS) platform providing: Organisational tools Communication structuring Scheduling and record-keeping Al-assisted text processing Floruit is not: A legal service A parenting authority A mediation service A healthcare provider A therapeutic service A decision-making system<br />
                <strong>4. ABSOLUTE DISCLAIMER OF ADVICE</strong><br />
                No content, output, suggestion, reminder or Al-generated response: Constitutes advice of any kind Creates a duty of care Forms the basis of reliance Users acknowledge that all actions and decisions are taken at their sole discretion and risk.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Legal privacy infos Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 px-1">Legal privacy infos</h2>
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Co-Parenting</h3>
              <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-8 text-xs font-medium px-4 rounded-lg">
                <Pencil className="h-3 w-3 mr-2" />
                Edit
              </Button>
            </div>
            <p className="text-sm text-slate-500">
              Making co-parenting work by helping you stay organized, communicate effectively, and manage shared expenses with ease.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Onboarding infos Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 px-1">Onboarding infos</h2>
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-8 space-y-8">
            {/* Expense Tracking */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Expense Tracking</h3>
                <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-8 text-xs font-medium px-4 rounded-lg">
                  <Pencil className="h-3 w-3 mr-2" />
                  Edit
                </Button>
              </div>
              <p className="text-sm text-slate-500">
                Manage and track shared expenses.
              </p>
            </div>

            {/* Shared Calendar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Shared Calendar</h3>
                <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-8 text-xs font-medium px-4 rounded-lg">
                  <Pencil className="h-3 w-3 mr-2" />
                  Edit
                </Button>
              </div>
              <p className="text-sm text-slate-500">
                Stay in sync with shared schedules and appointments.
              </p>
            </div>

            {/* Secure Messaging */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Secure Messaging</h3>
                <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 h-8 text-xs font-medium px-4 rounded-lg">
                  <Pencil className="h-3 w-3 mr-2" />
                  Edit
                </Button>
              </div>
              <p className="text-sm text-slate-500">
                Communicate clearly and respectfully in one place.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
