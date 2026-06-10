import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ShieldAlert, Check, RefreshCw, KeyRound, ArrowRight } from "lucide-react";
import AuthLayout from "./AuthLayout";

interface ResetPasswordUIProps {
  email: string;
  setEmail: (val: string) => void;
  isLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  shakeError: boolean;
  handleResetPassword: (e: React.FormEvent) => void;
  onSwitchToLogin: () => void;
}

export default function ResetPasswordUI({
  email,
  setEmail,
  isLoading,
  errorMessage,
  successMessage,
  shakeError,
  handleResetPassword,
  onSwitchToLogin
}: ResetPasswordUIProps) {
  return (
    <AuthLayout emailOrNameForCard={email} isRegister={false}>
      <motion.div 
        animate={shakeError ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="w-full bg-[#11192a]/90 backdrop-blur-2xl border border-emerald-500/15 p-5 sm:p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        {/* Styled Gold Top Header Ring */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(251,191,36,0.5)]" />

        {/* Title Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-[#21314d]/60">
          <div className="text-right w-full">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-1.5 justify-end">
              <span>استعادة كلمة المرور</span>
              <KeyRound className="w-5 h-5 text-emerald-400" />
            </h2>
            <p className="text-xs text-[#8da1c5] mt-1.5">
              أدخل بريدك الإلكتروني لتلقي رابط إعادة التعيين
            </p>
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

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#b0bfdb] block text-right">
              البريد الإلكتروني
            </label>
            <div className="relative group/input">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                className="w-full bg-[#070e1d] border border-[#21314d] group-hover/input:border-emerald-400/40 focus:border-emerald-400 text-white rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400 text-right font-mono transition-all"
              />
              <Mail className="w-5 h-5 text-[#5e7193] absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within/input:text-emerald-400 transition-colors" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !!successMessage}
            className={`w-full bg-emerald-400 hover:bg-emerald-300 disabled:bg-[#1f283d] text-slate-950 font-black py-3.5 rounded-xl cursor-pointer transition-all active:scale-98 text-sm shadow-xl mt-3 flex items-center justify-center gap-2 ${
              isLoading || !!successMessage ? "pointer-events-none opacity-60" : "glow-primary"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2 text-slate-950">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري إرسال الرابط...</span>
              </div>
            ) : (
              <>
                <span>إرسال رابط إعادة التعيين</span>
                <Mail className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>

          {/* Separator */}
          <div className="flex items-center justify-between my-5 py-1">
            <div className="flex-1 h-px bg-[#21314d]/60"></div>
          </div>

          {/* Back to Login */}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="w-full bg-transparent hover:bg-[#1d2c4b]/50 border border-transparent hover:border-[#2e3e5c] text-[#8da1c5] hover:text-white font-bold py-3.5 rounded-xl cursor-pointer transition-all active:scale-98 text-sm flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لتسجيل الدخول</span>
          </button>
        </form>
      </motion.div>
    </AuthLayout>
  );
}
