// app/api/user-profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "@/lib/dynamodb";
import { getAuth } from "@clerk/nextjs/server";
import { UserProfile } from "@/types/profile";

export async function GET(request: NextRequest) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const params = {
            TableName: "UserProfiles",
            Key: { userId },
        };

        const { Item } = await dynamoDb.send(new GetCommand(params));

        if (!Item) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json({ data: Item });
    } catch (error) {
        console.error("Failed to get profile:", error);
        return NextResponse.json({ error: "Failed to get profile" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = getAuth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Create/update user profile
        const timestamp = new Date().toISOString();
        const userProfile: UserProfile = {
            userId,
            email: body.email,
            jobPreferences: body.jobPreferences,
            selectedPlatforms: body.selectedPlatforms,
            applicationHistory: body.applicationHistory || [],
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        const params = {
            TableName: "UserProfiles",
            Item: userProfile,
        };

        await dynamoDb.send(new PutCommand(params));

        return NextResponse.json({ data: userProfile });
    } catch (error) {
        console.error("Failed to create profile:", error);
        return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { userId } = getAuth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Only update the fields that were provided
        let updateExpression = "set updatedAt = :updatedAt";
        const expressionAttributeValues: Record<string, any> = {
            ":updatedAt": new Date().toISOString(),
        };

        // Build dynamic update expression based on provided fields
        Object.entries(body).forEach(([key, value]) => {
            if (key !== "userId") {
                updateExpression += `, ${key} = :${key}`;
                expressionAttributeValues[`:${key}`] = value;
            }
        });

        const params = {
            TableName: "UserProfiles",
            Key: { userId },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW",
        };

        const { Attributes } = await dynamoDb.send(new UpdateCommand(params));

        return NextResponse.json({ data: Attributes });
    } catch (error) {
        console.error("Failed to update profile:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}