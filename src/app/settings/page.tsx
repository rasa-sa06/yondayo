// app/settings/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/Button';
import clsx from 'clsx';

type Child = {
    id: string;
    name: string;
    age: number | '';
};

export default function Settings() {
    const router = useRouter();

    // 現在のユーザー情報（後でSupabaseから取得）
    const [username, setUsername] = useState('ママ');
    const [email, setEmail] = useState('example@email.com');

    // パスワード変更用
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // 子ども情報（後でSupabaseから取得）
    const [children, setChildren] = useState<Child[]>([
        { id: '1', name: 'たろうくん', age: 5 },
        { id: '2', name: 'はなちゃん', age: 3 },
    ]);

    const [editingChildId, setEditingChildId] = useState<string | null>(null);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // プロフィール更新
    const handleUpdateProfile = () => {
        const errors: string[] = [];

        if (!username.trim()) {
            errors.push('ユーザー名を入力してください');
        }

        if (!email.trim()) {
            errors.push('メールアドレスを入力してください');
        } else if (!validateEmail(email)) {
            errors.push('メールアドレスの形式が正しくありません');
        }

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        console.log('プロフィール更新:', { username, email });
        alert('プロフィールを更新しました！');
    };

    // パスワード変更
    const handleChangePassword = () => {
        const errors: string[] = [];

        if (!currentPassword) {
            errors.push('現在のパスワードを入力してください');
        }

        if (newPassword.length < 8) {
            errors.push('新しいパスワードは8文字以上で入力してください');
        }

        if (newPassword !== confirmNewPassword) {
            errors.push('新しいパスワードが一致しません');
        }

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        console.log('パスワード変更');
        alert('パスワードを変更しました！');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
    };

    // 子どもを追加
    const addChild = () => {
        const newChild: Child = {
            id: crypto.randomUUID(),
            name: '',
            age: '',
        };
        setChildren([...children, newChild]);
        setEditingChildId(newChild.id);
    };

    // 子どもを削除
    const removeChild = (id: string) => {
        if (window.confirm('本当に削除しますか？')) {
            setChildren(children.filter(child => child.id !== id));
        }
    };

    // 子どもの情報を更新
    const updateChild = (id: string, field: 'name' | 'age', value: string) => {
        setChildren(children.map(child =>
            child.id === id
                ? {
                    ...child,
                    [field]: field === 'age'
                        ? value ? Number(value) : ''
                        : value
                }
                : child
        ));
    };

    // 子どもの編集を保存
    const saveChild = (id: string) => {
        const child = children.find(c => c.id === id);
        if (!child?.name.trim()) {
            alert('名前を入力してください');
            return;
        }
        console.log('子ども情報更新:', child);
        setEditingChildId(null);
        alert('保存しました！');
    };

    // ログアウト
    const handleLogout = () => {
        if (window.confirm('ログアウトしますか？')) {
            console.log('ログアウト');
            alert('ログアウトしました');
            router.push('/login');
        }
    };

    const inputClassName = clsx(
        'w-full p-3 border-2 border-cyan rounded-xl',
        'font-mplus text-base text-brown bg-white',
        'focus:outline-none focus:border-[#99e6e6]',
        'placeholder:text-gray-400'
    );

    const sectionClassName = clsx(
        'bg-white rounded-[20px] p-6 mb-5',
        'shadow-[0_2px_8px_rgba(102,0,0,0.1)]'
    );

    return (
        <div className="max-w-[600px] mx-auto pb-5 px-5">
            <h1 className="text-[28px] font-bold text-brown mb-6 mt-6">
                設定
            </h1>

            {/* プロフィール編集 */}
            <section className={sectionClassName}>
                <h2 className="text-xl font-bold text-brown mb-4">
                    プロフィール編集
                </h2>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-brown mb-2">
                            ユーザー名
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={inputClassName}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brown mb-2">
                            メールアドレス
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClassName}
                        />
                    </div>

                    <Button
                        variant="primary"
                        size="medium"
                        onClick={handleUpdateProfile}
                    >
                        更新する
                    </Button>
                </div>
            </section>

            {/* パスワード変更 */}
            <section className={sectionClassName}>
                <h2 className="text-xl font-bold text-brown mb-4">
                    パスワード変更
                </h2>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-brown mb-2">
                            現在のパスワード
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={inputClassName}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brown mb-2">
                            新しいパスワード
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="8文字以上"
                            className={inputClassName}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brown mb-2">
                            新しいパスワード（確認）
                        </label>
                        <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="もう一度 入力してください"
                            className={inputClassName}
                        />
                    </div>

                    <Button
                        variant="primary"
                        size="medium"
                        onClick={handleChangePassword}
                    >
                        パスワードを変更
                    </Button>
                </div>
            </section>

            {/* 子どもの管理 */}
            <section className={sectionClassName}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-brown">
                        お子さまの情報
                    </h2>
                    <button
                        onClick={addChild}
                        className="text-brown text-xl font-bold hover:opacity-70"
                    >
                        ➕ 追加
                    </button>
                </div>

                {children.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                        お子さまが登録されていません
                    </p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {children.map((child) => (
                            <div
                                key={child.id}
                                className="p-4 bg-cream rounded-xl"
                            >
                                {editingChildId === child.id ? (
                                    // 編集モード
                                    <div className="flex flex-col gap-3">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={child.name}
                                                onChange={(e) =>
                                                    updateChild(child.id, 'name', e.target.value)
                                                }
                                                placeholder="名前"
                                                className={clsx(inputClassName, 'flex-[3]')}
                                            />
                                            <input
                                                type="number"
                                                value={child.age}
                                                onChange={(e) =>
                                                    updateChild(child.id, 'age', e.target.value)
                                                }
                                                placeholder="年齢"
                                                className={clsx(inputClassName, 'flex-1')}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="primary"
                                                size="small"
                                                onClick={() => saveChild(child.id)}
                                                fullWidth
                                            >
                                                保存
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="small"
                                                onClick={() => setEditingChildId(null)}
                                                fullWidth
                                            >
                                                キャンセル
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    // 表示モード
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-brown">
                                                {child.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {child.age}歳
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingChildId(child.id)}
                                                className="px-3 py-1 text-sm text-brown border-2 border-cyan rounded-lg hover:bg-cyan/30"
                                            >
                                                編集
                                            </button>
                                            <button
                                                onClick={() => removeChild(child.id)}
                                                className="px-3 py-1 text-sm text-brown border-2 border-red-400 rounded-lg hover:bg-red-100"
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ログアウト */}
            <section className={sectionClassName}>
                <Button
                    variant="danger"
                    size="large"
                    fullWidth
                    onClick={handleLogout}
                >
                    ログアウト
                </Button>
            </section>
        </div>
    );
}