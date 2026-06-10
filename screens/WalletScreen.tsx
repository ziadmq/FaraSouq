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
      <div className="bg-[#111827] rounded-2xl p-8 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-end w-full">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-slate-400 text-sm font-medium">الرصيد المتاح</span>
            <Wallet className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-emerald-500 font-medium">JOD</span>
            <span className="text-4xl font-bold text-white tracking-tight">{walletBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Deposit Form */}
      <section className="bg-[#111827] rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center justify-end gap-2">
            <span>شحن المحفظة</span>
            <Coins className="w-5 h-5 text-emerald-500" />
          </h2>
          <p className="text-sm text-slate-400 mt-1">قم بتحويل المبلغ المطلوب وأرفق الوصل ليتم شحن حسابك.</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleDepositSubmit} className="space-y-6">
            
            {/* Payment Details */}
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button 
                type="button"
                onClick={() => handleCopyText("FAARA-SHOP-99")}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedText ? "تم النسخ" : "نسخ الاسم"}</span>
              </button>
              <div className="text-right flex-1">
                <p className="text-sm text-slate-400 mb-1">حساب CliQ للتحويل:</p>
                <div className="flex items-center justify-end gap-3">
                  <span className="text-xl font-mono font-bold text-white">FAARA-SHOP-99</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 block text-right">المبلغ المراد شحنه (JOD)</label>
                <input 
                  type="number" 
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  min="0.1"
                  step="0.01"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-left font-mono text-white outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Receipt Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 block text-right">صورة وصل التحويل</label>
                <label className="flex flex-col items-center justify-center w-full h-[50px] border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl cursor-pointer bg-slate-900 hover:bg-slate-800 transition-colors px-4">
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="text-sm text-slate-300 truncate text-right w-full">
                      {receiptFileName || "اختر صورة الوصل..."}
                    </span>
                    <Upload className="w-4 h-4 text-slate-400 shrink-0" />
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
              disabled={isDepositing}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isDepositing ? (
                <span>جاري الإرسال...</span>
              ) : (
                <>
                  <span>إرسال الطلب</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Orders History */}
      <section className="bg-[#111827] rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center justify-end gap-2">
            <span>سجل طلبات المحفظة</span>
            <History className="w-5 h-5 text-slate-400" />
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 border-b border-slate-800">
                <th className="px-6 py-4 font-medium">الحالة</th>
                <th className="px-6 py-4 font-medium">المبلغ</th>
                <th className="px-6 py-4 font-medium">تاريخ الإرسال</th>
                <th className="px-6 py-4 font-medium">العملية</th>
                <th className="px-6 py-4 font-medium">رقم المعاملة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {userOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    لا يوجد طلبات سابقة.
                  </td>
                </tr>
              ) : (
                userOrders.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
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
                    <td className="px-6 py-4 font-mono text-emerald-400">
                      {item.price.toFixed(2)} {item.currency}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{item.date}</td>
                    <td className="px-6 py-4 text-white">{item.product}</td>
                    <td className="px-6 py-4 font-mono text-slate-300">{item.id}</td>
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
