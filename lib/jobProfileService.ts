import {
    DynamoDBClient,
    PutItemCommand,
    QueryCommand,
    DeleteItemCommand
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { auth, currentUser } from "@clerk/nextjs/server";

// AWS Configuration
const dynamoDBClient = new DynamoDBClient({
    region: process.env.AWS_REGION || '',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});

// Job Profile Service
export class JobProfileService {
    private static TABLE_NAME = 'JobProfiles';

    // Save Job Profile
    static async saveJobProfile(profile: any) {
        const { userId } = await auth();
        if (!userId) throw new Error('User not authenticated');

        const profileId = profile.id || Date.now().toString();
        const params = {
            TableName: this.TABLE_NAME,
            Item: marshall({
                userId: userId,
                profileId: profileId,
                ...profile,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        };

        await dynamoDBClient.send(new PutItemCommand(params));
        return { ...profile, profileId };
    }

    // Fetch Job Profiles
    static async getUserJobProfiles() {
        const user = await currentUser();
        if (!user) throw new Error('User not authenticated');

        const params = {
            TableName: this.TABLE_NAME,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: marshall({
                ':userId': user.id
            })
        };

        const { Items } = await dynamoDBClient.send(new QueryCommand(params));
        return Items ? Items.map(item => unmarshall(item)) : [];
    }

    // Delete Job Profile
    static async deleteJobProfile(profileId: string) {
        const user = await currentUser();
        if (!user) throw new Error('User not authenticated');

        const params = {
            TableName: this.TABLE_NAME,
            Key: marshall({
                userId: user.id,
                profileId: profileId
            })
        };

        await dynamoDBClient.send(new DeleteItemCommand(params));
        return true;
    }
}
