"use client"

import { useEffect, useState } from "react"
import { databases } from "@/lib/appwrite"
import { Query } from "appwrite"
import PlantCard from "@/components/plantCard"
import ProtectedRoute from "@/routes/protectedRoutes"

type Plant = {
  $id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  season?: string
  inStock?: boolean
}

const CATEGORIES = [
  { name: "All", icon: "🌿" },
  { name: "Indoor", icon: "🪴" },
  { name: "Outdoor", icon: "🌳" },
  { name: "Succulent", icon: "🌵" },
  { name: "Flowering", icon: "🌸" }
]

const SEASONS = ["All", "Spring", "Summer", "Monsoon", "Winter"]
const PRICE_RANGES = ["All Prices", "Under ₹500", "₹500 - ₹1000", "Over ₹1000"]

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [page, setPage] = useState(1)
  
  // Search & Filter States
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [season, setSeason] = useState("All")
  const [priceFilter, setPriceFilter] = useState("All Prices")
  const [inStockOnly, setInStockOnly] = useState(false)
  
  // UI Dropdown Toggle State
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const limit = 9

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch plants
  useEffect(() => {
    getPlants()
  }, [page, debouncedSearch, category, season, priceFilter, inStockOnly])

  const getPlants = async () => {
    setLoading(true)
    try {
      const queries: any = [
        Query.limit(limit),
        Query.offset((page - 1) * limit),
      ]

      if (debouncedSearch) {
        queries.push(Query.contains("name", debouncedSearch))
      }

      if (category !== "All") {
        queries.push(Query.equal("category", category))
      }

      if (season !== "All") {
        queries.push(Query.equal("season", season))
      }

      if (inStockOnly) {
       queries.push(Query.greaterThan("stock", 0))
      }

      if (priceFilter === "Under ₹500") {
        queries.push(Query.lessThanEqual("price", 500))
      } else if (priceFilter === "₹500 - ₹1000") {
        queries.push(Query.between("price", 500, 1000))
      } else if (priceFilter === "Over ₹1000") {
        queries.push(Query.greaterThan("price", 1000))
      }

      const res = await databases.listDocuments(
        "69b11e5e0012e2704738",
        "plants",
        queries
      )

      setPlants(res.documents as unknown as Plant[]);
    } catch (err) {
      console.error("Error fetching plants:", err)
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setSearch("")
    setCategory("All")
    setSeason("All")
    setPriceFilter("All Prices")
    setInStockOnly(false)
    setPage(1)
  }

  return (
    <ProtectedRoute>
      <div className="bg-[#F9FAF9] min-h-screen pb-0 font-sans text-gray-900 overflow-x-hidden relative">
        
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-200/30 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>
        <div className="absolute top-[20%] right-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px] translate-x-1/3 pointer-events-none z-0"></div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-16 lg:pt-24 lg:pb-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white shadow-sm border border-gray-100 text-sm font-semibold text-green-700 uppercase tracking-widest">
                <span className="text-xl">✨</span> Spring Collection '26
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-[#11281A] tracking-tight leading-[1.15]">
                Breathe Life <br className="hidden lg:block"/>
                Into Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">Space.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Transform your home into a lush sanctuary with our hand-selected, premium botanical collection. 
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
                <button 
                  onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
                  className="px-8 py-4 bg-[#11281A] hover:bg-green-800 text-white rounded-full text-lg font-medium shadow-xl shadow-green-900/20 transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
                >
                  Shop Collection
                </button>
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="flex -space-x-3">
                    <img className="w-10 h-10 rounded-full border-2 border-white object-cover"src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80" alt="user" />
                    <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" alt="user" />
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-xs font-bold text-green-800">+2k</div>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Happy<br/>Plant Parents</div>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full relative">
              <div className="relative h-[450px] lg:h-[600px] w-full lg:w-[90%] ml-auto rounded-[2.5rem] overflow-hidden shadow-2xl shadow-green-900/15 group">
                <img 
                  src="https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=2070&auto=format&fit=crop" 
                  alt="Minimalist Potted Plant"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Features Strip */}
        <div className="border-y border-gray-200/60 bg-white/50 backdrop-blur-sm relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-gray-200/60">
              <div className="px-4">
                <span className="text-2xl mb-2 block">🚚</span>
                <h4 className="font-semibold text-gray-900 text-sm">Free Delivery</h4>
                <p className="text-xs text-gray-500 mt-1">On orders above ₹999</p>
              </div>
              <div className="px-4">
                <span className="text-2xl mb-2 block">🌱</span>
                <h4 className="font-semibold text-gray-900 text-sm">Healthy Plants</h4>
                <p className="text-xs text-gray-500 mt-1">Guaranteed to thrive</p>
              </div>
              <div className="px-4">
                <span className="text-2xl mb-2 block">📖</span>
                <h4 className="font-semibold text-gray-900 text-sm">Care Guides</h4>
                <p className="text-xs text-gray-500 mt-1">Included with every order</p>
              </div>
              <div className="px-4">
                <span className="text-2xl mb-2 block">🛡️</span>
                <h4 className="font-semibold text-gray-900 text-sm">Secure Payment</h4>
                <p className="text-xs text-gray-500 mt-1">100% safe checkout</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Filters and Layout Section */}
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10 flex flex-col lg:flex-row gap-8 xl:gap-12">
          
          {/* Left Sidebar */}
          <aside className="w-full lg:w-[310px] flex-shrink-0">
            <div className="bg-white p-6 rounded-[2rem] shadow-lg shadow-gray-200/50 border border-gray-100 lg:sticky lg:top-24 flex flex-col gap-7">
              
              {/* Search Bar */}
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search specific plants..."
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none transition-all text-sm font-medium text-gray-700"
                />
              </div>

              {/* Dynamic Dropdown Filter (Categories) */}
              <div className="space-y-2 relative">
                <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                  </svg>
                  Category
                </h3>
                
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3.5 hover:bg-gray-100/40 transition-all focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">
                      {CATEGORIES.find((c) => c.name === category)?.icon || "🌿"}
                    </span>
                    <span className="font-semibold text-gray-800">{category}</span>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180 text-green-600" : ""}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {categoryDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setCategoryDropdownOpen(false)} />
                    <div className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-green-950/5 overflow-hidden z-20 divide-y divide-gray-50">
                      {CATEGORIES.map((cat) => {
                        const isActive = category === cat.name;
                        return (
                          <button
                            key={cat.name}
                            type="button"
                            onClick={() => {
                              setCategory(cat.name);
                              setPage(1);
                              setCategoryDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                              isActive 
                                ? "bg-green-50/60 text-green-900 font-bold" 
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <span className="text-lg">{cat.icon}</span>
                            <span>{cat.name}</span>
                            {isActive && (
                              <svg className="w-4 h-4 text-green-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <hr className="border-gray-100" />

              {/* Advanced Controls Layout */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  Filters
                </h3>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Season</label>
                  <select
                    value={season}
                    onChange={(e) => { setSeason(e.target.value); setPage(1); }}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 focus:ring-green-500 focus:border-green-500 outline-none"
                  >
                    {SEASONS.map((s) => (
                      <option key={s} value={s}>{s === "All" ? "Any Season" : s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Price Range</label>
                  <select
                    value={priceFilter}
                    onChange={(e) => { setPriceFilter(e.target.value); setPage(1); }}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 focus:ring-green-500 focus:border-green-500 outline-none"
                  >
                    {PRICE_RANGES.map((price) => (
                      <option key={price} value={price}>{price}</option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center justify-between cursor-pointer bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl mt-4">
                  <div className="text-sm font-semibold text-gray-700">In Stock Only</div>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={inStockOnly}
                      onChange={(e) => { setInStockOnly(e.target.checked); setPage(1); }}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${inStockOnly ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${inStockOnly ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </label>
              </div>

              {(search || category !== "All" || season !== "All" || priceFilter !== "All Prices" || inStockOnly) && (
                <button 
                  onClick={resetFilters}
                  className="w-full py-3 mt-2 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>
          
          {/* Main Plant Grid View */}
          <div className="flex-1 min-h-[50vh]">
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10 xl:gap-y-12">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-80 bg-gray-200/50 animate-pulse rounded-[2rem]" />
                    <div className="h-6 bg-gray-200/50 animate-pulse rounded-md w-2/3 mx-auto" />
                    <div className="h-5 bg-gray-200/50 animate-pulse rounded-md w-1/3 mx-auto" />
                  </div>
                ))}
              </div>
            )}

            {!loading && plants.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center text-center bg-white/50 rounded-[3rem] border border-gray-200/50 backdrop-blur-sm h-full">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-6xl block opacity-50">🪴</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-3">No green friends found</h3>
                <p className="text-gray-500 text-lg max-w-md">Try adjusting your search or modifying your filters to see more results.</p>
                <button 
                  onClick={resetFilters}
                  className="mt-8 px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-full hover:border-[#11281A] hover:text-[#11281A] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10 xl:gap-y-12">
                {plants.map((plant) => (
                  <div key={plant.$id} className="group cursor-pointer">
                    <PlantCard plant={plant} />
                  </div>
                ))}
              </div>
            )}

            {!loading && plants.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-16 pt-8 border-t border-gray-200/60">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  className="px-6 py-3 flex items-center gap-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-[#11281A] hover:text-white hover:border-[#11281A] transition-all disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-200 shadow-sm font-semibold text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Previous
                </button>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#11281A] text-white font-bold shadow-md shadow-green-900/20">
                  {page}
                </div>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={plants.length < limit}
                  className="px-6 py-3 flex items-center gap-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-[#11281A] hover:text-white hover:border-[#11281A] transition-all disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-200 shadow-sm font-semibold text-sm"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Promo Banner Footer */}
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className="bg-gradient-to-br from-[#11281A] to-[#1c462c] rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl relative">
            <div className="p-12 lg:p-20 flex-1 text-white space-y-6 relative z-10 flex flex-col justify-center">
              <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur border border-white/20 text-white rounded-full text-xs font-bold tracking-widest uppercase">
                Plant Care 101
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Ready to watch <br/> them thrive?
              </h2>
              <p className="text-green-100/80 text-lg max-w-md font-light leading-relaxed">
                Every order comes with a detailed digital care handbook. Learn the secrets to perfect lighting, watering, and repotting.
              </p>
              <div className="pt-4">
                <button className="bg-white text-[#11281A] px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform duration-300 shadow-lg shadow-black/20">
                  Explore Care Guides
                </button>
              </div>
            </div>
            <div className="w-full lg:w-5/12 min-h-[300px] lg:min-h-[500px] relative">
              <img 
                src="https://cdn.shopify.com/s/files/1/1380/2059/files/Optimized-Change_is_not_good-Plant_Care_480x480.jpg?v=1606981098"
                alt="Plant care" 
                className="absolute inset-0 w-full h-full object-cover rounded-tl-[4rem] lg:rounded-tl-[6rem] lg:rounded-bl-[0rem]"
              />
            </div>
          </div>
        </div>

      </div>
    </ProtectedRoute>
  )
}