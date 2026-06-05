"use client"

import Link from "next/link"
import toast from "react-hot-toast"
import { useCartStore } from "@/store/cartStore"
import { storage } from "@/lib/appwrite"
import { account } from "@/lib/appwrite"
import { useRouter } from "next/navigation"

type Plant = {
  $id?: string
  id?: string
  name: string
  price: number
  image?: string
  category?: string
}

export default function PlantCard({ plant }: { plant: Plant }) {
  const { addToCart } = useCartStore()
  const router = useRouter()

  const imageUrl = plant?.image
    ? storage.getFileView("69b12061003585dc85b3", plant.image).toString()
    : "/images/no-image.png"

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()

    try {
      await account.get()

      addToCart({
        id: plant.$id || plant.id || "",
        name: plant.name,
        price: plant.price,
        image: plant.image || "",
        quantity: 1,
      })

      toast.success(`${plant.name} added to cart`, {
        position: "top-center",
        duration: 2000,
        style: {
          background: "#111827",
          color: "#fff",
          borderRadius: "100px",
          padding: "12px 24px",
          fontSize: "14px",
          fontWeight: "500",
        },
      })
    } catch {
      toast.error("Please login first", {
        position: "top-center",
      })

      setTimeout(() => {
        router.push("/login")
      }, 1500)
    }

  }
  const handleDetails = async () => {
    try {
      await account.get()

      router.push(`/plants/${plant.$id || plant.id}`)
    } catch {
      toast.error("Please login to view details", {
        position: "top-center",
      })

      setTimeout(() => {
        router.push("/login")
      }, 1500)
    }
  }

  return (
    <div className="group flex flex-col bg-white rounded-[2rem] p-3 border border-gray-100 hover:shadow-[0_30px_50px_-12px_rgba(0,0,0,0.08)] transition-all duration-500">

      {/* IMAGE SECTION */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[1.6rem] bg-stone-50">
        <img
          src={imageUrl}
          alt={plant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />

        {/* Category Tag */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-emerald-800 uppercase tracking-tighter">
            {plant.category || "Indoor"}
          </span>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="px-2 pt-5 pb-2 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight leading-none mb-2">
              {plant.name}
            </h3>
            <div className="flex items-center gap-1">
              <span className="text-xs text-amber-500 font-bold">★ 4.9</span>
              <span className="text-xs text-gray-400 font-medium">(82 Reviews)</span>
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-950">₹{plant.price}</span>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleDetails}
            className="flex-1 flex items-center justify-center h-12 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Details
          </button>

          {/* Add Button */}
          <button
            onClick={handleAddToCart}
            className="flex-[1.5] flex items-center justify-center gap-2 bg-emerald-900 text-white h-12 rounded-xl text-sm font-bold shadow-md hover:bg-emerald-800 active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M12 5v14" />
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}