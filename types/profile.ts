// types/profile.ts
export interface JobPreferences {
    salaryExpectation: string;
    workMode: string;
    country: string;
    industry: string;
}

export interface JobPlatform {
    name: string;
    lastUsed?: string;
}

export interface UserProfile {
    userId: string;  // Clerk user ID
    email: string;
    jobPreferences: JobPreferences;
    selectedPlatforms: JobPlatform[];
    applicationHistory?: {
        date: string;
        platform: string;
        status: string;
    }[];
    createdAt: string;
    updatedAt: string;
}