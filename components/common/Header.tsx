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
  navigateToTab: (tab: "home" | "game-detail" | "wallet" | "admin" | "login") => void;
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
                <a 
                  onClick={() => {
                    if (gamesList.length > 0) {
                      setSelectedGame(gamesList[0]);
                    }
                    navigateToTab("game-detail");
                  }}
                  className={`cursor-pointer pb-1 transition-all ${activeTab === "game-detail" ? "text-amber-400 border-b-2 border-amber-400 font-bold" : "text-[#d3c5ac] hover:text-white"}`}
                >
                  المتجر والمنتجات
                </a>
                <a 
                  onClick={() => navigateToTab("wallet")}
                  className={`cursor-pointer pb-1 transition-all ${activeTab === "wallet" ? "text-amber-400 border-b-2 border-amber-400 font-bold" : "text-[#d3c5ac] hover:text-white"}`}
                >
                  المحفظة والرصيد
                </a>
              </>
            ) : (
              <a 
                onClick={() => navigateToTab("admin")}
                className={`cursor-pointer pb-1 transition-all flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${activeTab === "admin" ? "bg-amber-400 text-slate-950 border-amber-400" : "bg-slate-900 text-amber-400 border-amber-500/30 hover:border-amber-400 hover:text-white animate-pulse"}`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>لوحة التحكم (Admin)</span>
              </a>
            )}
          </nav>
        </div>

        {/* Right Header Navigation Widgets */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Live Search bar for games (hidden on mobile header or for admin) */}
          {!isAdmin && (
            <div className="relative hidden md:block">
              <input 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== "home") navigateToTab("home");
                }}
                type="text" 
                placeholder="ابحث عن شدات أو ألعاب..."
                className="bg-[#191f2f] text-[#dce2f7] border border-[#4f4633]/30 rounded-full pr-10 pl-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-amber-400 w-52 focus:w-64 transition-all placeholder:text-[#9c8f79]/50 text-right"
              />
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#d3c5ac]" />
              {searchQuery && (
                <X 
                  onClick={() => setSearchQuery("")}
                  className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d3c5ac] cursor-pointer hover:text-white"
                />
              )}
            </div>
          )}

          {/* Wallet Quick Balance Card (hidden for admin) */}
          {loggedUser && !isAdmin && (
            <div 
              onClick={() => navigateToTab("wallet")}
              className="flex items-center gap-2 bg-slate-900 border border-amber-500/20 active:border-amber-400/50 hover:bg-slate-900/80 px-3 py-1.5 rounded-full cursor-pointer transition-all active:scale-95"
            >
              <Wallet className="w-4 h-4 text-amber-400 shadow-glow flex-shrink-0" />
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-amber-400 font-bold text-xs sm:text-sm">
                  {walletBalance.toFixed(2)}
                </span>
                <span className="text-[10px] text-[#adc6ff] font-sans">JD</span>
              </div>
            </div>
          )}

          {/* Notifications Popover Bell */}
          <div className="relative">
            <button 
              onClick={() => {
                if (!loggedUser) {
                  navigateToTab("login");
                } else {
                  setShowNotificationDropdown(!showNotificationDropdown);
                }
              }}
              className="p-2 text-[#d3c5ac] hover:text-white hover:bg-white/5 rounded-full relative transition-all active:scale-95 cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {loggedUser && unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 border border-[#0c1322] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover content */}
            <AnimatePresence>
              {loggedUser && showNotificationDropdown && (
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
                              <span className={`font-bold flex items-center gap-1.5 ${item.type === "success" ? "text-emerald-400" : item.type === "warning" ? "text-rose-400" : "text-amber-400"}`}>
                                {item.type === "success" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
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

          {/* User Profile & Logout Segment */}
          <div className="flex items-center gap-3 border-r border-[#4f4633]/20 pr-3 mr-1">
            {!loggedUser ? (
              <button
                onClick={() => navigateToTab("login")}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-4.5 py-2 rounded-xl font-bold text-xs cursor-pointer shadow-md transition-all active:scale-95"
              >
                تسجيل الدخول
              </button>
            ) : (
              <>
                {/* Profile Details (Name & Avatar Letter) */}
                <div 
                  onClick={() => isAdmin ? navigateToTab("admin") : navigateToTab("wallet")}
                  className="flex items-center gap-2 cursor-pointer group"
                  title={isAdmin ? "لوحة الإدارة والحساب" : "المحفظة والحساب"}
                >
                  <div className="hidden sm:flex flex-col items-end text-right">
                    <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      {loggedUser.name}
                    </span>
                    <span className="text-[9px] text-amber-400/80 font-mono">
                      {loggedUser.status === "نشط" ? "لاعب نشط" : "لاعب محظور"}
                    </span>
                  </div>

                  {/* Avatar circle */}
                  <div className="w-9 h-9 rounded-full border border-amber-400 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 font-bold text-slate-950 text-xs shadow-glow transition-all duration-300 group-hover:scale-105">
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

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-full transition-all cursor-pointer active:scale-95"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
