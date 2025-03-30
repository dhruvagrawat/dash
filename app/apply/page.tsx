'use client';
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Linkedin,
  Globe,
  Briefcase,
  DollarSign,
  MapPin,
  CloudSun,
  Settings,
  HelpCircle,
  Wrench,
  RefreshCw,
  XCircle,
  MousePointer
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { NavActions } from "@/components/nav-actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Session timeout in milliseconds (5 minutes)
const SESSION_TIMEOUT = 5 * 60 * 1000;

// Helper function for making POST requests
const postData = async (url: string | URL | Request, data: any) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const JOB_PLATFORMS = {
  LinkedIn: {
    label: 'Apply on LinkedIn',
    url: 'https://www.linkedin.com/jobs',
    promptTemplate: 'Automatically apply to relevant software engineering jobs on LinkedIn with the following preferences: salary expectation: {salary}, work mode: {workMode}, country: {country}, industry: {industry}'
  },
  Indeed: {
    label: 'Apply on Indeed',
    url: 'https://www.indeed.com',
    promptTemplate: 'Automatically apply to relevant jobs on Indeed with the following preferences: salary expectation: {salary}, work mode: {workMode}, country: {country}, industry: {industry}'
  },
  Glassdoor: {
    label: 'Apply on Glassdoor',
    url: 'https://www.glassdoor.com/Job',
    promptTemplate: 'Automatically apply to relevant jobs on Glassdoor with the following preferences: salary expectation: {salary}, work mode: {workMode}, country: {country}, industry: {industry}'
  }
};

