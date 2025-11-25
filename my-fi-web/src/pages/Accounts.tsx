import { AccountCard } from '@/components/AccountCard';
import { AddAccountModal } from '@/components/AddAccountModal';
import { ConnectBankModal } from '@/components/ConnectBankModal';
import type { RootState } from '@/store/store';
import { Link as LinkIcon, Plus, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const Accounts = () => {
    const accounts = useSelector((state: RootState) => state.accounts.items);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Accounts</h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage your financial accounts</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsConnectModalOpen(true)}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <LinkIcon size={20} />
                        <span>Connect Bank</span>
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} />
                        <span>Add Account</span>
                    </button>
                </div>
            </div>

            {/* Accounts Grid */}
            {accounts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.map((account) => (
                        <AccountCard
                            key={account.id}
                            account={account}
                            onClick={(acc) => navigate(`/account/${acc.id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="card-glass p-12 text-center">
                    <Wallet size={64} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No accounts yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Get started by adding your first account</p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => setIsConnectModalOpen(true)} className="btn-secondary">
                            <LinkIcon size={18} className="inline mr-2" />
                            Connect Bank
                        </button>
                        <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
                            <Plus size={18} className="inline mr-2" />
                            Add Manually
                        </button>
                    </div>
                </div>
            )}

            <AddAccountModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <ConnectBankModal
                isOpen={isConnectModalOpen}
                onClose={() => setIsConnectModalOpen(false)}
            />
        </div>
    );
};
