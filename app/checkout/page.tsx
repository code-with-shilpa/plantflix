"use client"

import { useState } from "react"
import { useCartStore } from "@/store/cartStore"
import { databases, account, storage } from "@/lib/appwrite" // ✅ Added storage import
import { ID } from "appwrite"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Image from "next/image"

const DATABASE_ID = "69b11e5e0012e2704738"
const ORDERS_COLLECTION_ID = "orders"

type CheckoutFormData = {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  paymentMethod: string
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>()

  // total calculation
  const total = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  )

  // shipping charge
  const shipping = total > 999 ? 0 : 80

  // final total
  const finalTotal = total + shipping

  // place order
  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setLoading(true)

      // logged in user
      const user = await account.get()

      // commission
      const commission = Math.floor(total * 0.1)

      // nursery revenue
      const nurseryRevenue = total - commission

      // create order
      await databases.createDocument(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          paymentMethod: data.paymentMethod,
          total: finalTotal,
          commission,
          nurseryRevenue,
          status: "Processing",
          items: JSON.stringify(cart),
        }
      )

      clearCart()
      toast.success("Order placed successfully")
      router.push("/success")
    } catch (error) {
      console.error(error)
      toast.error("Failed to place order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* HERO BANNER SECTION */}
      <div className="relative w-full h-[35vh] min-h-[300px] bg-[url('https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        
        {/* Banner Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
            Secure Checkout
          </h1>
          <p className="text-lg text-green-50 font-medium max-w-xl drop-shadow-sm">
            You're just a few steps away from bringing nature home. Complete your details below.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT (Overlapping the banner slightly for a modern look) */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8 relative -mt-16 z-10">

        {/* LEFT SIDE: Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-green-900/5 p-6 sm:p-10 border border-gray-100">
          
          <div className="mb-8 border-b border-gray-100 pb-6">
            <h2 className="text-2xl font-bold text-gray-800">Billing Details</h2>
            <p className="text-sm text-gray-500 mt-1">Please enter your shipping and contact information.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Personal Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Personal Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-green-500 focus:border-green-500 block p-3.5 transition-colors duration-200"
                    {...register("fullName", { required: "Full name is required" })}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1.5">{errors.fullName.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-green-500 focus:border-green-500 block p-3.5 transition-colors duration-200"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-green-500 focus:border-green-500 block p-3.5 transition-colors duration-200"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Enter valid 10 digit number",
                      },
                    })}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone.message}</p>}
                </div>

                {/* Pincode */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Pincode</label>
                  <input
                    type="text"
                    placeholder="110001"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-green-500 focus:border-green-500 block p-3.5 transition-colors duration-200"
                    {...register("pincode", { required: "Pincode is required" })}
                  />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1.5">{errors.pincode.message}</p>}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Shipping Address
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Full Address</label>
                  <textarea
                    rows={4}
                    placeholder="House/Flat No., Building Name, Street, Area"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-green-500 focus:border-green-500 block p-3.5 transition-colors duration-200 resize-none"
                    {...register("address", { required: "Address is required" })}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1.5">{errors.address.message}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* City */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      placeholder="New Delhi"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-green-500 focus:border-green-500 block p-3.5 transition-colors duration-200"
                      {...register("city", { required: "City is required" })}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1.5">{errors.city.message}</p>}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      placeholder="Delhi"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-green-500 focus:border-green-500 block p-3.5 transition-colors duration-200"
                      {...register("state", { required: "State is required" })}
                    />
                    {errors.state && <p className="text-red-500 text-xs mt-1.5">{errors.state.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-4 border-t border-gray-100">
               <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                Payment Method
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {/* COD */}
                <label className="relative flex cursor-pointer rounded-2xl border bg-white p-5 shadow-sm focus:outline-none border-green-500 ring-1 ring-green-500 transition-all hover:bg-green-50">
                  <input
                    type="radio"
                    value="Cash on Delivery"
                    defaultChecked
                    className="sr-only"
                    {...register("paymentMethod")}
                  />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900">Cash on Delivery</span>
                      <span className="mt-1 flex items-center text-sm text-gray-500">Pay when your order arrives.</span>
                    </span>
                  </span>
                  {/* Active Indicator Icon */}
                  <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </label>

                {/* Online Payment (Disabled) */}
                <label className="relative flex cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm opacity-60">
                  <input type="radio" value="Online Payment" disabled className="sr-only" />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900">Online Payment</span>
                      <span className="mt-1 flex items-center text-sm text-gray-500">Coming soon...</span>
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg font-semibold shadow-lg shadow-green-600/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Place Order Securely"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-xl shadow-green-900/5 p-6 sm:p-8 border border-gray-100 sticky top-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-4">Order Summary</h2>

            {/* Cart Items */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item: any) => {
                
                // ✅ Calculate image safely inside the map function where item is accessible
                const imageUrl = item.image 
                  ? storage.getFileView("69b12061003585dc85b3", item.image).toString() 
                  : "";

                return (
                  <div key={item.$id} className="flex gap-4 items-center">
                    {/* Item Image */}
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                      <img
                        src={imageUrl || "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=100&q=80"}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=100&q=80";
                        }}
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3 className="line-clamp-1">{item.name}</h3>
                        <p className="ml-4">₹{item.price * item.quantity}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pricing Details */}
            <div className="mt-8 space-y-4 border-t border-gray-100 pt-6">
              <div className="flex justify-between text-sm text-gray-600">
                <p>Subtotal</p>
                <p className="font-medium">₹{total}</p>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <p>Shipping Estimate</p>
                <p className="font-medium">{shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping}`}</p>
              </div>

              <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-4 mt-4">
                <p className="text-lg font-bold text-gray-900">Total</p>
                <p className="text-2xl font-bold text-green-600">₹{finalTotal}</p>
              </div>
            </div>

            {/* Promotional / Info Banner */}
            <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
              <span className="text-xl">🌱</span>
              <div>
                <h4 className="text-sm font-semibold text-green-800">Free Delivery Unlocked!</h4>
                <p className="text-xs text-green-700 mt-1">
                  Enjoy free shipping on all orders over ₹999. Your plants will be delivered fresh and safe.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}