// app/api/test-s3/route.ts
import { NextResponse } from "next/server";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

export async function GET() {
    const s3 = new S3Client({ region: process.env.AWS_REGION });
    try {
        const data = await s3.send(new ListBucketsCommand({}));
        return NextResponse.json({ buckets: data.Buckets });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
    }
}