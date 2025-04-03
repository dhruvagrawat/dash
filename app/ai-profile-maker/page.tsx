// app/upload/page.tsx
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, File, UploadCloud } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UploadPage() {
    const { isSignedIn } = useAuth();
    const [uploadStatus, setUploadStatus] = useState<{
        error?: string;
        success?: string;
        url?: string;
    }>({});

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-white dark:bg-gray-900">
                    <div className="flex flex-1 items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4 bg-gray-200 dark:bg-gray-700"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="line-clamp-1 text-gray-800 dark:text-gray-200">
                                        Resume Upload
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="ml-auto px-3">
                        <NavActions />
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-6 px-6 py-8 w-[80%] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        <File className="inline-block mr-2 h-6 w-6" />
                        Upload Your Resume
                    </h1>

                    {!isSignedIn && (
                        <Alert className="border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                            <Terminal className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                            <AlertTitle className="text-blue-800 dark:text-blue-200">
                                Authentication Required
                            </AlertTitle>
                            <AlertDescription className="text-blue-700 dark:text-blue-300">
                                Please sign in to upload your resume.
                            </AlertDescription>
                        </Alert>
                    )}

                    {isSignedIn && (
                        <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                <UploadCloud className="inline-block mr-2 h-5 w-5" />
                                Upload Document
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Supported formats: PDF, DOC, DOCX (Max size: 4MB)
                            </p>

                            <UploadButton
                                endpoint="resumeUploader"
                                onClientUploadComplete={(res) => {
                                    if (res?.[0]?.url) {
                                        setUploadStatus({
                                            success: "File uploaded successfully!",
                                            url: res[0].url
                                        });
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    setUploadStatus({
                                        error: error.message.includes("Failed to upload to S3")
                                            ? "Failed to store in S3 (check server logs)"
                                            : error.message
                                    });
                                }}
                                appearance={{
                                    button: "ut-ready:bg-blue-600 bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800",
                                    container: "w-full",
                                    allowedContent: "text-gray-500 dark:text-gray-400 text-sm",
                                }}
                                content={{
                                    button({ ready }) {
                                        if (ready) return "Select File";
                                        return "Preparing...";
                                    },
                                    allowedContent({ ready }) {
                                        if (!ready) return "Checking file...";
                                        return "PDF, DOC, DOCX (Max 4MB)";
                                    },
                                }}
                            />

                            {uploadStatus.error && (
                                <Alert variant="destructive" className="mt-4">
                                    <Terminal className="h-4 w-4" />
                                    <AlertTitle>Upload Error</AlertTitle>
                                    <AlertDescription className="text-red-700 dark:text-red-300">
                                        {uploadStatus.error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {uploadStatus.success && (
                                <Alert className="mt-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                    <AlertTitle className="text-green-800 dark:text-green-200">
                                        Upload Successful!
                                    </AlertTitle>
                                    <AlertDescription className="text-green-700 dark:text-green-300">
                                        {uploadStatus.success}
                                    </AlertDescription>
                                    {uploadStatus.url && (
                                        <AlertDescription>
                                            <Link
                                                href={uploadStatus.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 dark:text-blue-300 hover:underline break-all"
                                            >
                                                S3 URL: {uploadStatus.url}
                                            </Link>
                                        </AlertDescription>
                                    )}
                                </Alert>
                            )}

                            {uploadStatus.url && (
                                <Alert className="mt-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                                    <Terminal className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                                    <AlertTitle className="text-blue-800 dark:text-blue-200">
                                        File URL
                                    </AlertTitle>
                                    <AlertDescription>
                                        <Link
                                            href={uploadStatus.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 dark:text-blue-300 hover:underline break-all"
                                        >
                                            {uploadStatus.url}
                                        </Link>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}

                    <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md bg-white dark:bg-gray-800">
                        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                            📝 Upload Guidelines
                        </h2>
                        <ul className="list-disc list-inside text-sm space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Ensure your document is up-to-date and relevant</li>
                            <li>Maximum file size: 4MB</li>
                            <li>Supported formats: PDF, DOC, DOCX</li>
                            <li>Files will be stored securely with UploadThing</li>
                            <li>Remove sensitive information before uploading</li>
                        </ul>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}