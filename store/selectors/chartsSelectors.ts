import { Bill } from '@/store/slices/billsSlice';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Selectors
const selectIncomeItems = (state: RootState) => state.income.items;
const selectBillItems = (state: RootState) => state.bills.items;
const selectTransactionItems = (state: RootState) => state.transactions.items;

// Computed Selectors

export const selectTotalIncome = createSelector(
    [selectIncomeItems],
    (items) => items.reduce((sum, item) => sum + item.amount, 0)
);

export const selectTotalBills = createSelector(
    [selectBillItems],
    (items) => items.reduce((sum, item) => sum + item.amount, 0)
);

export const selectTotalExpenses = createSelector(
    [selectTransactionItems],
    (items) => items
        .filter(t => t.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0)
);

export const selectRemainingBalance = createSelector(
    [selectTotalIncome, selectTotalBills, selectTotalExpenses],
    (income, bills, expenses) => income - bills - expenses
);

export const selectSpendingByCategory = createSelector(
    [selectTransactionItems],
    (items) => {
        const categoryMap: Record<string, number> = {};
        items.forEach(item => {
            if (item.type === 'expense') {
                categoryMap[item.category] = (categoryMap[item.category] || 0) + item.amount;
            }
        });

        // Calculate total for percentage calculation
        const total = Object.values(categoryMap).reduce((sum, amount) => sum + amount, 0);

        // Color palette that excludes white and light colors that blend with light backgrounds
        const categoryColors = [
            '#C44569', // Dark rose
            '#6C5CE7', // Deep purple
            '#00B894', // Dark teal
            '#E17055', // Burnt orange
            '#0984E3', // Deep blue
            '#A29BFE', // Muted purple
            '#FD79A8', // Dark pink
            '#55A3FF', // Deep sky blue
            '#FDCB6E', // Darker gold
            '#74B9FF', // Steel blue
            '#81ECEC', // Darker cyan
            '#FF6B6B', // Coral red
            '#4ECDC4', // Teal
            '#FFD93D', // Golden yellow
            '#95E1D3', // Mint green
        ];

        return Object.entries(categoryMap).map(([name, amount], index) => {
            return {
                name,
                amount,
                color: categoryColors[index % categoryColors.length],
                legendFontColor: '#7F7F7F',
                legendFontSize: 12,
            };
        });
    }
);

export const selectMonthlySpending = createSelector(
    [selectTransactionItems],
    (items) => {
        // Simplified: Group by month (assuming current year for simplicity in this mock)
        // Real app would need proper date handling
        const monthlyData = new Array(12).fill(0);
        items.forEach(item => {
            if (item.type === 'expense') {
                const month = new Date(item.date).getMonth();
                monthlyData[month] += item.amount;
            }
        });
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{ data: monthlyData }]
        };
    }
);

export const selectIncomeVsBills = createSelector(
    [selectTotalIncome, selectBillItems],
    (income, bills) => {
        const totalBills = bills.reduce((sum, item) => sum + item.amount, 0);
        const leftover = Math.max(0, income - totalBills);

        // Darker, more muted color palette with good contrast
        // Using deeper, richer tones that work well together
        const billColors = [
            '#C44569', // Dark rose
            '#6C5CE7', // Deep purple
            '#00B894', // Dark teal
            '#E17055', // Burnt orange
            '#0984E3', // Deep blue
            '#A29BFE', // Muted purple
            '#FD79A8', // Dark pink
            '#55A3FF', // Deep sky blue
            '#FDCB6E', // Darker gold
            '#74B9FF', // Steel blue
            '#81ECEC', // Darker cyan
        ];

        const billSlices = bills.map((bill, index) => ({
            name: bill.title,
            amount: bill.amount,
            color: billColors[index % billColors.length],
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        }));

        return [
            ...billSlices,
            {
                name: 'Remaining',
                amount: leftover,
                color: '#95E1D3', // Soft teal that complements the bill colors
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
            },
        ];
    }
);

export const selectUpcomingBills = createSelector(
    [selectBillItems],
    (items) => {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        // Helper to get next occurrence date for a bill
        const getNextDate = (bill: Bill) => {
            if (bill.type === 'monthly') {
                const day = parseInt(bill.dueDate, 10);
                // Create date in current month
                let date = new Date(today.getFullYear(), today.getMonth(), day);
                // If the day has already passed this month, move to next month
                if (date < today) {
                    date = new Date(today.getFullYear(), today.getMonth() + 1, day);
                }
                return date;
            }
            // One-time bill: parse ISO string
            return new Date(bill.dueDate);
        };

        return items
            .filter(item => {
                const nextDate = getNextDate(item);
                return !item.isPaid && nextDate >= today && nextDate <= nextWeek;
            })
            .sort((a, b) => getNextDate(a).getTime() - getNextDate(b).getTime());
    }
);
