// app/api/job-applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "@/lib/dynamodb";
import { auth } from "@clerk/nextjs";

export async function GET(request: NextRequest) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const params = {
            TableName: "UserProfiles",
            Key: { userId },
            ProjectionExpression: "applicationHistory",
        };

        const { Item } = await dynamoDb.send(new GetCommand(params));

        if (!Item) {
            return NextResponse.json({ data: [] });
        }

        return NextResponse.json({ data: Item.applicationHistory || [] });
    } catch (error) {
        console.error("Failed to get application history:", error);
        return NextResponse.json({ error: "Failed to get application history" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Add new application entry to history
        const newApplication = {
            date: new Date().toISOString(),
            platform: body.platform,
            status: body.status || 'submitted',
        };

        const params = {
            TableName: "UserProfiles",
            Key: { userId },
            UpdateExpression: "SET applicationHistory = list_append(if_not_exists(applicationHistory, :empty_list), :newApp), updatedAt = :updatedAt",
            ExpressionAttributeValues: {
                ":newApp": [newApplication],
                ":empty_list": [],
                ":updatedAt": new Date().toISOString(),
            },
            ReturnValues: "UPDATED_NEW",
        };

        const { Attributes } = await dynamoDb.send(new UpdateCommand(params));

        return NextResponse.json({ data: newApplication });
    } catch (error) {
        console.error("Failed to update application history:", error);
        return NextResponse.json({ error: "Failed to update application history" }, { status: 500 });
    }
}