"use client";

import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // Import toast

const ADMIN_EMAILS = [
  "ahana@yopmail.com",
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await account.get();

        // 1. Trigger popup if the logged-in user is NOT an admin
        if (!ADMIN_EMAILS.includes(user.email)) {
          toast.error("Access Denied: Admin privileges required.", {
            style: { background: "#FEF2F2", color: "#991B1B", borderRadius: "100px" },
            icon: '🛡️',
          });
          router.push("/");
          return;
        }

        setLoading(false);
      } catch {
        // 2. Trigger popup if the user is not logged in at all
        toast.error("Authentication required. Please log in.", {
          style: { background: "#FEF2F2", color: "#991B1B", borderRadius: "100px" },
          icon: '🔒',
        });
        router.push("/login");
      }
    };

    checkAdmin();
  }, [router]);

  // Upgraded the loading state to a theme-matching spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAF9]">
         <div className="w-8 h-8 border-4 border-emerald-200 border-t-[#022c16] rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}