
export const CategoryBadge = ({ category }: { category: string | null }) => {
    const styles: Record<string, string> = {
        'Burn Energy': 'bg-orange-100 text-orange-700 border-orange-200',
        'Clear Head': 'bg-teal-100 text-teal-700 border-teal-200',
        'Find People': 'bg-blue-100 text-blue-700 border-blue-200',
    };

    const appliedStyle = category && styles[category] ? styles[category] : 'bg-gray-100 text-gray-700';

    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${appliedStyle}`}>
            {category}
        </span>
    );
};
