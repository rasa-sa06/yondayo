"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { signUp } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';
import clsx from 'clsx';

type Child = {
    id: string;
    name: string;
    birthday: string;
};

export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');   // username → name に変更（profilesテーブルに合わせる）
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [children, setChildren] = useState<Child[]>([
        { id: crypto.randomUUID(), name: '', birthday: '' },
    ]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (email: string) => {
        // シンプルなメールフォーマットチェック
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSignup = async () => {
        setError('');
        const errors: string[] = [];

        // バリデーション
        if (!name.trim()) {
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
            setError(errors.join('\n'));
            return;
        }

        setLoading(true);

        try {
            // 1. ユーザー登録（auth.users + profiles）
            const { user } = await signUp(email, password, name);

            // 2. 子ども情報を登録（入力されている場合のみ）
            const filledChildren = children.filter(
                (child) => child.name.trim() !== '' && child.birthday !== ''
            );
            if (filledChildren.length > 0) {
                const childrenData = filledChildren.map((child) => ({
                    user_id: user.id,
                    name: child.name,
                    birthday: child.birthday,
                }));
                const { error: childError } = await supabase
                    .from('children')
                    .insert(childrenData);

                if (childError) {
                    console.error('子ども情報の登録エラー:', childError);
                    // エラーでも続行（子どもは後から登録できる）
                }
            }

            // 3. 登録完了 → HOMEへ
            router.push('/');
        } catch (err: any) {
            console.error('サインアップエラー：', err);
            setError(
                err.message || '登録に失敗しました。もう一度お試しください。'
            );
        } finally {
            setLoading(false);
        }
    };

    const addChild = () => {
        setChildren([
            ...children,
            { id: crypto.randomUUID(), name: '', birthday: '' },
        ]);
    };

    const removeChild = (id: string) => {
        if (children.length > 1) {
            setChildren(children.filter((child) => child.id !== id));
        }
    };

    const updateChild = (
        id: string,
        field: 'name' | 'birthday',
        value: string
    ) => {
        setChildren(
            children.map((child) =>
                child.id === id ? { ...child, [field]: value } : child
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

                    {/* エラーメッセージ */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                            <p className="text-sm text-red-600 whitespace-pre-line text-center">
                                {error}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {/* ユーザー名 */}
                        <div>
                            <label className="block text-sm font-medium text-brown mb-2">
                                ユーザー名
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                        {children.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeChild(child.id)
                                                }
                                                className="text-brown text-sm hover:opacity-70"
                                                disabled={loading}
                                            >
                                                ✕ 削除
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
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
                                            className={inputClassName}
                                            disabled={loading}
                                        />
                                        <input
                                            type="date"
                                            value={child.birthday}
                                            onChange={(e) =>
                                                updateChild(
                                                    child.id,
                                                    'birthday',
                                                    e.target.value
                                                )
                                            }
                                            className={inputClassName}
                                            disabled={loading}
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
                                    disabled={loading}
                                >
                                    ➕
                                </button>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            size="large"
                            fullWidth
                            onClick={handleSignup}
                            disabled={loading}
                        >
                            {loading ? '登録中...' : '登録する'}
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