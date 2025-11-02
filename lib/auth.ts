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
            emailRedirectTo: `${window.location.origin}/auth/callback`,
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
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
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
// ログイン状態の変化を監視
// ======================
export function onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user ?? null);
    });
}