/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Mail, 
  User as UserIcon,
  Eye, 
  EyeOff, 
  Sparkles, 
  Check, 
  Award,
  RefreshCw,
  ShieldAlert
} from "lucide-react";
import AuthLayout from "./AuthLayout";
import { PasswordStrength } from "../../types";

interface RegisterUIProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  fullName: string;
  setFullName: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  shakeError: boolean;
  strength: PasswordStrength;
  handleSubmit: (e: React.FormEvent) => void;
  handleGoogleLogin: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterUI({
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  isLoading,
  errorMessage,
  successMessage,
  shakeError,
  strength,
  handleSubmit,
  handleGoogleLogin,
  onSwitchToLogin
}: RegisterUIProps) {
  return (
    <AuthLayout emailOrNameForCard={fullName} isRegister={true}>
      <motion.div 
        animate={shakeError ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="w-full bg-[#11192a]/90 backdrop-blur-2xl border border-amber-500/15 p-5 sm:p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        {/* Styled Gold Top Header Ring */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_rgba(251,191,36,0.5)]" />

        {/* Title Block & Tab Segment Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-[#21314d]/60">
          <div className="text-right">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-1.5 justify-end">
              <span>إنشاء حساب لاعب جديد</span>
              <Award className="w-5 h-5 text-amber-400" />
            </h2>

          </div>

          {/* Mode Selector slider tab */}
          <div className="flex bg-[#070e1d] p-1 rounded-xl border border-[#21314d] self-end sm:self-center relative overflow-hidden">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-xs px-4 py-2 font-bold rounded-lg transition-all cursor-pointer relative z-10 text-[#8da1c5] hover:text-white"
            >
              دخول
            </button>
            <button
              type="button"
              className="text-xs px-4 py-2 font-bold rounded-lg transition-all cursor-pointer relative z-10 text-slate-950 font-black"
            >
              تسجيل
              <motion.div 
                layoutId="activeAuthBg" 
                className="absolute inset-0 bg-amber-400 rounded-lg -z-10 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
              />
            </button>
          </div>
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

        {/* Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#b0bfdb] block text-right">الاسم بالكامل للكابتن</label>
            <div className="relative group/input">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أدخل اسمك الحقيقي أو المستعار"
                className="w-full bg-[#070e1d] border border-[#21314d] group-hover/input:border-amber-400/40 focus:border-amber-400 text-white rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 text-right transition-all font-sans"
              />
              <UserIcon className="w-5 h-5 text-[#5e7193] absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within/input:text-amber-400 transition-colors" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              {email && !email.includes("@") && (
                <span className="text-[10px] text-amber-400/90 font-mono font-bold bg-amber-400/10 px-2 py-0.5 rounded-md">
                  {email.trim()}@farasouq.com ⚙️
                </span>
              )}
              <label className="text-xs font-bold text-[#b0bfdb] block text-right">
                اسم مستخدم أو بريد إلكتروني
              </label>
            </div>
            <div className="relative group/input">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="مثال: khaled أو email@domain.com"
                className="w-full bg-[#070e1d] border border-[#21314d] group-hover/input:border-amber-400/40 focus:border-amber-400 text-white rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 text-right font-mono transition-all"
              />
              <Mail className="w-5 h-5 text-[#5e7193] absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within/input:text-amber-400 transition-colors" />
            </div>

          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#b0bfdb] block text-right">كلمة مرور الحساب</label>
            <div className="relative group/input">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#070e1d] border border-[#21314d] group-hover/input:border-amber-400/40 focus:border-amber-400 text-white rounded-xl pr-10 pl-10 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 text-right font-mono transition-all"
              />
              <Lock className="w-5 h-5 text-[#5e7193] absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within/input:text-amber-400 transition-colors" />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5e7193] hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength indicator bar */}
            {password.length > 0 && (
              <div className="space-y-1.5 pt-1 text-right">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-[#8da1c5]">
                    مستوى القوة: <span className="text-amber-300 font-bold">{strength.label}</span>
                  </span>
                  <span className="text-[#5e7193] font-mono">{strength.score * 20}%</span>
                </div>
                <div className="h-1.5 bg-[#070e1d] rounded-full overflow-hidden flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <div
                      key={lvl}
                      className={`h-full flex-1 transition-all duration-500 ${
                        lvl <= strength.score ? strength.color : "bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              {confirmPassword && (
                <span className="text-[9px] font-bold flex items-center gap-1">
                  {password === confirmPassword ? (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> متطابقتان
                    </span>
                  ) : (
                    <span className="text-rose-400">⚠️ تأكد من التطابق</span>
                  )}
                </span>
              )}
              <label className="text-xs font-bold text-[#b0bfdb] block text-right">تأكيد الرمز السري</label>
            </div>
            <div className="relative group/input">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد كتابة كلمة المرور"
                className="w-full bg-[#070e1d] border border-[#21314d] group-hover/input:border-amber-400/40 focus:border-amber-400 text-white rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 text-right font-mono transition-all"
              />
              <Lock className="w-5 h-5 text-[#5e7193] absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within/input:text-amber-400 transition-colors" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-amber-400 hover:bg-amber-300 disabled:bg-[#1f283d] text-slate-950 font-black py-3.5 rounded-xl cursor-pointer transition-all active:scale-98 text-sm shadow-xl mt-3 flex items-center justify-center gap-2 ${
              isLoading ? "pointer-events-none opacity-60" : "glow-primary"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2 text-slate-950">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري معالجة الطلب سحابياً...</span>
              </div>
            ) : (
              <>
                <span>تسجيل حساب جديد</span>
                <Sparkles className="w-4 h-4 text-slate-950" />
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
            className={`w-full bg-[#18243c] hover:bg-[#1d2c4b] border border-[#2e3e5c] hover:border-amber-400/40 text-white font-bold py-3.5 rounded-xl cursor-pointer transition-all active:scale-98 text-sm shadow-md flex items-center justify-center gap-3 ${
              isLoading ? "pointer-events-none opacity-60" : "glow-secondary"
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>تسجيل الدخول الآمن بحساب Google</span>
          </button>

          <div className="text-center text-[10px] text-[#5e7193] pt-2">
            بالاستمرار، فإنك توافق على سياسة الخصوصية وشروط الخدمة المشفرة لدى متجر فارة.
          </div>
        </form>
      </motion.div>
    </AuthLayout>
  );
}
