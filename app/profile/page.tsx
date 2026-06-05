"use client";

import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import {
  Leaf,
  LogOut,
  Loader2,
  Check,
  Camera,
  User,
  Mail,
  Phone,
  AlignLeft,
  LayoutGrid
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Form & Image State
  const [formData, setFormData] = useState({ name: "", phone: "", bio: "" });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await account.get();
        setUser(data);
        const prefs = await account.getPrefs();
        setFormData({
          name: data.name || "",
          phone: prefs.phone || "",
          bio: prefs.bio || "",
        });
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [router]);

  const logout = async () => {
    try {
      await account.deleteSession("current");
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setSaveSuccess(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      if (formData.name !== user.name) await account.updateName(formData.name);
      await account.updatePrefs({ phone: formData.phone, bio: formData.bio });

      // Avatar upload logic would go here
      // if (avatarFile) await storage.createFile(...)

      setUser((prev: any) => ({ ...prev, name: formData.name }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-zinc-900 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans selection:bg-zinc-200 pt-18">
    
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-zinc-500 mt-2">Manage your public profile and private details.</p>
        </div>

        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Avatar & Quick Stats (Bento Box 1) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center text-center">
              {/* Static Avatar Container */}
              <div className="mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-zinc-100 flex items-center justify-center text-4xl font-bold text-zinc-400 select-none">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-zinc-500">Member since {new Date(user.$createdAt).getFullYear()}</p>
            </div>

            <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-sm">
              <LayoutGrid className="w-6 h-6 mb-4 text-zinc-400" />
              <h3 className="font-semibold mb-1">Need help?</h3>
              <p className="text-sm text-zinc-400 mb-4">Reach out to our support team for assistance with your nursery orders.</p>
              <button type="button" className="text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors w-full">
                Contact Support 
              </button>
            </div>
          </div>

          {/* Right Column: Form Inputs (Bento Box 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-200 shadow-sm">

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Personal Information</h3>
                {saveSuccess && (
                  <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <Check className="w-4 h-4" /> Saved
                  </span>
                )}
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-zinc-400" /> Name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Email (Readonly) */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-zinc-400" /> Email
                    </label>
                    <input
                      defaultValue={user.email}
                      readOnly
                      className="w-full px-4 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-500 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-zinc-400" /> Phone Number
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-zinc-400" /> Biography
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about your plant collection..."
                    className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all min-h-[120px] resize-y"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ name: user.name, phone: "", bio: "" })}
                  className="px-5 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
                  disabled={isSaving}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-200 transition-all disabled:opacity-70"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </div>
          </div>
        </form>
      </main>
    </div>
  );
}