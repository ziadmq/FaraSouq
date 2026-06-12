/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Trash2, ChevronRight, Package, Clock, CheckCircle2, XCircle, Gamepad2, ArrowRight } from "lucide-react";
import { User, Order, OrderStatus } from "../../types";

interface UsersTabProps {
  adminUsers: User[];
  handleToggleUserStatus: (userId: string) => void;
  handleDeleteUser: (userId: string, userName: string) => void;
  userOrders?: Order[];
}

export default function UsersTab({
  adminUsers,
  handleToggleUserStatus,
  handleDeleteUser,
  userOrders = []
}: UsersTabProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return <CheckCircle2 className="w-4 h-4 text-amber-400" />;
      case OrderStatus.REJECTED:
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case OrderStatus.PROCESSING:
        return <Clock className="w-4 h-4 text-amber-400" />;
      default:
        return <Package className="w-4 h-4 text-[#8da1c5]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case OrderStatus.REJECTED:
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case OrderStatus.PROCESSING:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-[#191f2f] text-[#8da1c5] border-[#21314d]";
    }
  };

  if (selectedUserId) {
    const selectedUser = adminUsers.find(u => u.id === selectedUserId);
    if (!selectedUser) {
      setSelectedUserId(null);
      return null;
    }

    const userSpecificOrders = userOrders.filter(o => o.userId === selectedUser.id || o.user === selectedUser.name);

    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedUserId(null)}
            className="flex items-center gap-2 text-[#8da1c5] hover:text-white transition-colors bg-[#11192a] px-4 py-2 rounded-xl border border-[#21314d]"
          >
            <span>العودة للمستخدمين</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <h3 className="font-black text-xl text-white">تفاصيل اللاعب</h3>
        </div>

        <div className="bg-[#191f2f] rounded-2xl border border-[#4f4633]/30 p-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-amber-500/10 text-amber-400 font-black text-4xl flex items-center justify-center select-none uppercase border-2 border-amber-500/20 shadow-inner shrink-0">
              {selectedUser.avatarLetter.substr(0, 1)}
            </div>
            
            <div className="flex-1 text-center md:text-right space-y-3">
              <h2 className="text-2xl font-black text-white">{selectedUser.name}</h2>
              <p className="text-[#8da1c5]">{(selectedUser as any).email || selectedUser.name.toLowerCase().replace(/\s+/g, '') + '@gmail.com'}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className="bg-[#11192a] border border-[#21314d] rounded-xl p-3 px-5 flex flex-col items-center">
                  <span className="text-xs text-[#5e7193] mb-1">الرصيد</span>
                  <div className="font-sans text-amber-400 font-black text-lg">
                    {selectedUser.balance.toFixed(2)} <span className="text-xs">JOD</span>
                  </div>
                </div>
                <div className="bg-[#11192a] border border-[#21314d] rounded-xl p-3 px-5 flex flex-col items-center">
                  <span className="text-xs text-[#5e7193] mb-1">تاريخ الانضمام</span>
                  <div className="font-bold text-white text-sm mt-1" dir="ltr">
                    {selectedUser.joinDate.includes('/') ? new Date(selectedUser.joinDate).toLocaleDateString("en-GB") : selectedUser.joinDate}
                  </div>
                </div>
                <div className="bg-[#11192a] border border-[#21314d] rounded-xl p-3 px-5 flex flex-col items-center">
                  <span className="text-xs text-[#5e7193] mb-1">حالة الحساب</span>
                  <span className={`px-3 py-1 rounded-md text-xs font-bold mt-1 ${
                    selectedUser.status === "نشط" 
                      ? "text-amber-400" 
                      : "text-rose-400"
                  }`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <button 
                onClick={() => handleToggleUserStatus(selectedUser.id)}
                className={`w-full py-3 px-6 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  selectedUser.status === "نشط" 
                    ? "bg-rose-600/20 border border-rose-500/30 text-rose-400 hover:bg-rose-600 hover:text-white" 
                    : "bg-amber-600/20 border border-amber-500/30 text-amber-400 hover:bg-amber-600 hover:text-white"
                }`}
              >
                {selectedUser.status === "نشط" ? "حظر حساب اللاعب" : "تفعيل حساب اللاعب"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#191f2f] rounded-2xl border border-[#4f4633]/30 overflow-hidden shadow-lg mt-6">
          <div className="p-5 bg-[#11192a] border-b border-[#21314d] flex items-center justify-between">
            <h3 className="font-black text-lg text-white">سجل الطلبات والشحنات ({userSpecificOrders.length})</h3>
          </div>
          
          {userSpecificOrders.length === 0 ? (
            <div className="p-8 text-center text-[#5e7193] font-bold bg-[#0a1120]">
              لا يوجد طلبات لهذا اللاعب حتى الآن
            </div>
          ) : (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-[#0a1120] text-[#8da1c5] font-black text-xs border-b border-[#21314d]">
                    <th className="px-5 py-4 text-center">رقم الطلب</th>
                    <th className="px-5 py-4">المنتج</th>
                    <th className="px-5 py-4 text-center">معرف اللاعب</th>
                    <th className="px-5 py-4 text-center">التاريخ</th>
                    <th className="px-5 py-4 text-center">المبلغ</th>
                    <th className="px-5 py-4 text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#21314d]">
                  {userSpecificOrders.map(order => (
                    <tr key={order.id} className="hover:bg-[#11192a] transition-colors bg-[#0a1120]">
                      <td className="px-5 py-4 align-middle text-center font-mono text-[#8da1c5]">{order.id}</td>
                      <td className="px-5 py-4 align-middle">
                        <div className="flex items-center gap-2 justify-start">
                          <Gamepad2 className="w-4 h-4 text-amber-500/70" />
                          <span className="font-bold text-white text-sm">{order.product || (order as any).gameName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-middle text-center font-mono font-bold text-amber-400">
                        {order.playerId || "-"}
                      </td>
                      <td className="px-5 py-4 align-middle text-center text-[#8da1c5]" dir="ltr">
                        {order.date || new Date(order.timestamp).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 align-middle text-center">
                        <div className="font-sans text-white font-black flex items-baseline gap-1 justify-center">
                          <span className="text-amber-400 text-[10px]">JOD</span>
                          <span>{Number(order.price).toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-middle text-center">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span>{order.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#191f2f] rounded-2xl border border-[#4f4633]/30 overflow-hidden shadow-lg">
        <div className="p-6 bg-[#11192a] border-b border-[#21314d] flex justify-between items-center text-right">
          <h3 className="font-black text-xl text-white">إدارة اللاعبين المسجلين بالموقع</h3>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-[#0a1120] text-[#8da1c5] font-black text-sm border-b border-[#21314d]">
                <th className="px-6 py-4 text-center">الاسم</th>
                <th className="px-6 py-4 text-center">حالة الحساب</th>
                <th className="px-6 py-4 text-center">تاريخ الانضمام</th>
                <th className="px-6 py-4 text-center">الرصيد</th>
                <th className="px-6 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21314d]">
              {adminUsers.map(user => (
                <tr key={user.id} className="hover:bg-[#11192a] transition-colors bg-[#0a1120]">
                  {/* Name */}
                  <td className="px-6 py-4 align-middle">
                    <div 
                      onClick={() => setSelectedUserId(user.id)}
                      className="flex items-center gap-4 justify-center cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 font-black text-xl flex items-center justify-center select-none uppercase border border-amber-500/20 shrink-0 shadow-inner group-hover:bg-amber-500/20 group-hover:scale-110 transition-all duration-300">
                        {user.avatarLetter.substr(0, 1)}
                      </div>
                      <div className="flex flex-col text-right justify-center group-hover:text-amber-400 transition-colors">
                        <span className="font-bold text-white text-base whitespace-nowrap group-hover:text-amber-400 transition-colors">{user.name}</span>
                        <span className="text-xs text-[#8da1c5] mt-0.5 whitespace-nowrap font-medium">{(user as any).email || user.name.toLowerCase().replace(/\s+/g, '') + '@gmail.com'}</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 align-middle text-center">
                    <span className={`px-3 py-1 rounded-md text-xs font-bold border inline-block ${
                      user.status === "نشط" 
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  
                  {/* Join Date */}
                  <td className="px-6 py-4 align-middle text-center">
                    <div className="text-white font-bold whitespace-nowrap text-sm inline-block" dir="ltr">
                      {user.joinDate.includes('/') ? new Date(user.joinDate).toLocaleDateString("en-GB") : user.joinDate}
                    </div>
                  </td>
                  
                  {/* Balance */}
                  <td className="px-6 py-4 align-middle text-center">
                    <div className="font-sans text-white font-black text-xl flex items-baseline gap-1.5 justify-center">
                      <span className="text-amber-400 text-xs">JOD</span>
                      <span>{user.balance.toFixed(2)}</span>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 align-middle text-center">
                    <div className="flex gap-2 justify-center">
                      <button 
                        onClick={() => handleToggleUserStatus(user.id)}
                        className={`w-20 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                          user.status === "نشط" 
                            ? "bg-rose-600/20 border border-rose-500/30 text-rose-400 hover:bg-rose-600 hover:text-white" 
                            : "bg-amber-600/20 border border-amber-500/30 text-amber-400 hover:bg-amber-600 hover:text-white"
                        }`}
                      >
                        {user.status === "نشط" ? "حظر" : "تفعيل"}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        title="حذف اللاعب نهائياً"
                        className="w-20 py-2 border border-rose-500/20 hover:border-rose-500/60 bg-rose-500/5 hover:bg-rose-500/20 text-rose-400 hover:text-rose-200 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm font-bold"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
