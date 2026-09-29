"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { adminLoginAction } from "@/lib/admin/auth-actions";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await adminLoginAction({
        email,
        password,
        rememberMe,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(redirectTo);
          router.refresh();
        }, 600);
      } else {
        setError(res.error || "Authentication failed. Please check your credentials.");
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-navy-950 px-4 py-12 selection:bg-gold/30 selection:text-white overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-gold/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-navy-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.05)_0,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-navy-900/90 p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-gold shadow-gold-sm mb-4">
              <ShieldCheck className="h-7 w-7 text-navy-950" />
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
              Corona Properties Limited
            </p>
            <h1 className="mt-1 font-serif text-2xl font-bold text-cream">
              Administrative Portal
            </h1>
            <p className="mt-1 text-xs text-navy-300">
              Sign in with your enterprise credentials to access management console.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Authenticated successfully. Redirecting to workspace...</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-navy-200 mb-1"
              >
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@coronapropertiesltd.com"
                  className="w-full rounded-xl border border-white/10 bg-navy-950/60 pl-10 pr-4 py-2.5 text-xs text-white placeholder-navy-500 outline-none transition focus:border-gold focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-navy-200 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-navy-950/60 pl-10 pr-10 py-2.5 text-xs text-white placeholder-navy-500 outline-none transition focus:border-gold focus:ring-1 focus:ring-gold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-navy-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-navy-950 text-gold focus:ring-gold"
                />
                <span>Keep me signed in</span>
              </label>

              <span className="text-[11px] text-navy-400">
                Protected by 256-bit encryption
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold py-3 text-xs font-bold uppercase tracking-wider text-navy shadow-gold hover:shadow-gold-lg transition disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-navy border-t-transparent" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-navy-400">
          &copy; {new Date().getFullYear()} Corona Properties Limited. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-navy-950 text-gold text-xs">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
