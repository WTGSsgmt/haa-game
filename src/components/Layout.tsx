import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
    return (
        <div className={`min-h-screen w-full max-w-md mx-auto bg-slate-900 flex flex-col p-6 ${className}`}>
            {children}
        </div>
    );
};
