import { addAccount } from '@/store/slices/accountsSlice';
import { nanoid } from '@reduxjs/toolkit';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

interface AddAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');
    const [type, setType] = useState<'checking' | 'savings' | 'credit'>('checking');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !balance) return;

        dispatch(addAccount({
            id: nanoid(),
            name,
            balance: parseFloat(balance),
            type,
            currency: 'USD',
            source: 'manual'
        }));

        setName('');
        setBalance('');
        setType('checking');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[var(--surface)] rounded-xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Add Account</h2>
                    <button onClick={onClose} className="p-1 hover:bg-[rgba(0,0,0,0.05)] rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Account Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            placeholder="e.g. Chase Checking"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Current Balance</label>
                        <input
                            type="number"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            placeholder="0.00"
                            step="0.01"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Account Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['checking', 'savings', 'credit'] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`p-2 rounded-lg border capitalize transition-colors ${type === t
                                            ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                                            : 'border-[var(--border)] hover:bg-[rgba(0,0,0,0.05)]'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-[var(--primary)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity mt-4"
                    >
                        Save Account
                    </button>
                </form>
            </div>
        </div>
    );
};
