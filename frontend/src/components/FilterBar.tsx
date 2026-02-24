import { Search, Map as MapIcon, Grid as GridIcon } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

interface FilterBarProps {
    filters: string[];
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
    viewMode: 'grid' | 'map';
    setViewMode: (mode: 'grid' | 'map') => void;
    maxDistance: number;
    setMaxDistance: (dist: number) => void;
    variants?: Variants;
}

export function FilterBar({ filters, activeFilter, setActiveFilter, viewMode, setViewMode, maxDistance, setMaxDistance, variants }: FilterBarProps) {
    return (
        <motion.div variants={variants} className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full">
            <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                <div className="flex gap-1 p-1 bg-gray-100/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl flex-shrink-0">
                    {filters.map(filter => {
                        const isActive = activeFilter === filter;
                        return (
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`relative whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeFilter"
                                        className="absolute inset-0 bg-white shadow-sm border border-gray-200/60 rounded-xl -z-10"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{filter}</span>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Distance Slider */}
                <div className="flex items-center gap-3 px-3 py-2 bg-white border border-gray-200/60 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] min-w-[200px] flex-shrink-0">
                    <span className="text-xs font-semibold text-gray-500 whitespace-nowrap min-w-[55px]">
                        {maxDistance === 100 ? 'Any dist' : `< ${maxDistance}km`}
                    </span>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={maxDistance}
                        onChange={(e) => setMaxDistance(Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-grow sm:w-64 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200/60 rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-300 outline-none text-sm transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)] list-none"
                    />
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-200/50 w-full sm:w-auto self-end">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors relative flex-1 sm:flex-none flex justify-center ${viewMode === 'grid' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
                        title="Grid View"
                    >
                        {viewMode === 'grid' && <motion.div layoutId="viewModeToggle" className="absolute inset-0 bg-white shadow-sm border border-gray-200/60 rounded-lg -z-10" transition={{ type: "spring", stiffness: 500, damping: 30 }} />}
                        <GridIcon size={18} className="relative z-10" />
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`p-2 rounded-lg transition-colors relative flex-1 sm:flex-none flex justify-center ${viewMode === 'map' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
                        title="Map View"
                    >
                        {viewMode === 'map' && <motion.div layoutId="viewModeToggle" className="absolute inset-0 bg-white shadow-sm border border-gray-200/60 rounded-lg -z-10" transition={{ type: "spring", stiffness: 500, damping: 30 }} />}
                        <MapIcon size={18} className="relative z-10" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
