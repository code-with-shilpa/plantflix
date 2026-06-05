"use client"
import { useEffect, useState } from "react"
// Added `account` to your Appwrite imports
import { databases, account } from "@/lib/appwrite" 
import { Query } from "appwrite"
import Link from "next/link"
// Imported useRouter for redirecting after logout
import { useRouter } from "next/navigation" 
import {
  Package,
  IndianRupee,
  Truck,
  CheckCircle,
  LayoutDashboard,
  Leaf,
  ShoppingCart,
  LogOut
} from "lucide-react"

const DATABASE_ID = "69b11e5e0012e2704738"
const ORDERS_COLLECTION_ID = "orders"

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter() // Initialize Next.js router

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        [Query.orderDesc("$createdAt")]
      )
      setOrders(response.documents)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Handle Logout Function
  const handleLogout = async () => {
    try {
      // Deletes the current Appwrite session
      await account.deleteSession("current") 
      // Redirect to your login page
      router.push("/login") 
    } catch (error) {
      console.error("Logout failed:", error)
      alert("Failed to log out. Please try again.")
    }
  }

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  )

  const processingOrders = orders.filter(
    (order) => order.status === "Processing"
  ).length

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading Dashboard...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ---------------- NAVIGATION DRAWER (SIDEBAR) ---------------- */}
      <aside className="w-64 bg-white shadow-xl fixed h-full z-10 flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="bg-green-100 p-2 rounded-xl text-green-600">
            <Leaf size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">PlantFlix Admin</h2>
        </div>

        {/* Menu Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {/* Dashboard Link (Active State Example) */}
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 p-3 rounded-xl bg-green-50 text-green-700 font-semibold transition-colors"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          {/* Plant Page Link */}
          <Link
            href="/admin/plants"
            className="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-colors font-medium"
          >
            <Leaf size={20} />
            Manage Plants
          </Link>

          {/* Orders Page Link */}
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-colors font-medium"
          >
            <ShoppingCart size={20} />
            Orders
          </Link>
        </nav>

        {/* ---------------- LOGOUT SECTION ---------------- */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

      </aside>

      {/* ---------------- MAIN CONTENT AREA ---------------- */}
      {/* Note the `ml-64` class here to offset the width of the fixed sidebar */}
      <main className="flex-1 ml-64 p-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-8 text-white mb-8 shadow-md mt-15">
            <h1 className="text-4xl font-bold">
              PlantFlix Dashboard 🌿
            </h1>
            <p className="mt-2 text-green-100 text-lg">
              Monitor orders, manage plants, and track revenue.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
              <div className="bg-green-50 w-12 h-12 flex items-center justify-center rounded-2xl mb-4">
                <Package className="text-green-600" size={24} />
              </div>
              <p className="text-gray-500 font-medium">Total Orders</p>
              <h2 className="text-3xl font-bold mt-1 text-gray-800">{orders.length}</h2>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
              <div className="bg-emerald-50 w-12 h-12 flex items-center justify-center rounded-2xl mb-4">
                <IndianRupee className="text-emerald-600" size={24} />
              </div>
              <p className="text-gray-500 font-medium">Revenue</p>
              <h2 className="text-3xl font-bold mt-1 text-gray-800">₹{totalRevenue.toLocaleString()}</h2>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
              <div className="bg-yellow-50 w-12 h-12 flex items-center justify-center rounded-2xl mb-4">
                <Truck className="text-yellow-600" size={24} />
              </div>
              <p className="text-gray-500 font-medium">Processing</p>
              <h2 className="text-3xl font-bold mt-1 text-gray-800">{processingOrders}</h2>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
              <div className="bg-green-50 w-12 h-12 flex items-center justify-center rounded-2xl mb-4">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <p className="text-gray-500 font-medium">Delivered</p>
              <h2 className="text-3xl font-bold mt-1 text-gray-800">{deliveredOrders}</h2>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-50 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
              <Link href="/admin/orders" className="text-green-600 hover:text-green-700 font-medium text-sm">
                View All →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                    <th className="py-4 font-semibold">Customer</th>
                    <th className="py-4 font-semibold">Total</th>
                    <th className="py-4 font-semibold">Status</th>
                    <th className="py-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.$id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 font-medium text-gray-800">{order.name}</td>
                      <td className="py-4 font-medium">₹{order.total}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-500 text-sm">
                        {new Date(order.$createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}