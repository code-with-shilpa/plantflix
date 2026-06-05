"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { databases, storage } from "@/lib/appwrite" // Ensure storage is imported
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import toast from "react-hot-toast"
import { Sprout, DollarSign, Package, Tags, FileText, Link as LinkIcon, Image as ImageIcon, Loader2, Calendar } from "lucide-react"

// Your Appwrite Constants
const DATABASE_ID = "69b11e5e0012e2704738"
const PLANTS_COLLECTION_ID = "plants"
const BUCKET_ID = "69b12061003585dc85b3" // Required for image preview fix

const schema = yup.object({
    name: yup.string().required("Plant name is required"),
    price: yup
        .number()
        .typeError("Price must be a number")
        .required("Price is required"),
    category: yup.string().required("Category is required"),
    season: yup.string().required("Season is required"),
    stock: yup
        .number()
        .typeError("Stock must be a number")
        .required("Stock is required"),
    // Removed the .url() validation so Appwrite IDs are accepted
    image: yup
        .string()
        .required("Image ID or URL is required"),
    description: yup.string().required("Description is required"),
})

type FormData = yup.InferType<typeof schema>

export default function EditPlantPage() {
    const params = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    })

    const imagePreview = watch("image")

    useEffect(() => {
        fetchPlant()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchPlant = async () => {
        try {
            const plant = await databases.getDocument(
                DATABASE_ID,
                PLANTS_COLLECTION_ID,
                params.id as string
            )

            reset({
                name: plant.name,
                price: plant.price,
                category: plant.category,
                season: plant.season, // <-- ADDED SEASON TO RESET
                stock: plant.stock,
                image: plant.image,
                description: plant.description,
            })
        } catch (error) {
            console.error(error)
            toast.error("Failed to load plant")
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (data: FormData) => {
        try {
            await databases.updateDocument(
                DATABASE_ID,
                PLANTS_COLLECTION_ID,
                params.id as string,
                {
                    ...data,
                }
            )

            toast.success("Plant updated successfully 🌱")
            router.push("/admin/plants")
        } catch (error) {
            console.error(error)
            toast.error("Update failed")
        }
    }

    // Beautiful Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/50 to-teal-50 flex flex-col justify-center items-center">
                <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
                <p className="text-gray-600 font-medium animate-pulse">Loading plant details...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8 pt-29">
            <div className="max-w-5xl mx-auto">

                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                        Edit <span className="text-green-600">Plant</span> Details
                    </h1>
                    <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
                        Update your inventory details, pricing, and descriptions to keep your catalog fresh.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 sm:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                            {/* Left Column: Image URL & Preview */}
                            <div className="lg:col-span-5 flex flex-col space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4 text-green-600" />
                                        Image ID or URL
                                    </label>
                                    <input
                                        {...register("image")}
                                        placeholder="Appwrite File ID or https://..."
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl p-4 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 focus:bg-white outline-none transition-all"
                                    />
                                    {errors.image && <p className="text-red-500 text-sm mt-2 font-medium">{errors.image.message}</p>}
                                </div>

                                <div className="flex-1 w-full relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-green-600" />
                                        Preview
                                    </label>
                                    <div className="w-full h-full min-h-[280px] bg-gray-50 border-2 border-gray-200 border-dashed rounded-3xl overflow-hidden flex flex-col items-center justify-center transition-all">
                                        {imagePreview && !errors.image ? (
                                            <img
                                                src={
                                                    imagePreview.startsWith("http")
                                                        ? imagePreview
                                                        : storage
                                                            .getFileView(BUCKET_ID, imagePreview)
                                                            .toString()
                                                }
                                                alt="Preview"
                                                className="w-full h-full object-cover absolute inset-0 rounded-3xl"
                                                onError={(e) => {
                                                    console.log("Failed image:", imagePreview)
                                                    e.currentTarget.src =
                                                        "https://via.placeholder.com/400x500?text=Image+Not+Found"
                                                }}
                                            />
                                        ) : (
                                            <div className="text-center p-6">
                                                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-sm text-gray-400 font-medium">Paste a valid ID or URL</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Form Fields */}
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
                                            Stock Available
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

                                {/* Category & Season Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <Tags className="w-4 h-4 text-green-600" />
                                            Category
                                        </label>
                                        <input
                                            {...register("category")}
                                            placeholder="e.g. Indoor Plants"
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl p-4 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 focus:bg-white outline-none transition-all"
                                        />
                                        {errors.category && <p className="text-red-500 text-sm mt-2 font-medium">{errors.category.message}</p>}
                                    </div>

                                    {/* Season */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-green-600" />
                                            Season
                                        </label>
                                        <input
                                            {...register("season")}
                                            placeholder="e.g. Summer, All Year"
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl p-4 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 focus:bg-white outline-none transition-all"
                                        />
                                        {errors.season && <p className="text-red-500 text-sm mt-2 font-medium">{errors.season.message}</p>}
                                    </div>
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
                                        <Loader2 className="animate-spin h-5 w-5 text-white" />
                                        Saving Changes...
                                    </span>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}