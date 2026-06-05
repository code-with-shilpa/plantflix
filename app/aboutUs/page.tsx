import Link from 'next/link';
import React from 'react';

export const metadata = {
    title: 'Our Story | Plantflix',
    description: 'Learn how Plantflix is bringing nature into every home.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#FAFAFA] text-[#333333] font-sans overflow-x-hidden selection:bg-[#26473E] selection:text-white">

            {/* 1. HERO SECTION */}
            <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=2000&auto=format&fit=crop"
                        className="w-full h-full object-cover"
                        alt="Beautiful indoor plant collection"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-3xl mx-auto animate-fade-in-up">
                    <p className="text-[#A3B899] uppercase tracking-[0.3em] text-xs font-bold mb-6">
                        The Plantflix Story
                    </p>
                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif text-white leading-[1.1] mb-6">
                        Rooted in <span className="italic font-light">Nature</span>
                    </h1>
                </div>
            </section>

            {/* 2. MISSION STATEMENT */}
            <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 lg:px-12 bg-[#FAFAFA]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#26473E] leading-tight">
                            We believe every space deserves to breathe.
                        </h2>
                        <div className="w-16 h-[1px] bg-[#26473E]"></div>
                        <p className="text-lg text-gray-600 font-light leading-relaxed">
                            Plantflix started with a simple idea: bringing high-quality, sustainably sourced plants to people who love them, without the hassle. We know that adding a touch of green transforms a house into a home, purifies the air, and brings a sense of calm to our fast-paced lives.
                        </p>
                        <p className="text-lg text-gray-600 font-light leading-relaxed">
                            Whether you are a seasoned botanist or just looking for your very first low-maintenance pothos, our curation process ensures that only the healthiest, most vibrant plants make it from our greenhouse to your doorstep.
                        </p>
                    </div>

                    <div className="relative h-[500px] lg:h-[700px] w-full">
                        <img
                            src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1200&auto=format&fit=crop"
                            alt="Gardener caring for plants"
                            className="absolute inset-0 w-full h-full object-cover rounded-sm shadow-2xl"

                        />
                        {/* Decorative block */}
                        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-[#E5F0E1] -z-10 hidden md:block"></div>
                    </div>
                </div>
            </section>


            {/* 3. CORE VALUES / THREE PILLARS */}
            <section className="py-24 bg-[#26473E] text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl md:text-5xl font-serif mb-4">Our Promise</h3>
                        <p className="text-[#A3B899] uppercase tracking-[0.2em] text-xs font-bold">What drives us every day</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                        {/* Value 1 */}
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-full border border-[#A3B899] flex items-center justify-center mx-auto md:mx-0 mb-6 text-[#A3B899]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h4 className="text-xl font-serif tracking-wide">Premium Quality</h4>
                            <p className="text-white/70 font-light leading-relaxed">
                                Every plant is hand-selected and inspected by our horticultural experts before it ever goes into a box.
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-full border border-[#A3B899] flex items-center justify-center mx-auto md:mx-0 mb-6 text-[#A3B899]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h4 className="text-xl font-serif tracking-wide">Eco-Conscious</h4>
                            <p className="text-white/70 font-light leading-relaxed">
                                From biodegradable nursery pots to carbon-neutral shipping, we protect the earth we draw inspiration from.
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-full border border-[#A3B899] flex items-center justify-center mx-auto md:mx-0 mb-6 text-[#A3B899]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514"></path>
                                </svg>
                            </div>
                            <h4 className="text-xl font-serif tracking-wide">Guaranteed Health</h4>
                            <p className="text-white/70 font-light leading-relaxed">
                                If your plant arrives damaged or sick, our 14-day guarantee means we'll replace it instantly, no questions asked.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. CTA / BOTTOM BANNER */}
            <section className="py-24 md:py-32 bg-white text-center px-6">
                <div className="max-w-3xl mx-auto flex flex-col items-center">
                    <h2 className="text-4xl md:text-6xl font-serif text-[#26473E] mb-8">
                        Ready to grow your sanctuary?
                    </h2>
                    <p className="text-gray-500 mb-10 font-light text-lg">
                        Explore our curated collection of indoor plants, pots, and accessories.
                    </p>
                    <Link
                        href="/plants"
                        className="bg-[#26473E] text-white px-12 py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#1a302a] transition-all duration-300 shadow-xl"
                    >
                        Shop The Collection
                    </Link>
                </div>
            </section>

        </main>
    );
}