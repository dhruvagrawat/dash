import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server"; // Changed to server-side auth

const f = createUploadthing();

export const ourFileRouter = {
    resumeUploader: f({
        pdf: { maxFileSize: "4MB", maxFileCount: 1 },
        "application/msword": { maxFileSize: "4MB" }, // DOC files
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { // DOCX
            maxFileSize: "4MB"
        }
    })
        .middleware(async () => {
            const { userId } = await auth();
            if (!userId) throw new UploadThingError("Unauthorized");
            return { userId };
        })
        .onUploadComplete(async ({ file }) => {
            // Return the file URL to the client
            return { url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;