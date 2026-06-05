// "use client"

// import Link from "next/link"
// import { useCartStore } from "@/store/cartStore"
// import { storage } from "@/lib/appwrite"

// export default function CartPage() {

//   const { cart, removeFromCart, updateQty } = useCartStore()

//   const getImageUrl = (fileId: string) =>
//     storage.getFileView("69b12061003585dc85b3", fileId).toString()

//   const total = cart.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   )

//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center text-center">
//         <h2 className="text-2xl font-semibold mb-3">Your cart is empty 🛒</h2>
//         <Link
//           href="/plants"
//           className="bg-green-600 text-white px-5 py-2 rounded-lg"
//         >
//           Browse Plants
//         </Link>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-6">

//       <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">

//         {/* CART ITEMS */}
//         <div className="lg:col-span-2 space-y-6">

//           <h1 className="text-2xl font-bold">Shopping Cart</h1>

//           {cart.map((item) => {

//             const imageUrl = getImageUrl(item.image)

//             return (
//               <div
//                 key={item.id}
//                 className="flex items-center gap-5 bg-white p-4 rounded-xl shadow-sm"
//               >

//                 {/* IMAGE */}
//                 <img
//                   src={imageUrl}
//                   alt={item.name}
//                   className="w-24 h-24 object-cover rounded-lg"
//                 />

//                 {/* DETAILS */}
//                 <div className="flex-1">

//                   <h3 className="font-semibold">{item.name}</h3>

//                   <p className="text-green-600 font-bold">
//                     ₹{item.price}
//                   </p>

//                   {/* QTY */}
//                   <div className="flex items-center gap-3 mt-2">

//                     <button
//                       onClick={() =>
//                         updateQty(item.id, Math.max(1, item.quantity - 1))
//                       }
//                       className="px-2 py-1 bg-gray-200 rounded"
//                     >
//                       -
//                     </button>

//                     <span>{item.quantity}</span>

//                     <button
//                       onClick={() =>
//                         updateQty(item.id, item.quantity + 1)
//                       }
//                       className="px-2 py-1 bg-gray-200 rounded"
//                     >
//                       +
//                     </button>

//                   </div>

//                 </div>

//                 {/* REMOVE */}
//                 <button
//                   onClick={() => removeFromCart(item.id)}
//                   className="text-red-500 text-sm hover:underline"
//                 >
//                   Remove
//                 </button>

//               </div>
//             )
//           })}

//         </div>

//         {/* SUMMARY */}
//         <div className="bg-white p-6 rounded-xl shadow-sm h-fit">

//           <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

//           <div className="flex justify-between mb-2">
//             <span>Subtotal</span>
//             <span>₹{total}</span>
//           </div>

//           <div className="flex justify-between mb-2">
//             <span>Shipping</span>
//             <span className="text-green-600">Free</span>
//           </div>

//           <hr className="my-4" />

//           <div className="flex justify-between font-bold text-lg">
//             <span>Total</span>
//             <span>₹{total}</span>
//           </div>

//           <Link
//             href="/checkout"
//             className="block mt-6 text-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
//           >
//             Proceed to Checkout
//           </Link>

//         </div>

//       </div>

//     </div>
//   )
// }

"use client"

import Link from "next/link"
import { useCartStore } from "@/store/cartStore"
import { storage } from "@/lib/appwrite"

export default function CartPage() {
  const { cart, removeFromCart, updateQty } = useCartStore()

  const getImageUrl = (fileId: string) =>
    storage.getFileView("69b12061003585dc85b3", fileId).toString()

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  // --- EMPTY STATE ---
  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-600 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Your cart is empty</h2>
        <p className="text-gray-500 max-w-sm mb-8">
          Looks like you haven't added any green companions to your cart yet. Let's fix that!
        </p>
        <Link
          href="/plants"
          className="inline-flex items-center justify-center bg-emerald-600 text-white font-medium px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-700/30 active:scale-98 transition-all duration-200"
        >
          Browse Plants
        </Link>
      </div>
    )
  }

  // --- ACTIVE CART STATE ---
  return (
    <div className="min-h-screen bg-gray-50/50 py-30 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-8 border-b border-gray-200 pb-5">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>
          <p className="mt-2 text-sm text-gray-500">
            You have <span className="font-semibold text-emerald-600">{cart.length}</span> {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* CART ITEMS LIST */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const imageUrl = getImageUrl(item.image)

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-items-center sm:flex-row gap-4 sm:gap-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* IMAGE */}
                  <div className="relative w-full sm:w-28 h-28 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* DETAILS & CONTROLS CONTAINER */}
                  <div className="flex flex-col flex-1 justify-between py-1">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-base md:text-lg hover:text-emerald-700 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-emerald-700 font-bold text-lg mt-1">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* REMOVE BUTTON */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50/50 transition-colors duration-200"
                        title="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>

                    {/* QUANTITY PICKER */}
                    <div className="flex items-center justify-between sm:justify-start gap-4 mt-4 pt-2 border-t border-gray-50 sm:border-0">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider sm:hidden">Quantity</span>
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 p-1 shadow-inner">
                        <button
                          onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-emerald-700 hover:bg-white rounded-lg transition-all duration-150 disabled:opacity-40"
                          disabled={item.quantity <= 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                          </svg>
                        </button>

                        <span className="w-10 text-center font-medium text-gray-800 text-sm select-none">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-emerald-700 hover:bg-white rounded-lg transition-all duration-150"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ORDER SUMMARY SIDEBAR */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:sticky lg:top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{total.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Estimated Shipping</span>
                <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs uppercase tracking-wide">
                  Free
                </span>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between font-bold text-gray-900 text-lg">
                <span>Total Amount</span>
                <span className="text-xl text-emerald-700">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="group relative flex w-full items-center justify-center bg-emerald-600 text-white font-semibold py-4 px-6 rounded-xl mt-8 hover:bg-emerald-700 shadow-lg shadow-emerald-600/10 hover:shadow-emerald-700/20 active:scale-98 transition-all duration-200"
            >
              <span>Proceed to Checkout</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            {/* Micro-copy for Trust */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span>Secure and Encrypted Checkout</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}