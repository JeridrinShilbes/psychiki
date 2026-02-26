import { Plus } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

interface BentoHeroProps {
    userName: string;
    onHostClick: () => void;
    variants?: Variants;
}

export function BentoHero({ userName, onHostClick, variants }: BentoHeroProps) {
    return (
        <motion.div variants={variants} initial="hidden" animate="visible" exit="hidden" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2 bg-gradient-to-br from-white to-gray-50 border border-gray-200/60 rounded-[32px] p-8 sm:p-10 flex flex-col justify-center relative overflow-hidden shadow-[0_2px_20px_rgb(0,0,0,0.02)]">
                <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-gray-200/40 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-gray-900 mb-3 relative z-10">Welcome back, {userName}.</h1>
                <p className="text-gray-500 text-lg font-medium tracking-tight relative z-10">Discover your next activity.</p>
            </div>

            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onHostClick}
                className="bg-black text-white rounded-[32px] p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all border border-gray-800"
            >
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform">
                        <Plus size={24} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight mb-1">Host Event</h3>
                    <p className="text-gray-400 text-sm font-medium">Create a new gathering</p>
                </div>
                {/* Glow effect */}
                <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-white/10 blur-[50px] rounded-full group-hover:bg-white/20 transition-colors pointer-events-none"></div>
            </motion.div>
        </motion.div>
    );
}
