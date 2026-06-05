"use client"

import { useEffect, useState } from "react"
import { databases } from "@/lib/appwrite"
import { Query } from "appwrite"
import toast from "react-hot-toast"
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  User,
  Mail,
  MapPin,
} from "lucide-react"

const DATABASE_ID = "69b11e5e0012e2704738"
const ORDERS_COLLECTION_ID = "orders"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        [
          Query.orderDesc("$createdAt")
        ]
      )

      setOrders(response.documents)
    } catch (error) {
      console.error(error)
      toast.error("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (
    orderId: string,
    status: string
  ) => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        orderId,
        {
          status,
        }
      )

      toast.success(`Order marked as ${status}`)

      fetchOrders()
    } catch (error) {
      console.error(error)
      toast.error("Failed to update status")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading orders...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto pt-16">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-3xl p-8 mb-8">
          <h1 className="text-4xl font-bold">
            Order Management
          </h1>

          <p className="text-green-100 mt-2">
            Manage customer orders and deliveries
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <Package className="text-green-600 mb-2" />
            <p className="text-gray-500">Total Orders</p>
            <h2 className="text-3xl font-bold">
              {orders.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <Clock className="text-yellow-500 mb-2" />
            <p className="text-gray-500">Processing</p>
            <h2 className="text-3xl font-bold">
              {
                orders.filter(
                  (o) => o.status === "Processing"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <Truck className="text-blue-500 mb-2" />
            <p className="text-gray-500">Shipped</p>
            <h2 className="text-3xl font-bold">
              {
                orders.filter(
                  (o) => o.status === "Shipped"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <CheckCircle className="text-green-500 mb-2" />
            <p className="text-gray-500">Delivered</p>
            <h2 className="text-3xl font-bold">
              {
                orders.filter(
                  (o) => o.status === "Delivered"
                ).length
              }
            </h2>
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-6">

          {orders.map((order) => {
            const items = JSON.parse(order.items)

            return (
              <div
                key={order.$id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
              >
                {/* Top */}
                <div className="flex flex-col lg:flex-row justify-between gap-4">

                  <div>
                    <h2 className="font-bold text-xl">
                      Order #{order.$id.slice(0, 8)}
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(
                        order.$createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(
                          order.$id,
                          e.target.value
                        )
                      }
                      className="border rounded-xl px-4 py-2"
                    >
                      <option>
                        Processing
                      </option>

                      <option>
                        Shipped
                      </option>

                      <option>
                        Delivered
                      </option>
                    </select>
                  </div>
                </div>

                {/* Customer */}
                <div className="grid md:grid-cols-3 gap-5 mt-6">

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <User className="mb-2 text-green-600" />

                    <p className="text-sm text-gray-500">
                      Customer
                    </p>

                    <p className="font-semibold">
                      {order.name}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <Mail className="mb-2 text-green-600" />

                    <p className="text-sm text-gray-500">
                      Email
                    </p>

                    <p className="font-semibold break-all">
                      {order.email}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <MapPin className="mb-2 text-green-600" />

                    <p className="text-sm text-gray-500">
                      Address
                    </p>

                    <p className="font-semibold">
                      {order.address}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">
                    Ordered Plants
                  </h3>

                  <div className="space-y-3">
                    {items.map(
                      (item: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between border-b pb-3"
                        >
                          <div>
                            <p className="font-medium">
                              {item.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>

                          <p className="font-semibold">
                            ₹
                            {item.price *
                              item.quantity}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Revenue */}
                <div className="grid md:grid-cols-3 gap-4 mt-6">

                  <div className="bg-green-50 rounded-2xl p-4">
                    <p className="text-gray-500 text-sm">
                      Order Total
                    </p>

                    <p className="text-2xl font-bold text-green-700">
                      ₹{order.total}
                    </p>
                  </div>

                  <div className="bg-yellow-50 rounded-2xl p-4">
                    <p className="text-gray-500 text-sm">
                      Commission
                    </p>

                    <p className="text-2xl font-bold text-yellow-700">
                      ₹{order.commission}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-4">
                    <p className="text-gray-500 text-sm">
                      Nursery Revenue
                    </p>

                    <p className="text-2xl font-bold text-blue-700">
                      ₹{order.nurseryRevenue}
                    </p>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}