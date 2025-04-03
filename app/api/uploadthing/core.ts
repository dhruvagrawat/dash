import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const f = createUploadthing();

export const ourFileRouter = {
    resumeUploader: f({
        pdf: { maxFileSize: "4MB", maxFileCount: 1 },
        "application/msword": { maxFileSize: "4MB" },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
            maxFileSize: "4MB"
        }
    })
        .middleware(async () => {
            const { userId } = await auth();
            if (!userId) throw new UploadThingError("Unauthorized");
            return { userId };
        })
        .onUploadComplete(async ({ file }) => {
            try {
                console.log("Starting S3 upload process...");
                console.log("Fetching file from URL:", file.url);

                const response = await fetch(file.url);
                console.log("File fetch status:", response.status);

                if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);

                const fileBuffer = await response.arrayBuffer();
                console.log("File size:", fileBuffer.byteLength, "bytes");

                const s3Key = `resumes/${Date.now()}_${file.name}`;
                console.log("S3 upload parameters:", {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: s3Key,
                    Region: process.env.AWS_REGION,
                    ContentType: file.type
                });

                const command = new PutObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME!,
                    Key: s3Key,
                    Body: Buffer.from(fileBuffer),
                    ContentType: file.type,
                });

                const s3Response = await s3.send(command);
                console.log("S3 upload successful. Response:", s3Response);

                return {
                    uploadthingUrl: file.url,
                    s3Url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`
                };
            } catch (error) {
                console.error("Full S3 upload error:", error);
                throw new UploadThingError("Failed to upload to S3");
            }
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;