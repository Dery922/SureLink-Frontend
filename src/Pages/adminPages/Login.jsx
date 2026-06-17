import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003DFF] via-[#005EFF] to-[#00A2FF] p-6">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl bottom-10 right-10"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img src="/logo.png" alt="SureLink" className="h-24 mb-4" />

            <h1 className="text-white text-3xl font-bold">SureLink Admin</h1>

            <p className="text-blue-100 text-sm mt-2">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="text-white text-sm block mb-2">
              Email Address
            </label>

            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60"
                size={18}
              />

              <input
                type="email"
                placeholder="admin@surelink.com"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/15 border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="text-white text-sm block mb-2">Password</label>

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60"
                size={18}
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/15 border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 text-sm text-white">
              <input type="checkbox" className="rounded" />
              Remember Me
            </label>

            <button className="text-sm text-white hover:text-blue-100">
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button className="w-full py-3 rounded-xl bg-white text-[#005EFF] font-bold hover:scale-[1.02] transition-all shadow-lg">
            Sign In
          </button>

          {/* Security Notice */}
          <div className="mt-6 flex items-center justify-center gap-2 text-blue-100 text-sm">
            <ShieldCheck size={16} />

            <span>Secure Administrator Access</span>
          </div>
        </div>
      </div>
    </div>
  );
}
