/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { 
  Wallet, 
  Coins, 
  Copy, 
  Upload, 
  Send, 
  History 
} from "lucide-react";
import { Order, OrderStatus, PaymentMethod } from "../types";

interface WalletScreenProps {
  walletBalance: number;
  depositAmount: string;
  setDepositAmount: (amount: string) => void;
  handleDepositSubmit: (e: React.FormEvent) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  copiedText: boolean;
  handleCopyText: (text: string) => void;
  receiptFileName: string;
  handleReceiptUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDepositing: boolean;
  userOrders: Order[];
}

export default function WalletScreen({
  walletBalance,
  depositAmount,
  setDepositAmount,
  handleDepositSubmit,
  paymentMethod,
  setPaymentMethod,
  copiedText,
  handleCopyText,
  receiptFileName,
  handleReceiptUpload,
  isDepositing,
  userOrders
}: WalletScreenProps) {
  return (
    <motion.div
      key="wallet"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="max-w-3xl mx-auto w-full space-y-8 text-right font-sans"
    >
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-[#0a1a15] to-[#111827] rounded-2xl p-8 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col items-start w-full relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-100/80 text-sm font-bold tracking-wide">الرصيد المتاح</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{walletBalance.toFixed(2)}</span>
            <span className="text-emerald-100/70 font-bold tracking-widest">JOD</span>
          </div>
        </div>
      </div>

      {/* Deposit Form */}
      <section className="bg-[#111827] rounded-2xl border border-slate-800 overflow-hidden shadow-sm relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-emerald-400" />
        <div className="p-6 sm:p-8 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center justify-start gap-2">
            <Coins className="w-6 h-6 text-emerald-500" />
            <span>شحن المحفظة (CliQ)</span>
          </h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            لإضافة رصيد إلى محفظتك، يرجى تحويل المبلغ المطلوب عبر تطبيق <b>CliQ</b> إلى الحساب الموضح أدناه، ثم إرفاق صورة الوصل لتأكيد العملية.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleDepositSubmit} className="space-y-8">
            
            {/* Payment Details */}
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-emerald-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex flex-col gap-5 relative z-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-right w-full sm:w-auto">
                    <p className="text-sm text-slate-400 mb-2">اسم الحساب (Alias) - CliQ:</p>
                    <div className="flex items-center justify-start">
                      <span className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-wider">FAARA-SHOP-99</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleCopyText("FAARA-SHOP-99")}
                    className="w-full sm:w-auto bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedText ? "تم النسخ بنجاح!" : "نسخ للتحويل"}</span>
                  </button>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 flex flex-col sm:flex-row gap-6 sm:gap-12 border border-slate-700/50">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">يجب أن يظهر اسم المستفيد:</p>
                    <p className="text-sm font-bold text-white">مؤسسة فارة (Fara Souq)</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">البنك / المحفظة:</p>
                    <p className="text-sm font-bold text-white">بنك الاتحاد (Bank al Etihad)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Amount Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300 block text-right">المبلغ المراد شحنه</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    min="0.1"
                    step="0.01"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-16 pr-4 py-4 text-right font-bold text-xl text-white outline-none focus:border-emerald-500 transition-colors shadow-inner"
                  />
                  <div className="absolute left-0 top-0 bottom-0 px-4 flex items-center bg-slate-800/50 rounded-l-xl border-r border-slate-800">
                    <span className="text-emerald-500 font-bold">JOD</span>
                  </div>
                </div>
              </div>

              {/* Receipt Upload */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300 block text-right">صورة وصل التحويل (Screenshot)</label>
                <label className="flex flex-col items-center justify-center w-full h-[60px] border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl cursor-pointer bg-slate-900 hover:bg-slate-800/80 transition-all px-4 group">
                  <div className="flex items-center justify-center w-full gap-3">
                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0" />
                    <span className={`text-sm font-medium truncate max-w-full transition-colors ${receiptFileName ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'}`}>
                      {receiptFileName || "اضغط هنا لاختيار صورة الوصل..."}
                    </span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    required
                    className="hidden" 
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isDepositing || !depositAmount || !receiptFileName}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 disabled:shadow-none text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] active:scale-95"
            >
              {isDepositing ? (
                <span>جاري الإرسال...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 rotate-180" />
                  <span>إرسال الطلب</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Orders History */}
      <section className="bg-[#111827] rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center justify-start gap-2">
            <History className="w-5 h-5 text-slate-400" />
            <span>سجل طلبات المحفظة</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 border-b border-slate-800">
                <th className="px-6 py-4 font-medium">رقم المعاملة</th>
                <th className="px-6 py-4 font-medium">تاريخ الإرسال</th>
                <th className="px-6 py-4 font-medium">المبلغ</th>
                <th className="px-6 py-4 font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {userOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    لا يوجد طلبات سابقة.
                  </td>
                </tr>
              ) : (
                userOrders.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-300">{item.id}</td>
                    <td className="px-6 py-4 text-slate-400" dir="ltr">{item.date}</td>
                    <td className="px-6 py-4 font-mono text-emerald-400">
                      <div className="flex gap-1 justify-start">
                        <span>{item.price.toFixed(2)}</span>
                        <span>{item.currency}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        item.status === OrderStatus.COMPLETED 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : item.status === OrderStatus.PENDING
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : item.status === OrderStatus.PROCESSING
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

    </motion.div>
  );
}
