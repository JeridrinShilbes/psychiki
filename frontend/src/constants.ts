import type { Club } from './types';

// Gemini API Key will be injected by the environment
export const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const ALL_TAGS: string[] = [
    '#GymAnxiety', '#Endurance', '#NeedToVent', '#MeditationNewbie',
    '#PostWorkDecompression', '#MorningPerson', '#NightOwl', '#HIIT', '#Yoga',
    '#RunnerLife', '#Weightlifting', '#MentalHealth', '#Socializing', '#QuietTime',
    '#NatureLover', '#CoffeeAfter', '#Stretching', '#Breathwork', '#GroupEnergy',
    '#SoloButTogether', '#StressRelief', '#BodyPositive', '#BeginnerFriendly',
    '#PushLimits'
];

export const INITIAL_CLUBS: Club[] = [
    {
        id: 1,
        title: 'Zen Lifters',
        description: 'Weightlifting followed by a 15-minute guided mindfulness cooldown. Build strength for your body, peace for your mind.',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
        category: 'Burn Energy',
        tags: ['#Weightlifting', '#MeditationNewbie', '#StressRelief'],
        members: 23,
        schedule: 'Tuesdays & Thursdays, 6:30 PM',
        matchScore: 95
    },
    {
        id: 2,
        title: 'Anxiety Burn',
        description: 'High-intensity interval training designed to burn off nervous energy, followed by a 20-minute cool-down chat.',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfe09ce14?auto=format&fit=crop&q=80&w=600',
        category: 'Burn Energy',
        tags: ['#HIIT', '#GymAnxiety', '#StressRelief'],
        members: 18,
        schedule: 'Mondays & Wednesdays, 7:00 PM',
        matchScore: 90
    },
    {
        id: 3,
        title: 'Coffee & Miles',
        description: 'A running group that always ends at a local coffee shop. The run is the warm-up; the real magic is the conversation after.',
        image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=600',
        category: 'Burn Energy',
        tags: ['#RunnerLife', '#CoffeeAfter', '#Socializing'],
        members: 35,
        schedule: 'Wednesdays & Saturdays, 7:00 AM',
        matchScore: 88
    },
    {
        id: 4,
        title: 'Pace & Ponder',
        description: 'Brisk walking while discussing audiobooks or podcasts. A great way to get moving without the pressure of a run.',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600',
        category: 'Find People',
        tags: ['#Endurance', '#QuietTime', '#Socializing'],
        members: 12,
        schedule: 'Sundays, 8:00 AM',
        matchScore: 75
    },
    {
        id: 5,
        title: 'Sunrise Stretch Circle',
        description: 'Gentle morning yoga and stretching to wake up the body. Perfect for decompression before a long workday.',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
        category: 'Clear Head',
        tags: ['#Yoga', '#MorningPerson', '#Stretching'],
        members: 28,
        schedule: 'Weekdays, 6:30 AM',
        matchScore: 82
    },
    {
        id: 6,
        title: 'Trail Talk',
        description: 'Weekend nature hikes focused on opening up. Leave the city behind and talk about what\'s really on your mind.',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=600',
        category: 'Find People',
        tags: ['#NatureLover', '#NeedToVent', '#GroupEnergy'],
        members: 15,
        schedule: 'Saturdays, 9:00 AM',
        matchScore: 85
    }
];
