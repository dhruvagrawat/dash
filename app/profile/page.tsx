'use client';
import { AppSidebar } from "@/components/app-sidebar";
import { NavActions } from "@/components/nav-actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const [username, setUsername] = useState("JohnDoe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [tier, setTier] = useState("Free");
  const [jobCredits, setJobCredits] = useState(50);
  const [trackerLimit, setTrackerLimit] = useState("50/100");
  const [weeklyLimit, setWeeklyLimit] = useState("100/100");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <NavActions />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 px-8 py-8 max-w-5xl">
          <h1 className="text-2xl font-bold">Profile</h1>

          <div className="space-y-6">
            {/* Account Information */}
            <div className="border p-6 rounded-lg shadow-md w-full">
              <h2 className="text-lg font-semibold mb-2">Account Information</h2>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Username</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="space-y-2 mt-3">
                <label className="block text-sm font-medium">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            {/* Tier Selection */}
            <div className="border p-6 rounded-lg shadow-md w-full">
              <h2 className="text-lg font-semibold mb-2">Subscription Tier</h2>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full border p-2 rounded-md"
              >
                <option value="Free">Free</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>

            {/* Job Application Credits */}
            <div className="border p-6 rounded-lg shadow-md w-full">
              <h2 className="text-lg font-semibold mb-2">Job Application Credits</h2>
              <p>{jobCredits} remaining</p>
            </div>

            {/* Job Tracker Storage Limit */}
            <div className="border p-6 rounded-lg shadow-md w-full">
              <h2 className="text-lg font-semibold mb-2">Job Tracker Storage Limit</h2>
              <p>{trackerLimit}</p>
            </div>

            {/* Weekly Job Application Limit */}
            <div className="border p-6 rounded-lg shadow-md w-full">
              <h2 className="text-lg font-semibold mb-2">This Week's Job Application Limit</h2>
              <p>{weeklyLimit}</p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}