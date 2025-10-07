// app/read/page.tsx
"use client";

import React from "react";
import { Header } from "../../components/Header";
import { MenuBar } from "../../components/MenuBar";
import { ReadPage } from "../../features/ReadPage";
import { useApp } from "../../contexts/AppContext";

export default function Read() {
    const { records, addRecord, deleteRecord, updateRecord } = useApp();

    return (
        <>
            <Header />
            <ReadPage
                records={records}
                onAddRecord={addRecord}
                onDeleteRecord={deleteRecord}
                onUpdateRecord={updateRecord}
            />
            <MenuBar />
        </>
    );
}
