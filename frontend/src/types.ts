export interface UserProfile {
    name: string;
    email: string;
    primaryFocus: string | null;
    interests: string[];
    joinedEvents: string[];
}

export interface Club {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    tags: string[];
    members: number;
    schedule: string;
    matchScore: number;
    author: string;
    lat?: number;
    lng?: number;
    distance?: number;
}

export interface Notice {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
}
