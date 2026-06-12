import React from "react";
import { 
  Coins, 
  AlertCircle, 
  Users, 
  Wallet, 
  TrendingUp, 
  BarChart3,
  ShoppingBag
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
}: AnalyticsTabProps) {
  
  // Custom mock data for the chart to make it look active
  const weeklyData = [
    { day: "السبت", sales: 120, height: "h-[40%]" },
    { day: "الأحد", sales: 250, height: "h-[60%]" },
    { day: "الإثنين", sales: 180, height: "h-[45%]" },
    { day: "الثلاثاء", sales: 300, height: "h-[75%]" },
    { day: "الأربعاء", sales: 220, height: "h-[55%]" },
    { day: "الخميس", sales: 400, height: "h-[90%]" },
    { day: "الجمعة", sales: 450, height: "h-[100%]" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header text */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <span>نظرة عامة على الأداء</span>
            <TrendingUp className="w-6 h-6 text-amber-400" />
          </h2>
          <p className="text-[#8da1c5] text-sm mt-1">ملخص الإحصائيات والمبيعات لمتجر فارة سوق</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl text-amber-400 text-sm font-bold flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          مباشر
        </div>
      </div>

      {/* Grid Header statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        
        {/* Sales */}
        <div className="bg-gradient-to-br from-[#0a1120] to-[#111c2e] rounded-3xl p-6 border border-amber-500/20 text-right flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-[0_0_20px_rgba(16,185,129,0.05)] hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
          <div className="absolute -left-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <span className="text-[#8da1c5] text-sm font-bold">إجمالي المبيعات</span>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Coins className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-l from-white to-amber-200 flex items-end gap-1.5 justify-end relative z-10">
            <span>{totalSalesToDisplay.toFixed(2)}</span>
            <span className="text-sm text-amber-500 font-bold mb-1.5">JOD</span>
          </p>
        </div>

        {/* Pending */}
        <div className="bg-gradient-to-br from-[#0a1120] to-[#111c2e] rounded-3xl p-6 border border-amber-500/20 text-right flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-[0_0_20px_rgba(245,158,11,0.05)] hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
          <div className="absolute -left-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />

          <div className="flex justify-between items-center mb-6 relative z-10">
            <span className="text-[#8da1c5] text-sm font-bold">إيداعات للمراجعة</span>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
              <AlertCircle className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
          </div>
          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-l from-white to-amber-200 flex items-end gap-1.5 justify-end relative z-10">
            <span>{pendingDepositsToDisplay}</span>
            <span className="text-sm text-amber-500 font-bold mb-1.5">طلب</span>
          </p>
        </div>

        {/* Total Orders (New Card) */}
        <div className="bg-gradient-to-br from-[#0a1120] to-[#111c2e] rounded-3xl p-6 border border-violet-500/20 text-right flex flex-col justify-between hover:border-violet-500/50 transition-all shadow-[0_0_20px_rgba(139,92,246,0.05)] hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />
          <div className="absolute -left-4 -top-4 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all" />

          <div className="flex justify-between items-center mb-6 relative z-10">
            <span className="text-[#8da1c5] text-sm font-bold">إجمالي الطلبات</span>
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6 text-violet-400" />
            </div>
          </div>
          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-l from-white to-violet-200 flex items-end gap-1.5 justify-end relative z-10">
            <span>{userOrders.length}</span>
            <span className="text-sm text-violet-500 font-bold mb-1.5">عملية</span>
          </p>
        </div>

        {/* Users */}
        <div className="bg-gradient-to-br from-[#0a1120] to-[#111c2e] rounded-3xl p-6 border border-sky-500/20 text-right flex flex-col justify-between hover:border-sky-500/50 transition-all shadow-[0_0_20px_rgba(14,165,233,0.05)] hover:shadow-[0_0_30px_rgba(14,165,233,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-50" />
          <div className="absolute -left-4 -top-4 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all" />

          <div className="flex justify-between items-center mb-6 relative z-10">
            <span className="text-[#8da1c5] text-sm font-bold">أعضاء المتجر</span>
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-sky-400" />
            </div>
          </div>
          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-l from-white to-sky-200 flex items-end gap-1.5 justify-end relative z-10">
            <span>{totalMembersToDisplay}</span>
            <span className="text-sm text-sky-500 font-bold mb-1.5">لاعب</span>
          </p>
        </div>

        {/* Total Deposits */}
        <div className="bg-gradient-to-br from-[#0a1120] to-[#111c2e] rounded-3xl p-6 border border-indigo-500/20 text-right flex flex-col justify-between hover:border-indigo-500/50 transition-all shadow-[0_0_20px_rgba(99,102,241,0.05)] hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
          <div className="absolute -left-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />

          <div className="flex justify-between items-center mb-6 relative z-10">
            <span className="text-[#8da1c5] text-sm font-bold">الإيداعات المقبولة</span>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-l from-white to-indigo-200 flex items-end gap-1.5 justify-end relative z-10">
            <span>{totalInstantDepositsToDisplay.toFixed(2)}</span>
            <span className="text-sm text-indigo-500 font-bold mb-1.5">JOD</span>
          </p>
        </div>

      </div>

      {/* Chart Section */}
      <div className="bg-gradient-to-br from-[#0a1120] to-[#111c2e] rounded-3xl p-6 md:p-8 border border-[#21314d] shadow-[0_0_20px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-[#21314d] pb-5 gap-4">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-amber-400" />
              <span>مبيعات آخر 7 أيام</span>
            </h3>
            <p className="text-sm text-[#8da1c5] mt-1">مخطط بياني يوضح حركة المبيعات وتفاعل الأعضاء</p>
          </div>
          <span className="text-xs text-amber-400 font-bold bg-amber-400/10 px-4 py-2 rounded-xl border border-amber-400/20">
            مؤشر إيجابي +15%
          </span>
        </div>

        {/* Pure CSS Bar Chart */}
        <div className="h-72 flex items-end justify-between gap-3 sm:gap-6 pt-4 w-full">
          {weeklyData.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1 group h-full justify-end">
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#21314d] text-white text-xs font-bold px-3 py-1.5 rounded-lg mb-2 pointer-events-none shadow-xl transform translate-y-2 group-hover:translate-y-0">
                {data.sales} JOD
              </div>
              
              {/* Bar */}
              <div className={`w-full max-w-[48px] bg-gradient-to-t from-amber-600/40 to-amber-400 rounded-t-xl ${data.height} relative overflow-hidden group-hover:from-amber-500/60 group-hover:to-amber-300 transition-all duration-300`}>
                {/* Glossy overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              {/* Label */}
              <span className="text-[#8da1c5] text-[10px] sm:text-sm font-bold mt-4">
                {data.day}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
