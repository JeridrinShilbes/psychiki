"use client";
import { Globe3D, type GlobeMarker } from "@/components/ui/3d-globe";

const sampleMarkers: GlobeMarker[] = [
    {
        lat: 40.7128,
        lng: -74.006,
        src: "https://assets.aceternity.com/avatars/1.webp",
        label: "New York",
    },
    {
        lat: 51.5074,
        lng: -0.1278,
        src: "https://assets.aceternity.com/avatars/2.webp",
        label: "London",
    },
    {
        lat: 35.6762,
        lng: 139.6503,
        src: "https://assets.aceternity.com/avatars/3.webp",
        label: "Tokyo",
    },
    {
        lat: -33.8688,
        lng: 151.2093,
        src: "https://assets.aceternity.com/avatars/4.webp",
        label: "Sydney",
    },
    {
        lat: 48.8566,
        lng: 2.3522,
        src: "https://assets.aceternity.com/avatars/5.webp",
        label: "Paris",
    },
    {
        lat: 28.6139,
        lng: 77.209,
        src: "https://assets.aceternity.com/avatars/6.webp",
        label: "New Delhi",
    },
    {
        lat: 55.7558,
        lng: 37.6173,
        src: "https://assets.aceternity.com/avatars/7.webp",
        label: "Moscow",
    },
    {
        lat: -22.9068,
        lng: -43.1729,
        src: "https://assets.aceternity.com/avatars/8.webp",
        label: "Rio de Janeiro",
    },
    {
        lat: 31.2304,
        lng: 121.4737,
        src: "https://assets.aceternity.com/avatars/9.webp",
        label: "Shanghai",
    },
    {
        lat: 25.2048,
        lng: 55.2708,
        src: "https://assets.aceternity.com/avatars/10.webp",
        label: "Dubai",
    },
    {
        lat: -34.6037,
        lng: -58.3816,
        src: "https://assets.aceternity.com/avatars/11.webp",
        label: "Buenos Aires",
    },
    {
        lat: 1.3521,
        lng: 103.8198,
        src: "https://assets.aceternity.com/avatars/12.webp",
        label: "Singapore",
    },
    {
        lat: 37.5665,
        lng: 126.978,
        src: "https://assets.aceternity.com/avatars/13.webp",
        label: "Seoul",
    },
];

interface OnboardingProps {
    onComplete?: (focus: string) => void;
    onGetStarted?: () => void;
}

export function Onboarding({ onComplete, onGetStarted }: OnboardingProps) {
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col relative font-sans dark:bg-neutral-950">
            <header className="absolute top-0 w-full p-6 md:px-12 md:py-8 flex justify-between items-center z-50">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-3">
                        {/* This is the raw SVG code for a thin, minimalistic temple */}
                        <svg
                            viewBox="0 0 100 100"
                            className="h-12 w-auto text-neutral-900 dark:text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        >
                            <path d="M20 40 L50 20 L80 40" /> {/* Roof */}
                            <path d="M20 45 H80" />          {/* Top Base */}
                            <path d="M30 45 V75" />          {/* Left Column */}
                            <path d="M50 45 V75" />          {/* Middle Column */}
                            <path d="M70 45 V75" />          {/* Right Column */}
                            <path d="M20 80 H80" />          {/* Bottom Base */}
                        </svg>
                        <span className="font-extrabold text-3xl tracking-tight text-neutral-900 dark:text-white">Psychiki</span>
                    </div>
                </div>

            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col pt-32 pb-12 px-6 md:px-12 w-full">
                <div className="relative mx-auto w-full max-w-[1400px] flex-1 min-h-[700px] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-black/5 ring-1 ring-black/5 dark:bg-neutral-900 flex items-center">
                    <div className="relative z-20 p-8 md:p-16 lg:p-20 w-full lg:w-[55%] max-w-2xl pointer-events-none">
                        <div className="pointer-events-auto">
                            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                                Join the global community
                            </div>
                            <h2 className="mb-6 text-5xl font-extrabold tracking-tight text-balance text-neutral-900 md:text-7xl lg:text-8xl dark:text-white leading-[1.1]">
                                Play all over the world with a click.
                            </h2>
                            <p className="mt-4 max-w-xl text-balance text-neutral-600 md:mt-8 md:text-xl dark:text-neutral-400 leading-relaxed font-medium">
                                Sign up for an account and start posting all over the world with one
                                click. Discover micro-clubs and connect with amazing people wherever you go.
                            </p>

                            <div className="mt-10 flex flex-wrap gap-4 md:mt-12">
                                <button
                                    onClick={() => onGetStarted ? onGetStarted() : (onComplete && onComplete('Global'))}
                                    className="flex cursor-pointer items-center justify-center rounded-2xl bg-neutral-900 px-8 py-4 font-semibold text-white shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)_inset] ring ring-white/20 ring-offset-2 ring-offset-neutral-900 transition-all duration-200 ring-inset hover:shadow-[0px_0px_20px_0px_rgba(255,255,255,0.4)_inset] hover:ring-white/40 active:scale-95 text-lg">
                                    Get Started
                                </button>
                                <button
                                    onClick={() => onComplete && onComplete('Learn More')}
                                    className="flex cursor-pointer items-center justify-center rounded-2xl bg-white px-8 py-4 font-semibold text-neutral-900 ring ring-neutral-200 transition-all duration-200 ring-inset hover:bg-neutral-50 hover:ring-neutral-300 active:scale-95 shadow-sm text-lg">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Globe container - spans across the right side */}
                    <div className="absolute -right-20 md:-right-10 lg:-right-32 xl:-right-40 top-1/2 -translate-y-1/2 z-10 w-[700px] h-[700px] md:w-[900px] md:h-[900px] lg:w-[1000px] lg:h-[1000px] xl:w-[1100px] xl:h-[1100px] pointer-events-auto">
                        <Globe3D
                            className="h-full w-full opacity-90 transition-opacity hover:opacity-100 duration-500"
                            markers={sampleMarkers}
                            config={{
                                atmosphereColor: "#4da6ff",
                                atmosphereIntensity: 20,
                                bumpScale: 5,
                                autoRotateSpeed: 0.3,
                                markerSize: 0.08,
                            }}
                            onMarkerClick={(marker) => {
                                console.log("Clicked marker:", marker.label);
                            }}
                            onMarkerHover={(marker) => {
                                if (marker) {
                                    console.log("Hovering:", marker.label);
                                }
                            }}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
