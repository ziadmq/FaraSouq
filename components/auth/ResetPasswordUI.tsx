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
        {/* Styled Green Top Header Ring */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.5)]" />

        {/* Title Block */}
        <div className="mb-8 pb-6 border-b border-[#21314d]/60 flex flex-col items-start justify-start text-right w-full">
          <div className="flex items-center justify-start gap-3 mb-3">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)] shrink-0">
              <KeyRound className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              استعادة كلمة المرور
            </h2>
          </div>
          <p className="text-sm text-[#8da1c5] leading-relaxed w-full">
            أدخل بريدك الإلكتروني المسجل أدناه وسنرسل لك رابطاً آمناً لإعادة تعيين كلمة المرور.
          </p>
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
        <form onSubmit={handleResetPassword} className="space-y-6 pt-2">
          
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
          </div>

          <button
            type="submit"
            disabled={isLoading || !!successMessage}
            className={`w-full bg-emerald-500/10 hover:bg-emerald-500/20 backdrop-blur-md border border-emerald-500 text-emerald-400 font-black py-4 rounded-xl cursor-pointer transition-all active:scale-98 text-sm shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center gap-2 mt-2 ${
              isLoading || !!successMessage ? "pointer-events-none opacity-60" : ""
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري إرسال الرابط...</span>
              </div>
            ) : (
              <>
                <span>إرسال رابط إعادة التعيين</span>
                <Mail className="w-5 h-5" />
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