export default function JobApplicationFlow() {
  const [selectedPlatform, setSelectedPlatform] = useState<keyof typeof JOB_PLATFORMS | ''>('');
  const [jobPreferences, setJobPreferences] = useState({
    salaryExpectation: '',
    workMode: '',
    country: '',
    industry: ''
  });
  const [isReadyToApply, setIsReadyToApply] = useState(false);

  // Apply Page State
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  interface LogEntry {
    timestamp: string;
    message: string;
  }

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [iframeStatus, setIframeStatus] = useState('loading');
  const iframeRef = useRef(null);
  const [isHoveringIframe, setIsHoveringIframe] = useState(false);

  // Browser session state
  interface Session {
    id: string;
    liveView: string;
  }

  const [session, setSession] = useState<Session | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isRunningTask, setIsRunningTask] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Session timer state
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(SESSION_TIMEOUT);
  const [sessionTimerActive, setSessionTimerActive] = useState(false);

  // Use the App Router proxy URL
  const proxyUrl = '/api/proxy-vnc/vnc.html';

  // Redirect to sign-in page if user is not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Session timer effect
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;

    if (sessionTimerActive && sessionTimeRemaining > 0) {
      interval = setInterval(() => {
        setSessionTimeRemaining(prevTime => {
          if (prevTime <= 1000) {
            clearInterval(interval);
            setSessionTimerActive(false);
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
    } else if (sessionTimeRemaining === 0) {
      addLog("Session timeout reached. Browser session will close automatically.");
      terminateSession();
    }

    return () => clearInterval(interval);
  }, [sessionTimerActive, sessionTimeRemaining]);

  // Platforms for job application
  const platforms = [
    { name: 'LinkedIn', icon: <Linkedin className="w-6 h-6" /> },
    { name: 'Indeed', icon: <Globe className="w-6 h-6" /> },
    { name: 'Glassdoor', icon: <Briefcase className="w-6 h-6" /> }
  ];

  // Work mode options
  const workModes = [
    { value: 'remote', label: 'Remote', icon: <CloudSun className="w-5 h-5" /> },
    { value: 'hybrid', label: 'Hybrid', icon: <MapPin className="w-5 h-5" /> },
    { value: 'onsite', label: 'On-site', icon: <Briefcase className="w-5 h-5" /> }
  ];

  // Handle platform selection
  const handlePlatformSelect = (platform: keyof typeof JOB_PLATFORMS | '') => {
    setSelectedPlatform(platform);
  };

  // Handle job preferences update
  const handlePreferenceChange = (key: string, value: string) => {
    setJobPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Proceed to apply
  const handleProceedToApply = () => {
    if (selectedPlatform && jobPreferences.salaryExpectation && jobPreferences.workMode) {
      setIsReadyToApply(true);
      startApplicationProcess();
    }
  };

  // Start application process
  const startApplicationProcess = async () => {
    setIsCreatingSession(true);
    setLogs([]);
    setIframeLoaded(false);
    setSessionTimeRemaining(SESSION_TIMEOUT);
    setSessionTimerActive(false);

    try {
      // Phase 1: Session Creation
      addLog('Starting browser session creation...');
      const sessionResponse = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeout: SESSION_TIMEOUT // Set session timeout to 5 minutes
        })
      });

      if (!sessionResponse.ok) {
        const error = await sessionResponse.json();
        throw new Error(error.message || 'Session creation failed');
      }

      const sessionData = await sessionResponse.json();
      addLog('Browser session created successfully ✅');

      // Immediately update session state
      setSession({
        id: sessionData.data.id,
        liveView: sessionData.data.live_view_url
      });

      setIsCreatingSession(false);
      setSessionTimerActive(true);

      // We'll start the task after iframe is loaded in the handleIframeLoad function
      addLog('Waiting for browser to fully load before starting job applications...');

    } catch (error) {
      if (error instanceof Error) {
        if (error instanceof Error) {
          if (error instanceof Error) {
            if (error instanceof Error) {
              if (error instanceof Error) {
                if (error instanceof Error) {
                  if (error instanceof Error) {
                    toast.error(error.message);
                  } else {
                    toast.error('An unknown error occurred');
                  }
                } else {
                  toast.error('An unknown error occurred');
                }
              } else {
                toast.error('An unknown error occurred');
              }
            } else {
              toast.error('An unknown error occurred');
            }
          } else {
            toast.error('An unknown error occurred');
          }
        } else {
          toast.error('An unknown error occurred');
        }
      } else {
        toast.error('An unknown error occurred');
      }
      if (error instanceof Error) {
        if (error instanceof Error) {
          if (error instanceof Error) {
            addLog(`Error: ${error.message} ❌`);
          } else {
            addLog('An unknown error occurred ❌');
          }
        } else {
          addLog('An unknown error occurred ❌');
        }
      } else {
        addLog('An unknown error occurred ❌');
      }
      setSession(null);
      setIsCreatingSession(false);
    }
  };

  // Function to run job application after iframe is loaded
  const runJobApplication = async () => {
    if (session && iframeLoaded && !isRunningTask) {
      setIsRunningTask(true);
      addLog('Browser fully loaded. Starting job application process...');

      try {
        // Create prompt from template with job preferences
        const platformConfig = JOB_PLATFORMS[selectedPlatform as keyof typeof JOB_PLATFORMS];
        const prompt = platformConfig.promptTemplate
          .replace('{salary}', jobPreferences.salaryExpectation)
          .replace('{workMode}', jobPreferences.workMode)
          .replace('{country}', jobPreferences.country || 'any')
          .replace('{industry}', jobPreferences.industry || 'any');

        const taskResponse = await fetch(`/api/tools/perform-web-task?sessionId=${session.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session.id,
            url: platformConfig.url,
            prompt: prompt
          })
        });

        if (!taskResponse.ok) {
          const error = await taskResponse.json();
          throw new Error(error.message || 'Application failed');
        }

        addLog(`Started applying to jobs on ${selectedPlatform} 🎉`);
        addLog('The automation will run until completed or stopped manually');
      } catch (error) {
        toast.error(error.message);
        addLog(`Error: ${error.message} ❌`);
      }
    }
  };

  // Handle iframe load
  const handleIframeLoad = () => {
    addLog('Browser session fully loaded ✅');
    setIframeLoaded(true);
    setIframeStatus('connected');

    // Start job application after iframe is loaded
    runJobApplication();
  };

  // Terminate session
  const terminateSession = async () => {
    if (!session) return;

    try {
      addLog('Terminating browser session...');
      const response = await fetch(`/api/sessions/${session.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to terminate session');
      }

      addLog('Browser session terminated successfully ✅');
      setSession(null);
      setIframeLoaded(false);
      setSessionTimerActive(false);
      setIsReadyToApply(false);
      setIsRunningTask(false);
    } catch (error) {
      toast.error(error.message);
      addLog(`Error terminating session: ${error.message} ❌`);
    }
  };

  // Add log message
  const addLog = (message: string) => {
    setLogs(prev => [...prev, {
      timestamp: new Date().toISOString(),
      message
    }]);
  };

  // Format time remaining
  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate session timer progress percentage
  const getTimerProgressPercentage = () => {
    return (sessionTimeRemaining / SESSION_TIMEOUT) * 100;
  };

  // If the user is not signed in, show a loading state or nothing
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Toaster position="top-right" />
        <div className="h-screen flex flex-col">
          {!isReadyToApply ? (
            <div className="container mx-auto px-4 py-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Platform Selection Column */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Application Platform</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {platforms.map((platform) => (
                        <Button
                          key={platform.name}
                          variant={selectedPlatform === platform.name ? 'default' : 'outline'}
                          className="flex flex-col items-center h-24"
                          onClick={() => handlePlatformSelect(platform.name)}
                        >
                          {platform.icon}
                          <span className="mt-2">{platform.name}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Job Preferences Column */}
                <Card>
                  <CardHeader>
                    <CardTitle>Job Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Salary Expectation */}
                      <div>
                        <Label className="flex items-center mb-2">
                          <DollarSign className="w-5 h-5 mr-2" /> Salary Expectation
                        </Label>
                        <Input
                          type="number"
                          placeholder="Enter annual salary expectation"
                          value={jobPreferences.salaryExpectation}
                          onChange={(e) => handlePreferenceChange('salaryExpectation', e.target.value)}
                        />
                      </div>

                      {/* Work Mode */}
                      <div>
                        <Label className="flex items-center mb-2">
                          <CloudSun className="w-5 h-5 mr-2" /> Work Mode
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          {workModes.map((mode) => (
                            <Button
                              key={mode.value}
                              variant={jobPreferences.workMode === mode.value ? 'default' : 'outline'}
                              className="flex flex-col items-center"
                              onClick={() => handlePreferenceChange('workMode', mode.value)}
                            >
                              {mode.icon}
                              <span className="mt-2">{mode.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Country */}
                      <div>
                        <Label className="flex items-center mb-2">
                          <MapPin className="w-5 h-5 mr-2" /> Country
                        </Label>
                        <Input
                          placeholder="Enter preferred country"
                          value={jobPreferences.country}
                          onChange={(e) => handlePreferenceChange('country', e.target.value)}
                        />
                      </div>

                      {/* Industry */}
                      <div>
                        <Label className="flex items-center mb-2">
                          <Briefcase className="w-5 h-5 mr-2" /> Industry
                        </Label>
                        <Input
                          placeholder="Enter preferred industry"
                          value={jobPreferences.industry}
                          onChange={(e) => handlePreferenceChange('industry', e.target.value)}
                        />
                      </div>

                      <Separator className="my-4" />

                      <Button
                        className="w-full"
                        onClick={handleProceedToApply}
                        disabled={!selectedPlatform || !jobPreferences.salaryExpectation || !jobPreferences.workMode || isCreatingSession}
                      >
                        {isCreatingSession ? 'Starting Browser...' : 'Start Applying'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <header className="flex h-14 shrink-0 items-center gap-2 border-b px-6">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage className="line-clamp-1">
                        Apply With AI Agent Dashboard
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Wrench className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="w-5 h-5" />
                  </Button>
                  <NavActions />
                </div>
              </header>

              {/* Integrated Button and Iframe Section */}
              <div className="relative flex-1 border rounded-xl overflow-hidden shadow-lg flex flex-col p-4 bg-white">
                {/* Button Group and Session Info */}
                <div className="flex justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Button
                      className="bg-red-500 hover:bg-red-600"
                      onClick={terminateSession}
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Stop Browser Session
                    </Button>

                    {session && (
                      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-md">
                        <span className="text-sm font-medium">Session:</span>
                        <span className="text-sm text-gray-600">{session.id}</span>
                      </div>
                    )}
                  </div>

                  {sessionTimerActive && (
                    <div className="flex flex-col w-48">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Session expires in:</span>
                        <span className="text-sm font-mono">{formatTimeRemaining(sessionTimeRemaining)}</span>
                      </div>
                      <Progress value={getTimerProgressPercentage()} className="h-2" />
                    </div>
                  )}
                </div>

                {/* Iframe with Status */}
                <div
                  className="flex-1 border rounded-xl overflow-hidden relative"
                  onMouseEnter={() => setIsHoveringIframe(true)}
                  onMouseLeave={() => setIsHoveringIframe(false)}
                >
                  {!session ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
                      <p>Starting browser session...</p>
                    </div>
                  ) : (
                    <>
                      {!iframeLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10">
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
                            <p>Loading browser session...</p>
                          </div>
                        </div>
                      )}

                      <iframe
                        src={session.liveView}
                        className="w-full h-full rounded-xl border border-gray-300"
                        frameBorder="0"
                        onLoad={handleIframeLoad}
                      ></iframe>

                      {/* Take Control Button (shown on hover) */}
                      {iframeLoaded && isHoveringIframe && (
                        <Button
                          className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 opacity-90"
                        >
                          <MousePointer className="w-5 h-5 mr-2" />
                          Take Control
                        </Button>
                      )}
                    </>
                  )}
                </div>

                {/* Process Logs */}
                <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold mb-2">System Logs</h3>
                  <div className="space-y-1 h-32 overflow-y-auto font-mono text-sm">
                    {logs.map((log, index) => (
                      <div key={index} className="p-1.5 bg-gray-50 rounded">
                        <span className="text-gray-500 mr-2">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        {log.message}
                      </div>
                    ))}
                    {logs.length === 0 && (
                      <div className="text-gray-500 text-center py-4">
                        No logs yet. Starting browser session...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}