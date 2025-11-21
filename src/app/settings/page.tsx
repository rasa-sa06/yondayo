"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/Button';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile, updateEmail, updatePassword } from '../../../lib/auth';
import clsx from 'clsx';

export default function Settings() {
    const router = useRouter();
    const { childrenList, addChild, deleteChild, updateChild, fetchChildren } = useApp();
    const { user, profile } = useAuth();

    // 初回ロード時に子どもリストを取得
    useEffect(() => {
        fetchChildren();
    }, []);

    // 現在のユーザー情報（後でSupabaseから取得）
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    // プロフィール情報が読み込まれたら、フォームに反映
    useEffect(() => {
        if (profile) {
            setUsername(profile.name || '');
        }
        if (user) {
            setEmail(user.email || '');
        }
    }, [profile, user]);

    // パスワード変更用
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // 子ども編集用
    const [editingChild, setEditingChild] = useState<{
        id: string | null;
        name: string;
        birthday: string;
    }>({
        id: null,
        name: '',
        birthday: '',
    });

    // 保存中フラグ
    const [isSaving, setIsSaving] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // 年齢計算
    const calculateAge = (birthday: string): number => {
        if (!birthday) return 0;
        const today = new Date();
        const birthDate = new Date(birthday);
        if (isNaN(birthDate.getTime())) return 0;

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // プロフィール更新
    const handleUpdateProfile = async () => {
        if (isSaving) return;
        setIsSaving(true);

        try {
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
                setIsSaving(false);
                return;
            }

            // ユーザー名の更新
            if (user && username !== profile?.name) {
                await updateProfile(user.id, { name: username });
            }

            // メールアドレスの更新
            if (email !== user?.email) {
                await updateEmail(email);
                alert('メールアドレスを変更しました。確認メールが送信されますので、メールを確認してください。');
            } else {
                alert('プロフィールを更新しました!');
            }

            // ページをリロードして最新の情報を表示
            window.location.reload();
        } catch (error) {
            console.error('プロフィール更新エラー:', error);
            alert('更新に失敗しました。もう一度お試しください。');
        } finally {
            setIsSaving(false);
        }
    };

    // パスワード変更
    const handleChangePassword = async () => {
        if (isSaving) return;  // 連打防止
        setIsSaving(true);

        try {
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
                setIsSaving(false);
                return;
            }

            await updatePassword(newPassword);
            alert('パスワードを変更しました!');

            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');

        } catch (error) {

            console.error('パスワード変更エラー:', error);
            alert('パスワードの変更に失敗しました。現在のパスワードが正しいか確認してください。');
        } finally {
            setIsSaving(false);
        }

    };

    // 子ども追加モード
    const startAddChild = () => {
        setEditingChild({
            id: 'new',  // 新規追加の識別用
            name: '',
            birthday: '',
        });
    };

    // 子ども編集モード
    const startEditChild = (child: typeof childrenList[0]) => {
        setEditingChild({
            id: child.id,
            name: child.name,
            birthday: child.birthday,
        });
    };

    // 子ども保存
    const handleSaveChild = async () => {
        if (isSaving) return;  // 連打防止
        setIsSaving(true);

        const errors: string[] = [];

        if (!editingChild.name.trim()) {
            errors.push('名前を入力してください');
        }

        if (!editingChild.birthday) {
            errors.push('誕生日を入力してください');
        }

        if (errors.length > 0) {
            alert(errors.join('\n'));
            setIsSaving(false);
            return;
        }

        if (editingChild.id === 'new') {
            // 新規追加
            await addChild({
                userId: user?.id || '',
                name: editingChild.name,
                birthday: editingChild.birthday,
            });
        } else if (editingChild.id) {
            // 更新
            await updateChild(editingChild.id, {
                name: editingChild.name,
                birthday: editingChild.birthday,
            });
        }

        // リセット
        setEditingChild({
            id: null,
            name: '',
            birthday: '',
        });

        setIsSaving(false);
        alert('保存しました！');
    };

    // 子ども削除
    const handleDeleteChild = async (id: string) => {
        if (window.confirm('本当に削除しますか？')) {
            await deleteChild(id);
        }
    };

    // キャンセル
    const handleCancel = () => {
        setEditingChild({
            id: null,
            name: '',
            birthday: '',
        });
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
                            placeholder="ユーザー名を入力"
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
                            placeholder="メールアドレスを入力"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            ※メールアドレスを変更すると、確認メールが送信されます
                        </p>
                    </div>

                    <Button
                        variant="primary"
                        size="medium"
                        onClick={handleUpdateProfile}
                        disabled={isSaving}
                    >
                        {isSaving ? '更新中...' : '更新する'}
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
                        disabled={isSaving}
                    >
                        {isSaving ? '変更中...' : 'パスワードを変更'}
                    </Button>
                </div>
            </section>

            {/* 子どもの管理 */}
            <section className={sectionClassName}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-brown">
                        お子さまの情報
                    </h2>
                    {editingChild.id === null && (
                        <button
                            onClick={startAddChild}
                            className="text-brown text-xl font-bold hover:opacity-70"
                        >
                            ➕ 追加
                        </button>
                    )}
                </div>

                {/* 新規追加フォーム */}
                {editingChild.id === 'new' && (
                    <div className="p-4 bg-cream rounded-xl mb-4">
                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                value={editingChild.name}
                                onChange={(e) =>
                                    setEditingChild({ ...editingChild, name: e.target.value })
                                }
                                placeholder="名前"
                                className={inputClassName}
                            />
                            <input
                                type="date"
                                value={editingChild.birthday}
                                onChange={(e) =>
                                    setEditingChild({ ...editingChild, birthday: e.target.value })
                                }
                                className={inputClassName}
                            />
                            <div className="flex gap-2">
                                <Button
                                    variant="primary"
                                    size="small"
                                    onClick={handleSaveChild}
                                    fullWidth
                                    disabled={isSaving}
                                >
                                    {isSaving ? '保存中...' : '保存'}
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={handleCancel}
                                    fullWidth
                                    disabled={isSaving}
                                >
                                    キャンセル
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 子どもリスト */}
                {childrenList.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                        お子さまが登録されていません
                    </p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {childrenList.map((child) => (
                            <div
                                key={child.id}
                                className="p-4 bg-cream rounded-xl"
                            >
                                {editingChild.id === child.id ? (
                                    // 編集モード
                                    <div className="flex flex-col gap-3">
                                        <input
                                            type="text"
                                            value={editingChild.name}
                                            onChange={(e) =>
                                                setEditingChild({ ...editingChild, name: e.target.value })
                                            }
                                            placeholder="名前"
                                            className={inputClassName}
                                        />
                                        <input
                                            type="date"
                                            value={editingChild.birthday}
                                            onChange={(e) =>
                                                setEditingChild({ ...editingChild, birthday: e.target.value })
                                            }
                                            className={inputClassName}
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                variant="primary"
                                                size="small"
                                                onClick={handleSaveChild}
                                                fullWidth
                                                disabled={isSaving}
                                            >
                                                {isSaving ? '保存中...' : '保存'}
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="small"
                                                onClick={handleCancel}
                                                fullWidth
                                                disabled={isSaving}
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
                                                {calculateAge(child.birthday)}歳
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEditChild(child)}
                                                className="px-3 py-1 text-sm text-brown border-2 border-cyan rounded-lg hover:bg-cyan/30"
                                            >
                                                編集
                                            </button>
                                            <button
                                                onClick={() => handleDeleteChild(child.id)}
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