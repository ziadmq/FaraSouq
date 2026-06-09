/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Coins, 
  AlertCircle, 
  Users, 
  Wallet, 
  TrendingUp, 
  CheckCircle2, 
  Eye, 
  ShieldAlert 
} from "lucide-react";
import { Order, OrderStatus } from "../../types";

interface AnalyticsTabProps {
  totalSalesToDisplay: number;
  pendingDepositsToDisplay: number;
  totalMembersToDisplay: number;
  totalInstantDepositsToDisplay: number;
  userOrders: Order[];
  handleAdminAcceptDeposit: (orderId: string, amount: number) => void;
  handleAdminRejectDeposit: (orderId: string) => void;
  setZoomReceiptUrl: (url: string | null) => void;
}

export default function AnalyticsTab({
  totalSalesToDisplay,
  pendingDepositsToDisplay,
  totalMembersToDisplay,
  totalInstantDepositsToDisplay,
  userOrders,
  handleAdminAcceptDeposit,
  handleAdminRejectDeposit,
  setZoomReceiptUrl
}: AnalyticsTabProps) {
  const pendingOrders = userOrders.filter(o => o.status === OrderStatus.PENDING);

  return (
    <div className="space-y-6">
      
      {/* Bento Grid Header statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/30 text-right space-y-1 hover:border-amber-400/30 transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[#9c8f79] text-xs font-bold">إجمالي المبيعات</span>
            <Coins className="w-5 h-5 text-amber-400" />
          </div>
          <p className="font-mono text-xl sm:text-2xl font-black text-white">{totalSalesToDisplay.toFixed(2)} د.أ</p>
          <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5 justify-end">
            <span>مباشرة من قاعدة البيانات Firestore</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </p>
        </div>

        <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/30 text-right space-y-1 hover:border-rose-500/20 transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[#9c8f79] text-xs font-bold">إيداعات قيد المراجعة</span>
            <AlertCircle className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>
          <p className="font-mono text-xl sm:text-2xl font-black text-rose-400">
            {pendingDepositsToDisplay} طلبات
          </p>
          <p className="text-[10px] text-rose-400 font-bold">تتطلب تدقيق يدوي فوري</p>
        </div>

        <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/30 text-right space-y-1 hover:border-sky-500/20 transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[#9c8f79] text-xs font-bold">أعضاء فارة الجدد</span>
            <Users className="w-5 h-5 text-sky-400" />
          </div>
          <p className="font-mono text-xl sm:text-2xl font-black text-white">{totalMembersToDisplay} لاعب</p>
          <p className="text-[10px] text-sky-400 font-bold">مسجلين في Firebase Auth</p>
        </div>

        <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/30 text-right space-y-1 hover:border-amber-400/30 transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[#9c8f79] text-xs font-bold">إجمالي الإيداعات المقبولة</span>
            <Wallet className="w-5 h-5 text-amber-300" />
          </div>
          <p className="font-mono text-xl sm:text-2xl font-black text-white">{totalInstantDepositsToDisplay.toFixed(2)} د.أ</p>
          <p className="text-[10px] text-[#9c8f79]">تأكيد مباشر ومزامن</p>
        </div>

      </div>

      {/* Deposit Request Lists */}
      <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/30 space-y-4">
        <div className="flex justify-between items-center border-b border-[#4f4633]/20 pb-3">
          <h3 className="font-bold text-base text-amber-200 flex items-center gap-1.5 justify-end">
            <span>طلبات تأكيد الشحن والإيداع الأخيرة بالمتجر</span>
            <Wallet className="w-5 h-5 text-amber-400" />
          </h3>
          <span className="text-xs text-[#9c8f79]">مراجعة يدوية نشطة</span>
        </div>

        <div className="space-y-3">
          {pendingOrders.length === 0 ? (
            <div className="p-12 text-center text-[#9c8f79] text-sm">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400 mb-2" />
              <p className="font-bold">كل الطلبات والإيداعات تم البت ومراجعتها بنجاح!</p>
              <p className="text-xs text-[#9c8f79] mt-1">لا توجد دفوعات معلقة حالياً في طابور الانتظار.</p>
            </div>
          ) : (
            pendingOrders.map(order => (
              <div key={order.id} className="bg-[#111827]/80 rounded-xl p-4 border border-[#4f4633]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto text-right">
                  {order.receiptUrl ? (
                    <div className="relative w-28 h-16 bg-[#191f2f] border border-[#4f4633]/30 rounded-lg overflow-hidden shrink-0 group">
                      <img src={order.receiptUrl} alt="Receipt proof" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div 
                        onClick={() => setZoomReceiptUrl(order.receiptUrl || null)}
                        className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-28 h-16 bg-slate-900 border border-[#4f4633]/20 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-[10px] text-[#9c8f79]">بدون إيصال</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{order.user}</h4>
                      <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-mono text-[9px] font-black">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <p className="text-xs text-[#d3c5ac] mt-1">رقم الطلب: <span className="font-mono">{order.id}</span> | تعبئة رصيد يدوي </p>
                  </div>
                </div>

                <div className="flex flex-row items-center gap-4 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
                  <span className="font-mono text-amber-400 font-extrabold text-sm sm:text-base">
                    {order.price.toFixed(2)} JOD
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAdminAcceptDeposit(order.id, order.price)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-transform active:scale-95 cursor-pointer"
                    >
                      قبول وتأكيد
                    </button>
                    <button 
                      onClick={() => handleAdminRejectDeposit(order.id)}
                      className="border border-rose-500 text-rose-400 hover:bg-rose-500/10 font-bold px-4 py-2 rounded-lg text-xs transition-transform active:scale-95 cursor-pointer"
                    >
                      رفض
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick System Alerts Inside Admin panel */}
      <div className="bg-[#191f2f] rounded-2xl p-5 border-r-4 border-rose-500/80 border-t border-b border-l border-[#4f4633]/30 flex items-start gap-4 text-right">
        <ShieldAlert className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1">
          <h4 className="font-bold text-white text-sm">تنبيهات الأنظمة والمخزون</h4>
          <p className="text-xs text-[#9c8f79] leading-relaxed">
            نظام الكشف الآلي يشير إلى وجود 5 طلبات تحويل تأخر معالجتها لعدم تحميل العميل الإيصال الصحيح، يرجى مراجعة كشوفات CliQ البنكية لمطابقة حوالات FAARA-SHOP-99.
          </p>
        </div>
      </div>

    </div>
  );
}
