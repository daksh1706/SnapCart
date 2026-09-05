'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './redux/store'
import { initCart } from './redux/cartSlice'
import { initWishlist } from './redux/wishlistSlice'
import useGetMe from './hooks/useGetMe'

function InitUser() {
    useGetMe()
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                // Restore persistent cart from localStorage
                const savedCart = localStorage.getItem("snapcart_cart")
                if (savedCart) {
                    const parsed = JSON.parse(savedCart)
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        dispatch(initCart(parsed))
                    }
                }

                // Restore persistent wishlist from localStorage
                const savedWishlist = localStorage.getItem("snapcart_wishlist")
                if (savedWishlist) {
                    const parsed = JSON.parse(savedWishlist)
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        dispatch(initWishlist(parsed))
                    }
                }
            } catch (err) {
                console.error("Error restoring cart/wishlist from localStorage:", err)
            }
        }
    }, [dispatch])

    return null
}

export default InitUser