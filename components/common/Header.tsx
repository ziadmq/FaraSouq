/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Bell, 
  Wallet, 
  LogOut, 
  Sliders, 
  X, 
  BellRing,
  Star
} from "lucide-react";
import { User, AppNotification, Game } from "../../types";

interface HeaderProps {
  activeTab: string;
  isAdmin: boolean;
  loggedUser: User | null;
  walletBalance: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unreadCount: number;
  notifications: AppNotification[];
  showNotificationDropdown: boolean;
  setShowNotificationDropdown: (show: boolean) => void;
  navigateToTab: (tab: "home" | "game-detail" | "wallet" | "admin" | "login" | "profile") => void;
  handleLogout: () => void;
  handleMarkAllNotificationsRead: () => void;
  setSelectedGame: (game: Game) => void;
  gamesList: Game[];
}

export default function Header({
  activeTab,
  isAdmin,
  loggedUser,
  walletBalance,
  searchQuery,
  setSearchQuery,
  unreadCount,
  notifications,
  showNotificationDropdown,
  setShowNotificationDropdown,
  navigateToTab,
  handleLogout,
  handleMarkAllNotificationsRead,
  setSelectedGame,
  gamesList
}: HeaderProps) {
  return (
    <header className="bg-[#0c1322]/80 backdrop-blur-xl border-b border-[#4f4633]/30 sticky top-0 z-40 transition-shadow shadow-[0_0_20px_rgba(5,102,217,0.15)]">
      <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-7xl mx-auto w-full">
        
        {/* Brand Logo & Basic Web Links */}
        <div className="flex items-center gap-6 sm:gap-10">
          <a 
            onClick={() => navigateToTab("home")} 
            className="font-headline-lg text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent cursor-pointer drop-shadow-[0_0_12px_rgba(251,191,36,0.5)] select-none hover:opacity-90 active:scale-95 transition-all"
          >
            فارة | سوق
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {!isAdmin ? (
              <>
                <a 
                  onClick={() => { navigateToTab("home"); handleMarkAllNotificationsRead(); }}
                  className={`cursor-pointer pb-1 transition-all ${activeTab === "home" ? "text-amber-400 border-b-2 border-amber-400 font-bold" : "text-[#d3c5ac] hover:text-white"}`}
                >
                  الرئيسية
                </a>
                {loggedUser && (
                  <a 
                    onClick={() => navigateToTab("wallet")}
                    className={`cursor-pointer pb-1 transition-all ${activeTab === "wallet" ? "text-amber-400 border-b-2 border-amber-400 font-bold" : "text-[#d3c5ac] hover:text-white"}`}
                  >
                    إدارة الرصيد
                  </a>
                )}
                <a 
                  onClick={() => {
                    if (gamesList.length > 0) {
                      setSelectedGame(gamesList[0]);
                    }
                    navigateToTab("game-detail");
                  }}
                  className={`cursor-pointer pb-1 transition-all ${activeTab === "game-detail" ? "text-amber-400 border-b-2 border-amber-400 font-bold" : "text-[#d3c5ac] hover:text-white"}`}
                >
                  باقات الشحن
                </a>
              </>
            ) : (
              activeTab === "admin" ? (
                <a 
                  onClick={() => { navigateToTab("home"); handleMarkAllNotificationsRead(); }}
                  className="cursor-pointer pb-1 transition-all flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold border bg-slate-800 text-white border-[#4f4633]/50 hover:bg-slate-700 active:scale-95"
                >
                  <span>العودة للمتجر</span>
                </a>
              ) : (
                <a 
                  onClick={() => navigateToTab("admin")}
                  className="cursor-pointer pb-1 transition-all flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold border bg-amber-500/10 text-amber-400 border-amber-500/30 hover:border-amber-400 hover:text-white animate-pulse active:scale-95"
                >
                  <Sliders className="w-4 h-4" />
                  <span>لوحة التحكم (Admin)</span>
                </a>
              )
            )}
          </nav>
        </div>

        {/* Right Header Navigation Widgets */}
        <div className="flex items-center gap-2 sm:gap-4">
          


          {/* Wallet Quick Balance Card (hidden for admin) */}
          {loggedUser && !isAdmin && (
            <div 
              onClick={() => navigateToTab("wallet")}
              className="flex items-center gap-2.5 bg-gradient-to-r from-[#0a1a15] to-[#111827] border border-amber-500/40 hover:border-amber-400/80 px-3 sm:px-4 py-1.5 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-95 group"
            >
              <div className="bg-amber-500/10 p-1.5 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                <Wallet className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-amber-400 font-black text-sm sm:text-base tracking-tight drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
                  {walletBalance.toFixed(2)}
                </span>
                <span className="text-[10px] text-amber-100/70 font-bold tracking-wider">JD</span>
              </div>
            </div>
          )}

          {/* Notifications Popover Bell */}
          {loggedUser && (
            <div className="relative">
              <button 
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className="p-2 text-[#d3c5ac] hover:text-white hover:bg-white/5 rounded-full relative transition-all active:scale-95 cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 border border-[#0c1322] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover content */}
              <AnimatePresence>
                {showNotificationDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotificationDropdown(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute left-0 mt-3 w-80 bg-[#141b2b] border border-[#4f4633]/40 rounded-2xl shadow-2xl z-50 text-right overflow-hidden shadow-black"
                    >
                      <div className="p-4 bg-[#191f2f] border-b border-[#4f4633]/30 flex justify-between items-center">
                        <h4 className="font-bold text-sm text-amber-400">آخر التنبيهات والإشعارات ({notifications.length})</h4>
                        {unreadCount > 0 && (
                          <button 
                            onClick={handleMarkAllNotificationsRead}
                            className="text-xs text-[#adc6ff] hover:text-[#e6ecff] underline"
                          >
                            تحديد كالمقروءة
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-[#4f4633]/20">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-[#9c8f79] text-xs">
                            <BellRing className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            لا توجد إشعارات حالياً
                          </div>
                        ) : (
                          notifications.map(item => (
                            <div 
                              key={item.id} 
                              className={`p-3 text-xs leading-relaxed transition-colors ${!item.isRead ? "bg-amber-400/5 hover:bg-amber-400/10" : "hover:bg-slate-900"}`}
                            >
                              <div className="flex justify-between items-start mb-1 gap-2">
                                <span className={`font-bold flex items-center gap-1.5 ${item.type === "success" ? "text-amber-400" : item.type === "warning" ? "text-rose-400" : "text-amber-400"}`}>
                                  {item.type === "success" && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                                  {item.type === "warning" && <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
                                  {item.type === "info" && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                                  {item.title}
                                </span>
                                <span className="text-[10px] text-[#9c8f79] font-mono">{item.time}</span>
                              </div>
                              <p className="text-[#dce2f7] opacity-80">{item.description}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* User Profile Segment (Click to Logout) */}
          <div className="flex items-center gap-3 border-r border-[#4f4633]/20 pr-3 mr-1">
            {!loggedUser ? (
              <button
                onClick={() => navigateToTab("login")}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-4.5 py-2 rounded-xl font-bold text-xs cursor-pointer shadow-md transition-all active:scale-95"
              >
                تسجيل الدخول
              </button>
            ) : (
              <div 
                onClick={() => navigateToTab("profile")}
                className="flex items-center gap-2 cursor-pointer group hover:bg-amber-500/10 p-1.5 rounded-2xl transition-all"
                title="الملف الشخصي"
              >
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                    {loggedUser.name}
                  </span>
                  <span className="text-[9px] text-amber-400/80 font-mono flex items-center gap-1 transition-colors">
                    <span className="group-hover:hidden">
                      {isAdmin ? "مدير النظام" : (loggedUser.status === "نشط" ? "لاعب نشط" : "لاعب محظور")}
                    </span>
                    <span className="hidden group-hover:flex items-center gap-1 text-amber-400">
                      <Star className="w-2.5 h-2.5" />
                      الملف الشخصي
                    </span>
                  </span>
                </div>

                {/* Avatar circle */}
                <div className="w-9 h-9 rounded-full border border-amber-400 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 font-bold text-slate-950 text-xs shadow-glow transition-all duration-300 group-hover:border-amber-400 group-hover:scale-105">
                  {loggedUser.imageUrl ? (
                    <img 
                      src={loggedUser.imageUrl} 
                      alt={loggedUser.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : loggedUser.name === "خالد العتيبي" || loggedUser.name === "محمد الأحمد" || loggedUser.name === "سارة الغامدي" ? (
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuClUyDMeNNz5EDpcJCOarsYRF7voJzugEoI4HSCJS8V4iCWY2D1b0aqGI39rnvy3R_NzKhUWZGjFxX_Hg4wqxLsxLCmy7ISBL2ETVyqF6a5fsYgxg_k-xnilnmvbLYKxP9tg7mt_hqE_kSeGnb5OCMZRozlfoKPxzTNEP573bGAn7kcgrPD2H6VC6jAEZebbpWLOp0bHJ-VX39y98II53ZCHIUzq4O5oydK6_1jVabzn9Q9FRf2bhwX51c-bjsnHlYSx4z77O--pWg" 
                      alt={loggedUser.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{loggedUser.avatarLetter || "👤"}</span>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
