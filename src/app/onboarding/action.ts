'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function registerChildren(_prevState: any, formData: FormData) {
    const supabase = await createClient();

    // 現在のユーザーを取得
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { message: 'ログインしてください', success: false };
    }

    // FormDataから子どもの情報を取得
    const childrenData: Array<{ name: string; birthday: string }> = [];
    let index = 0;

    while (formData.has(`child_${index}_name`)) {
        const name = formData.get(`child_${index}_name`) as string;
        const birthday = formData.get(`child_${index}_birthday`) as string;

        if (name.trim() && birthday) {
            childrenData.push({ name, birthday });
        }
        index++;
    }

    // 子ども情報を登録
    if (childrenData.length > 0) {
        const insertData = childrenData.map((child) => ({
            user_id: user.id,
            name: child.name,
            birthday: child.birthday,
        }));

        const { error: insertError } = await supabase
            .from('children')
            .insert(insertData);

        if (insertError) {
            return { message: '登録に失敗しました。もう一度お試しください。', success: false };
        }
    }

    // キャッシュを再検証
    revalidatePath('/', 'layout');

    // 成功
    return { message: '', success: true };
}

export async function skipOnboarding() {
    revalidatePath('/', 'layout');
    return { message: '', success: true };
}