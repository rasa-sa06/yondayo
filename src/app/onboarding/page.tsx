"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { registerChildren, skipOnboarding } from './action';
import clsx from 'clsx';

type Child = {
    id: string;
    name: string;
    birthday: string;
};

const initialState = {
    message: "",
    success: false,
};

export default function Onboarding() {
    const router = useRouter();
    const [children, setChildren] = useState<Child[]>([
        { id: crypto.randomUUID(), name: '', birthday: '' },
    ]);
    const [state, formAction, isPending] = useActionState(registerChildren, initialState);
    const [skipState, skipFormAction, isSkipping] = useActionState(skipOnboarding, initialState);

    // アクション完了後にリフレッシュ
    useEffect(() => {
        if (state.success || skipState.success) {
            router.push('/');
        }
    }, [state.success, skipState.success, router]);

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
                    <h1 className="text-2xl font-bold text-brown text-center mb-2">
                        お子さまの情報を登録
                    </h1>
                    <p className="text-sm text-gray-600 text-center mb-6">
                        読書記録を管理するお子さまの情報を登録してください
                        <br />
                        （後から追加・編集できます）
                    </p>

                    {/* エラーメッセージ */}
                    {state.message && (
                        <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                            <p className="text-sm text-red-600 text-center">
                                {state.message}
                            </p>
                        </div>
                    )}

                    <form action={formAction}>
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
                                                disabled={isPending || isSkipping}
                                            >
                                                ✕ 削除
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            name={`child_${index}_name`}
                                            value={child.name}
                                            onChange={(e) =>
                                                updateChild(child.id, 'name', e.target.value)
                                            }
                                            placeholder="名前"
                                            className={inputClassName}
                                            disabled={isPending || isSkipping}
                                        />
                                        <input
                                            type="date"
                                            name={`child_${index}_birthday`}
                                            value={child.birthday}
                                            onChange={(e) =>
                                                updateChild(child.id, 'birthday', e.target.value)
                                            }
                                            className={inputClassName}
                                            disabled={isPending || isSkipping}
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
                                    disabled={isPending || isSkipping}
                                >
                                    ➕
                                </button>
                            </div>

                            <Button
                                variant="primary"
                                size="large"
                                fullWidth
                                type="submit"
                                disabled={isPending || isSkipping}
                            >
                                {isPending ? '登録中...' : '登録する'}
                            </Button>
                        </div>
                    </form>

                    <form action={skipFormAction}>
                        <button
                            type="submit"
                            disabled={isPending || isSkipping}
                            className="w-full mt-4 text-brown text-sm hover:opacity-70 disabled:opacity-50"
                        >
                            {isSkipping ? 'スキップ中...' : '後で登録する'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}