"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { supabase } from '../../../lib/supabase';
import clsx from 'clsx';

type Child = {
    id: string;
    name: string;
    birthday: string;
};

export default function Onboarding() {
    const router = useRouter();
    const [children, setChildren] = useState<Child[]>([
        { id: crypto.randomUUID(), name: '', birthday: '' },
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            // 現在ログイン中のユーザーIDを取得
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('ログインしてください');
            }

            // 入力されている子どもの情報のみ登録
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
                    throw childError;
                }
            }

            // HOMEへ遷移
            router.push('/');
        } catch (err: any) {
            console.error('子ども情報の登録エラー:', err);
            setError('登録に失敗しました。もう一度お試しください。');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        router.push('/');
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
                    <h1 className="text-2xl font-bold text-brown text-center mb-2">
                        お子さまの情報を登録
                    </h1>
                    <p className="text-sm text-gray-600 text-center mb-6">
                        読書記録を管理するお子さまの情報を登録してください
                        <br />
                        （後から追加・編集できます）
                    </p>

                    {/* エラーメッセージ */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                            <p className="text-sm text-red-600 text-center">
                                {error}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {/* 子ども情報 */}
                        {children.map((child, index) => (
                            <div
                                key={child.id}
                                className="p-4 bg-cream rounded-xl"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-brown">
                                        {index + 1}人目
                                    </span>
                                    {children.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeChild(child.id)}
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
                                            updateChild(child.id, 'name', e.target.value)
                                        }
                                        placeholder="名前"
                                        className={inputClassName}
                                        disabled={loading}
                                    />
                                    <input
                                        type="date"
                                        value={child.birthday}
                                        onChange={(e) =>
                                            updateChild(child.id, 'birthday', e.target.value)
                                        }
                                        className={inputClassName}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        ))}

                        <div>
                            <span className="text-sm text-brown ml-2 mr-2">
                                お子様を追加
                            </span>
                            <button
                                type="button"
                                onClick={addChild}
                                className="text-brown text-xl font-bold hover:opacity-70"
                                disabled={loading}
                            >
                                ➕
                            </button>
                        </div>

                        <Button
                            variant="primary"
                            size="large"
                            fullWidth
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? '登録中...' : '登録する'}
                        </Button>

                        <button
                            onClick={handleSkip}
                            disabled={loading}
                            className="w-full text-brown text-sm hover:opacity-70 disabled:opacity-50"
                        >
                            後で登録する
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}