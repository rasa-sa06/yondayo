"use client";

import { HomePage } from "../features/HomePage";
import { useApp } from "../contexts/AppContext";
import { useRouter } from "next/navigation";

export default function Home() {
    const { records, addRecord } = useApp();
    const router = useRouter();

    return (
        <>
            <HomePage
                records={records}
                onAddRecord={addRecord}
                onViewAllRecords={() => router.push("/read")}
            />
        </>
    );
}
