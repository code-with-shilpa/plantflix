"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { account } from "@/lib/appwrite"
import { useRouter } from "next/navigation"
import { Package, User, Heart, LogOut, ChevronDown } from "lucide-react"
import { useCartStore } from "@/store/cartStore"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true) // ✅ Added loading state
 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const router = useRouter()

  // Check Auth & Cart Count
 // ✅ Check Auth & Cart Count
  useEffect(() => {
    const getUser = async () => {
      setIsAuthLoading(true)
      try {
        const res = await account.get()
        setUser(res)
      } catch {
        setUser(null)
      } finally {
        setIsAuthLoading(false)
      }
    }

    getUser()

    // 1. Listen for auth changes
    window.addEventListener("auth-change", getUser)
 
  }, [])

  const logout = async () => {
    await account.deleteSession("current")
    setUser(null)
    router.push("/login")
  }

  const cart = useCartStore((state) => state.cart);

const cartCount = cart.reduce(
  (sum, item) => sum + item.quantity,
  0
);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/85 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* 🌿 Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => router.push("/")}
          >
            {/* <div className="bg-green-600 text-white p-1.5 rounded-lg group-hover:bg-green-700 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div> */}
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-green-700 transition-colors">
              Plantflix
            </h1>
          </div>

          {/* 🖥️ Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <Link href="/aboutUs" className="hover:text-green-600 transition-colors">
            About Us
            </Link>
            <Link href="/plants" className="hover:text-green-600 transition-colors">
            Plants
            </Link>
             
          </div>

          {/* 🛒 Actions (Cart + Auth) */}
          <div className="flex items-center gap-5">

            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-green-600 transition-colors rounded-full hover:bg-green-50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth UI */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthLoading ? (
                // ✅ Skeleton loader prevents the UI from flashing on refresh
                <div className="flex items-center gap-4 animate-pulse pl-4 border-l border-gray-200">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                </div>
              ) : !user ? (
                <>
                  <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">
                    Log in
                  </Link>
                  <Link href="/signup" className="text-sm font-medium bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95">
                    Register
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-700 font-bold rounded-full border border-green-200 hover:ring-2 hover:ring-green-600 hover:ring-offset-2 transition-all">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <ChevronDown
                        size={16}
                        className={`transition-transform text-gray-500 ${
                          showProfileMenu ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showProfileMenu && (
                      <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                        {/* User Info */}
                        <div className="px-4 py-4 bg-green-50/50 border-b border-gray-50">
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>

                        {/* Profile Links */}
                        <button
                          onClick={() => { router.push("/profile"); setShowProfileMenu(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 hover:text-green-700 transition-colors text-gray-600 text-sm font-medium"
                        >
                          <User size={18} /> Profile
                        </button>

                        <button
                          onClick={() => { router.push("/orders"); setShowProfileMenu(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 hover:text-green-700 transition-colors text-gray-600 text-sm font-medium"
                        >
                          <Package size={18} /> My Orders
                        </button>

                        <button
                          onClick={() => { router.push("/wishlist"); setShowProfileMenu(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 hover:text-green-700 transition-colors text-gray-600 text-sm font-medium"
                        >
                          <Heart size={18} /> Wishlist
                        </button>

                        {/* Logout */}
                        <button
                          onClick={() => { logout(); setShowProfileMenu(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50 text-sm font-medium"
                        >
                          <LogOut size={18} /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 📱 Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg absolute w-full left-0 top-20 z-40">
          <div className="flex flex-col px-6 py-4 gap-4 text-base font-medium text-gray-700">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
             <Link href="/aboutUs" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link href="/plants" onClick={() => setIsMobileMenuOpen(false)}>Plants</Link>

            <hr className="border-gray-100 my-2" />

            {isAuthLoading ? (
               // Mobile skeleton
               <div className="flex items-center justify-between animate-pulse">
                 <div className="h-6 w-24 bg-gray-200 rounded"></div>
                 <div className="h-6 w-16 bg-gray-200 rounded"></div>
               </div>
            ) : !user ? (
              <div className="flex flex-col gap-3">
                <Link href="/login" className="text-center py-2 text-green-600 border border-green-600 rounded-full" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                <Link href="/signup" className="text-center py-2 bg-green-600 text-white rounded-full" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-green-700 bg-green-50 p-3 rounded-xl">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-200 font-bold rounded-full">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold">{user.name}</span>
                </div>
                
                <Link href="/profile" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                  <User size={18} /> Profile
                </Link>
                <Link href="/orders" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                  <Package size={18} /> My Orders
                </Link>
                <Link href="/wishlist" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                  <Heart size={18} /> Wishlist
                </Link>
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 text-red-500 mt-2">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}