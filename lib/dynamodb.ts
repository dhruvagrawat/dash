// src/lib/dynamo-db.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

// Initialize the DynamoDB client
const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

const docClient = DynamoDBDocumentClient.from(client);

// Table name for sessions
const SESSIONS_TABLE = process.env.DYNAMODB_SESSIONS_TABLE || "user_job_sessions";

export interface JobSession {
    userId: string;         // Clerk user ID
    sessionId: string;      // Session ID from the session maker
    platform: string;       // Selected platform (LinkedIn, Indeed, etc.)
    createdAt: number;      // Timestamp
    preferences: {
        salaryExpectation: string;
        workMode: string;
        country: string;
        industry: string;
    };
    status: 'active' | 'completed' | 'terminated';
    liveViewUrl?: string;   // URL to access the session
}

// Save a new session to DynamoDB
export async function saveJobSession(sessionData: JobSession): Promise<JobSession> {
    const command = new PutCommand({
        TableName: SESSIONS_TABLE,
        Item: {
            ...sessionData,
            // Using composite key: userId + timestamp for sorting
            PK: sessionData.userId,
            SK: `SESSION#${sessionData.sessionId}`,
        },
    });

    await docClient.send(command);
    return sessionData;
}

// Get all sessions for a user
export async function getUserSessions(userId: string): Promise<JobSession[]> {
    const command = new QueryCommand({
        TableName: SESSIONS_TABLE,
        KeyConditionExpression: "PK = :userId",
        ExpressionAttributeValues: {
            ":userId": userId,
        },
    });

    const response = await docClient.send(command);
    return (response.Items as JobSession[]) || [];
}

// Update session status
export async function updateSessionStatus(
    userId: string,
    sessionId: string,
    status: 'active' | 'completed' | 'terminated'
): Promise<void> {
    const command = new PutCommand({
        TableName: SESSIONS_TABLE,
        Item: {
            PK: userId,
            SK: `SESSION#${sessionId}`,
            status,
            updatedAt: Date.now(),
        },
        ConditionExpression: "attribute_exists(PK) AND attribute_exists(SK)",
    });

    await docClient.send(command);
}

// Delete a session record (optional)
export async function deleteSessionRecord(userId: string, sessionId: string): Promise<void> {
    const command = new DeleteCommand({
        TableName: SESSIONS_TABLE,
        Key: {
            PK: userId,
            SK: `SESSION#${sessionId}`,
        },
    });

    await docClient.send(command);
}