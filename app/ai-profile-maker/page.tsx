'use client';
import { AppSidebar } from "@/components/app-sidebar";
import { NavActions } from "@/components/nav-actions";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";

export default function UploadPage() {
    const { isSignedIn } = useAuth();
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2 border-b">
                    {/* ... existing header content ... */}
                </header>

                <div className="flex flex-1 flex-col gap-6 px-6 py-8 w-[80%] mx-auto">
                    <h1 className="text-2xl font-bold">Upload Your Resume</h1>

                    {!isSignedIn && (
                        <Alert>
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Authentication Required</AlertTitle>
                            <AlertDescription>
                                Please sign in to upload your resume.
                            </AlertDescription>
                        </Alert>
                    )}

                    {isSignedIn && (
                        <div className="border p-6 rounded-lg shadow-md space-y-4">
                            <h2 className="text-lg font-semibold">Upload Document</h2>
                            <p className="text-sm text-gray-500">
                                Supported formats: PDF, DOC, DOCX (Max size: 4MB)
                            </p>

                            <UploadButton
                                endpoint="resumeUploader"
                                onClientUploadComplete={() => {
                                    setUploadSuccess("File uploaded successfully!");
                                    setUploadError(null);
                                }}
                                onUploadError={(error: Error) => {
                                    setUploadError(error.message);
                                    setUploadSuccess(null);
                                }}
                                appearance={{
                                    button: "ut-ready:bg-primary ut-uploading:cursor-not-allowed",
                                    container: "w-full",
                                    allowedContent: "text-muted-foreground text-sm",
                                }}
                                content={{
                                    button({ ready }) {
                                        if (ready) return "Select File";
                                        return "Preparing...";
                                    },
                                    allowedContent({ ready }) {
                                        if (!ready) return "Checking...";
                                        return "PDF, DOC, DOCX (Max 4MB)";
                                    },
                                }}
                            />

                            {/* ... success/error alerts ... */}
                        </div>
                    )}

                    {/* ... upload guidelines ... */}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}