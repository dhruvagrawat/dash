// src/app/api/save-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { saveJobSession } from "@/lib/dynamo-db";

export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req);

        // Check authentication
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse request body
        const sessionData = await req.json();

        // Validate session ID is present
        if (!sessionData.sessionId) {
            return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
        }

        // Save to DynamoDB
        await saveJobSession({
            userId,
            sessionId: sessionData.sessionId,
            platform: sessionData.platform,
            preferences: sessionData.preferences,
            createdAt: Date.now(),
            status: 'active',
            liveViewUrl: sessionData.liveViewUrl,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving session:", error);
        return NextResponse.json(
            { error: "Failed to save session data" },
            { status: 500 }
        );
    }
}

// src/app/api/update-session-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { updateSessionStatus } from "@/lib/dynamo-db";

export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req);

        // Check authentication
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse request body
        const { sessionId, status } = await req.json();

        // Validate required fields
        if (!sessionId || !status) {
            return NextResponse.json({ error: "Session ID and status are required" }, { status: 400 });
        }

        // Validate status value
        if (!['active', 'completed', 'terminated'].includes(status)) {
            return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
        }

        // Update session status in DynamoDB
        await updateSessionStatus(userId, sessionId, status);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating session status:", error);
        return NextResponse.json(
            { error: "Failed to update session status" },
            { status: 500 }
        );
    }
}

// src/app/api/get-user-sessions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { getUserSessions } from "@/lib/dynamo-db";

export async function GET(req: NextRequest) {
    try {
        const { userId } = getAuth(req);

        // Check authentication
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user sessions from DynamoDB
        const sessions = await getUserSessions(userId);

        return NextResponse.json({ sessions });
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json(
            { error: "Failed to fetch user sessions" },
            { status: 500 }
        );
    }
}