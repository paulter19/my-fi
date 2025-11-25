import { Card } from '@/components/Card';
import { ListItem } from '@/components/ListItem';
import type { RootState } from '@/store/store';
import { ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export const AccountDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const account = useSelector((state: RootState) =>
        state.accounts.items.find(a => a.id === id)
    );
    const transactions = useSelector((state: RootState) =>
        state.transactions.items.filter(t => t.accountId === id)
    );

    if (!account) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold mb-4">Account not found</h2>
                <button
                    onClick={() => navigate('/accounts')}
                    className="text-[var(--primary)] hover:underline"
                >
                    Back to Accounts
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/accounts')}
                    className="p-2 hover:bg-[rgba(0,0,0,0.05)] rounded-full"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold">{account.name}</h1>
            </div>

            <Card className="mb-8 bg-gradient-to-r from-[var(--primary)] to-[#635BFF] text-white border-none">
                <div className="text-sm opacity-80 mb-2 capitalize">{account.type} Account</div>
                <div className="text-4xl font-bold mb-4">${account.balance.toFixed(2)}</div>
                <div className="text-sm opacity-80">
                    {account.source === 'stripe' ? 'Linked via Stripe' : 'Manual Account'}
                </div>
            </Card>

            <h2 className="text-xl font-bold mb-4">Transactions</h2>
            <Card>
                {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                        <ListItem
                            key={transaction.id}
                            title={transaction.title}
                            subtitle={transaction.date}
                            amount={`$${transaction.amount.toFixed(2)}`}
                            amountColor={transaction.type === 'income' ? '#27AE60' : '#EB5757'}
                            icon={transaction.type === 'income' ? 'ArrowDownCircle' : 'ArrowUpCircle'}
                        />
                    ))
                ) : (
                    <div className="text-center py-8 text-[var(--text-secondary)]">
                        No transactions found for this account.
                    </div>
                )}
            </Card>
        </div>
    );
};
