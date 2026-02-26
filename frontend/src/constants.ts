

// Gemini API Key will be injected by the environment
export const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
// src/constants.ts
const BASE_URL = import.meta.env.VITE_RENDER_SERVER_URL || 'http://localhost:3000';

export const EVENTS_API = `${BASE_URL}/api/events`;
export const USERS_API = `${BASE_URL}/api/users`;
export const HEALTH_API = `${BASE_URL}/api/status`;
export const NOTICES_API = `${BASE_URL}/api/notices`;
export const AUTH_API = `${BASE_URL}/api/auth`;

export const ALL_TAGS: string[] = [
    '#GymAnxiety', '#Endurance', '#NeedToVent', '#MeditationNewbie',
    '#PostWorkDecompression', '#MorningPerson', '#NightOwl', '#HIIT', '#Yoga',
    '#RunnerLife', '#Weightlifting', '#MentalHealth', '#Socializing', '#QuietTime',
    '#NatureLover', '#CoffeeAfter', '#Stretching', '#Breathwork', '#GroupEnergy',
    '#SoloButTogether', '#StressRelief', '#BodyPositive', '#BeginnerFriendly',
    '#PushLimits'
];
