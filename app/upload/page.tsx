'use client';
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function UploadPage() {
    const { isSignedIn } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState('');

    const handleUpload = async () => {
        if (!file) return;

        try {
            setStatus('Starting upload...');

            // Step 1: Get pre-signed URL
            const res = await fetch('/api/s3-upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName: file.name,
                    fileType: file.type,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to get upload URL');
            }

            const { url, key } = await res.json();

            // Step 2: Upload to S3
            setStatus('Uploading to AWS S3...');
            const uploadRes = await fetch(url, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                    'x-amz-acl': 'bucket-owner-full-control',
                },
            });

            if (!uploadRes.ok) {
                throw new Error(`S3 Upload failed: ${uploadRes.status}`);
            }

            setStatus(`Success! File saved to: s3://${process.env.S3_BUCKET}/${key}`);

        } catch (error) {
            console.error('Upload error:', error);
            setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            {/* ... (keep your existing UI structure) ... */}
        </div>
    );
}