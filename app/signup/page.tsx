"use client";

import { useForm } from "react-hook-form";
import { account } from "@/lib/appwrite";
import { ID } from "appwrite"; // Assuming standard Appwrite SDK import for ID
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ArrowRight, Mail, Lock, User } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // Redirect if already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        await account.get();
        router.push("/plants");
      } catch { }
    };
    checkUser();
  }, [router]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // 1. Create the user account
      await account.create(ID.unique(), data.email, data.password, data.name);
      
      // 2. Automatically log them in after successful registration
      await account.createEmailPasswordSession(data.email, data.password);
      window.dispatchEvent(new Event("auth-change"));

      toast.success("Welcome to your sanctuary.", {
        style: { background: "#064E3B", color: "#fff", borderRadius: "100px" },
        icon: '🌿',
      });
      router.push("/plants");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to create account. Please try again.", {
        style: { background: "#FEF2F2", color: "#991B1B", borderRadius: "100px" }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F9FAF9] selection:bg-emerald-200 selection:text-emerald-900 font-sans">

      {/* LEFT: Premium Visual Section (Maintained from Login) */}
      <div className="hidden lg:flex flex-col justify-end items-start p-16 xl:p-24 text-white relative overflow-hidden bg-emerald-950">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[30s] hover:scale-100 ease-out"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2000&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#022c16]/90 via-[#064e3b]/40 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#022c16] via-[#022c16]/50 to-transparent opacity-95" />

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl xl:text-6xl font-bold mb-6 leading-[1.15] tracking-tight">
            Start cultivating <br />
            <span className="text-emerald-300 font-serif font-medium italic">your oasis.</span>
          </h1>
          <p className="text-lg text-emerald-50/80 font-light leading-relaxed max-w-md backdrop-blur-md bg-[#022c16]/30 p-5 rounded-2xl border border-white/10 shadow-xl">
            Join us to build your botanical archive, track incoming acquisitions, and explore our newest rare species.
          </p>
        </div>
      </div>

      {/* RIGHT: Registration Form Section */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16 relative bg-[#F9FAF9]">
        <div className="w-full max-w-[440px] relative z-10">

          {/* Form Card */}
          <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 transition-all duration-500">
            
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-[#022c16] tracking-tight mb-2">
                Create Account
              </h2>
              <p className="text-gray-400 text-xs">
                Enter your details to establish your greenhouse dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Full Name Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className={`w-4 h-4 transition-colors ${errors.name ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#022c16]'}`} />
                  </div>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    {...register("name", { required: "Name is required" })}
                    className={`w-full bg-gray-50/50 border text-sm ${errors.name
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-200 hover:border-gray-300 focus:border-[#022c16] focus:ring-[#022c16]/10'
                      } pl-11 pr-4 py-3.5 rounded-xl outline-none transition-all duration-200 text-gray-800 placeholder:text-gray-400`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs font-medium pl-1">{errors.name.message}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`w-4 h-4 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#022c16]'}`} />
                  </div>
                  <input
                    type="email"
                    placeholder="botanist@example.com"
                    {...register("email", { required: "Email is required" })}
                    className={`w-full bg-gray-50/50 border text-sm ${errors.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-200 hover:border-gray-300 focus:border-[#022c16] focus:ring-[#022c16]/10'
                      } pl-11 pr-4 py-3.5 rounded-xl outline-none transition-all duration-200 text-gray-800 placeholder:text-gray-400`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs font-medium pl-1">{errors.email.message}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`w-4 h-4 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#022c16]'}`} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register("password", { 
                      required: "Password is required",
                      minLength: { value: 8, message: "Password must be at least 8 characters" }
                    })}
                    className={`w-full bg-gray-50/50 border text-sm ${errors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-200 hover:border-gray-300 focus:border-[#022c16] focus:ring-[#022c16]/10'
                      } pl-11 pr-4 py-3.5 rounded-xl outline-none transition-all duration-200 text-gray-800 placeholder:text-gray-400`}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs font-medium pl-1">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group flex items-center justify-center gap-2 bg-[#022c16] text-white py-4 rounded-xl font-semibold text-sm tracking-wide hover:bg-[#064e3b] hover:shadow-lg hover:shadow-emerald-900/20 hover:-translate-y-0.5 transition-all duration-300 mt-2 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign Up As Botanist
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className="text-sm mt-8 text-center text-gray-500 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-[#022c16] font-semibold hover:text-emerald-600 transition-colors relative pb-0.5">
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}