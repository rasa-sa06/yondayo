// app/wishlist/page.tsx
"use client";

import { Header } from "../../components/Header";
import { MenuBar } from "../../components/MenuBar";
import { WishlistPage } from "../../features/WishlistPage";
import { useApp } from "../../contexts/AppContext";

export default function Wishlist() {
    const { wishlist, removeFromWishlist } = useApp();

    return (
        <>
            <Header />
            <WishlistPage
                wishlist={wishlist}
                onRemoveFromWishlist={removeFromWishlist}
            />
            <MenuBar />
        </>
    );
}
