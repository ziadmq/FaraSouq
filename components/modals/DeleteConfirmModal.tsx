/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle } from "lucide-react";

interface ProductDeleteModalProps {
  itemToDelete: { id: string; name: string } | null;
  setItemToDelete: (item: { id: string; name: string } | null) => void;
  confirmDeleteItem: () => void;
}

export function ProductDeleteModal({
  itemToDelete,
  setItemToDelete,
  confirmDeleteItem
}: ProductDeleteModalProps) {
  return (
    <AnimatePresence>
      {itemToDelete && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            className="bg-[#191f2f] border border-rose-500/30 rounded-2xl max-w-md w-full p-6 text-right space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-2xl rounded-full" />
            
            <div className="flex items-center gap-3 justify-end text-rose-400">
              <span className="text-base font-extrabold font-headline">تأكيد حذف المنتج</span>
              <AlertCircle className="w-6 h-6 shrink-0" />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-[#dce2f7] leading-relaxed">
                هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً من المتجر؟
              </p>
              <p className="text-sm font-black text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                {itemToDelete.name}
              </p>
              <p className="text-xs text-[#9c8f79]">
                ⚠️ تنبيه: هذا الإجراء لا يمكن التراجع عنه وسيتم إزالة المنتج وباقاته بشكل دائم من قاعدة البيانات.
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button 
                onClick={() => setItemToDelete(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs sm:text-sm cursor-pointer border border-[#4f4633]/20 transition-all active:scale-95"
              >
                إلغاء والتراجع
              </button>
              <button 
                onClick={confirmDeleteItem}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl text-xs sm:text-sm cursor-pointer shadow-lg shadow-rose-950/20 transition-all active:scale-95"
              >
                نعم، احذف المنتج
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface UserDeleteModalProps {
  userToDelete: { id: string; name: string } | null;
  setUserToDelete: (user: { id: string; name: string } | null) => void;
  confirmDeleteUser: () => void;
}

export function UserDeleteModal({
  userToDelete,
  setUserToDelete,
  confirmDeleteUser
}: UserDeleteModalProps) {
  return (
    <AnimatePresence>
      {userToDelete && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            className="bg-[#191f2f] border border-rose-500/30 rounded-2xl max-w-md w-full p-6 text-right space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-2xl rounded-full" />
            
            <div className="flex items-center gap-3 justify-end text-rose-400">
              <span className="text-base font-extrabold font-headline">تأكيد حذف اللاعب</span>
              <AlertCircle className="w-6 h-6 shrink-0" />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-[#dce2f7] leading-relaxed">
                هل أنت متأكد من رغبتك في حذف حساب هذا اللاعب نهائياً من الموقع؟
              </p>
              <p className="text-sm font-black text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                {userToDelete.name}
              </p>
              <p className="text-xs text-[#9c8f79]">
                ⚠️ تنبيه: هذا الإجراء سيقوم بحذف اللاعب نهائياً وإلغاء رصيده الحالي ولن يتمكن من تسجيل الدخول به مرة أخرى إلا بإنشاء حساب جديد.
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button 
                onClick={() => setUserToDelete(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs sm:text-sm cursor-pointer border border-[#4f4633]/20 transition-all active:scale-95"
              >
                إلغاء والتراجع
              </button>
              <button 
                onClick={confirmDeleteUser}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl text-xs sm:text-sm cursor-pointer shadow-lg shadow-rose-950/20 transition-all active:scale-95"
              >
                نعم، احذف الحساب
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
