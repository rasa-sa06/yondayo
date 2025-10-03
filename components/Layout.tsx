// components/Layout.tsx
import React from 'react';
import { Header } from './Header';
import { MenuBar } from './MenuBar';

type LayoutProps = {
    children: React.ReactNode;
    currentPage: 'home' | 'read' | 'search' | 'wishlist';
    onPageChange: (page: 'home' | 'read' | 'search' | 'wishlist') => void;
};

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-5 pb-[150px] px-9 max-w-[1200px] w-full mx-auto">
                {children}
            </main>
            <MenuBar currentPage={currentPage} onPageChange={onPageChange} />
        </div>
    );
};