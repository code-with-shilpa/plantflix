"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { account, databases } from "@/lib/appwrite"
import { Query } from "appwrite"
import toast from "react-hot-toast"

const DATABASE_ID = "69b11e5e0012e2704738"
const ORDERS_COLLECTION_ID = "orders"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const user = await account.get()

      const response = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        [
          Query.equal("userId", user.$id),
          Query.orderDesc("$createdAt") // Show newest orders first
        ]
      )

      setOrders(response.documents)
      // Small timeout to allow the smooth entrance animation to play
      setTimeout(() => setIsLoaded(true), 100)
    } catch (error) {
      console.error(error)
      toast.error("Failed to load your archive.", {
        style: { background: "#0A1C12", color: "#fff", borderRadius: "100px" }
      })
    } finally {
      setLoading(false)
    }
  }

  // Premium Date Formatter
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Status Badge Styling Helper
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">{status}</span>
          </div>
        )
      case "shipped":
        return (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">{status}</span>
          </div>
        )
      default: // Processing, Pending, etc.
        return (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">{status || 'Processing'}</span>
          </div>
        )
    }
  }

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F4] pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="h-12 w-64 bg-gray-200 animate-pulse rounded-full mb-4" />
          <div className="h-6 w-96 bg-gray-200 animate-pulse rounded-full mb-12" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[2rem] p-8 h-64 animate-pulse shadow-sm" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F6F4] pt-32 pb-32 relative selection:bg-green-200 selection:text-green-900 overflow-hidden">
      
      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02] mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className={`mb-12 transition-all duration-700 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#0A1C12] font-bold text-xs tracking-[0.2em] uppercase transition-colors mb-8 group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Return to Store
          </Link>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0A1C12] tracking-tighter mb-4">
            Botanical Archive
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-xl leading-relaxed">
            Review your past acquisitions, track the journey of your new greenery, and manage your greenhouse collection.
          </p>
        </div>

        {/* --- EMPTY STATE --- */}
        {orders.length === 0 ? (
          <div className={`bg-white rounded-[3rem] p-12 lg:p-20 text-center shadow-xl shadow-[#0A1C12]/5 border border-white transition-all duration-700 delay-200 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-7xl block mb-6 filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default">
              🌿
            </span>
            <h2 className="text-3xl font-extrabold text-[#0A1C12] mb-4 tracking-tight">
              Your archive is empty
            </h2>
            <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto font-light">
              You haven't made any botanical acquisitions yet. Explore our curated collection to find your perfect specimen.
            </p>
            <Link href="/" className="inline-flex items-center gap-3 bg-[#0A1C12] text-white px-8 py-4 rounded-full font-bold hover:bg-[#133021] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0A1C12]/20 transition-all duration-300">
              Explore Collection
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        ) : (
          
          /* --- ORDERS LIST --- */
          <div className="space-y-8">
            {orders.map((order, index) => {
              // Parse items safely
              let items = []
              try { items = JSON.parse(order.items) } catch (e) { console.error("Failed to parse items", e) }

              return (
                <div
                  key={order.$id}
                  className={`bg-white rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-gray-100 overflow-hidden group`}
                  style={{
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateY(0)' : 'translateY(2rem)',
                    transitionDelay: `${(index + 1) * 150}ms`
                  }}
                >
                  
                  {/* Card Header */}
                  <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                        Order No.
                      </p>
                      <h2 className="font-bold text-[#0A1C12] text-xl font-mono tracking-tight">
                        #{order.$id.slice(0, 8).toUpperCase()}
                      </h2>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      {getStatusBadge(order.status)}
                      <p className="text-sm text-gray-500 font-medium">
                        Placed on {formatDate(order.$createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Card Body - Items */}
                  <div className="px-8 py-6">
                    <h3 className="text-sm font-bold text-[#0A1C12] mb-4">Acquisitions ({items.length})</h3>
                    <div className="space-y-4">
                      {items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F6F4]/50 group-hover:bg-[#F4F6F4] transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl shadow-sm border border-gray-100">
                              🪴
                            </div>
                            <div>
                              <p className="font-bold text-[#0A1C12]">{item.name}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                            </div>
                          </div>
                          <p className="font-black text-[#0A1C12]">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-8 py-6 bg-[#0A1C12] text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-3 max-w-sm">
                      <svg className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Destination
                        </p>
                        <p className="text-sm text-gray-200 leading-relaxed">
                          {order.address}
                        </p>
                      </div>
                    </div>
                    
                    <div className="md:text-right border-t md:border-t-0 border-gray-700 pt-4 md:pt-0">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Total Investment
                      </p>
                      <p className="text-3xl font-black text-emerald-400">
                        ₹{order.total}
                      </p>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}