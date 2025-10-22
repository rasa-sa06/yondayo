"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { MenuBar } from "./MenuBar";
import { ReactNode } from "react";

type AppLayoutProps = {
    children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
    const pathname = usePathname();

    // ヘッダーとメニューバーを非表示にするページ
    const hideNavigation = pathname === '/login' || pathname === '/signup';

    return (
        <>
            {!hideNavigation && <Header />}
            {children}
            {!hideNavigation && <MenuBar />}
        </>
    );
}