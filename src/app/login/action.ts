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

    // ✅ ログイン成功後、子どもの有無を確認
    const { data: children } = await supabase
        .from('children')
        .select('id')
        .eq('user_id', data.user.id)
        .limit(1);

    // 子どもがいなければオンボーディングへ
    if (!children || children.length === 0) {
        redirect('/onboarding');
    }


    redirect('/');
}