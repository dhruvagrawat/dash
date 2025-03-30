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
import { Button } from "@/components/ui/button"
import { Bell, Briefcase, Calendar, ChevronUp, CreditCard, LineChart, Zap } from "lucide-react"

export default function HomePage() {
  // Sample data for the dashboard
  const userData = {
    name: "Alex Johnson",
    tier: "Premium",
    totalCredits: 100,
    usedCredits: 35,
    activeApplications: 5,
    interviews: 2,
    recentActivity: [
      { company: "Google", position: "Frontend Developer", action: "Applied", date: "2023-05-15", portal: "LinkedIn" },
      { company: "Microsoft", position: "Software Engineer", action: "Interview scheduled", date: "2023-05-10", portal: "Indeed" },
      { company: "Meta", position: "React Developer", action: "Submitted follow-up", date: "2023-05-18", portal: "jobeasy" },
    ],
    weeklyStats: [
      { day: "Mon", applications: 2 },
      { day: "Tue", applications: 1 },
      { day: "Wed", applications: 3 },
      { day: "Thu", applications: 0 },
      { day: "Fri", applications: 2 },
      { day: "Sat", applications: 0 },
      { day: "Sun", applications: 1 },
    ],
    upcomingEvents: [
      { title: "Technical Interview", company: "Microsoft", date: "2023-05-25", time: "10:00 AM" },
      { title: "Follow-up Call", company: "Google", date: "2023-05-22", time: "2:30 PM" },
    ]
  }

  // Helper function for portal styling
  const getPortalClass = (portal: string) => {
    switch (portal) {
      case "LinkedIn": return "bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs border border-blue-200"
      case "Indeed": return "bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-xs border border-purple-200"
      case "jobeasy": return "bg-green-50 text-green-600 px-2 py-0.5 rounded text-xs border border-green-200"
      default: return "bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-xs border border-gray-200"
    }
  }

  // Calculate weekly stats max for chart scaling
  const maxApplications = Math.max(...userData.weeklyStats.map(day => day.applications))

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
                    Dashboard
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 px-4 py-6">
          <div className="mx-auto w-full max-w-6xl">
            {/* Welcome Section */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Welcome back, {userData.name}</h1>
              <p className="text-muted-foreground">Here's an overview of your job search activity</p>
            </div>

            {/* Top Stats Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Tier Status Card */}
              <div className="rounded-lg border p-4 shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Membership Tier</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold">{userData.tier}</p>
                      <p className="text-xs text-muted-foreground">Until June 15, 2023</p>
                    </div>
                  </div>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Active</span>
                </div>
              </div>

              {/* Credits Card */}
              <div className="rounded-lg border p-4 shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Application Credits</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <CreditCard className="h-8 w-8 text-blue-500" />
                    <p className="text-2xl font-bold">{userData.totalCredits - userData.usedCredits} / {userData.totalCredits}</p>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(userData.usedCredits / userData.totalCredits) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground">Credits refresh in 16 days</p>
                </div>
              </div>

              {/* Active Applications Card */}
              <div className="rounded-lg border p-4 shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Applications</h3>
                <div className="flex items-center justify-between">
                  <Briefcase className="h-8 w-8 text-green-500" />
                  <div className="text-right">
                    <p className="text-2xl font-bold">{userData.activeApplications}</p>
                    <p className="flex items-center text-xs text-green-600">
                      <ChevronUp className="mr-1 h-3 w-3" />
                      <span>+2 this week</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Interviews Card */}
              <div className="rounded-lg border p-4 shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Upcoming Interviews</h3>
                <div className="flex items-center justify-between">
                  <Calendar className="h-8 w-8 text-purple-500" />
                  <div className="text-right">
                    <p className="text-2xl font-bold">{userData.interviews}</p>
                    <p className="text-xs text-muted-foreground">Next: Microsoft (May 25)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Weekly Applications Chart */}
              <div className="rounded-lg border p-4 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <LineChart className="mr-2 h-5 w-5" />
                    Weekly Application Activity
                  </h3>
                  <p className="text-sm text-muted-foreground">Applications submitted in the last 7 days</p>
                </div>
                <div className="flex h-52 items-end justify-between gap-2">
                  {userData.weeklyStats.map((day, i) => (
                    <div key={i} className="relative flex flex-col items-center">
                      <div
                        className="relative w-12 bg-blue-500 rounded-t"
                        style={{
                          height: `${(day.applications / maxApplications) * 160}px`,
                          minHeight: day.applications > 0 ? '20px' : '4px',
                          backgroundColor: day.applications > 0 ? 'rgb(59, 130, 246)' : 'rgb(229, 231, 235)'
                        }}
                      >
                        {day.applications > 0 && (
                          <div className="absolute -top-6 left-0 right-0 text-center text-sm font-medium">
                            {day.applications}
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-xs font-medium">{day.day}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="rounded-lg border p-4 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Upcoming Events
                  </h3>
                  <p className="text-sm text-muted-foreground">Your scheduled interviews and follow-ups</p>
                </div>
                <div className="space-y-4">
                  {userData.upcomingEvents.map((event, i) => (
                    <div key={i} className="flex items-start space-x-4 rounded-lg border p-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        {event.title.includes("Interview") ? (
                          <Briefcase className="h-5 w-5" />
                        ) : (
                          <Bell className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.company}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          {event.date} at {event.time}
                        </div>
                      </div>
                    </div>
                  ))}
                  {userData.upcomingEvents.length === 0 && (
                    <div className="flex h-32 items-center justify-center text-center">
                      <p className="text-muted-foreground">No upcoming events scheduled</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-6 rounded-lg border p-4 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Recent Activity
                </h3>
                <p className="text-sm text-muted-foreground">Your latest job application updates</p>
              </div>
              <div className="space-y-4">
                {userData.recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        {activity.company.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{activity.company}</p>
                        <p className="text-sm text-muted-foreground">{activity.position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{activity.action}</p>
                      <div className="mt-1 flex items-center justify-end space-x-2">
                        <span className={getPortalClass(activity.portal)}>{activity.portal}</span>
                        <span className="text-xs text-muted-foreground">{activity.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}