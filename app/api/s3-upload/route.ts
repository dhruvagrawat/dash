import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { auth } from '@clerk/nextjs/server';

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse('Unauthorized', { status: 401 });

        // Verify environment variables
        if (!process.env.S3_BUCKET || !process.env.AWS_REGION) {
            console.error('Missing configuration:', {
                bucket: process.env.S3_BUCKET,
                region: process.env.AWS_REGION
            });
            throw new Error('Server configuration error');
        }

        const { fileName, fileType } = await req.json();
        const key = `dhurv/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.]/g, '-')}`;

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: key,
            ContentType: fileType,k
            ACL: 'bucket-owner-full-control',  // Critical for permission
        });

        const url = await getSignedUrl(s3, command, { expiresIn: 300 });

        console.log('Generated pre-signed URL for:', key);
        return NextResponse.json({ url, key });

    } catch (error) {
        console.error('API Error:', error);
        return new NextResponse(JSON.stringify({ error: (error as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}