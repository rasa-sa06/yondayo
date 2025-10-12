"use client";

import { ReadPage } from "../../features/ReadPage";
import { useApp } from "../../contexts/AppContext";

export default function Read() {
    const { records, addRecord, deleteRecord, updateRecord } = useApp();

    return (
        <>
            <ReadPage
                records={records}
                onAddRecord={addRecord}
                onDeleteRecord={deleteRecord}
                onUpdateRecord={updateRecord}
            />
        </>
    );
}
