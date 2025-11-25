import type { Bill } from '@/store/slices/billsSlice';
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

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

        return Object.entries(categoryMap).map(([name, amount]) => ({
            name,
            amount,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Random color for now
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        }));
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

        // Generate colors for bills
        const colors = [
            '#EB5757', '#F2994A', '#F2C94C', '#219653', '#2D9CDB',
            '#56CCF2', '#9B51E0', '#BB6BD9', '#FF9F43', '#54a0ff'
        ];

        const billSlices = bills.map((bill, index) => ({
            name: bill.title,
            amount: bill.amount,
            color: colors[index % colors.length],
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        }));

        return [
            ...billSlices,
            {
                name: 'Leftover',
                amount: leftover,
                color: '#27AE60',
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
