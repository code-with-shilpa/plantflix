// export default function SuccessPage() {
//   return (
//     <div className="h-screen flex flex-col items-center justify-center">
//       <h1 className="text-3xl font-bold text-green-600">
//         Order Placed Successfully 🎉
//       </h1>
//       <p className="mt-2">Your order will be delivered soon.</p>
//     </div>
//   )
// }
import Link from "next/link"

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md">

        <div className="text-6xl mb-4">
          ✅
        </div>

        <h1 className="text-3xl font-bold text-green-600">
          Order Placed!
        </h1>

        <p className="text-gray-500 mt-3">
          Your order has been placed successfully.
        </p>

        <Link
          href="/plants"
          className="inline-block mt-6 bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          Continue Shopping
        </Link>

      </div>
    </div>
  )
}