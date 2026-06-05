"use client";

import PlantCard from '@/components/plantCard';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

// --- DATA ---
type Plant = {
  $id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  stock?: number;   // Added to track availability
  season?: string;  // Added for seasonal filtering
};

const testimonials = [
  { id: 1, text: "The quality of the plants is unmatched. They arrived healthy and have transformed my living room into a sanctuary.", author: "Jennifer Lewis", avatar: "https://i.pravatar.cc/150?u=11" },
  { id: 2, text: "Customer service helped me pick the right low-light plants for my office. Truly a premium experience.", author: "Alicia Heart", avatar: "https://i.pravatar.cc/150?u=22" },
  { id: 3, text: "Fast delivery and beautiful packaging. It feels like receiving a gift every time I order from here.", author: "Juan Carlos", avatar: "https://i.pravatar.cc/150?u=33" }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [plants, setPlants] = useState<Plant[]>([]);

  // 1. FILTER STATES
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [seasonFilter, setSeasonFilter] = useState<string>("all");

  // Testimonial Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // 2. DYNAMIC FETCH WITH DEPENDENCIES
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        // Base queries
        const queryParams = [
          Query.orderDesc("$createdAt"),
          Query.limit(4)
        ];

        // Apply Stock Filter: assumes 'stock' attribute exists in Appwrite
        if (stockFilter === "in-stock") {
          queryParams.push(Query.greaterThan("stock", 0));
        }

        // Apply Season Filter: assumes 'season' attribute exists in Appwrite
        if (seasonFilter !== "all") {
          queryParams.push(Query.equal("season", seasonFilter));
        }

        const res = await databases.listDocuments(
          "69b11e5e0012e2704738",
          "plants",
          queryParams
        );

        console.log("HOME RESPONSE:", res);
       setPlants(res.documents as unknown as Plant[]);
      } catch (err) {
        console.error("HOME ERROR:", err);
      }
    };

    fetchPlants();
  }, [stockFilter, seasonFilter]); // Runs whenever filters change

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#333333] font-sans overflow-x-hidden selection:bg-[#26473E] selection:text-white">

      {/* 1. FULL WIDTH HERO BANNER */}
      <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1558603668-6570496b66f8?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
            alt="Beautiful lush indoor plants"
          />
          {/* Elegant Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
        </div>

        {/* Hero Content */}
      {/* Hero Content */}
        <div className="relative z-10 text-center px-6 w-full max-w-5xl mx-auto flex flex-col items-center justify-center h-full pt-12">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white leading-[1.1] mb-10 drop-shadow-lg animate-fade-in-up delay-100">
            Bring the <br />
            <span className="italic font-serif font-light text-[#E5F0E1]">Spring</span> Home
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto animate-fade-in-up delay-200">
            {/* Replaced <button> with Next.js <Link> */}
            <Link 
              href="/plants" 
              className="bg-white text-[#26473E] px-10 py-4 sm:px-12 sm:py-5 font-bold uppercase tracking-widest text-xs hover:bg-[#26473E] hover:text-white transition-all duration-300 w-full sm:w-auto shadow-xl text-center"
            >
              Shop Collection
            </Link>
            
            <Link 
              href="/aboutUs" 
              className="border border-white/50 backdrop-blur-sm text-white px-10 py-4 sm:px-12 sm:py-5 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-[#26473E] transition-all duration-300 w-full sm:w-auto text-center"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT GRID SECTION */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 lg:px-12 bg-[#FAFAFA]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div className="space-y-3">
            <h2 className="text-4xl md:text-6xl font-serif text-[#26473E]">New Arrivals</h2>
            <p className="text-gray-500 uppercase tracking-[0.2em] text-xs font-semibold">Hand-picked for your space</p>
          </div>
          <Link
            href="/plants"
            className="text-xs font-bold uppercase tracking-[0.15em] border-b border-[#26473E] pb-1 hover:opacity-50 transition-all text-[#26473E]"
          >
            View All Products
          </Link>
        </div>

        {/* 3. FILTER UI CONTROLS */}
        <div className="flex flex-wrap gap-4 mb-10 pb-6 border-b border-gray-200">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Availability</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="bg-white border border-gray-300 text-[#26473E] text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-none appearance-none cursor-pointer focus:outline-none focus:border-[#26473E] min-w-[160px]"
            >
              <option value="all">All Items</option>
              <option value="in-stock">In Stock</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Season</label>
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="bg-white border border-gray-300 text-[#26473E] text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-none appearance-none cursor-pointer focus:outline-none focus:border-[#26473E] min-w-[160px]"
            >
              <option value="all">All Seasons</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="autumn">Autumn</option>
              <option value="winter">Winter</option>
            </select>
          </div>
        </div>

        {/* Dynamic Items Renderer */}
        {plants.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-light italic">
            No plants found matching these filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {plants.map((plant) => (
              <PlantCard key={plant.$id} plant={plant} />
            ))}
          </div>
        )}
      </section>

      {/* 4. MODERN STORY SECTION */}
      <section className="py-0 overflow-hidden bg-[#26473E]">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 h-[500px] lg:h-auto relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1604762524889-3e2fcc145683?q=80&w=1200&auto=format&fit=crop"
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
              alt="Woman holding a monstera plant"
              loading="lazy"
            />
          </div>
          <div className="w-full lg:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col justify-center items-start space-y-8 bg-[#26473E]">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white leading-[1.1]">
              For People Who <br /> <span className="text-[#A3B899] italic font-light">Love Plants</span>
            </h2>
            <p className="text-white/80 leading-relaxed text-lg font-light max-w-md">
              We believe every home deserves a touch of nature. Our curated selection of indoor plants is designed to improve air quality and aesthetic harmony in your living space. Elevate your everyday.
            </p>
            <button className="bg-[#A3B899] text-[#26473E] px-10 py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all duration-300 shadow-lg mt-4">
              Discover More
            </button>
          </div>
        </div>
      </section>

      {/* 5. MINIMAL TESTIMONIALS */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-10 gap-1">
            {[1, 2, 3, 4, 5].map(s => (
              <svg key={s} className="w-5 h-5 text-[#A3B899]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          <div className="relative min-h-[300px] sm:min-h-[220px]">
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out
                  ${i === currentSlide ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 pointer-events-none z-0'}
                `}
              >
                <p className="text-2xl md:text-4xl font-serif italic text-[#26473E] mb-10 leading-snug px-4">
                  "{t.text}"
                </p>
                <div className="flex items-center justify-center gap-5">
                  <img src={t.avatar} className="w-14 h-14 rounded-full grayscale border border-gray-200" alt={t.author} />
                  <div className="text-left">
                    <h4 className="font-bold text-[#26473E] text-sm uppercase tracking-widest mb-1">{t.author}</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-12 md:mt-16">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-[3px] transition-all duration-500 rounded-full ${i === currentSlide ? 'bg-[#26473E] w-12' : 'bg-gray-200 w-6 hover:bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Global Styles for Fonts and Animations */}
      
    </main>
  );
}