/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Star, 
  User as UserIcon, 
  BadgeHelp, 
  Coins, 
  ShoppingBag 
} from "lucide-react";
import { Game, GamePackage, User } from "../types";

interface GameDetailScreenProps {
  gamesList: Game[];
  selectedGame: Game;
  setSelectedGame: (game: Game) => void;
  loggedUser: User | null;
  walletBalance: number;
  navigateToTab: (tab: "home" | "game-detail" | "wallet" | "admin" | "login") => void;
  setActiveTab: (tab: "home" | "game-detail" | "wallet" | "admin" | "login") => void;
  playerId: string;
  setPlayerId: (id: string) => void;
  selectedPackage: GamePackage | null;
  setSelectedPackage: (pkg: GamePackage | null) => void;
  playerIdError: string;
  setPlayerIdError: (err: string) => void;
  showIdHelp: boolean;
  setShowIdHelp: (show: boolean) => void;
  handlePurchasePackage: () => void;
}

export default function GameDetailScreen({
  gamesList,
  selectedGame,
  setSelectedGame,
  loggedUser,
  walletBalance,
  navigateToTab,
  setActiveTab,
  playerId,
  setPlayerId,
  selectedPackage,
  setSelectedPackage,
  playerIdError,
  setPlayerIdError,
  showIdHelp,
  setShowIdHelp,
  handlePurchasePackage
}: GameDetailScreenProps) {
  return (
    <motion.div
      key="game-detail"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      
      {/* Left Column: Sidebar with Similar Games & Balance Card */}
      <aside className="lg:col-span-3 lg:order-1 order-2 space-y-6">
        
        {/* Simulated list of recommended games with active states */}
        <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/30">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-[#4f4633]/20 pb-2">
            ألعاب مشابهة بالموقع
          </h3>
          <div className="space-y-3">
            {gamesList.filter(g => g.id !== selectedGame.id).slice(0, 3).map(game => (
              <div 
                key={game.id}
                onClick={() => {
                  setSelectedGame(game);
                  setPlayerId(""); // reset player details
                }}
                className="group flex items-center gap-4 p-2.5 rounded-xl hover:bg-[#232a3a] transition-all duration-300 cursor-pointer border border-transparent hover:border-[#4f4633]/20 bg-[#111827]/40"
              >
                <img 
                  src={game.imageUrl} 
                  alt={game.name} 
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                    {game.name}
                  </p>
                  <p className="text-[10px] text-[#9c8f79]">شحن مباشر فوري</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subsidized Wallet Promo inside Side Grid */}
        <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/30 space-y-4">
          <div className="bg-[#0566d9]/15 p-4 rounded-xl border border-sky-500/20 text-right">
            <span className="text-[10px] text-sky-300 font-bold block mb-1 uppercase tracking-widest">رصيد حسابك المتاح</span>
            <p className="font-mono text-xl sm:text-2xl font-black text-white">{loggedUser ? walletBalance.toFixed(2) : "0.00"} د.أ</p>
            <button 
              onClick={() => navigateToTab("wallet")}
              className="w-full mt-3 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 rounded-lg text-xs cursor-pointer shadow-md transition-colors"
            >
              شحن المحفظة فوراً
            </button>
          </div>
        </div>

      </aside>

      {/* Center/Right Main Section: Title banner and detailed selectors */}
      <div className="lg:col-span-9 lg:order-2 order-1 space-y-6">
        
        <button 
          onClick={() => setActiveTab("home")}
          className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-200 transition-colors cursor-pointer group mb-2"
        >
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          <span>العودة لمتجر العروض</span>
        </button>

        {/* RPG Dynamic Selected Game Header Banner */}
        <section className="relative h-[220px] md:h-[300px] rounded-2xl overflow-hidden group shadow-xl">
          <img 
            src={selectedGame.imageUrl} 
            alt={selectedGame.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-[#0c1322]/40 to-transparent" />
          
          {/* Absolute positioning of game banner metadata */}
          <div className="absolute bottom-0 right-0 p-6 flex flex-row items-center gap-4 md:gap-6 w-full text-right">
            
            {/* Dragon Shield Emblem */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-amber-400 shadow-xl overflow-hidden flex-shrink-0 bg-slate-900 hidden sm:block">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_1-_0lD0z3KW5jAbgAfnO-kGYZkb8d46WN7CQaQR9GGFrRG-iJyRfX_iDCZMd5lnSBEWoZwyuAYh6LOzSuFzLSWmItKAzXzETUc7tNAvPT6c3GZpcz69F2LeeoWNvJqr1Jy0JLmsd8p6Mb7SRdt6PPVKewHwdJASl-kRqLXClzS0frtL7gT6cJS-pp5Je6kEkvTvvm0Nd5eeiz8u6CiwIlY_qgpiLRZVeuI4_nsvpSuH4I6eKdT32xz5sZtS3k_zzhaooiCd6erw" 
                alt="Dragon Emblem" 
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="font-headline-xl text-xl sm:text-3xl font-black text-white hover:text-amber-300 transition-colors drop-shadow-md">
                {selectedGame.name}
              </h1>
              <div className="flex items-center gap-3 mt-1.5 text-xs">
                <span className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-bold">
                  باقة فورية آمنة
                </span>
                <span className="text-[#d3c5ac] flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{selectedGame.rating} ({selectedGame.ratingCount} تقييم)</span>
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* Game description */}
        {selectedGame.description && (
          <section className="bg-[#191f2f] rounded-2xl p-6 border border-[#4f4633]/30 text-right space-y-2 shadow-md">
            <h3 className="text-sm font-bold text-amber-400 border-b border-[#4f4633]/20 pb-2 uppercase tracking-wider mb-2">الوصف والتعليمات والسياسة</h3>
            <p className="text-[#d3c5ac] text-xs sm:text-sm leading-relaxed whitespace-pre-line">{selectedGame.description}</p>
          </section>
        )}

        {/* PLAYER ID INPUT PANEL */}
        <section className="bg-[#191f2f] rounded-2xl p-6 border border-[#4f4633]/30 text-right space-y-4 shadow-md">
          <div className="flex items-center gap-2 text-amber-200">
            <UserIcon className="w-5 h-5 text-amber-400" />
            <label className="font-bold text-base">
              أدخل معرف اللاعب بضمير (Player ID)
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch max-w-lg relative">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={playerId}
                onChange={(e) => {
                  setPlayerId(e.target.value);
                  if (e.target.value.trim()) setPlayerIdError("");
                }}
                placeholder="مثال: 123456789"
                className={`w-full bg-[#070e1d] border rounded-xl px-4 py-3.5 text-right text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-400 transition-all ${
                  playerIdError ? "border-rose-500 ring-rose-500/20" : "border-[#4f4633]/40"
                }`}
              />
              {playerIdError && (
                <p className="text-xs text-rose-400 font-bold mt-1 text-right">{playerIdError}</p>
              )}
            </div>
            
            <button 
              type="button"
              onClick={() => setShowIdHelp(!showIdHelp)}
              className="bg-[#2e3545] hover:bg-[#232a3a] px-4 py-3 rounded-xl border border-[#4f4633]/30 text-xs font-bold text-[#dce2f7] flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
            >
              <BadgeHelp className="w-4 h-4 text-amber-400" />
              <span>أين أجد المعرف المعني؟</span>
            </button>
          </div>

          {/* ID instruction help box */}
          <AnimatePresence>
            {showIdHelp && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#111827]/80 rounded-xl p-4 border border-[#4f4633]/20 overflow-hidden text-xs text-[#d3c5ac] leading-relaxed space-y-1"
              >
                <p className="font-bold text-amber-400">كيفية إيجاد معرف اللاعب الخاص بك:</p>
                <p>1. قم بفتح تطبيق اللعبة على هاتفك.</p>
                <p>2. اذهب إلى ملفك الشخصي (Profile) بالزاوية العلوية.</p>
                <p>3. ستجد رقماً طويلاً بجانب كلمة (ID or Character ID). اضغط على زر نسخ والحقه هنا لضمان سرعة شحن الجواهر والشدات.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs text-[#9c8f79]">
            تنبيه: يرجى التحقق من صحة الرقم التعريفي لتجنب ضياع الرصيد أو إرساله لحساب عشوائي بالخطأ.
          </p>
        </section>

        {/* GAME CATEGORIES PACKAGES LISTGRID */}
        <section className="space-y-4">
          <h3 className="font-bold text-lg text-white text-right">
            اختر باقة وحزمة الشحن المفضلة
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-sans">
            {selectedGame.packages.map(p => {
              const isSelected = selectedPackage?.id === p.id;
              return (
                <div 
                  key={p.id}
                  onClick={() => setSelectedPackage(p)}
                  className={`relative cursor-pointer p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                    isSelected 
                      ? "bg-amber-400 border-amber-400 text-slate-950 shadow-lg scale-[1.01]" 
                      : p.isPreferred
                        ? "bg-[#1f283d] border-amber-400 hover:border-amber-300 hover:bg-[#28334f] text-white ring-1 ring-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]"
                        : "bg-[#191f2f] border-[#4f4633]/30 hover:border-amber-400/40 hover:bg-[#232a3a] text-white"
                  }`}
                >
                  {p.badge && (
                    <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase scale-90">
                      {p.badge}
                    </span>
                  )}

                  {p.isPreferred && (
                    <span className={`absolute top-2 left-2 ${isSelected ? "bg-slate-950 text-amber-400" : "bg-amber-400 text-slate-950"} text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 scale-90 shadow-md`}>
                      <span>المفضلة</span>
                      <Star className="w-2.5 h-2.5 fill-current" />
                    </span>
                  )}

                  <div className={`p-3 rounded-xl mb-1 flex items-center justify-center ${isSelected ? "bg-slate-950/25" : "bg-[#111827]"}`}>
                    <Coins className={`w-8 h-8 ${isSelected ? "text-slate-950" : "text-amber-400"}`} />
                  </div>

                  <span className="font-extrabold text-[#dce2f7] text-sm sm:text-base text-center truncate w-full" style={{ color: isSelected ? "#000" : "" }}>
                    {p.name}
                  </span>
                  
                  <div className="flex flex-col items-center flex-shrink-0">
                    <span className={`text-xs ${isSelected ? "text-slate-950 font-black" : "text-amber-400 font-bold"}`}>
                      {p.price.toFixed(2)} {selectedGame.currency}
                    </span>
                    {p.bonusPercent && (
                      <span className={`text-[10px] mt-0.5 px-1 py-0.2 rounded font-mono ${isSelected ? "bg-[#111827] text-white" : "bg-rose-500/20 text-rose-400"}`}>
                        +{p.bonusPercent}% رصيد إضافي
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* BUY BUTTON ACTION BAR CONTAINER */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-[#141b2b] p-6 rounded-2xl border border-[#4f4633]/30 gap-4 text-right">
          <div className="flex flex-col text-center sm:text-right">
            <span className="text-xs text-[#9c8f79]">المجموع الإجمالي المستحق:</span>
            <span className="text-amber-400 font-headline-lg text-2xl sm:text-3xl font-black drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
              {selectedPackage ? `${selectedPackage.price.toFixed(2)} ${selectedGame.currency}` : "0.00 د.أ"}
            </span>
          </div>

          <button 
            onClick={handlePurchasePackage}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black rounded-xl cursor-pointer glow-primary transform active:scale-95 transition-all text-base flex items-center justify-center gap-2 shadow-lg"
          >
            <span>تأكيد الشراء الآن</span>
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>

      </div>

    </motion.div>
  );
}
