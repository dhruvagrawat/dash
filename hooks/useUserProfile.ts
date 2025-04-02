// hooks/useUserProfile.ts
import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { UserProfile, JobPreferences } from '@/types/profile';
import { toast } from 'react-hot-toast';

export function useUserProfile() {
    const { user, isSignedIn, isLoaded } = useUser();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user profile
    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            fetchUserProfile();
        }
    }, [isLoaded, isSignedIn, user]);

    const fetchUserProfile = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/user-profile');

            if (response.ok) {
                const data = await response.json();
                setProfile(data.data);
            } else if (response.status === 404) {
                // Profile not found, we'll create one when user submits preferences
                setProfile(null);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load your profile');
        } finally {
            setIsLoading(false);
        }
    };

    // Save or update user profile
    const saveUserProfile = async (jobPreferences: JobPreferences, selectedPlatform: string) => {
        try {
            if (!user) return null;

            const profileData = {
                email: user.primaryEmailAddress?.emailAddress,
                jobPreferences,
                selectedPlatforms: [{ name: selectedPlatform, lastUsed: new Date().toISOString() }],
            };

            const method = profile ? 'PATCH' : 'POST';

            const response = await fetch('/api/user-profile', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(data.data);
                toast.success('Profile saved successfully');
                return data.data;
            } else {
                throw new Error('Failed to save profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to save your profile');
            return null;
        }
    };

    // Add job application to history
    const addJobApplication = async (platform: string, status: string = 'submitted') => {
        try {
            const response = await fetch('/api/job-applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform, status }),
            });

            if (response.ok) {
                toast.success('Application recorded');
                // Refresh profile to get updated application history
                await fetchUserProfile();
                return true;
            } else {
                throw new Error('Failed to record application');
            }
        } catch (error) {
            console.error('Error recording application:', error);
            toast.error('Failed to record application');
            return false;
        }
    };

    return {
        profile,
        isLoading,
        saveUserProfile,
        addJobApplication,
        refreshProfile: fetchUserProfile,
    };
}