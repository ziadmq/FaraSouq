/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  User as UserIcon, 
  Coins, 
  ShoppingBag,
  Info,
  Star
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
  selectedGame,
  walletBalance,
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="max-w-4xl mx-auto w-full space-y-6 text-right font-sans"
    >
      <div className="flex justify-start">
        <button 
          onClick={() => setActiveTab("home")}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer group"
        >
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          <span>العودة للمتجر</span>
        </button>
      </div>

      {/* Game Info Header */}
      <div className="bg-[#111827] rounded-2xl border border-slate-800 overflow-hidden shadow-sm flex flex-col md:flex-row-reverse">
        <div className="md:w-1/3 h-48 md:h-auto">
          <img 
            src={selectedGame.imageUrl} 
            alt={selectedGame.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 md:p-8 md:w-2/3 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{selectedGame.name}</h1>
          <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
            {selectedGame.description || "اشحن حسابك بسرعة وأمان."}
          </p>
        </div>
      </div>

      {/* Player ID Section */}
      <section className="bg-[#111827] rounded-2xl p-6 md:p-8 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-start gap-2 text-white">
          <UserIcon className="w-5 h-5 text-emerald-500" />
          <h2 className="font-bold text-lg">رقم اللاعب (Player Number)</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 w-full relative">
            <input 
              type="text" 
              value={playerId}
              onChange={(e) => {
                setPlayerId(e.target.value);
                if (e.target.value.trim()) setPlayerIdError("");
              }}
              placeholder="مثال: 1560982341"
              className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-right text-white font-mono placeholder:font-sans placeholder:text-slate-500 placeholder:text-sm outline-none focus:border-emerald-500 transition-colors ${
                playerIdError ? "border-red-500" : "border-slate-800"
              }`}
            />
            {playerIdError && (
              <p className="text-xs text-red-500 mt-2 text-right">{playerIdError}</p>
            )}
          </div>

          <button 
            type="button"
            onClick={() => setShowIdHelp(!showIdHelp)}
            className="text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-start gap-1 shrink-0 px-2"
          >
            <Info className="w-4 h-4" />
            <span>أين أجد الرقم؟</span>
          </button>
        </div>

        <AnimatePresence>
          {showIdHelp && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 text-sm text-slate-400 text-right leading-relaxed"
            >
              للعثور على رقم اللاعب الخاص بك، يرجى فتح اللعبة والتوجه إلى قائمة الإعدادات، ثم قم بنسخ الرقم الموجود بجانب خيار (Player Number).
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Packages Section */}
      <section className="space-y-4">
        <h3 className="font-bold text-lg text-white text-right px-2">
          اختر باقة الشحن
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {selectedGame.packages.map(p => {
            const isSelected = selectedPackage?.id === p.id;
            
            // Calculate base amount if bonus exists
            const totalTokensStr = p.name.replace(/\D/g, "");
            const totalTokens = parseInt(totalTokensStr);
            let baseTokensStr = "";
            let finalTokensStr = totalTokens.toLocaleString('en-US');
            
            if (p.bonusPercent && !isNaN(totalTokens)) {
              const bonusMultiplier = 1 + (p.bonusPercent / 100);
              const baseTokens = Math.round(totalTokens / bonusMultiplier);
              baseTokensStr = baseTokens.toLocaleString('en-US');
            }

            return (
              <div 
                key={p.id}
                onClick={() => setSelectedPackage(p)}
                className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 relative overflow-hidden group ${
                  isSelected 
                    ? "bg-gradient-to-b from-emerald-500/20 to-transparent border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-[1.02] z-10" 
                    : "bg-[#111827] border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                }`}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay pointer-events-none" />
                )}
                {/* Preferred Star Badge */}
                {p.isPreferred && (
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-400 to-amber-600 shadow-md text-white text-[10px] font-bold px-3 py-1.5 rounded-br-xl z-20 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    مفضلة
                  </div>
                )}
                {/* Custom Admin Badge */}
                {p.badge && !p.isPreferred && (
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md text-white text-[10px] font-bold px-3 py-1.5 rounded-br-xl z-20">
                    {p.badge}
                  </div>
                )}
                {/* Bonus Badge */}
                {p.bonusPercent && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-md text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl z-20">
                    +{p.bonusPercent}%
                  </div>
                )}
                <div className={`p-3 rounded-full transition-colors duration-300 z-10 ${isSelected ? "bg-emerald-500/20 shadow-inner" : "bg-slate-800 group-hover:bg-slate-700"}`}>
                  <Coins className={`w-8 h-8 transition-colors duration-300 ${isSelected ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "text-slate-400 group-hover:text-emerald-500/70"}`} />
                </div>
                <div className="text-center w-full mt-1 z-10">
                  <p className={`font-bold text-sm truncate transition-colors duration-300 overflow-visible ${isSelected ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
                    {p.name} {p.bonusPercent ? (
                      <span className="relative group/tooltip inline-flex items-center justify-center ml-1">
                        <span className="text-emerald-400 font-black cursor-help flex items-center gap-0.5 bg-emerald-500/10 px-1.5 py-0.5 rounded transition-all active:scale-95">
                          + بونص
                          <Info className="w-3 h-3 opacity-70" />
                        </span>
                        {/* Interactive Tooltip */}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-slate-800 text-white text-[10px] p-2.5 rounded-lg shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible group-active/tooltip:opacity-100 group-active/tooltip:visible transition-all duration-200 z-[100] border border-slate-700 pointer-events-none flex flex-col gap-1.5 text-center font-sans font-normal">
                          <span className="text-slate-400 line-through decoration-rose-500 decoration-2">قبل العرض: {baseTokensStr} توكنز</span>
                          <span className="text-emerald-400 font-bold whitespace-nowrap">بعد بونص {p.bonusPercent}%: {finalTokensStr} توكنز</span>
                          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-[5px] border-transparent border-t-slate-800"></span>
                        </span>
                      </span>
                    ) : null}
                  </p>
                  <p className={`text-xs mt-1.5 font-mono font-semibold tracking-wide transition-colors duration-300 ${isSelected ? "text-emerald-400" : "text-slate-400 group-hover:text-emerald-500"}`}>
                    {p.price.toFixed(2)} {selectedGame.currency}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Checkout Footer */}
      <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden mt-8">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="flex flex-col items-center sm:items-start w-full sm:w-auto z-10">
          <span className="text-sm text-slate-400 font-medium mb-1">الإجمالي المستحق</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">
              {selectedPackage ? selectedPackage.price.toFixed(2) : "0.00"}
            </span>
            <span className="text-emerald-500 font-bold text-lg">
              {selectedGame.currency}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span>الرصيد المتاح:</span>
            <span className="font-mono text-slate-400">{walletBalance.toFixed(2)}</span>
            <span className="text-slate-400">{selectedGame.currency}</span>
          </div>
        </div>

        <button 
          onClick={handlePurchasePackage}
          disabled={!selectedPackage || !playerId.trim()}
          className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] active:scale-95 z-10"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-base">تأكيد الشراء</span>
        </button>
      </div>

    </motion.div>
  );
}
