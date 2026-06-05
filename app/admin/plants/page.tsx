"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { databases } from "@/lib/appwrite"
import { Query } from "appwrite"
import toast from "react-hot-toast"
import { storage } from "@/lib/appwrite"

const BUCKET_ID = "69b12061003585dc85b3"
const DATABASE_ID = "69b11e5e0012e2704738"
const PLANTS_COLLECTION_ID = "plants"

export default function AdminPlantsPage() {
  const [plants, setPlants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPlants()
  }, [])

  const fetchPlants = async () => {
    try {
      setIsLoading(true)
      const response = await databases.listDocuments(
        DATABASE_ID,
        PLANTS_COLLECTION_ID,
        [Query.orderDesc("$createdAt")]
      )
      setPlants(response.documents)
    } catch {
      toast.error("Failed to fetch plants")
    } finally {
      setIsLoading(false)
    }
  }

  const deletePlant = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plant?")) return

    try {
      await databases.deleteDocument(
        DATABASE_ID,
        PLANTS_COLLECTION_ID,
        id
      )
      toast.success("Plant deleted successfully")
      fetchPlants()
    } catch {
      toast.error("Delete failed")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 sm:p-8 md:p-10 font-sans mt-20">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Manage Plants
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isLoading ? "Loading inventory..." : `Total cataloged: ${plants.length} items`}
            </p>
          </div>

          <Link
            href="/admin/plants/add"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-medium shadow-sm shadow-emerald-100 transition-all duration-200 group self-start sm:self-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:rotate-90">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Plant
          </Link>
        </div>

        {/* Loading Skeleton State */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-4">
                <div className="bg-slate-200 h-52 w-full rounded-xl" />
                <div className="h-5 bg-slate-200 rounded w-2/3" />
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="flex gap-3 pt-2">
                  <div className="h-10 bg-slate-200 rounded-lg flex-1" />
                  <div className="h-10 bg-slate-200 rounded-lg flex-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && plants.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 px-4">
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No plants listed yet</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1">
              Your inventory is currently empty. Get started by adding your first plant to the store.
            </p>
          </div>
        )}

        {/* Active Grid View */}
        {!isLoading && plants.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {plants.map((plant) => (
              <div
                key={plant.$id}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Image Container with subtle zoom effect */}
                <div className="p-4 pb-0 relative overflow-hidden">
                  <div className="overflow-hidden rounded-xl h-52 w-full bg-slate-50">
                    <img
                      src={storage.getFileView(BUCKET_ID, plant.image).toString()}
                      alt={plant.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-800 text-lg tracking-tight line-clamp-1">
                      {plant.name
                        .split(" ")
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(" ")}
                    </h2>
                    <p className="text-xl font-bold text-emerald-600 mt-1.5">
                      ₹{Number(plant.price).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-5 pt-4 border-t border-slate-50">
                    <Link
                      href={`/admin/plants/${plant.$id}`}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/admin/plants/edit/${plant.$id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium py-2.5 px-4 rounded-xl border border-slate-200/60 transition-colors duration-150"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                      Edit
                    </Link>

                    <button
                      onClick={() => deletePlant(plant.$id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-medium py-2.5 px-4 rounded-xl border border-rose-100 transition-colors duration-150"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.74 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}