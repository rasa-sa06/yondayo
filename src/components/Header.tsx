"use client";

import { Logo } from "./Logo";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "../../lib/auth";

export function Header() {
    const router = useRouter();
    const { user, profile } = useAuth();
    const { selectedChildId, setSelectedChildId, childrenList } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 選択された子どもの情報を取得
    const selectedChild = childrenList.find(child => child.id === selectedChildId);
    const displayName = selectedChild ? selectedChild.name : 'こどもを　えらぶ';

    // 現在の日付を取得
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const weekdays = [
        "にちようび",
        "げつようび",
        "かようび",
        "すいようび",
        "もくようび",
        "きんようび",
        "どようび",
    ];
    const weekday = weekdays[today.getDay()];

    // ドロップダウン外クリックで閉じる
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelectChild = (childId: string) => {
        setSelectedChildId(childId);
        setIsOpen(false);
    };

    const handleLogout = async () => {
        if (!window.confirm('ログアウトしますか？')) return;

        setLoading(true);
        try {
            await signOut();
            router.push('/login');
        } catch (error) {
            console.error('ログアウトエラー：', error);
            alert('ログアウトに失敗しました');
        } finally {
            setLoading(false);
        }
    }

    return (
        <header className="top-0 left-0 right-0 mb-6 bg-white">
            <div className="max-w-[1200px] mx-auto px-5 py-2 flex justify-between items-center">
                <Logo size="small" />
                <div className="flex flex-col items-end text-sm">
                    {/* 認証ボタン */}
                    {user ? (
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="px-4 py-2 te xt-sm font-medium text-brown bg-cyan rounded-xl hover:opacity-70 transition-opacity disabled:opacity-50">
                            {loading ? 'ログアウト中...' : 'ログアウト'}
                        </button>
                    ) : (
                        <Link
                            href={"/login"}
                            className="px-4 py-2 text-sm font-medium text-brown bg-cyan rounded-xl hover:opacity-70 transition-opacity"
                        >
                            ログイン
                        </Link>
                    )}
                    {/* ユーザー情報 */}
                    <div className="flex flex-col items-end text-sm">
                        {/* ユーザー名 */}
                        <span className="font-medium text-gray-500">
                            {profile?.name || 'ゲスト'}
                        </span>


                        {/* 子ども選択ドロップダウン */}
                        {user && (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="flex items-center gap-1 font-medium text-brown hover:opacity-70 transition-opacity"
                                >
                                    {displayName}
                                    <span className="text-xs">{isOpen ? '▲' : '▼'}</span>
                                </button>

                                {isOpen && childrenList.length > 0 && (
                                    <div className="absolute right-0 mt-1 bg-white border-2 border-cyan rounded-xl shadow-lg z-50 min-w-[120px] w-max">
                                        {childrenList.map((child) => (
                                            <button
                                                key={child.id}
                                                onClick={() => handleSelectChild(child.id)}
                                                className={`
                                            block w-full px-4 py-2 text-left text-brown hover:bg-cyan/30 transition-colors
                                            first:rounded-t-xl last:rounded-b-xl whitespace-nowrap
                                            ${child.id === selectedChildId ? 'bg-cyan font-bold' : ''}
                                        `}
                                            >
                                                {child.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 日付 */}
                        <span className="font-medium mt-1">
                            {year}ねん {month}がつ {day}にち
                        </span>
                        <span className="text-xs text-gray-400">
                            ({weekday})
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}