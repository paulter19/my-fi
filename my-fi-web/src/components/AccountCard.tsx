import type { Account } from '@/store/slices/accountsSlice';
import { Banknote, ChevronRight, CreditCard, PiggyBank, Wallet } from 'lucide-react';

interface AccountCardProps {
    account: Account;
    onClick: (account: Account) => void;
}

export const AccountCard = ({ account, onClick }: AccountCardProps) => {
    const getIcon = (type: Account['type']) => {
        switch (type) {
            case 'checking':
                return { Icon: Wallet, color: 'from-blue-500 to-indigo-600' };
            case 'savings':
                return { Icon: Banknote, color: 'from-emerald-500 to-teal-600' };
            case 'credit':
                return { Icon: CreditCard, color: 'from-rose-500 to-pink-600' };
            default:
                return { Icon: PiggyBank, color: 'from-amber-500 to-orange-600' };
        }
    };

    const { Icon, color } = getIcon(account.type);

    return (
        <div
            onClick={() => onClick(account)}
            className="card-glass p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={28} className="text-white" />
                </div>
                <ChevronRight className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>

            <div>
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">{account.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 capitalize mb-3">{account.type}</p>
                <p className="text-3xl font-bold text-gradient">${account.balance.toLocaleString()}</p>
            </div>
        </div>
    );
};
