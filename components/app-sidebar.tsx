"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Blocks,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Settings2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs"; // Import Clerk hooks

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Apply",
      url: "/apply",
      icon: Sparkles,
    },
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Job Profile",
      url: "/jobprofile",
      icon: Inbox,
      badge: "10",
    },
    {
      title: "History",
      url: "/history",
      icon: Inbox,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: Blocks,
    },
    {
      title: "Trash",
      url: "/trash",
      icon: Trash2,
    },
    {
      title: "Help",
      url: "/help",
      icon: MessageCircleQuestion,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname(); // Get the current URL path
  const { isSignedIn, isLoaded, user } = useUser(); // Get authentication state and user data
  const router = useRouter(); // Initialize useRouter

  // Redirect to sign-in page if user is not authenticated
  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in"); // Redirect to sign-in page
    }
  }, [isLoaded, isSignedIn, router]);

  // If the user is not signed in, don't render the sidebar
  if (!isLoaded || !isSignedIn) {
    return null; // Or return a loading spinner
  }

  // Function to check if the item is active
  const isActive = (url: string) => pathname === url;

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain
          items={data.navMain.map((item) => ({
            ...item,
            isActive: isActive(item.url),
          }))}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary
          items={data.navSecondary.map((item) => ({
            ...item,
            isActive: isActive(item.url),
          }))}
          className="mt-auto"
        />
        {/* Add User Profile Section */}
        <div
          className="mt-4 p-2 flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors duration-200"
          onClick={() => document.querySelector(".cl-userButtonTrigger")?.dispatchEvent(new MouseEvent('click'))} // Programmatically click the UserButton
        >
          {/* User Profile Picture */}
          <UserButton
            afterSignOutUrl="/" // Redirect to sign-in page after sign-out
            appearance={{
              elements: {
                avatarBox: "h-10 w-10", // Customize the size of the avatar
              },
            }}
          />
          {/* User Name and Email */}
          {user && (
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs text-gray-500">
                {user.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          )}
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}