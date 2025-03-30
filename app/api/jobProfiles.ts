import { JobProfileService } from '@/lib/jobProfileService';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'POST': {
                const profile = await JobProfileService.saveJobProfile(req.body);
                return res.status(200).json(profile);
            }
            case 'GET': {
                const profiles = await JobProfileService.getUserJobProfiles();
                return res.status(200).json(profiles);
            }
            case 'DELETE': {
                const { profileId } = req.body;
                await JobProfileService.deleteJobProfile(profileId);
                return res.status(200).json({ success: true });
            }
            default:
                res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
                return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
