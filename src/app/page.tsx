// app/page.tsx
"use client";

import React from "react";
import { Header } from "../components/Header";
import { MenuBar } from "../components/MenuBar";
import { HomePage } from "../features/HomePage";
import { useApp } from "../contexts/AppContext";
import { useRouter } from "next/navigation";

export default function Home() {
    const { records, addRecord } = useApp();
    const router = useRouter();

    return (
        <>
            <Header />
            <HomePage
                records={records}
                onAddRecord={addRecord}
                onViewAllRecords={() => router.push("/read")}
            />
            <MenuBar />
        </>
    );
}
