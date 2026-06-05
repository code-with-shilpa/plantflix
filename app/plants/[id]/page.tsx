"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { databases, storage } from "@/lib/appwrite"
import { useCartStore } from "@/store/cartStore"
import toast from "react-hot-toast"
import ProtectedRoute from "@/routes/protectedRoutes"

type Plant = {
  $id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
}

export default function PlantDetails() {
  const { id } = useParams()

  const [plant, setPlant] = useState<Plant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const addToCart = useCartStore((state: any) => state.addToCart)

  useEffect(() => {
    if (id) getPlant()
  }, [id])

  const getPlant = async () => {
    setLoading(true)
    try {
      const res = await databases.getDocument(
        "69b11e5e0012e2704738",
        "plants",
        id as string
      )
      setPlant(res as unknown as Plant)
    } catch (err) {
      console.error(err)
      setError("Specimen not found.")
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (fileId: string) =>
    storage.getFileView("69b12061003585dc85b3", fileId).toString()

  const handleAddToCart = () => {
    if (!plant) return

    addToCart({
      id: plant.$id,
      name: plant.name,
      price: plant.price,
      image: plant.image,
      quantity: 1,
    })
    
    toast.success(`${plant.name} added to cart`, {
      position: "top-center",
      duration: 2000,
      style: { 
        background: "#0A1C12", 
        color: "#fff", 
        borderRadius: "100px",
        padding: "14px 28px",
        fontSize: "14px",
        fontWeight: "600",
        boxShadow: "0 20px 40px -10px rgba(10, 28, 18, 0.3)",
        border: "1px solid rgba(255,255,255,0.1)"
      },
      iconTheme: {
        primary: '#4ADE80',
        secondary: '#0A1C12',
      },
    })
  }

  if (loading) {
    return (
      <div className="bg-[#F4F6F4] min-h-screen pt-32 pb-12 px-6 lg:px-12 flex items-start justify-center">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="h-[60vh] lg:h-[80vh] w-full bg-gradient-to-tr from-gray-200 to-gray-100 animate-pulse rounded-[3rem]" />
          <div className="flex flex-col justify-center space-y-6 pt-12">
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-full" />
            <div className="h-16 w-3/4 bg-gray-200 animate-pulse rounded-2xl" />
            <div className="h-10 w-40 bg-gray-200 animate-pulse rounded-full" />
            <div className="h-32 w-full bg-gray-100 animate-pulse rounded-3xl mt-8" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !plant) {
    return (
      <div className="bg-[#F4F6F4] min-h-screen pt-32 flex items-start justify-center p-6">
        <div className="py-24 px-8 flex flex-col items-center justify-center text-center bg-white/40 rounded-[3rem] border border-white backdrop-blur-sm shadow-xl max-w-2xl w-full">
          <span className="text-7xl block mb-6 opacity-50 filter grayscale">🥀</span>
          <h3 className="text-4xl font-extrabold text-[#0A1C12] mb-4 tracking-tight">{error || "Plant not found"}</h3>
          <p className="text-gray-500 text-lg mb-10">We couldn't locate this specific botanical specimen in our greenhouse.</p>
          <Link href="/" className="px-10 py-5 bg-[#0A1C12] text-white font-bold rounded-full hover:bg-[#1a3a26] transition-all shadow-xl hover:scale-105">
            Return to Collection
          </Link>
        </div>
      </div>
    )
  }

  const imageUrl = getImageUrl(plant.image)
  const isOutOfStock = plant.stock === 0

  return (
    <ProtectedRoute>
      <div className="bg-[#F4F6F4] min-h-screen relative selection:bg-green-200 selection:text-green-900 pt-32 pb-32">
      
      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02] mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0A1C12] font-bold text-sm tracking-widest uppercase transition-colors mb-10 group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Collection
        </Link>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* LEFT: STICKY IMAGE */}
          <div className="lg:col-span-5 xl:col-span-6 lg:sticky lg:top-32">
            <div className="relative group w-full aspect-[4/5] lg:aspect-auto lg:h-[66vh] rounded-[3rem] overflow-hidden bg-white shadow-2xl shadow-[#0A1C12]/5 border border-white">
              <img
                src={imageUrl}
                alt={plant.name}
                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="absolute top-6 left-6">
                <span className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full text-xs font-bold text-[#0A1C12] uppercase tracking-widest shadow-lg">
                  {plant.category}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTENT SCROLL */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center pt-4 lg:pt-8">
            
            {/* Header & Pricing */}
            <div className="mb-10">
              <h1 className="text-5xl lg:text-5xl font-extrabold text-[#0A1C12] tracking-tighter leading-[1.1] mb-6">
                {plant.name}
              </h1>
              <div className="flex items-center gap-6">
                <p className="text-4xl font-black text-[#0A1C12]">
                  ₹{plant.price}
                </p>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide ${isOutOfStock ? 'bg-red-50 text-red-600' : 'bg-green-100 text-green-800'}`}>
                  {isOutOfStock ? 'Sold Out' : `${plant.stock} Available`}
                </div>
              </div>
            </div>

            {/* Main Description */}
            <div className="prose prose-lg text-gray-600 font-light leading-relaxed mb-12">
              <p className="text-xl lg:text-2xl text-[#0A1C12] font-medium leading-snug mb-6">
                A stunning living sculpture designed to breathe life and elegance into your interior spaces.
              </p>
              <p>
                {plant.description}
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">☀️</div>
                <h4 className="font-bold text-[#0A1C12] text-lg mb-1">Lighting</h4>
                <p className="text-gray-500 text-sm font-medium">Thrives in bright, indirect sunlight.</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">💧</div>
                <h4 className="font-bold text-[#0A1C12] text-lg mb-1">Watering</h4>
                <p className="text-gray-500 text-sm font-medium">Water every 1-2 weeks. Allow soil to dry.</p>
              </div>
            </div>

            {/* Add to Cart Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-[2] py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl flex items-center justify-center gap-3
                  ${isOutOfStock 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none' 
                    : 'bg-[#0A1C12] text-white hover:bg-[#1a3a26] hover:shadow-[#0A1C12]/20 hover:-translate-y-1 active:translate-y-0'
                  }`}
              >
                {isOutOfStock ? (
                  "Currently Unavailable"
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>

              <button className="flex-1 border-2 border-gray-200 text-[#0A1C12] py-5 px-8 rounded-2xl font-bold text-lg hover:border-[#0A1C12] hover:bg-gray-50 transition-all duration-300 text-center">
                Ask Expert
              </button>
            </div>

            {/* --- NEW EDITORIAL TEXT SECTIONS --- */}
            
            <div className="space-y-10 border-t border-gray-200 pt-12">
              
              {/* Botanical Details */}
              <section>
                <h3 className="text-2xl font-extrabold text-[#0A1C12] mb-4">Botanical Profile</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Carefully cultivated in our climate-controlled greenhouses, this specimen represents the highest tier of indoor foliage. Its unique leaf structure has evolved to maximize photosynthesis in dappled light, making it exceptionally resilient in modern home environments.
                </p>
              </section>

              {/* Detailed Care Guide */}
              <section>
                <h3 className="text-2xl font-extrabold text-[#0A1C12] mb-4">The Studio Care Guide</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold text-sm">1</span>
                    <div>
                      <h4 className="font-bold text-[#0A1C12]">Environment</h4>
                      <p className="text-gray-600 text-sm font-light mt-1">Keep away from direct cold drafts or AC units. A stable room temperature between 18°C and 25°C is ideal.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold text-sm">2</span>
                    <div>
                      <h4 className="font-bold text-[#0A1C12]">Soil & Nutrition</h4>
                      <p className="text-gray-600 text-sm font-light mt-1">Planted in our signature well-draining aroid mix. Feed with a balanced liquid fertilizer once a month during spring and summer.</p>
                    </div>
                  </li>
                </ul>
              </section>

              {/* Shipping Guarantee */}
              <section className="bg-[#0A1C12] text-white p-8 rounded-[2rem] shadow-xl mt-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
                  <span className="text-9xl">🌿</span>
                </div>
                <h3 className="text-2xl font-extrabold mb-3 relative z-10">Our Pristine Promise</h3>
                <p className="text-gray-300 font-light leading-relaxed relative z-10 mb-6 text-sm">
                  Every plant is hand-selected and undergoes a rigorous health inspection before departing our nursery. We utilize custom-engineered thermal packaging to ensure your new botanical companion arrives in perfect, vibrant condition.
                </p>
                <div className="flex items-center gap-6 text-sm font-bold text-emerald-400 relative z-10">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Climate-Safe Transit
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    30-Day Guarantee
                  </div>
                </div>
              </section>

            </div>

          </div>
        </div>
      </div>
    </div>

    </ProtectedRoute>
    
  )
}