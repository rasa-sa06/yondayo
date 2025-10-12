"use client";

import { WishlistPage } from "../../features/WishlistPage";
import { useApp } from "../../contexts/AppContext";

export default function Wishlist() {
    const { wishlist, removeFromWishlist } = useApp();

    return (
        <>
            <WishlistPage
                wishlist={wishlist}
                onRemoveFromWishlist={removeFromWishlist}
            />
        </>
    );
}
