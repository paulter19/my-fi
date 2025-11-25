import { stripeService } from '@/services/stripeService';
import { addAccount } from '@/store/slices/accountsSlice';
import { addTransaction } from '@/store/slices/transactionsSlice';
import { nanoid } from '@reduxjs/toolkit';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2, X } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

// Replace with your actual publishable key
const stripePromise = loadStripe('pk_test_51SXUzZPJNIokrXB6bIVrLwutXqrlQTFLGQndCHpULqCnhz03QFCcYC7fpyiq14Bib1EOrzOr9RvbYrQ5KFjhDxNP00e4DSisf4');

interface ConnectBankModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ConnectBankModal: React.FC<ConnectBankModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleConnect = async () => {
        setLoading(true);
        try {
            const stripe = await stripePromise;
            if (!stripe) return;

            // 1. Get Client Secret from Backend
            const { clientSecret } = await stripeService.createSession();

            // 2. Open Stripe Financial Connections Modal
            const { error, financialConnectionsSession } = await stripe.collectFinancialConnectionsAccounts({
                clientSecret,
            });

            if (error) {
                console.error('Stripe Error:', error);
                setLoading(false);
                return;
            }

            if (financialConnectionsSession) {
                // 3. Fetch Account Details from Backend
                const accounts = await stripeService.fetchAccounts(financialConnectionsSession.id);

                for (const acc of accounts) {
                    const accountId = nanoid();

                    // Add Account
                    dispatch(addAccount({
                        id: accountId,
                        name: acc.institution_name + ' ' + acc.last4,
                        type: 'checking', // Simplified mapping
                        balance: acc.balance.current, // Assuming USD
                        currency: acc.currency,
                        source: 'stripe',
                        stripeAccountId: acc.id,
                        lastSynced: new Date().toISOString()
                    }));

                    // 4. Fetch Transactions
                    const transactions = await stripeService.fetchTransactions(acc.id);
                    transactions.forEach((t: any) => {
                        dispatch(addTransaction({
                            id: t.id,
                            title: t.description,
                            amount: Math.abs(t.amount / 100), // Stripe amounts are in cents
                            date: new Date(t.transacted_at * 1000).toISOString().split('T')[0],
                            category: 'Uncategorized',
                            type: t.amount < 0 ? 'expense' : 'income',
                            accountId
                        }));
                    });
                }

                onClose();
            }
        } catch (e) {
            console.error('Connection failed', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[var(--surface)] rounded-xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#635BFF] text-white text-xs font-bold px-2 py-1 rounded">Stripe Secured</div>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-[rgba(0,0,0,0.05)] rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <div className="text-center py-8">
                    <h2 className="text-2xl font-bold mb-4">Connect your bank</h2>
                    <p className="text-[var(--text-secondary)] mb-8">
                        Link your bank account to automatically sync balances and transactions.
                    </p>

                    <button
                        onClick={handleConnect}
                        disabled={loading}
                        className="w-full py-3 bg-[#635BFF] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Connecting...
                            </>
                        ) : (
                            'Connect with Stripe'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
