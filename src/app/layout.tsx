import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import { MenuBar } from "../components/MenuBar";

// Google Fontsの読み込み（Next.jsの推奨方法）
import { M_PLUS_Rounded_1c } from "next/font/google";
import { AppProvider } from "../contexts/AppContext";

const mPlusRounded = M_PLUS_Rounded_1c({
    weight: ["400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-mplus",
});

export const metadata: Metadata = {
    title: "よんだよ",
    description: "親子で楽しめる読書記録アプリ",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body className={mPlusRounded.variable}>
                <AppProvider>
                    <Header />
                    {children}
                    <MenuBar />
                </AppProvider>
            </body>

        </html>
    );
}
