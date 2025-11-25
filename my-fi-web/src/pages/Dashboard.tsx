import { Card } from '@/components/Card';
import { ListItem } from '@/components/ListItem';
import { StatBox } from '@/components/StatBox';
import {
    selectIncomeVsBills,
    selectMonthlySpending,
    selectRemainingBalance,
    selectSpendingByCategory,
    selectTotalBills,
    selectTotalIncome,
    selectUpcomingBills
} from '@/store/selectors/chartsSelectors';
import { Wallet } from 'lucide-react';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export const Dashboard = () => {
    const totalIncome = useSelector(selectTotalIncome);
    const totalBills = useSelector(selectTotalBills);
    const remainingBalance = useSelector(selectRemainingBalance);
    const spendingByCategory = useSelector(selectSpendingByCategory);
    const monthlySpending = useSelector(selectMonthlySpending);
    const incomeVsBills = useSelector(selectIncomeVsBills);
    const upcomingBills = useSelector(selectUpcomingBills);

    const monthlySpendingData = useMemo(() => {
        if (!monthlySpending?.labels) return [];
        return monthlySpending.labels.map((label, index) => ({
            label,
            amount: monthlySpending.datasets[0].data[index]
        }));
    }, [monthlySpending]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Dashboard</h1>
                <p className="text-slate-600 dark:text-slate-400">Welcome back! Here's your financial overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatBox
                    label="Total Income"
                    value={`$${totalIncome.toLocaleString()}`}
                    color="green"
                    trend="up"
                    trendValue="+12% from last month"
                />
                <StatBox
                    label="Total Bills"
                    value={`$${totalBills.toLocaleString()}`}
                    color="red"
                    trend="down"
                    trendValue="-5% from last month"
                />
                <StatBox
                    label="Balance"
                    value={`$${remainingBalance.toLocaleString()}`}
                    color="blue"
                    trend="up"
                    trendValue="+8% from last month"
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Income vs Bills">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={incomeVsBills}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="amount"
                                >
                                    {incomeVsBills.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Upcoming Bills">
                    <div className="h-80 overflow-y-auto space-y-2">
                        {upcomingBills.length > 0 ? (
                            upcomingBills.map((bill) => (
                                <ListItem
                                    key={bill.id}
                                    title={bill.title}
                                    subtitle={`Due: ${bill.dueDate}`}
                                    amount={`$${bill.amount.toLocaleString()}`}
                                    amountColor="#ef4444"
                                    icon="Receipt"
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <Wallet size={48} className="mb-2 opacity-50" />
                                <p>No upcoming bills this week</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Monthly Spending">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlySpendingData}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                                <XAxis
                                    dataKey="label"
                                    stroke="#94a3b8"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Bar
                                    dataKey="amount"
                                    fill="url(#colorAmount)"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Spending by Category">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={spendingByCategory}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="amount"
                                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                    labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                                >
                                    {spendingByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};
