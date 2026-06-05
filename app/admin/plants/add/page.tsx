"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { databases, storage } from "@/lib/appwrite"
import { ID } from "appwrite"
import toast from "react-hot-toast"
import { UploadCloud, Sprout, DollarSign, Package, Tags, FileText, Image as ImageIcon } from "lucide-react"

const DATABASE_ID = "69b11e5e0012e2704738"
const PLANTS_COLLECTION_ID = "plants"
const BUCKET_ID = "69b12061003585dc85b3"

const schema = yup.object({
  name: yup
    .string()
    .required("Plant name is required")
    .min(3, "Minimum 3 characters"),

  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),

  category: yup
    .string()
    .required("Category is required"),

  stock: yup
    .number()
    .typeError("Stock must be a number")
    .min(0, "Stock cannot be negative")
    .required("Stock is required"),

  description: yup
    .string()
    .required("Description is required")
    .min(20, "Description should be at least 20 characters"),
  season: yup
    .string()
    .required("season is required"),
    
})

type FormData = yup.InferType<typeof schema>

export default function AddPlantPage() {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      if (!selectedFile) {
        toast.error("Please select an image")
        return
      }

      // Upload Image
      const uploadedFile = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        selectedFile
      )

      // Save Plant
      await databases.createDocument(
        DATABASE_ID,
        PLANTS_COLLECTION_ID,
        ID.unique(),
        {
          name: data.name,
          price: Number(data.price),
          category: data.category,
          stock: Number(data.stock),
          image: uploadedFile.$id,
          description: data.description,
           season: data.season
        }
      )

      toast.success("Plant added successfully 🌱")
      reset()
      setPreview("")
      setSelectedFile(null)
      router.push("/admin/plants")
    } catch (error) {
      console.error(error)
      toast.error("Failed to add plant")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8 pt-28">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Add New <span className="text-green-600">Plant</span>
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            Create a stunning new listing for the PlantFlix catalog. Fill in the details below to watch your inventory grow.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Column: Image Upload (Takes up 5 columns on large screens) */}
              <div className="lg:col-span-5 flex flex-col space-y-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Plant Image
                </label>
                
                <div className="flex-1 w-full relative group">
                  {!preview ? (
                    <label className="flex flex-col items-center justify-center w-full h-full min-h-[320px] border-2 border-gray-300 border-dashed rounded-3xl cursor-pointer bg-gray-50/50 hover:bg-green-50 hover:border-green-400 transition-all duration-300">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                        <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                          <UploadCloud className="w-8 h-8 text-green-500" />
                        </div>
                        <p className="mb-2 text-sm text-gray-600 font-medium">
                          <span className="text-green-600 font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">High-quality PNG, JPG or WEBP</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setSelectedFile(file)
                          setPreview(URL.createObjectURL(file))
                        }}
                      />
                    </label>
                  ) : (
                    <div className="relative w-full h-full min-h-[320px] rounded-3xl overflow-hidden shadow-md group">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover absolute inset-0"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white/90 text-gray-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-white transition-colors flex items-center gap-2">
                          <ImageIcon className="w-5 h-5" />
                          Change Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              setSelectedFile(file)
                              setPreview(URL.createObjectURL(file))
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Form Fields (Takes up 7 columns on large screens) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-green-600" />
                    Plant Name
                  </label>
                  <input
                    {...register("name")}
                    placeholder="e.g. Monstera Deliciosa"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl p-4 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 focus:bg-white outline-none transition-all"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-2 font-medium">{errors.name.message}</p>}
                </div>

                {/* Price & Stock Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("price")}
                      placeholder="499"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl p-4 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 focus:bg-white outline-none transition-all"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-2 font-medium">{errors.price.message}</p>}
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4 text-green-600" />
                      Initial Stock
                    </label>
                    <input
                      type="number"
                      {...register("stock")}
                      placeholder="25"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl p-4 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 focus:bg-white outline-none transition-all"
                    />
                    {errors.stock && <p className="text-red-500 text-sm mt-2 font-medium">{errors.stock.message}</p>}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Tags className="w-4 h-4 text-green-600" />
                    Category
                  </label>
                  <input
                    {...register("category")}
                    placeholder="e.g. Indoor Plants, Succulents"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl p-4 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 focus:bg-white outline-none transition-all"
                  />
                  {errors.category && <p className="text-red-500 text-sm mt-2 font-medium">{errors.category.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    Description
                  </label>
                  <textarea
                    rows={4}
                    {...register("description")}
                    placeholder="Describe the plant, its care instructions, and ideal environment..."
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl p-4 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 focus:bg-white outline-none transition-all resize-none"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-2 font-medium">{errors.description.message}</p>}
                </div>
<div>
  <label className="block text-sm font-medium mb-2">
    Season
  </label>

  <select
    {...register("season")}
    className="w-full border rounded-lg p-3"
  >
    <option value="">Select Season</option>
    <option value="Spring">Spring</option>
    <option value="Summer">Summer</option>
    <option value="Monsoon">Monsoon</option>
    <option value="Autumn">Autumn</option>
    <option value="Winter">Winter</option>
    <option value="All Seasons">All Seasons</option>
  </select>
</div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-4 text-gray-600 font-semibold hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-colors mr-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Plant...
                  </span>
                ) : (
                  "Publish Plant Listing"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}