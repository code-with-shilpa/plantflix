// "use client";

// import { useEffect, useState } from "react";
// import { account } from "@/lib/appwrite";
// import Link from "next/link";

// export default function ProtectedRoute({ children }) {
//   const [authorized, setAuthorized] = useState(null);

//   useEffect(() => {
//     const verifyUser = async () => {
//       try {
//         await account.get();
//         setAuthorized(true);
//       } catch {
//         setAuthorized(false);
//       }
//     };

//     verifyUser();
//   }, []);

//   if (authorized === null) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         Loading...
//       </div>
//     );
//   }

//   if (!authorized) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F9FAF9]">
//         <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
//           <div className="text-6xl mb-4">🌿</div>

//           <h1 className="text-3xl font-bold text-[#11281A] mb-3">
//             Login Required
//           </h1>

//           <p className="text-gray-600 mb-6">
//             Please sign in to explore our plant collection.
//           </p>

//           <Link
//             href="/login"
//             className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
//           >
//             Login Now
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return children;
// }

"use client";

import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await account.get();
        setAuthorized(true);
      } catch {
        // Instead of router.replace("/login"), we trigger the modal
        setShowModal(true);
      } finally {
        // Stop loading regardless of success or failure
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  // 1. Show a clean loading state while verifying
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9FAF9]">
        <div className="animate-pulse text-[#11281A] font-semibold tracking-widest uppercase text-sm">
          Verifying Access...
        </div>
      </div>
    );
  }

  // 2. Show the popup modal if the user is NOT authorized
  if (showModal) {
    return (
      <div className="min-h-screen bg-[#F9FAF9] relative flex items-center justify-center overflow-hidden">
        
        {/* Decorative Background Blobs for the modal screen */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-200/30 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>
        <div className="absolute top-[20%] right-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px] translate-x-1/3 pointer-events-none z-0"></div>

        {/* Modal Card */}
        <div className="relative z-10 w-full max-w-md p-4">
          <div className="bg-white w-full rounded-[2.5rem] p-8 lg:p-10 text-center shadow-2xl border border-gray-100 transform transition-transform scale-100 animate-fade-in-up">
            
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner animate-[bounce_3s_infinite]">
              🔒
            </div>
            
            <h2 className="text-3xl font-extrabold text-[#11281A] tracking-tight mb-3">
              Premium Access Only
            </h2>
            
            <p className="text-gray-500 leading-relaxed text-sm mb-8">
              This area is exclusive to our registered plant community. Please log in or register to continue browsing.
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={() => router.push("/login")}
                className="w-full py-4 bg-[#11281A] hover:bg-green-800 text-white font-bold rounded-full text-base transition-all duration-300 shadow-lg shadow-green-900/20 active:scale-[0.98]"
              >
                Sign In / Register
              </button>
              
              <button 
                onClick={() => router.push("/")}
                className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-full text-sm transition-all duration-300 active:scale-[0.98]"
              >
                Return to Home Page
              </button>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // 3. If authorized, render the actual page content securely
  return <>{children}</>;
}