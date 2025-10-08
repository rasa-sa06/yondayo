// components/Header.tsx
import React from "react";
import { Logo } from "./Logo";

export const Header: React.FC = () => {
    // 現在の日付を取得
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const weekdays = [
        "にちようび",
        "げつようび",
        "かようび",
        "すいようび",
        "もくようび",
        "きんようび",
        "どようび",
    ];
    const weekday = weekdays[today.getDay()];

    return (
        <header className="top-0 left-0 right-0 bg-white">
            <div className="max-w-[1200px] mx-auto px-5 py-2 flex justify-between items-center">
                <Logo size="small" />
                <div className="flex flex-col items-end text-sm">
                    <span className="font-medium">
                        {year}ねん {month}がつ {day}にち
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5">
                        ({weekday})
                    </span>
                </div>
            </div>
        </header>
    );
};
