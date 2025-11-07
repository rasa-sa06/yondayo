'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../../utils/supabase/server';

export async function login(_prevState: any, formData: FormData) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    });

    if (error) {
        return { message: "ログインに失敗しました。メールアドレスまたはパスワードを確認してください。" };
    }

    redirect('/');
}