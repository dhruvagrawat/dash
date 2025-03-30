'use client';
import { AppSidebar } from "@/components/app-sidebar"
import { NavActions } from "@/components/nav-actions"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Page() {
  const [filter, setFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  // Sample job applications data with portal information
  const jobApplications = [
    { company: "Google", position: "Frontend Developer", portal: "LinkedIn", status: "Applied", date: "2023-05-15" },
    { company: "Microsoft", position: "Software Engineer", portal: "Indeed", status: "Interview", date: "2023-05-10" },
    { company: "Amazon", position: "Full Stack Developer", portal: "LinkedIn", status: "Rejected", date: "2023-04-28" },
    { company: "Meta", position: "React Developer", portal: "jobeasy", status: "Applied", date: "2023-05-18" },
    { company: "Netflix", position: "UI Engineer", portal: "Indeed", status: "Offer", date: "2023-04-05" },
  ]

  // Filter and search applications
  const filteredApplications = jobApplications.filter(app => {
    const matchesFilter = filter === "All" || app.status === filter
    const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.portal.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Calculate statistics
  const stats = {
    total: jobApplications.length,
    interviews: jobApplications.filter(app => app.status === "Interview").length,
    offers: jobApplications.filter(app => app.status === "Offer").length,
    rejections: jobApplications.filter(app => app.status === "Rejected").length,
    linkedin: jobApplications.filter(app => app.portal === "linkedin").length,
  }

  // Helper function for status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Applied": return "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs"
      case "Interview": return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs"
      case "Offer": return "bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs"
      case "Rejected": return "bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs"
      default: return "bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs"
    }
  }

  // Helper function for portal badge styling
  const getPortalBadgeClass = (portal: string) => {
    switch (portal) {
      case "LinkedIn": return "bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs border border-blue-200"
      case "Indeed": return "bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-xs border border-purple-200"
      case "jobeasy": return "bg-green-50 text-green-600 px-2 py-0.5 rounded text-xs border border-green-200"
      default: return "bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-xs border border-gray-200"
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    Job Applications
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 px-4 py-6">
          <div className="mx-auto w-full max-w-5xl">
            <div className="mb-4">
              <h1 className="text-2xl font-bold">Job Applications</h1>
              <p className="text-muted-foreground">Track and manage your job applications</p>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={filter === "All" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("All")}
                >
                  All
                </Button>
                <Button
                  variant={filter === "Applied" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("Applied")}
                >
                  Applied
                </Button>
                <Button
                  variant={filter === "Interview" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("Interview")}
                >
                  Interview
                </Button>
                <Button
                  variant={filter === "Offer" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("Offer")}
                >
                  Offer
                </Button>

              </div>


            </div>

            <div className="mt-6 overflow-hidden rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-3 text-left font-medium">Company</th>
                    <th className="p-3 text-left font-medium">Position</th>
                    <th className="p-3 text-left font-medium">Portal</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-left font-medium">Date</th>
                    <th className="p-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app, index) => (
                    <tr key={index} className="border-t hover:bg-muted/50">
                      <td className="p-3">{app.company}</td>
                      <td className="p-3">{app.position}</td>
                      <td className="p-3">
                        <span className={getPortalBadgeClass(app.portal)}>
                          {app.portal}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={getStatusBadgeClass(app.status)}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3">{app.date}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="19" cy="12" r="1" />
                              <circle cx="5" cy="12" r="1" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-md border p-4">
                <h3 className="text-sm text-muted-foreground">Total Applications</h3>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="rounded-md border p-4">
                <h3 className="text-sm text-muted-foreground">Interviews</h3>
                <p className="text-2xl font-bold">{stats.interviews}</p>
              </div>
              <div className="rounded-md border p-4">
                <h3 className="text-sm text-muted-foreground">Offers</h3>
                <p className="text-2xl font-bold">{stats.offers}</p>
              </div>
              <div className="rounded-md border p-4">
                <h3 className="text-sm text-muted-foreground">Rejections</h3>
                <p className="text-2xl font-bold">{stats.rejections}</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}