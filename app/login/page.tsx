"use client";

import { useForm } from "react-hook-form";
import { account } from "@/lib/appwrite";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ArrowRight, Mail, Lock, User, ShieldCheck } from "lucide-react";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"user" | "admin">("user");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Separate form instances to maintain clean isolated error states
  const {
    register: registerUser,
    handleSubmit: handleUserSubmit,
    formState: { errors: userErrors },
    reset: resetUserForm
  } = useForm<FormData>();

  const {
    register: registerAdmin,
    handleSubmit: handleAdminSubmit,
    formState: { errors: adminErrors },
    reset: resetAdminForm
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

  // Reset forms on tab toggle to clean up validation states
  useEffect(() => {
    resetUserForm();
    resetAdminForm();
  }, [activeTab, resetUserForm, resetAdminForm]);

  const onUserSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await account.createEmailPasswordSession(data.email, data.password);
      window.dispatchEvent(new Event("auth-change"));

      toast.success("Welcome back to your sanctuary.", {
        style: { background: "#064E3B", color: "#fff", borderRadius: "100px" },
        icon: '🌿',
      });
      router.push("/plants");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Invalid credentials. Please try again.", {
        style: { background: "#FEF2F2", color: "#991B1B", borderRadius: "100px" }
      });
    } finally {
      setLoading(false);
    }
  };

  const onAdminSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await account.createEmailPasswordSession(data.email, data.password);
      window.dispatchEvent(new Event("auth-change"));

      toast.success("Access granted, Administrator.", {
        style: { background: "#111827", color: "#fff", borderRadius: "100px" },
        icon: '🔑',
      });
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Invalid administrator credentials.", {
        style: { background: "#FEF2F2", color: "#991B1B", borderRadius: "100px" }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#F9FAF9] selection:bg-emerald-200 selection:text-emerald-900 font-sans">

      {/* LEFT: Premium Visual Section */}
      <div className="hidden lg:flex flex-col justify-end items-start p-12 xl:p-24 text-white relative overflow-hidden bg-emerald-950">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[30s] hover:scale-100 ease-out"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2000&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#022c16]/90 via-[#064e3b]/40 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#022c16] via-[#022c16]/50 to-transparent opacity-95" />

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl xl:text-6xl font-bold mb-6 leading-[1.15] tracking-tight">
            Cultivate your <br />
            <span className="text-emerald-300 font-serif font-medium italic">indoor oasis.</span>
          </h1>
          <p className="text-base xl:text-lg text-emerald-50/80 font-light leading-relaxed max-w-md backdrop-blur-md bg-[#022c16]/30 p-5 rounded-2xl border border-white/10 shadow-xl">
            Log in to manage your botanical archive, track incoming acquisitions, and explore our newest rare species.
          </p>
        </div>
      </div>

      {/* RIGHT: Combined Tab Form Section */}
      <div className="flex items-center justify-center p-4 sm:p-12 lg:p-16 relative bg-[#F9FAF9]">
        <div className="w-full max-w-[440px] relative z-10">

          {/* Form Card Container */}
          <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 transition-all duration-500">
            
            {/* Unified Segmented Switcher Header (Now inside the card) */}
            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8 border border-gray-200/30">
              <button
                type="button"
                onClick={() => setActiveTab("user")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ${
                  activeTab === "user"
                    ? "bg-white text-[#022c16] shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <User className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${activeTab === "user" ? "text-emerald-600" : "text-gray-400"}`} />
                User Login
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("admin")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ${
                  activeTab === "admin"
                    ? "bg-white text-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${activeTab === "admin" ? "text-emerald-600" : "text-gray-400"}`} />
                Admin Login
              </button>
            </div>

            {activeTab === "user" ? (
              /* --- USER FORM PANEL --- */
              <div>
                <div className="mb-6 sm:mb-8 text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#022c16] tracking-tight mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-400 text-xs">
                    Enter your details to access your greenhouse dashboard.
                  </p>
                </div>

                <form onSubmit={handleUserSubmit(onUserSubmit)} className="space-y-4 sm:space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide ml-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className={`w-4 h-4 transition-colors ${userErrors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#022c16]'}`} />
                      </div>
                      <input
                        type="email"
                        placeholder="botanist@example.com"
                        {...registerUser("email", { required: "Email is required" })}
                        className={`w-full bg-gray-50/50 border text-sm ${userErrors.email
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 hover:border-gray-300 focus:border-[#022c16] focus:ring-[#022c16]/10'
                          } pl-11 pr-4 py-3 sm:py-3.5 rounded-xl outline-none transition-all duration-200 text-gray-800 placeholder:text-gray-400`}
                      />
                    </div>
                    {userErrors.email && <p className="text-red-500 text-xs font-medium pl-1">{userErrors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                        Password
                      </label>
                      <Link href="#" className="text-xs font-medium text-emerald-600 hover:text-[#022c16] transition-colors">
                        Forgot?
                      </Link>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className={`w-4 h-4 transition-colors ${userErrors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#022c16]'}`} />
                      </div>
                      <input
                        type="password"
                        placeholder="••••••••"
                        {...registerUser("password", { required: "Password is required" })}
                        className={`w-full bg-gray-50/50 border text-sm ${userErrors.password
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 hover:border-gray-300 focus:border-[#022c16] focus:ring-[#022c16]/10'
                          } pl-11 pr-4 py-3 sm:py-3.5 rounded-xl outline-none transition-all duration-200 text-gray-800 placeholder:text-gray-400`}
                      />
                    </div>
                    {userErrors.password && <p className="text-red-500 text-xs font-medium pl-1">{userErrors.password.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full group flex items-center justify-center gap-2 bg-[#022c16] text-white py-3.5 sm:py-4 rounded-xl font-semibold text-sm tracking-wide hover:bg-[#064e3b] hover:shadow-lg hover:shadow-emerald-900/20 hover:-translate-y-0.5 transition-all duration-300 mt-2 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In As Botanist
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-sm mt-6 sm:mt-8 text-center text-gray-500 font-medium">
                  New to Plantflix?{" "}
                  <Link href="/signup" className="text-[#022c16] font-semibold hover:text-emerald-600 transition-colors relative pb-0.5">
                    Create an account
                  </Link>
                </p>
              </div>
            ) : (
              /* --- ADMIN FORM PANEL --- */
              <div>
                <div className="mb-6 sm:mb-8 text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                    Admin Node
                  </h2>
                  <p className="text-gray-400 text-xs">
                    Elevated core infrastructure authentication interface.
                  </p>
                </div>

                <form onSubmit={handleAdminSubmit(onAdminSubmit)} className="space-y-4 sm:space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide ml-1">
                      Admin Identity (Email)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className={`w-4 h-4 transition-colors ${adminErrors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-emerald-800'}`} />
                      </div>
                      <input
                        type="email"
                        placeholder="admin@plantflix.com"
                        {...registerAdmin("email", { required: "Admin identifier required" })}
                        className={`w-full bg-gray-50/50 border text-sm ${adminErrors.email
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 hover:border-gray-300 focus:border-emerald-800 focus:ring-emerald-800/10'
                          } pl-11 pr-4 py-3 sm:py-3.5 rounded-xl outline-none transition-all duration-200 text-gray-800 placeholder:text-gray-400`}
                      />
                    </div>
                    {adminErrors.email && <p className="text-red-500 text-xs font-medium pl-1">{adminErrors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide ml-1">
                      Security Passkey
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className={`w-4 h-4 transition-colors ${adminErrors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-emerald-800'}`} />
                      </div>
                      <input
                        type="password"
                        placeholder="••••••••"
                        {...registerAdmin("password", { required: "Security passkey required" })}
                        className={`w-full bg-gray-50/50 border text-sm ${adminErrors.password
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 hover:border-gray-300 focus:border-emerald-800 focus:ring-emerald-800/10'
                          } pl-11 pr-4 py-3 sm:py-3.5 rounded-xl outline-none transition-all duration-200 text-gray-800 placeholder:text-gray-400`}
                      />
                    </div>
                    {adminErrors.password && <p className="text-red-500 text-xs font-medium pl-1">{adminErrors.password.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full group flex items-center justify-center gap-2 bg-gray-950 text-white py-3.5 sm:py-4 rounded-xl font-semibold text-sm tracking-wide hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20 hover:-translate-y-0.5 transition-all duration-300 mt-2 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Authenticate Authority
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                {/* Micro Sandbox Credentials Card */}
                <div className="mt-6 p-4 bg-emerald-50/60 border border-emerald-100/70 rounded-2xl text-[11px] text-emerald-950 shadow-sm animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 uppercase tracking-wider mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Sandbox Testing Coordinates
                  </div>
                  <div className="space-y-1 font-medium text-gray-600">
                    <p>User: <span className="font-mono text-emerald-950 font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-100 block sm:inline-block break-all sm:break-normal">ahana@yopmail.com</span></p>
                    <p>Password: <span className="font-mono text-emerald-950 font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-100">@ahana22</span></p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}