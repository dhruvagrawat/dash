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

export default function SettingsPage() {
  const [username, setUsername] = useState("JohnDoe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
                <BreadcrumbPage className="line-clamp-1">Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <NavActions />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 px-8 py-8 max-w-5xl">
          <h1 className="text-2xl font-bold">Settings</h1>

          <div className="space-y-6">
            {/* Account Settings */}
            <div className="border p-6 rounded-lg shadow-md w-full">
              <h2 className="text-lg font-semibold mb-2">Account Settings</h2>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Username</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="space-y-2 mt-3">
                <label className="block text-sm font-medium">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button className="mt-4">Save Changes</Button>
            </div>

            {/* Notification Settings */}
            <div className="border p-6 rounded-lg shadow-md w-full">
              <h2 className="text-lg font-semibold mb-2">Notifications</h2>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  className="h-4 w-4"
                />
                <span>Enable email notifications</span>
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="border p-6 rounded-lg shadow-md w-full">
              <h2 className="text-lg font-semibold mb-2">Appearance</h2>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  className="h-4 w-4"
                />
                <span>Enable Dark Mode</span>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
