import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
}

export const Card = ({ children, className = '', title }: CardProps) => {
    return (
        <div className={`card-glass p-6 ${className}`}>
            {title && <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">{title}</h3>}
            {children}
        </div>
    );
};
