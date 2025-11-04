'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { getCurrentUser, onAuthStateChange, getProfile, Profile } from '../../lib/auth';

type AuthContextType = {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const initAuth = async () => {
            try {
                const currentUser = await getCurrentUser();
                if (!isMounted) return;

                setUser(currentUser);

                if (currentUser) {
                    try {
                        const userProfile = await getProfile(currentUser.id);
                        if (isMounted) setProfile(userProfile);
                    } catch (profileError) {
                        // プロフィールがまだ作成されていない場合（メール確認前など）
                        console.log('プロフィール未作成:', profileError);
                        if (isMounted) setProfile(null);
                    }
                }
            } catch (error) {
                console.error('認証エラー:', error);
                if (isMounted) {
                    setUser(null);
                    setProfile(null);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        initAuth();

        const { data: { subscription } } = onAuthStateChange(async (currentUser) => {
            if (!isMounted) return;

            setUser(currentUser);

            if (currentUser) {
                try {
                    const userProfile = await getProfile(currentUser.id);
                    if (isMounted) setProfile(userProfile);
                } catch (profileError) {
                    console.log('プロフィール未作成:', profileError);
                    if (isMounted) setProfile(null);
                }
            } else {
                setProfile(null);
            }
        });

        return () => {
            isMounted = false;
            subscription?.unsubscribe?.();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    return useContext(AuthContext);
}