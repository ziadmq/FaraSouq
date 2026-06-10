/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Wallet } from "lucide-react";
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
    <div className="space-y-6">
      <div className="bg-[#191f2f] p-6 rounded-2xl border border-[#4f4633]/30 text-right space-y-4">
        <div>
          <h3 className="font-black text-xl text-white">إدارة طلبات شحن الرصيد المعلقة</h3>
        </div>

        <div className="space-y-3 pt-3">
          {pendingOrders.length === 0 ? (
            <div className="text-center p-12 text-[#9c8f79]">
              <Wallet className="w-12 h-12 mx-auto text-amber-500 opacity-20 mb-2" />
              <p className="font-bold">لا توجد طلبات إيداع معلقة متبقية.</p>
            </div>
          ) : (
            pendingOrders.map(order => (
              <div key={order.id} className="bg-[#070e1d] p-4 rounded-xl border border-[#4f4633]/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-right w-full md:w-auto">
                  <img 
                    src={order.receiptUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDt_Ia8NFL2910LQeWD6l1aebyCE2kukULD1velcJLQl8uxf8BNG6bmT9RCWyjQ5XYBDD81Gf5WmECKJKNtb3_tO1LjPRHqQpYcWPeXnT2kjNAv7PPqQBCLqXXsZOL0gpfWkAIGwUaZk8FsriyFuKdvZUIYbzgtrlM__6Ey1GK8IQio_TjAdVifw5ZDFuLswkEjzGafYxCFsDtnJq_Uyif092IF3JVA5I0ir-K6ZarVDHB8ky6rr3A7GyYvY7ttzh4jpMOkr6RgUFo"} 
                    alt="إيصال" 
                    onClick={() => setZoomReceiptUrl(order.receiptUrl || null)}
                    className="w-16 h-16 object-cover rounded border border-[#4f4633]/30 cursor-pointer hover:border-amber-400"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="font-bold text-white text-sm">{order.user}</p>
                    <p className="text-xs text-[#d3c5ac] mt-0.5">الرقم المرجعي: <span className="font-mono text-amber-400">{order.id}</span></p>
                    <p className="text-[10px] text-[#9c8f79]">وسيلة الدفع: <span className="font-bold">{order.paymentMethod}</span></p>
                  </div>
                </div>

                <div className="flex flex-row items-center gap-4 text-right shrink-0 w-full md:w-auto justify-between md:justify-end">
                  <span className="font-mono text-amber-400 font-extrabold text-lg">
                    {order.price.toFixed(2)} JOD
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAdminAcceptDeposit(order.id, order.price)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs"
                    >
                      قبول كلي
                    </button>
                    <button 
                      onClick={() => handleAdminRejectDeposit(order.id)}
                      className="border border-rose-500 text-rose-500 hover:bg-rose-500/10 font-bold px-3 py-1.5 rounded-lg text-xs"
                    >
                      رفض الإيداع
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
