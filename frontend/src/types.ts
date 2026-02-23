export interface UserProfile {
    name: string;
    email: string;
    primaryFocus: string | null;
    interests: string[];
}

export interface Club {
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
    tags: string[];
    members: number;
    schedule: string;
    matchScore: number;
}
