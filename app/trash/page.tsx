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

export default function TrashPage() {
  const [deletedApplications, setDeletedApplications] = useState([
    { id: 1, title: "Software Engineer", company: "TechCorp", date: "2025-03-10" },
    { id: 2, title: "Product Manager", company: "BizTech", date: "2025-03-12" },
  ]);

  const restoreApplication = (id: number) => {
    setDeletedApplications(deletedApplications.filter((app) => app.id !== id));
  };

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
                <BreadcrumbPage className="line-clamp-1">Trash</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <NavActions />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 px-8 py-8 max-w-5xl">
          <h1 className="text-2xl font-bold">Trash</h1>
          <p className="text-sm text-gray-500">Deleted job applications. Restore if needed.</p>
          <div className="space-y-4">
            {deletedApplications.length > 0 ? (
              deletedApplications.map((app) => (
                <div key={app.id} className="border p-6 rounded-lg shadow-md flex justify-between items-center w-full">
                  <div>
                    <h2 className="text-lg font-semibold">{app.title}</h2>
                    <p className="text-sm text-gray-500">{app.company} - {app.date}</p>
                  </div>
                  <Button onClick={() => restoreApplication(app.id)}>Restore</Button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No deleted applications.</p>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
