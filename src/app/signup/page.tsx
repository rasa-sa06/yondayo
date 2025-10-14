"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import clsx from 'clsx';

type Child = {
    id: string;
    name: string;
    age: number | '';
};

export default function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [children, setChildren] = useState<Child[]>([
        { id: crypto.randomUUID(), name: '', age: '' },
        { id: crypto.randomUUID(), name: '', age: '' },
    ]);

    const validateEmail = (email: string) => {
        // シンプルなメールフォーマットチェック
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSignup = () => {
        const errors: string[] = [];

        if (!username.trim()) {
            errors.push('ユーザー名を入力してください');
        }

        if (!email.trim()) {
            errors.push('メールアドレスを入力してください');
        } else if (!validateEmail(email)) {
            errors.push('メールアドレスの形式が正しくありません');
        }

        if (password.length < 8) {
            errors.push('パスワードは8文字以上で入力してください');
        }

        if (password !== confirmPassword) {
            errors.push('パスワードが一致しません');
        }

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        const filledChildren = children.filter(
            (child) => child.name.trim() !== '' && child.age !== ''
        );

        console.log('新規登録:', {
            email,
            username,
            password,
            children: filledChildren,
        });

        alert('登録処理を実行しました！');
    };

    const addChild = () => {
        setChildren([
            ...children,
            { id: crypto.randomUUID(), name: '', age: '' },
        ]);
    };

    const removeChild = (id: string) => {
        setChildren(children.filter((child) => child.id !== id));
    };

    const updateChild = (id: string, field: 'name' | 'age', value: string) => {
        setChildren(
            children.map((child) =>
                child.id === id
                    ? {
                        ...child,
                        [field]:
                            field === 'age'
                                ? value
                                    ? Number(value)
                                    : ''
                                : value,
                    }
                    : child
            )
        );
    };

    const inputClassName = clsx(
        'w-full p-4 border-2 border-cyan rounded-xl',
        'font-mplus text-base text-brown bg-white',
        'focus:outline-none focus:border-[#99e6e6]',
        'placeholder:text-gray-400'
    );

    return (
        <div className="min-h-screen flex items-center justify-center px-5 py-10">
            <div className="w-full max-w-[500px]">
                {/* ロゴ */}
                <div className="flex justify-center mb-8">
                    <Logo size="large" />
                </div>

                {/* メインカード */}
                <div className="bg-white rounded-[20px] p-8 shadow-[0_4px_12px_rgba(102,0,0,0.1)]">
                    <h1 className="text-2xl font-bold text-brown text-center mb-6">
                        新規登録
                    </h1>

                    <div className="flex flex-col gap-4">
                        {/* ユーザー名 */}
                        <div>
                            <label className="block text-sm font-medium text-brown mb-2">
                                ユーザー名
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="例: ママ"
                                className={inputClassName}
                            />
                        </div>

                        {/* メールアドレス */}
                        <div>
                            <label className="block text-sm font-medium text-brown mb-2">
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                className={inputClassName}
                            />
                        </div>

                        {/* パスワード */}
                        <div>
                            <label className="block text-sm font-medium text-brown mb-2">
                                パスワード
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="8文字以上"
                                className={inputClassName}
                            />
                        </div>

                        {/* パスワード確認 */}
                        <div>
                            <label className="block text-sm font-medium text-brown mb-2">
                                パスワード（確認）
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="もう一度 入力してください"
                                className={inputClassName}
                            />
                        </div>

                        {/* 子ども情報 */}
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-medium text-brown">
                                    お子さまの情報{' '}
                                    <span className="text-xs text-gray-500">
                                        （任意・後から追加可能）
                                    </span>
                                </label>
                            </div>

                            {children.map((child, index) => (
                                <div
                                    key={child.id}
                                    className="mb-3 p-4 bg-cream rounded-xl"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-brown">
                                            {index + 1}人目
                                        </span>
                                        {children.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeChild(child.id)
                                                }
                                                className="text-brown text-sm hover:opacity-70"
                                            >
                                                ✕ 削除
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={child.name}
                                            onChange={(e) =>
                                                updateChild(
                                                    child.id,
                                                    'name',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="名前"
                                            className={clsx(
                                                inputClassName,
                                                'flex-3'
                                            )}
                                        />
                                        <input
                                            type="number"
                                            value={child.age}
                                            onChange={(e) =>
                                                updateChild(
                                                    child.id,
                                                    'age',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="年齢"
                                            className={clsx(
                                                inputClassName,
                                                'flex-1'
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                            <div>
                                <span className="text-sm text-brown ml-2 mr-2">お子様を追加</span>
                                <button
                                    type="button"
                                    onClick={addChild}
                                    className="text-brown text-xl font-bold hover:opacity-70"
                                >
                                    ➕
                                </button>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            size="large"
                            fullWidth
                            type="button"
                            onClick={handleSignup}
                        >
                            登録する
                        </Button>
                    </div>

                    {/* ログインへのリンク */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            すでに アカウントを お持ちの方は
                        </p>
                        <Link
                            href="/login"
                            className="text-brown font-bold underline hover:opacity-70"
                        >
                            ログイン
                        </Link>
                    </div>
                </div>

                {/* フッター装飾 */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        親子で楽しむ 読書記録アプリ
                    </p>
                </div>
            </div>
        </div>
    );
}
