"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Crown,
  Users,
  UserX,
  CalendarClock,
  CalendarCheck,
  ArrowUpCircle,
  Loader2,
  ChevronUp,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  adminService,
  UserSubscription,
} from "@/lib/api/services/admin.service";
import UserCard from "@/components/dashboardComponent/userCard";

type FilterType = "all" | "free" | "monthly" | "yearly";

const SubscribersPage = () => {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  // Upgrade dialog
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<UserSubscription | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const data = await adminService.getUserSubscriptions();
        setSubscriptions(data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        toast.error("Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Categorize subscriptions
  const categorized = {
    free: subscriptions.filter((s) => !s.is_active || !s.plan_details),
    monthly: subscriptions.filter(
      (s) => s.is_active && s.plan_details?.name === "monthly"
    ),
    yearly: subscriptions.filter(
      (s) => s.is_active && s.plan_details?.name === "yearly"
    ),
  };

  // Filter + search
  const filteredSubscriptions = subscriptions
    .filter((sub) => {
      if (filter === "free") return !sub.is_active || !sub.plan_details;
      if (filter === "monthly")
        return sub.is_active && sub.plan_details?.name === "monthly";
      if (filter === "yearly")
        return sub.is_active && sub.plan_details?.name === "yearly";
      return true;
    })
    .filter((sub) => {
      const term = searchTerm.toLowerCase();
      return (
        sub.user_details.username?.toLowerCase().includes(term) ||
        sub.user_details.email?.toLowerCase().includes(term) ||
        sub.user_details.full_name?.toLowerCase().includes(term)
      );
    });

  const getPlanBadge = (sub: UserSubscription) => {
    if (!sub.is_active || !sub.plan_details) {
      return (
        <Badge
          variant="secondary"
          className="bg-slate-100 text-slate-600 border-none font-medium px-3 py-0.5 rounded-full"
        >
          Free
        </Badge>
      );
    }
    if (sub.plan_details.name === "yearly") {
      return (
        <Badge
          variant="secondary"
          className="bg-amber-50 text-amber-700 border border-amber-200 font-medium px-3 py-0.5 rounded-full"
        >
          <Crown className="w-3 h-3 mr-1" />
          Yearly — ${sub.plan_details.price}
        </Badge>
      );
    }
    return (
      <Badge
        variant="secondary"
        className="bg-purple-50 text-purple-700 border border-purple-200 font-medium px-3 py-0.5 rounded-full"
      >
        Monthly — ${sub.plan_details.price}
      </Badge>
    );
  };

  const getStatusBadge = (sub: UserSubscription) => {
    if (!sub.is_active) {
      return (
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-400"></span>
          <span className="text-sm text-red-600 font-medium">Expired</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-sm text-emerald-600 font-medium">Active</span>
      </span>
    );
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleUpgradeClick = (sub: UserSubscription) => {
    setSelectedSubscription(sub);
    setSelectedPlan("");
    setIsUpgradeDialogOpen(true);
  };

  const handleUpgradeSubmit = async () => {
    if (!selectedSubscription || !selectedPlan) return;

    setIsSubmitting(true);
    try {
      let body: { user: number; plan_slug?: string; is_active: boolean };

      if (selectedPlan === "free") {
        // Downgrade to free: just pass user + is_active false
        body = { user: selectedSubscription.user, is_active: false };
      } else {
        // Upgrade to monthly or yearly
        body = { user: selectedSubscription.user, plan_slug: selectedPlan, is_active: true };
      }

      const updated = await adminService.updateUserSubscription(selectedSubscription.id, body);

      // Update local state
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === selectedSubscription.id ? updated : s))
      );

      toast.success(
        `Plan updated to "${selectedPlan}" for ${selectedSubscription.user_details.full_name || selectedSubscription.user_details.username}`
      );
      setIsUpgradeDialogOpen(false);
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("Failed to update subscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filterTabs: { key: FilterType; label: string; count: number; icon: React.ReactNode; color: string }[] = [
    {
      key: "all",
      label: "All",
      count: subscriptions.length,
      icon: <Users className="w-4 h-4" />,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      key: "free",
      label: "Free",
      count: categorized.free.length,
      icon: <UserX className="w-4 h-4" />,
      color: "text-slate-600 bg-slate-50 border-slate-200",
    },
    {
      key: "monthly",
      label: "Monthly",
      count: categorized.monthly.length,
      icon: <CalendarClock className="w-4 h-4" />,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      key: "yearly",
      label: "Yearly",
      count: categorized.yearly.length,
      icon: <CalendarCheck className="w-4 h-4" />,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subscribers</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage user subscriptions and plan upgrades
          </p>
        </div>
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10 bg-white border-slate-200 rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4">
        <UserCard
          title="Total Subscribers"
          value={subscriptions.length.toLocaleString()}
          icon={<Users className="w-6 h-6" />}
          iconColor="text-blue-500 bg-blue-50"
        />
        <UserCard
          title="Free Plan"
          value={categorized.free.length.toLocaleString()}
          icon={<UserX className="w-6 h-6" />}
          iconColor="text-slate-500 bg-slate-50"
        />
        <UserCard
          title="Monthly Plan"
          value={categorized.monthly.length.toLocaleString()}
          icon={<CalendarClock className="w-6 h-6" />}
          iconColor="text-purple-500 bg-purple-50"
        />
        <UserCard
          title="Yearly Plan"
          value={categorized.yearly.length.toLocaleString()}
          icon={<Crown className="w-6 h-6" />}
          iconColor="text-amber-500 bg-amber-50"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
              ${
                filter === tab.key
                  ? `${tab.color} shadow-sm`
                  : "text-slate-500 bg-white border-slate-200 hover:bg-slate-50"
              }
            `}
          >
            {tab.icon}
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                filter === tab.key ? "bg-white/60" : "bg-slate-100"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none">
                  <TableHead className="font-semibold text-slate-700 pl-6">
                    User
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">
                    Plan
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Start Date
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    End Date
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right pr-6">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-16 text-slate-400"
                    >
                      No subscribers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscriptions.map((sub) => (
                    <TableRow
                      key={sub.id}
                      className="hover:bg-slate-50/50 transition-colors border-slate-100 group"
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 border border-slate-100">
                            <AvatarImage
                              src={sub.user_details.avatar || undefined}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 font-semibold">
                              {(
                                sub.user_details.full_name ||
                                sub.user_details.username ||
                                "U"
                              )
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                              {sub.user_details.full_name ||
                                sub.user_details.username ||
                                "Anonymous"}
                            </div>
                            <div className="text-xs text-slate-500">
                              {sub.user_details.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getPlanBadge(sub)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(sub)}
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm">
                        {formatDate(sub.start_date)}
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm">
                        {formatDate(sub.end_date)}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all"
                          onClick={() => handleUpgradeClick(sub)}
                        >
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Upgrade
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100">
              <div className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-900">
                  {filteredSubscriptions.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-900">
                  {subscriptions.length}
                </span>{" "}
                subscribers
              </div>
            </div>
          </>
        )}
      </div>

      {/* Upgrade Plan Dialog */}
      <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5 text-blue-600" />
              Upgrade Plan
            </DialogTitle>
            <DialogDescription>
              Change the subscription plan for{" "}
              <strong>
                {selectedSubscription?.user_details.full_name ||
                  selectedSubscription?.user_details.username}
              </strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Current Plan Info */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Current Plan</p>
              <p className="text-sm font-semibold text-slate-800 capitalize">
                {selectedSubscription?.plan_details
                  ? `${selectedSubscription.plan_details.name} — $${selectedSubscription.plan_details.price}`
                  : "Free (No Plan)"}
              </p>
            </div>

            {/* Plan Selector */}
            <div className="space-y-2">
              <Label>Select New Plan</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a plan..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="flex items-center gap-2">
                      <UserX className="w-4 h-4 text-slate-500" />
                      Free Plan
                    </span>
                  </SelectItem>
                  <SelectItem value="monthly">
                    <span className="flex items-center gap-2">
                      <CalendarClock className="w-4 h-4 text-purple-500" />
                      Monthly — $9.99
                    </span>
                  </SelectItem>
                  <SelectItem value="yearly">
                    <span className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-amber-500" />
                      Yearly — $79.99
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpgradeDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpgradeSubmit}
              disabled={!selectedPlan || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <ArrowUpCircle className="w-4 h-4 mr-1" />
              )}
              {isSubmitting ? "Updating..." : "Confirm Upgrade"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscribersPage;
