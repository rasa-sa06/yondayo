'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

interface SignupState {
    message: string;
}

export async function signup(_prevState: SignupState, formData: FormData) {
    const supabase = await createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // バリデーション
    const errors: string[] = [];

    if (!name.trim()) {
        errors.push('ユーザー名を入力してください');
    }

    if (!email.trim()) {
        errors.push('メールアドレスを入力してください');
    }

    if (password.length < 8) {
        errors.push('パスワードは8文字以上で入力してください');
    }

    if (password !== confirmPassword) {
        errors.push('パスワードが一致しません');
    }

    if (errors.length > 0) {
        return { message: errors.join('\n') };
    }

    // サインアップ
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
            data: {
                name: name,
            },
        },
    });

    if (error) {
        return { message: error.message || '登録に失敗しました。もう一度お試しください。' };
    }

    // メール確認画面へ
    redirect('/verify-email');
}