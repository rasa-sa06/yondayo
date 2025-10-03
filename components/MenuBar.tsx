// components/MenuBar.tsx
import React from 'react';

type MenuBarProps = {
    currentPage: 'home' | 'read' | 'search' | 'wishlist';
    onPageChange: (page: 'home' | 'read' | 'search' | 'wishlist') => void;
};

export const MenuBar: React.FC<MenuBarProps> = ({ currentPage, onPageChange }) => {
    const menuItems = [
        { id: 'home' as const, icon: '🏠', label: 'ホーム' },
        { id: 'read' as const, icon: '📖', label: 'よんだほん' },
        { id: 'search' as const, icon: '🔍', label: 'ほんをさがす' },
        { id: 'wishlist' as const, icon: '📌', label: 'よみたいほん' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_8px_rgba(102,0,0,0.1)] z-[100]">
            <div className="max-w-[1200px] mx-auto flex justify-around py-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onPageChange(item.id)}
                        className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 max-w-[100px] font-mplus rounded-xl transition-all ${
                            currentPage === item.id 
                            ? 'bg-cyan/30 font-bold' 
                            : 'bg-transparent font-normal hover:bg-cyan/20'
                            }`
                        }
                    >
                    <span className={`text-2xl transition-transform ${currentPage === item.id ? 'scale-120' : 'scale-100'}`}>
                        {item.icon}
                    </span>
                    <span className="text-[11px] whitespace-nowrap">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};