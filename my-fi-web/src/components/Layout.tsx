import { toggleTheme } from '@/store/slices/uiSlice';
import type { RootState } from '@/store/store';
import { LayoutDashboard, Menu, Moon, Settings as SettingsIcon, Sun, Wallet, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const theme = useSelector((state: RootState) => state.ui.theme);
    const dispatch = useDispatch();
    const isDark = theme === 'dark';

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Wallet, label: 'Accounts', path: '/accounts' },
        { icon: SettingsIcon, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-72 p-6 fixed h-full">
                <div className="card-glass p-6 flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-2xl">M</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gradient">My-Fi</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Personal Finance</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => dispatch(toggleTheme())}
                        className="mt-4 btn-secondary flex items-center justify-center gap-2"
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        <span className="text-sm">{isDark ? 'Light' : 'Dark'} Mode</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 card-glass p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-xl">M</span>
                    </div>
                    <span className="text-lg font-bold text-gradient">My-Fi</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 pt-20 px-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="card-glass p-6 space-y-2 animate-fade-in">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`nav-link ${location.pathname === item.path ? 'nav-link-active' : 'nav-link-inactive'}`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                        <button
                            onClick={() => {
                                dispatch(toggleTheme());
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full btn-secondary flex items-center justify-center gap-2 mt-4"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                            <span>{isDark ? 'Light' : 'Dark'} Mode</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 md:ml-72 p-6 md:p-10 pt-24 md:pt-10">
                <div className="max-w-7xl mx-auto animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
