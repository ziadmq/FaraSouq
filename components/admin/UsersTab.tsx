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
                    <div className="flex items-center gap-4 justify-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 font-black text-xl flex items-center justify-center select-none uppercase border border-emerald-500/20 shrink-0 shadow-inner">
                        {user.avatarLetter.substr(0, 1)}
                      </div>
                      <div className="flex flex-col text-right justify-center">
                        <span className="font-bold text-white text-base whitespace-nowrap">{user.name}</span>
                        <span className="text-xs text-[#8da1c5] mt-0.5 whitespace-nowrap font-medium">{(user as any).email || user.name.toLowerCase().replace(/\s+/g, '') + '@gmail.com'}</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 align-middle text-center">
                    <span className={`px-3 py-1 rounded-md text-xs font-bold border inline-block ${
                      user.status === "نشط" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
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
                      <span className="text-emerald-400 text-xs">JOD</span>
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
                            : "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white"
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
