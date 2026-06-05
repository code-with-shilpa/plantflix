"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      <Navbar />

      {children}

      {!isAdmin && <Footer />}
    </>
  );
}