"use client";

import { useActionState } from 'react';
import Link from 'next/link';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { signup } from './action';
import clsx from 'clsx';

const initialState = {
    message: "",
};

export default function Signup() {
    const [state, formAction, isPending] = useActionState(signup, initialState);

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

                    {/* エラーメッセージ */}
                    {state.message && (
                        <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                            <p className="text-sm text-red-600 whitespace-pre-line text-center">
                                {state.message}
                            </p>
                        </div>
                    )}

                    <form action={formAction}>
                        <div className="flex flex-col gap-4">
                            {/* ユーザー名 */}
                            <div>
                                <label className="block text-sm font-medium text-brown mb-2">
                                    ユーザー名
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="例: ママ"
                                    className={inputClassName}
                                    disabled={isPending}
                                />
                            </div>

                            {/* メールアドレス */}
                            <div>
                                <label className="block text-sm font-medium text-brown mb-2">
                                    メールアドレス
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="example@email.com"
                                    className={inputClassName}
                                    disabled={isPending}
                                />
                            </div>

                            {/* パスワード */}
                            <div>
                                <label className="block text-sm font-medium text-brown mb-2">
                                    パスワード
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="8文字以上"
                                    className={inputClassName}
                                    disabled={isPending}
                                />
                            </div>

                            {/* パスワード確認 */}
                            <div>
                                <label className="block text-sm font-medium text-brown mb-2">
                                    パスワード（確認）
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="もう一度 入力してください"
                                    className={inputClassName}
                                    disabled={isPending}
                                />
                            </div>

                            <Button
                                variant="primary"
                                size="large"
                                fullWidth
                                disabled={isPending}
                                type="submit"
                            >
                                {isPending ? '登録中...' : '登録する'}
                            </Button>
                        </div>
                    </form>

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