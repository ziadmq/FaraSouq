/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Wallet, 
  Coins, 
  Copy, 
  Upload, 
  Send, 
  History,
  Landmark,
  CreditCard,
  CheckCircle2
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

const PAYMENT_METHODS = [
  {
    id: PaymentMethod.ARAB_BANK,
    label: "البنك العربي",
    icon: Landmark,
    gradientClass: "from-blue-500/20 to-blue-600/10",
    borderActiveClass: "border-blue-500",
    iconColorClass: "text-blue-400",
  },
  {
    id: PaymentMethod.ORANGE_MONEY,
    label: "Orange Money",
    icon: CreditCard,
    gradientClass: "from-orange-500/20 to-orange-600/10",
    borderActiveClass: "border-orange-500",
    iconColorClass: "text-orange-400",
  },
] as const;

interface MethodInfo {
  label: string;
  accountLabel: string;
  accountValue: string;
  extra: { label: string; value: string }[];
  description: string;
  accentColorClass: string;
  borderColorClass: string;
  glowColorClass: string;
}

function getMethodInfo(method: PaymentMethod): MethodInfo {
  switch (method) {
    case PaymentMethod.ARAB_BANK:
      return {
        label: "البنك العربي",
        accountLabel: "رقم الهاتف - البنك العربي:",
        accountValue: "0779191371",
        extra: [
          { label: "يجب أن يظهر اسم المستفيد:", value: "مؤسسة فارة (Fara Souq)" },
          { label: "البنك:", value: "البنك العربي (Arab Bank)" },
        ],
        description: "لإضافة رصيد إلى محفظتك، يرجى تحويل المبلغ المطلوب عبر البنك العربي إلى رقم الهاتف الموضح أدناه، ثم إرفاق صورة الوصل لتأكيد العملية.",
        accentColorClass: "text-blue-400",
        borderColorClass: "border-blue-500/20",
        glowColorClass: "bg-blue-500/5",
      };
    case PaymentMethod.ORANGE_MONEY:
      return {
        label: "Orange Money",
        accountLabel: "اسم المستخدم - Orange Money:",
        accountValue: "FARASOUQ",
        extra: [
          { label: "يجب أن يظهر اسم المستفيد:", value: "مؤسسة فارة (Fara Souq)" },
          { label: "المحفظة:", value: "Orange Money" },
        ],
        description: "لإضافة رصيد إلى محفظتك، يرجى تحويل المبلغ المطلوب عبر Orange Money إلى اسم المستخدم الموضح أدناه، ثم إرفاق صورة الوصل لتأكيد العملية.",
        accentColorClass: "text-orange-400",
        borderColorClass: "border-orange-500/20",
        glowColorClass: "bg-orange-500/5",
      };
    default:
      return {
        label: "البنك العربي",
        accountLabel: "رقم الهاتف - البنك العربي:",
        accountValue: "0779191371",
        extra: [
          { label: "يجب أن يظهر اسم المستفيد:", value: "مؤسسة فارة (Fara Souq)" },
          { label: "البنك:", value: "البنك العربي (Arab Bank)" },
        ],
        description: "لإضافة رصيد إلى محفظتك، يرجى تحويل المبلغ المطلوب عبر البنك العربي إلى رقم الهاتف الموضح أدناه، ثم إرفاق صورة الوصل لتأكيد العملية.",
        accentColorClass: "text-blue-400",
        borderColorClass: "border-blue-500/20",
        glowColorClass: "bg-blue-500/5",
      };
  }
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
  const [localMethod, setLocalMethod] = useState<PaymentMethod>(paymentMethod);

  const handleSelectMethod = (method: PaymentMethod) => {
    setLocalMethod(method);
    setPaymentMethod(method);
  };

  const methodInfo = getMethodInfo(localMethod);
  const activeMethodConfig = PAYMENT_METHODS.find(m => m.id === localMethod) ?? PAYMENT_METHODS[0];
  const ActiveIcon = activeMethodConfig.icon;

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
      <div className="bg-gradient-to-r from-[#0a1a15] to-[#111827] rounded-2xl p-8 border border-amber-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col items-start w-full relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-amber-400" />
            <span className="text-amber-100/80 text-sm font-bold tracking-wide">الرصيد المتاح</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-400 tracking-tight drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{walletBalance.toFixed(2)}</span>
            <span className="text-amber-100/70 font-bold tracking-widest">JOD</span>
          </div>
        </div>
      </div>

      {/* Deposit Form */}
      <section className="bg-[#111827] rounded-2xl border border-slate-800 overflow-hidden shadow-sm relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-400" />
        <div className="p-6 sm:p-8 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center justify-start gap-2">
            <ActiveIcon className={`w-6 h-6 ${activeMethodConfig.iconColorClass}`} />
            <span>شحن المحفظة ({methodInfo.label})</span>
          </h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            {methodInfo.description}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleDepositSubmit} className="space-y-8">

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-300 text-right">اختر طريقة الدفع</p>
              <div className="grid grid-cols-3 gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isActive = localMethod === method.id;
                  return (
                    <motion.button
                      key={method.id}
                      type="button"
                      onClick={() => handleSelectMethod(method.id)}
                      whileTap={{ scale: 0.96 }}
                      className={[
                        "relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden",
                        isActive
                          ? `${method.borderActiveClass} bg-gradient-to-b ${method.gradientClass}`
                          : "border-slate-700 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-800/50"
                      ].join(" ")}
                    >
                      {isActive && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${method.iconColorClass}`} />
                        </div>
                      )}
                      <Icon className={`w-6 h-6 transition-colors ${isActive ? method.iconColorClass : "text-slate-400"}`} />
                      <span className={`text-xs font-bold text-center leading-tight transition-colors ${isActive ? "text-white" : "text-slate-400"}`}>
                        {method.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Payment Details */}
            <motion.div
              key={localMethod}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`bg-slate-900/50 rounded-2xl p-6 border ${methodInfo.borderColorClass} relative overflow-hidden group`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${methodInfo.glowColorClass} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none`} />

              <div className="flex flex-col gap-5 relative z-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-right w-full sm:w-auto">
                    <p className="text-sm text-slate-400 mb-2">{methodInfo.accountLabel}</p>
                    <div className="flex items-center justify-start">
                      <span className={`text-2xl sm:text-3xl font-bold ${methodInfo.accentColorClass} tracking-wider`}>{methodInfo.accountValue}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(methodInfo.accountValue)}
                    className={`w-full sm:w-auto bg-slate-800 hover:bg-slate-700 ${methodInfo.accentColorClass} border border-slate-700 hover:border-slate-600 px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0`}
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedText ? "تم النسخ بنجاح!" : "نسخ للتحويل"}</span>
                  </button>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 flex flex-col sm:flex-row gap-6 sm:gap-12 border border-slate-700/50">
                  {methodInfo.extra.map((item, idx) => (
                    <div key={idx}>
                      <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                      <p className="text-sm font-bold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

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
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-16 pr-4 py-4 text-right font-bold text-xl text-white outline-none focus:border-amber-500 transition-colors shadow-inner"
                  />
                  <div className="absolute left-0 top-0 bottom-0 px-4 flex items-center bg-slate-800/50 rounded-l-xl border-r border-slate-800">
                    <span className="text-amber-500 font-bold">JOD</span>
                  </div>
                </div>
              </div>

              {/* Receipt Upload */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300 block text-right">صورة وصل التحويل (Screenshot)</label>
                <label className="flex flex-col items-center justify-center w-full h-[60px] border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-xl cursor-pointer bg-slate-900 hover:bg-slate-800/80 transition-all px-4 group">
                  <div className="flex items-center justify-center w-full gap-3">
                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors shrink-0" />
                    <span className={`text-sm font-medium truncate max-w-full transition-colors ${receiptFileName ? 'text-amber-400' : 'text-slate-400 group-hover:text-white'}`}>
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
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 disabled:shadow-none text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] active:scale-95"
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
                    <td className="px-6 py-4 font-mono text-amber-400">
                      <div className="flex gap-1 justify-start">
                        <span>{item.price.toFixed(2)}</span>
                        <span>{item.currency}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        item.status === OrderStatus.COMPLETED
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
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
