"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { databases, storage } from "@/lib/appwrite";

type Plant = {
  $id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  image: string;
  $createdAt: string;
};

export default function AdminPlantDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  const DATABASE_ID = "69b11e5e0012e2704738";
  const COLLECTION_ID = "plants";
  const BUCKET_ID = "69b12061003585dc85b3";

  useEffect(() => {
    if (id) {
      fetchPlant();
    }
  }, [id]);

  const fetchPlant = async () => {
    try {
      const res = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id as string
      );

      setPlant(res as unknown as Plant);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this plant?"
    );

    if (!confirmDelete) return;

    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        plant!.$id
      );

      alert("Plant deleted successfully");
      router.push("/admin/plants");
    } catch (error) {
      console.error(error);
      alert("Failed to delete plant");
    }
  };

  const imageUrl = plant?.image
    ? storage.getFileView(BUCKET_ID, plant.image).toString()
    : "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Plant not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            Plant Details
          </h1>

          <Link
            href="/admin/plants"
            className="px-4 py-2 bg-slate-200 rounded-lg"
          >
            Back
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 bg-white p-8 rounded-3xl shadow-sm">

          {/* Image */}
          <div>
            <img
              src={imageUrl}
              alt={plant.name}
              className="w-full h-[500px] object-cover rounded-3xl"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">

            <div>
              <h2 className="text-4xl font-bold text-slate-900">
                {plant.name}
              </h2>

              <p className="text-2xl font-semibold text-green-700 mt-3">
                ₹{plant.price}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-slate-100 p-4 rounded-xl">
                <p className="text-sm text-gray-500">
                  Category
                </p>
                <p className="font-semibold">
                  {plant.category}
                </p>
              </div>

              <div className="bg-slate-100 p-4 rounded-xl">
                <p className="text-sm text-gray-500">
                  Stock
                </p>
                <p className="font-semibold">
                  {plant.stock}
                </p>
              </div>

            </div>

            <div className="bg-slate-100 p-5 rounded-xl">
              <p className="text-sm text-gray-500 mb-2">
                Description
              </p>

              <p className="text-slate-700">
                {plant.description}
              </p>
            </div>

            <div className="bg-slate-100 p-5 rounded-xl">
              <p className="text-sm text-gray-500">
                Created At
              </p>

              <p className="font-medium">
                {new Date(
                  plant.$createdAt
                ).toLocaleDateString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">

              <Link
                href={`/admin/plants/edit/${plant.$id}`}
                className="flex-1 text-center bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
              >
                Edit Plant
              </Link>

              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700"
              >
                Delete Plant
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}