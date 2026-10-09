
"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <ProtectedRoute>
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
          <h1 className="text-2xl font-bold">
            Welcome to ResearchLane
          </h1>

          <div className="mt-6 rounded-lg bg-zinc-100 p-4">
            <p className="text-sm text-zinc-500">Logged in as</p>

            <p className="mt-1 font-medium">{user?.name}</p>

            <p className="text-sm text-zinc-600">{user?.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 w-full rounded-lg border px-4 py-2"
          >
            Logout
          </button>
        </div>
      </main>
    </ProtectedRoute>
  );
}

