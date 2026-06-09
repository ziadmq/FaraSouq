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
  ExternalLink, 
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto w-full space-y-8 text-right font-sans"
    >
      
      {/* Simulated Center Wallet Status Card */}
      <div className="bg-[#191f2f] rounded-2xl p-6 border border-amber-400/20 relative overflow-hidden group shadow-[0_0_30px_rgba(251,191,36,0.06)] hover:border-amber-400/40 transition-all text-center">
        <div className="absolute -right-10 -top-10 w-44 h-44 bg-amber-400/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center gap-2 justify-center">
            <Wallet className="w-5 h-5 text-amber-500 fill-amber-500/20" />
            <span className="text-[#9c8f79] text-xs font-bold uppercase tracking-wider">رصيد حسابك الحالي</span>
          </div>
          <div className="flex items-baseline gap-1 bg-gradient-to-l from-white to-[#dce2f7] bg-clip-text text-transparent font-sans">
            <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight">{walletBalance.toFixed(2)}</span>
            <span className="text-sm font-semibold text-amber-400">د.أ</span>
          </div>
        </div>
      </div>

      {/* Request form (Exclusive CliQ payment layout) */}
      <section className="bg-[#191f2f] rounded-2xl p-6 sm:p-8 border border-[#4f4633]/30 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full" />
        
        <div className="flex items-center gap-3 justify-end border-b border-[#4f4633]/20 pb-4">
          <div>
            <h2 className="font-headline-md text-xl sm:text-2xl font-black text-white">طلب شحن وتعبئة الرصيد</h2>
            <p className="text-xs text-[#9c8f79] mt-1">اشحن محفظتك فوراً ومجاناً عبر الإيداع البنكي السريع</p>
          </div>
          <div className="p-3 bg-sky-500/10 rounded-xl border border-sky-500/20 text-sky-400 flex-shrink-0">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        <form onSubmit={handleDepositSubmit} className="space-y-6">
          
          {/* Select Payment channels (Only showing CLIQ as requested) */}
          <div className="space-y-2">
            <label className="text-xs text-[#d3c5ac] font-bold block">بوابة الشحن المعتمدة</label>
            <div className="p-4 rounded-xl border border-sky-450 bg-sky-500/5 flex items-center justify-between transition-all">
              <div className="text-left font-mono text-[10px] text-sky-400 font-extrabold bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                طلب مباشر فوراً
              </div>
              <div className="text-right">
                <span className="font-extrabold text-[#dce2f7] text-sm block">CliQ مباشر ومجاني</span>
                <span className="text-[10px] text-[#9c8f79]">أسرع طريقة شحن معتمدة ومجانية</span>
              </div>
            </div>
          </div>

          {/* Admin Account details & QR Panel */}
          <div className="space-y-4 bg-[#070e1d] p-5 rounded-xl border border-[#4f4633]/30">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-[#4f4633]/20 pb-1">بيانات حساب الإدارة للتحويل</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              
              {/* Left Block: QR code box */}
              <div className="flex flex-col items-center justify-center p-3.5 bg-white rounded-xl shadow-inner border border-slate-200">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvMuv-hPMQ_2n5zqlH_yd1mCI8KQyQF7iusj3GZCkBkBZ1u37TSW6qt6Fya284c6fSIVANE0wG8C9tmiZ1MnCxDyGvK_1JmviFupI_9G5oJ5PoqiRbKps_ISgCFQPjddWrf9_wPNad6SLidtdKRzrzsMuUml3AvfwwyPhjP1eEnHalk0CCrJso2ItA1p0uVADRPikdbRqiFOsgJiUumVlBX1EGfY4A0OQo37lJLwXQuietl40GN53vUpjAYK8Lo_MknYpmCTZ4Q94" 
                  alt="CliQ Payment QR" 
                  className="w-28 h-28 object-contain"
                />
                <span className="text-[10px] text-slate-500 font-extrabold mt-1.5">امسح كود CliQ للتحويل</span>
              </div>

              {/* Right Block: Account Coordinates for Copying */}
              <div className="space-y-3">
                <div className="bg-[#191f2f] rounded-lg p-3 flex items-center justify-between border border-[#4f4633]/30">
                  <button 
                    type="button"
                    onClick={() => handleCopyText("FAARA-SHOP-99")}
                    className="text-xs text-amber-400 hover:text-amber-200 flex items-center gap-1 font-semibold transition-colors shrink-0 font-sans"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedText ? "تم النسخ" : "نسخ الاسم"}</span>
                  </button>
                  <div className="min-w-0 pr-2">
                    <p className="text-[10px] text-[#9c8f79]">اسم مستعار CliQ (Alias)</p>
                    <p className="font-mono font-bold text-sm text-white tracking-wider truncate">FAARA-SHOP-99</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-400/5 rounded-lg border border-amber-400/10">
                  <p className="text-[10px] text-[#d3c5ac] leading-relaxed">
                    💡 يرجى تحويل كامل المبلغ المطلوب عبر تطبيق البنك الخاص بك عن طريق خدمة CliQ باستخدام اسم المستعار أعلاه، وتنزيل صورة الإيصال لإرفاقها في الحقل أدناه.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Input and upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Amount Input */}
            <div className="space-y-1">
              <label className="text-xs text-[#d3c5ac] block font-bold">المبلغ المراد شحنه</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full bg-[#070e1d] border border-[#4f4633]/40 rounded-xl px-4 py-3 text-sm text-left font-mono font-bold outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-white"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-sky-400 font-mono">JOD</span>
              </div>
            </div>

            {/* Receipt image file picker */}
            <div className="space-y-1">
              <label className="text-xs text-[#d3c5ac] block font-bold">إرفاق إيصال الحوالة (صورة)</label>
              <label className="flex flex-col items-center justify-center w-full h-[46px] border border-dashed border-[#4f4633]/40 hover:border-sky-500/50 rounded-xl cursor-pointer bg-[#070e1d] hover:bg-[#111827] transition-all px-4">
                <div className="flex items-center justify-between w-full h-full gap-2">
                  <ExternalLink className="w-4 h-4 text-[#9c8f79] shrink-0" />
                  <div className="min-w-0 text-right">
                    {receiptFileName ? (
                      <p className="text-xs text-emerald-400 font-bold max-w-[180px] truncate">{receiptFileName}</p>
                    ) : (
                      <p className="text-xs text-[#d3c5ac] truncate font-semibold">اضغط لاختيار صورة الإيصال</p>
                    )}
                  </div>
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
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-4 rounded-xl cursor-pointer shadow-lg hover:shadow-sky-800/20 text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 border border-sky-500/25"
          >
            {isDepositing ? (
              <span>جاري إرسال وتدقيق البيانات الحالية...</span>
            ) : (
              <>
                <span>أرسل طلب الشحن فوراً</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>

        </form>
      </section>

      {/* HISTORICAL RECENT REQUESTS */}
      <section className="bg-[#191f2f] rounded-2xl border border-[#4f4633]/30 overflow-hidden shadow-md text-right">
        <div className="p-5 border-b border-[#4f4633]/30 bg-[#232a3a] flex justify-between items-center bg-gradient-to-l from-[#232a3a] to-[#191f2f]">
          <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2 justify-end">
            <span>سجل طلبات المحفظة والشراء الأخيرة</span>
            <History className="w-5 h-5 text-amber-400" />
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-[#070e1d] text-[#9c8f79] uppercase font-bold tracking-wider border-b border-[#4f4633]/20">
                <th className="px-5 py-3.5">رقم المعاملة</th>
                <th className="px-5 py-3.5">المنتج / العملية</th>
                <th className="px-5 py-3.5">تاريخ الإرسال</th>
                <th className="px-5 py-3.5">المبلغ المدفوع</th>
                <th className="px-5 py-3.5">حالة المعاملة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4f4633]/10">
              {userOrders.map(item => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-white">{item.id}</td>
                  <td className="px-5 py-4 font-semibold">{item.product}</td>
                  <td className="px-5 py-4 text-[#9c8f79]">{item.date}</td>
                  <td className="px-5 py-4 font-mono font-extrabold text-amber-400">
                    {item.price.toFixed(2)} {item.currency}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold border inline-block ${
                      item.status === OrderStatus.COMPLETED 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : item.status === OrderStatus.PENDING
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : item.status === OrderStatus.PROCESSING
                            ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </motion.div>
  );
}
