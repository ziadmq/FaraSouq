/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Trash2 } from "lucide-react";
import { User } from "../../types";

interface UsersTabProps {
  adminUsers: User[];
  handleToggleUserStatus: (userId: string) => void;
  handleDeleteUser: (userId: string, userName: string) => void;
}

export default function UsersTab({
  adminUsers,
  handleToggleUserStatus,
  handleDeleteUser
}: UsersTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-[#191f2f] rounded-2xl border border-[#4f4633]/30 overflow-hidden shadow-lg">
        <div className="p-5 bg-[#232a3a] border-b border-[#4f4633]/30 flex justify-between items-center text-right">
          <h3 className="font-black text-lg text-white">إدارة اللاعبين المسجلين بالموقع</h3>
          <span className="text-xs text-[#9c8f79]">تعديل الحظر والأرصدة</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-[#070e1d] text-[#9c8f79] font-bold uppercase tracking-wider border-b border-[#4f4633]/20">
                <th className="px-5 py-3">اللاعب / الاسم</th>
                <th className="px-5 py-3">حالة الحساب</th>
                <th className="px-5 py-3">تاريخ الانضمام</th>
                <th className="px-5 py-3">الرصيد المحفظي</th>
                <th className="px-5 py-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4f4633]/10">
              {adminUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-900/35 transition-colors">
                  <td className="px-5 py-4 font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-emerald-400 font-extrabold flex items-center justify-center text-[10px] select-none uppercase">
                      {user.avatarLetter.substr(0, 1)}
                    </div>
                    <span>{user.name}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      user.status === "نشط" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#9c8f79] font-mono">{user.joinDate}</td>
                  <td className="px-5 py-4 font-mono font-bold text-white">
                    {user.balance.toFixed(2)} د.أ
                  </td>
                  <td className="px-5 py-4 flex gap-1.5">
                    <button 
                      onClick={() => handleToggleUserStatus(user.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        user.status === "نشط" 
                          ? "bg-rose-600/20 border border-rose-500/30 text-rose-400 hover:bg-rose-600 hover:text-white" 
                          : "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                      }`}
                    >
                      {user.status === "نشط" ? "حظر اللاعب" : "إعادة تفعيل"}
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      title="حذف اللاعب نهائياً"
                      className="p-1 px-1.5 border border-rose-500/20 hover:border-rose-500/60 bg-rose-500/5 hover:bg-rose-500/20 text-rose-400 hover:text-rose-200 rounded transition-all cursor-pointer flex items-center justify-center gap-1 text-[10px] font-bold"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>حذف</span>
                    </button>
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
