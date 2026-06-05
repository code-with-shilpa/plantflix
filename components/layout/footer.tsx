import React from 'react'

const Footer = () => {
    return (
        <>
            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 px-16 py-12">

                <div className="grid md:grid-cols-4 gap-10">

                    {/* Logo */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Plantflix
                        </h2>
                        <p className="text-sm">
                            Bringing nature closer to your home with beautiful plants from
                            trusted nurseries.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>Home</li>
                            <li>Plants</li>
                            <li>About</li>
                            <li>Contact</li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">Categories</h3>
                        <ul className="space-y-2">
                            <li>Indoor Plants</li>
                            <li>Outdoor Plants</li>
                            <li>Succulents</li>
                            <li>Medicinal Plants</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">Contact</h3>
                        <p>Email: support@plantflix.com</p>
                        <p>Phone: +91 9876543210</p>
                    </div>

                </div>

                <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
                    © 2026 Plantflix. All rights reserved.
                </div>

            </footer>
        </>
    )
}

export default Footer