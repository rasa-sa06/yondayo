// app/search/page.tsx
"use client";

import { Header } from "../../components/Header";
import { MenuBar } from "../../components/MenuBar";
import { SearchPage } from "../../features/SearchPage";
import { useApp } from "../../contexts/AppContext";

export default function Search() {
    const { addToWishlist } = useApp();

    return (
        <>
            <Header />
            <SearchPage onAddToWishlist={addToWishlist} />
            <MenuBar />
        </>
    );
}
