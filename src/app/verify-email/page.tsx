"use client";

import { Logo } from '../../components/Logo';
import Link from 'next/link';
import Image from 'next/image';

export default function VerifyEmail() {
    return (
        <div className="min-h-screen flex items-center justify-center px-5 py-10">
            <div className="w-full max-w-[500px]">
                {/* ロゴ */}
                <div className="flex justify-center mb-8">
                    <Logo size="large" />
                </div>

                {/* メインカード */}
                <div className="bg-white rounded-[20px] p-8 shadow-[0_4px_12px_rgba(102,0,0,0.1)]">
                    <div className="text-center">
                        <Image
                            src="/icon-send_mail.png"
                            alt="メール送信アイコン"
                            width={65}
                            height={65}
                            className="mx-auto mb-4"
                        />
                        <h1 className="text-2xl font-bold text-brown mb-4">
                            確認メールを送信しました
                        </h1>
                        <p className="text-brown mb-6">
                            ご登録いただいたメールアドレスに
                            <br />
                            確認メールを送信しました。
                            <br />
                            メール内のリンクをクリックして、
                            <br />
                            アカウントを有効化してください。
                        </p>

                        <div className="bg-cream rounded-xl p-4 mb-6">
                            <p className="text-sm text-brown">
                                💡 メールが届かない場合は、
                                <br />
                                迷惑メールフォルダもご確認ください。
                            </p>
                        </div>

                        <Link
                            href="/login"
                            className="inline-block text-brown font-bold underline hover:opacity-70"
                        >
                            ログイン画面に戻る
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}