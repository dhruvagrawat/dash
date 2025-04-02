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
import { Button } from "@/components/ui/button";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function UploadPage() {
    const { userId } = useAuth();
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2 border-b">
                    <div className="flex flex-1 items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="line-clamp-1">Resume Upload</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="ml-auto px-3">
                        <NavActions />
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-6 px-6 py-8 w-[80%] mx-auto">
                    <h1 className="text-2xl font-bold">Upload Your Resume</h1>

                    {!userId && (
                        <Alert>
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Authentication Required</AlertTitle>
                            <AlertDescription>
                                Please sign in to upload your resume.
                            </AlertDescription>
                        </Alert>
                    )}

                    {userId && (
                        <div className="border p-6 rounded-lg shadow-md space-y-4">
                            <h2 className="text-lg font-semibold">Upload Document</h2>
                            <p className="text-sm text-gray-500">
                                Supported formats: PDF, DOC, DOCX (Max size: 4MB)
                            </p>

                            <UploadButton<OurFileRouter>
                                endpoint="resumeUploader"
                                onClientUploadComplete={(res) => {
                                    setUploadSuccess("File uploaded successfully!");
                                    setUploadError(null);
                                }}
                                onUploadError={(error: Error) => {
                                    setUploadError(error.message);
                                    setUploadSuccess(null);
                                }}
                                appearance={{
                                    button:
                                        "ut-ready:bg-green-500 ut-uploading:cursor-not-allowed bg-red-500 bg-none after:bg-orange-400",
                                    container: "w-full",
                                    allowedContent: "text-gray-500 text-sm",
                                }}
                                content={{
                                    button({ ready }) {
                                        if (ready) return "Select File";
                                        return "Preparing...";
                                    },
                                    allowedContent({ ready, fileTypes, isUploading }) {
                                        if (!ready) return "Checking...";
                                        if (isUploading) return "Uploading...";
                                        return `PDF, DOC, DOCX (Max 4MB)`;
                                    },
                                }}
                            />

                            {uploadError && (
                                <Alert variant="destructive">
                                    <Terminal className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{uploadError}</AlertDescription>
                                </Alert>
                            )}

                            {uploadSuccess && (
                                <Alert>
                                    <Terminal className="h-4 w-4" />
                                    <AlertTitle>Success</AlertTitle>
                                    <AlertDescription>{uploadSuccess}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}

                    <div className="border p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-2">Upload Guidelines</h2>
                        <ul className="list-disc list-inside text-sm space-y-2">
                            <li>Ensure your document contains up-to-date information</li>
                            <li>Remove sensitive personal information before uploading</li>
                            <li>Files will be automatically deleted after 90 days</li>
                        </ul>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}