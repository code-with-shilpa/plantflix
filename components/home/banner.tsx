// import Link from "next/link"

// export default function Banner() {
//   return (
//     <section className="grid md:grid-cols-2 items-center px-10 py-16">

//       <div>
//         <h1 className="text-5xl font-bold text-gray-800 mb-6">
//           Bring Nature Into Your Home 🌱
//         </h1>

//         <p className="text-gray-600 mb-6">
//           Discover beautiful indoor and outdoor plants
//           from trusted nurseries.
//         </p>

//         <Link
//           href="/plants"
//           className="bg-green-600 text-white px-6 py-3 rounded-lg"
//         >
//           Explore Plants
//         </Link>
//       </div>

//       <img
//         src="/banner.jpg"
//         className="rounded-xl"
//         alt="plants"
//       />

//     </section>
//   )
// }
import Link from "next/link"

export default function Banner() {
  return (
    <section className="grid md:grid-cols-2 items-center px-16 py-20 bg-green-50">

      <div>
        <h1 className="text-6xl font-bold text-gray-800 mb-6">
          Bring Nature <br /> Into Your Home 🌿
        </h1>

        <p className="text-gray-600 mb-8">
          Discover fresh indoor and outdoor plants from trusted nurseries.
        </p>

        <Link
          href="/plants"
          className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700"
        >
          Shop Plants
        </Link>
      </div>

      <img
        src="/banner.jpg"
        className="rounded-xl shadow-lg"
      />

    </section>
  )
}