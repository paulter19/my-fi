import { Card } from '@/components/Card';
import { resetAccounts } from '@/store/slices/accountsSlice';
import { resetBills } from '@/store/slices/billsSlice';
import { resetIncome } from '@/store/slices/incomeSlice';
import { resetTransactions } from '@/store/slices/transactionsSlice';
import { setTheme } from '@/store/slices/uiSlice';
import type { RootState } from '@/store/store';
import { AlertTriangle, Moon, Sun, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

export const Settings = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.ui.theme);
    const isDark = theme === 'dark';

    const toggleTheme = () => {
        dispatch(setTheme(isDark ? 'light' : 'dark'));
    };

    const handleClearData = () => {
        if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            dispatch(resetAccounts());
            dispatch(resetTransactions());
            dispatch(resetBills());
            dispatch(resetIncome());
        }
    };

    return (
        <div className="max-w-3xl space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
                <p className="text-slate-600 dark:text-slate-400">Manage your app preferences</p>
            </div>

            {/* Appearance */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Appearance</h2>
                <Card>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                                {isDark ? <Moon size={24} className="text-indigo-600 dark:text-indigo-400" /> : <Sun size={24} className="text-amber-600" />}
                            </div>
                            <div>
                                <div className="font-semibold text-slate-900 dark:text-white">Theme</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    {isDark ? 'Dark' : 'Light'} mode is active
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${isDark ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-slate-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${isDark ? 'translate-x-9' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </Card>
            </div>

            {/* Danger Zone */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                    <AlertTriangle size={24} />
                    Danger Zone
                </h2>
                <Card className="border-2 border-rose-200 dark:border-rose-900/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                                <Trash2 size={24} className="text-rose-600 dark:text-rose-400" />
                            </div>
                            <div>
                                <div className="font-semibold text-rose-600 dark:text-rose-400">Clear All Data</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    Permanently delete all accounts, transactions, and settings
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleClearData}
                            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            Clear Data
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};
