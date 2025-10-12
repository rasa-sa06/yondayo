"use client";

import { SearchPage } from "../../features/SearchPage";
import { useApp } from "../../contexts/AppContext";

export default function Search() {
    const { addToWishlist } = useApp();

    return (
        <>
            <SearchPage onAddToWishlist={addToWishlist} />
        </>
    );
}
