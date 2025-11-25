import { TrendingDown, TrendingUp } from 'lucide-react';

interface StatBoxProps {
    label: string;
    value: string;
    color?: string;
    trend?: 'up' | 'down';
    trendValue?: string;
}

export const StatBox = ({ label, value, color, trend, trendValue }: StatBoxProps) => {
    const gradients = {
        green: 'from-emerald-500 to-teal-600',
        red: 'from-rose-500 to-pink-600',
        blue: 'from-blue-500 to-indigo-600',
        purple: 'from-purple-500 to-indigo-600',
    };

    const getGradient = () => {
        if (color?.includes('27AE60') || color?.includes('green')) return gradients.green;
        if (color?.includes('EB5757') || color?.includes('red')) return gradients.red;
        if (color?.includes('4A90E2') || color?.includes('blue')) return gradients.blue;
        return gradients.purple;
    };

    return (
        <div className={`stat-card bg-gradient-to-br ${getGradient()} text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
                <p className="text-sm font-medium opacity-90 mb-2">{label}</p>
                <p className="text-4xl font-bold mb-2">{value}</p>
                {trend && trendValue && (
                    <div className="flex items-center gap-1 text-sm">
                        {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
