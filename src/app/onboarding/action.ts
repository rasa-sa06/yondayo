'use server';

import { createClient } from '@/utils/supabase/server';

interface OnboardingState {
    message: string;
}

export async function registerChildren(_prevState: OnboardingState, formData: FormData) {
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

    return { message: '', success: true };
}

export async function skipOnboarding() {
    return { message: '', success: true };
}