/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Check, 
  Award,
  RefreshCw,
  ShieldAlert,
  LogIn
} from "lucide-react";
import AuthLayout from "./AuthLayout";

interface LoginUIProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  shakeError: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleGoogleLogin: () => void;
  onSwitchToRegister: () => void;
  onSwitchToResetPassword: () => void;
}

export default function LoginUI({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading,
  errorMessage,
  successMessage,
  shakeError,
  handleSubmit,
  handleGoogleLogin,
  onSwitchToRegister,
  onSwitchToResetPassword
}: LoginUIProps) {
  return (
    <AuthLayout emailOrNameForCard={email} isRegister={false}>
      <motion.div 
        animate={shakeError ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="w-full bg-[#11192a]/90 backdrop-blur-2xl border border-emerald-500/15 p-5 sm:p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        {/* Styled Green Top Header Ring */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.5)]" />

        {/* Full-width Tab Segment Switcher */}
        <div className="flex bg-[#070e1d] p-1.5 rounded-xl border border-[#21314d] mb-8 relative w-full overflow-hidden">
          <button
            type="button"
            className="flex-1 text-sm py-3 font-bold rounded-lg transition-all cursor-pointer relative z-10 text-slate-950 font-black"
          >
            تسجيل الدخول
            <motion.div 
              layoutId="activeAuthBg" 
              className="absolute inset-0 bg-emerald-400 rounded-lg -z-10 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
            />
          </button>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="flex-1 text-sm py-3 font-bold rounded-lg transition-all cursor-pointer relative z-10 text-[#8da1c5] hover:text-white"
          >
            إنشاء حساب
          </button>
        </div>

        {/* Error and Success notifications inside Form */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3.5 rounded-xl text-xs font-bold text-right mb-6 flex items-start gap-2 justify-end"
            >
              <span className="leading-relaxed">{errorMessage}</span>
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-xl text-xs font-bold text-right mb-6 flex items-center gap-2 justify-end"
            >
              <span>{successMessage}</span>
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          
          {/* Email Field with Floating Label */}
          <div className="relative group/input">
            <input
              id="email"
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="peer w-full bg-[#070e1d] border border-[#21314d] focus:border-emerald-500 text-white rounded-xl pr-12 pl-4 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right font-mono transition-all"
            />
            <label 
              htmlFor="email"
              className="absolute text-[#5e7193] bg-[#070e1d] px-2 right-10 top-0 -translate-y-1/2 text-xs transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-emerald-500 pointer-events-none"
            >
              البريد الإلكتروني
            </label>
            <Mail className="w-5 h-5 text-[#5e7193] absolute right-4 top-1/2 -translate-y-1/2 peer-focus:text-emerald-500 transition-colors pointer-events-none" />
            
            {email && !email.includes("@") && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-400/90 font-mono font-bold bg-emerald-400/10 px-2 py-0.5 rounded-md pointer-events-none">
                @farasouq.com ⚙️
              </span>
            )}
          </div>

          {/* Password Field with Floating Label */}
          <div className="relative group/input">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className="peer w-full bg-[#070e1d] border border-[#21314d] focus:border-emerald-500 text-white rounded-xl pr-12 pl-12 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right font-mono transition-all tracking-widest"
            />
            <label 
              htmlFor="password"
              className="absolute text-[#5e7193] bg-[#070e1d] px-2 right-10 top-0 -translate-y-1/2 text-xs transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-focus:top-0 peer-focus:text-xs peer-focus:text-emerald-500 pointer-events-none"
            >
              كلمة المرور
            </label>
            <Lock className="w-5 h-5 text-[#5e7193] absolute right-4 top-1/2 -translate-y-1/2 peer-focus:text-emerald-500 transition-colors pointer-events-none" />
            
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5e7193] hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="text-left -mt-2">
            <span 
              onClick={onSwitchToResetPassword}
              className="text-xs text-[#8da1c5] hover:text-emerald-400 transition-colors cursor-pointer inline-block border-b border-transparent hover:border-emerald-400/50 pb-0.5"
            >
              نسيت كلمة المرور؟
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-emerald-500/10 hover:bg-emerald-500/20 backdrop-blur-md border border-emerald-500 text-emerald-400 font-black py-4 rounded-xl cursor-pointer transition-all active:scale-98 text-sm shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center gap-2 mt-2 ${
              isLoading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري تسجيل الدخول...</span>
              </div>
            ) : (
              <>
                <span>تسجيل الدخول</span>
                <LogIn className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Separator */}
          <div className="flex items-center justify-between my-5 py-1">
            <div className="flex-1 h-px bg-[#21314d]/60"></div>
            <span className="text-[10px] text-[#5e7193] px-3 font-bold uppercase tracking-wider">أو اتصال فوري مباشر</span>
            <div className="flex-1 h-px bg-[#21314d]/60"></div>
          </div>

          {/* Google login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`w-full bg-emerald-500/10 hover:bg-emerald-500/20 backdrop-blur-md border border-emerald-500 text-emerald-400 font-black py-4 rounded-xl cursor-pointer transition-all active:scale-98 text-sm shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center gap-2 ${
              isLoading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>المتابعة باستخدام Google</span>
          </button>

          <div className="text-center text-[10px] text-[#5e7193] pt-2">
            بالاستمرار، فإنك توافق على سياسة الخصوصية وشروط الخدمة المشفرة لدى متجر فارة.
          </div>
        </form>
      </motion.div>
    </AuthLayout>
  );
}
