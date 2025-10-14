"use client";

import { useState } from 'react';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import clsx from 'clsx';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // 後でSupabase認証を実装
        console.log('ログイン:', { email, password });
    };

    const inputClassName = clsx(
        'w-full p-4 border-2 border-cyan rounded-xl',
        'font-mplus text-base text-brown bg-white',
        'focus:outline-none focus:border-[#99e6e6]',
        'placeholder:text-gray-400'
    );

    return (
        <div className="min-h-screen flex items-center justify-center px-5">
            <div className="w-full max-w-[400px]">
                {/* ロゴ */}
                <div className="flex justify-center mb-8">
                    <Logo size="large" />
                </div>

                {/* メインカード */}
                <div className="bg-white rounded-[20px] p-8 shadow-[0_4px_12px_rgba(102,0,0,0.1)]">
                    <h1 className="text-2xl font-bold text-brown text-center mb-6">
                        ログイン
                    </h1>

                    <div className="flex flex-col gap-4">
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

                        <div>
                            <label className="block text-sm font-medium text-brown mb-2">
                                パスワード
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className={inputClassName}
                            />
                        </div>

                        <Button
                            variant="primary"
                            size="large"
                            fullWidth
                            onClick={handleLogin}
                        >
                            ログイン
                        </Button>
                    </div>

                    {/* サインアップへのリンク */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            アカウントを お持ちでない方は
                        </p>
                        <a
                            href="/signup"
                            className="text-brown font-bold underline hover:opacity-70"
                        >
                            新規登録
                        </a>
                    </div>
                </div>

                {/* フッター装飾 */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        親子で楽しむ 読書記録アプリ 📚
                    </p>
                </div>
            </div>
        </div >
    );
}