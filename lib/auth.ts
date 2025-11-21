'use client';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export type Profile = {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
};

// ======================
// サインアップ（新規登録）
// ======================
export async function signUp(email: string, password: string, name: string) {
    // 1. 認証ユーザーを作成
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,  // ← 修正
            data: {
                name: name,  // ← nameをメタデータとして保存
            },
        },
    });
    if (authError) throw authError;
    if (!authData.user) throw new Error('ユーザーの作成に失敗しました');

    return { user: authData.user };
}

// ======================
// ログイン
// ======================
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data.user;
}

// ======================
// ログアウト
// ======================
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

// ======================
// 現在のユーザー情報を取得
// ======================
export async function getCurrentUser(): Promise<User | null> {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            // セッションがない場合は null を返す（エラーを投げない）
            return null;
        }
        return user;
    } catch {
        // エラーが出ても null を返す
        return null;
    }
}

// ======================
// プロフィール情報を取得
// ======================
export async function getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
}

// ======================
// プロフィール情報を更新 ← ★ここから追加
// ======================
export async function updateProfile(userId: string, updates: { name?: string }) {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('プロフィール更新エラー:', error);
        throw error;
    }

    return data;
}

// ======================
// メールアドレスを更新
// ======================
export async function updateEmail(newEmail: string) {
    const { data, error } = await supabase.auth.updateUser({
        email: newEmail
    });

    if (error) {
        console.error('メールアドレス更新エラー:', error);
        throw error;
    }

    return data;
}

// ======================
// パスワードを更新
// ======================
export async function updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        console.error('パスワード更新エラー:', error);
        throw error;
    }

    return data;
}

// ======================
// ログイン状態の変化を監視
// ======================
export function onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user ?? null);
    });
}