/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, Zap } from "lucide-react";

interface Toast {
  id: string;
  text: string;
  type: "success" | "error" | "info";
}

interface ToastContainerProps {
  toasts: Toast[];
}

export default function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div className="fixed top-24 left-4 sm:left-6 z-50 flex flex-col gap-2 w-[calc(100vw-32px)] sm:w-auto sm:max-w-md pointer-events-none" dir="rtl">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`p-4 rounded-xl shadow-lg border pointer-events-auto flex items-center justify-between gap-3 text-sm font-medium ${
              toast.type === "success" 
                ? "bg-slate-900/95 text-emerald-400 border-emerald-500/30 shadow-emerald-950/25" 
                : toast.type === "error"
                ? "bg-slate-900/95 text-rose-400 border-rose-500/30 shadow-rose-950/25"
                : "bg-slate-900/95 text-sky-400 border-sky-500/30 shadow-sky-950/25"
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === "success" && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
              {toast.type === "error" && <XCircle className="w-5 h-5 flex-shrink-0" />}
              {toast.type === "info" && <Zap className="w-5 h-5 flex-shrink-0" />}
              <span className="leading-relaxed text-right">{toast.text}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
