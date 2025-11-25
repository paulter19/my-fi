import * as Icons from 'lucide-react';

interface ListItemProps {
    title: string;
    subtitle: string;
    amount: string;
    amountColor?: string;
    icon?: string;
}

export const ListItem = ({ title, subtitle, amount, amountColor, icon }: ListItemProps) => {
    const IconComponent = icon && (Icons as any)[icon] ? (Icons as any)[icon] : Icons.Receipt;

    return (
        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200 group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent size={20} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{title}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</div>
                </div>
            </div>
            <div className="font-bold text-lg" style={{ color: amountColor }}>
                {amount}
            </div>
        </div>
    );
};
