import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { useAuth } from "@clerk/nextjs";

const f = createUploadthing();

const middleware = async () => {
    const { userId } = useAuth();
    console.log("Middleware userId:", userId);

    if (!userId) {
        throw new UploadThingError("Unauthorized");
    }
    return { userId };
};

const onUploadComplete = async ({
    metadata,
    file
}: {
    metadata: Awaited<ReturnType<typeof middleware>>
    file: any
}) => {
    console.log("Upload completed for:", metadata.userId);
    console.log("File data:", file);
    return { success: true };
};

export const ourFileRouter = {
    resumeUploader: f({
        pdf: { maxFileSize: "4MB", maxFileCount: 1 },
        // doc: { maxFileSize: "4MB" }, // Removed as it is not a valid key
        // docx: { maxFileSize: "4MB" }
    })
        .middleware(middleware)
        .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;