import React from "react";
import { Wallet, CheckCircle2, Eye } from "lucide-react";
import { Order, OrderStatus } from "../../types";

interface DepositsTabProps {
  userOrders: Order[];
  handleAdminAcceptDeposit: (orderId: string, amount: number) => void;
  handleAdminRejectDeposit: (orderId: string) => void;
  setZoomReceiptUrl: (url: string | null) => void;
}

export default function DepositsTab({
  userOrders,
  handleAdminAcceptDeposit,
  handleAdminRejectDeposit,
  setZoomReceiptUrl
}: DepositsTabProps) {
  const pendingOrders = userOrders.filter(o => o.status === OrderStatus.PENDING);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full min-w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-amber-400" />
            <span>الطلبات المعلقة</span>
          </h2>
          <p className="text-[#8da1c5] text-sm mt-1">مراجعة وتأكيد إيداعات اللاعبين قبل إضافتها للأرصدة</p>
        </div>
        
        {pendingOrders.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl text-amber-400 text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            {pendingOrders.length} طلبات قيد الانتظار
          </div>
        )}
      </div>

      {/* Main Container - Extended Width */}
      <div className="bg-[#0a1120] rounded-3xl p-6 md:p-10 border border-[#21314d] shadow-[0_0_20px_rgba(0,0,0,0.2)] w-full">
        
        <div className="flex flex-col gap-6 w-full">
          {pendingOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">ممتاز! لا توجد طلبات معلقة</h3>
              <p className="text-[#8da1c5] text-base max-w-md mx-auto">
                لقد قمت بمراجعة جميع طلبات الإيداع بنجاح. لا يوجد لاعبين في طابور الانتظار حالياً.
              </p>
            </div>
          ) : (
            pendingOrders.map(order => (
              <div 
                key={order.id} 
                className="bg-[#11192a] p-6 lg:p-8 rounded-2xl border border-[#21314d] flex flex-row items-center justify-between gap-4 hover:border-[#384b6e] transition-colors w-full"
              >
                {/* 1. Player Info & Avatar */}
                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 text-emerald-400 font-bold text-xl shrink-0">
                    {order.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-bold text-white text-base whitespace-nowrap">{order.user}</h4>
                    <p className="text-xs text-[#8da1c5] mt-0.5 whitespace-nowrap">{(order as any).email || order.user.toLowerCase().replace(/\s+/g, '') + '@gmail.com'}</p>
                  </div>
                </div>

                {/* 2. Order Details (ID, Date) */}
                <div className="flex flex-col gap-2 shrink-0 text-right">
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <span className="text-sm text-[#8da1c5]">رقم الطلب:</span>
                    <span className="font-mono text-emerald-400 text-sm font-bold select-all" dir="ltr">{order.id}</span>
                  </div>
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <span className="text-sm text-[#8da1c5]">تاريخ الطلب:</span>
                    <span className="text-white font-bold text-sm" dir="ltr">
                      {new Date(order.timestamp).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <span className="text-sm text-[#8da1c5]">وقت الطلب:</span>
                    <span className="text-white font-bold text-sm" dir="ltr">
                      {new Date(order.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                    </span>
                  </div>
                </div>

                {/* 3. Amount */}
                <div className="flex flex-col items-center shrink-0">
                  <span className="text-xs text-[#8da1c5] font-bold mb-1 whitespace-nowrap">مبلغ الإيداع المحول</span>
                  <span className="font-sans text-white font-black text-2xl flex items-baseline gap-1.5 whitespace-nowrap">
                    <span className="text-emerald-400 text-sm">JOD</span>
                    <span>{order.price.toFixed(2)}</span>
                  </span>
                </div>

                {/* 4. Receipt Thumbnail */}
                <div className="relative w-28 h-20 bg-[#0a1120] border border-[#21314d] rounded-xl overflow-hidden shrink-0 group/img cursor-pointer"
                     onClick={() => setZoomReceiptUrl(order.receiptUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDt_Ia8NFL2910LQeWD6l1aebyCE2kukULD1velcJLQl8uxf8BNG6bmT9RCWyjQ5XYBDD81Gf5WmECKJKNtb3_tO1LjPRHqQpYcWPeXnT2kjNAv7PPqQBCLqXXsZOL0gpfWkAIGwUaZk8FsriyFuKdvZUIYbzgtrlM__6Ey1GK8IQio_TjAdVifw5ZDFuLswkEjzGafYxCFsDtnJq_Uyif092IF3JVA5I0ir-K6ZarVDHB8ky6rr3A7GyYvY7ttzh4jpMOkr6RgUFo")}>
                  <img 
                    src={order.receiptUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDt_Ia8NFL2910LQeWD6l1aebyCE2kukULD1velcJLQl8uxf8BNG6bmT9RCWyjQ5XYBDD81Gf5WmECKJKNtb3_tO1LjPRHqQpYcWPeXnT2kjNAv7PPqQBCLqXXsZOL0gpfWkAIGwUaZk8FsriyFuKdvZUIYbzgtrlM__6Ey1GK8IQio_TjAdVifw5ZDFuLswkEjzGafYxCFsDtnJq_Uyif092IF3JVA5I0ir-K6ZarVDHB8ky6rr3A7GyYvY7ttzh4jpMOkr6RgUFo"} 
                    alt="إيصال الدفع" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <Eye className="w-5 h-5 text-white mb-1" />
                    <span className="text-[10px] text-white font-bold">عرض الصورة</span>
                  </div>
                </div>

                {/* 5. Action Buttons (Stacked vertically) */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <button 
                    onClick={() => handleAdminAcceptDeposit(order.id, order.price)}
                    className="w-28 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    قبول
                  </button>
                  
                  <button 
                    onClick={() => handleAdminRejectDeposit(order.id)}
                    className="w-28 flex items-center justify-center border border-rose-500 text-rose-500 hover:bg-rose-500/10 font-bold px-4 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    رفض
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
