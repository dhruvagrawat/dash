import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs";

const f = createUploadthing();

export const ourFileRouter = {
    resumeUploader: f({
        pdf: { maxFileSize: "4MB", maxFileCount: 1 },
        "application/msword": { maxFileSize: "4MB" },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
            maxFileSize: "4MB"
        }
    })
        .middleware(async ({ req }) => {
            const { userId } = auth();
            if (!userId) throw new UploadThingError("Unauthorized");
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;