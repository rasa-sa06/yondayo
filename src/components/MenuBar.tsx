// components/MenuBar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const MenuBar: React.FC = () => {
    const pathname = usePathname();
    const menuItems = [
        { id: "home", path: "/", icon: "🏠", label: "ホーム" },
        { id: "read", path: "/read", icon: "📖", label: "よんだほん" },
        { id: "search", path: "/search", icon: "🔍", label: "ほんをさがす" },
        { id: "wishlist", path: "/wishlist", icon: "📌", label: "よみたいほん" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_8px_rgba(102,0,0,0.1)] z-[100]">
            <div className="max-w-[1200px] mx-auto flex justify-around py-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.id}
                        href={item.path}
                        className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 max-w-[100px] font-mplus rounded-xl transition-all ${
                            pathname === item.id
                                ? "bg-cyan/30 font-bold"
                                : "bg-transparent font-normal hover:bg-cyan/20"
                        }`}
                    >
                        <span
                            className={`text-2xl transition-transform ${
                                pathname === item.id ? "scale-120" : "scale-100"
                            }`}
                        >
                            {item.icon}
                        </span>
                        <span className="text-[11px] whitespace-nowrap">
                            {item.label}
                        </span>
                    </Link>
                ))}
            </div>
        </nav>
    );
};
