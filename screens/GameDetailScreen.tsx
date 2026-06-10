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
  Info
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
      <div className="flex justify-end">
        <button 
          onClick={() => setActiveTab("home")}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors cursor-pointer group"
        >
          <span>العودة للمتجر</span>
          <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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
        <div className="flex items-center justify-end gap-2 text-white">
          <h2 className="font-bold text-lg">معرف اللاعب (Player ID)</h2>
          <UserIcon className="w-5 h-5 text-amber-500" />
        </div>

        <div className="flex flex-col sm:flex-row-reverse gap-4 items-start sm:items-center">
          <div className="flex-1 w-full relative">
            <input 
              type="text" 
              value={playerId}
              onChange={(e) => {
                setPlayerId(e.target.value);
                if (e.target.value.trim()) setPlayerIdError("");
              }}
              placeholder="أدخل رقم الـ ID هنا"
              className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-right text-white font-mono outline-none focus:border-amber-500 transition-colors ${
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
            className="text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-end gap-1 shrink-0 px-2"
          >
            <span>أين أجد المعرف؟</span>
            <Info className="w-4 h-4" />
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
              قم بفتح اللعبة، اذهب إلى ملفك الشخصي بالزاوية، وانسخ الرقم المجاور لكلمة ID.
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
            return (
              <div 
                key={p.id}
                onClick={() => setSelectedPackage(p)}
                className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center gap-3 relative overflow-hidden ${
                  isSelected 
                    ? "bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]" 
                    : "bg-[#111827] border-slate-800 hover:border-slate-600"
                }`}
              >
                {p.bonusPercent && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                    +{p.bonusPercent}%
                  </div>
                )}
                <Coins className={`w-8 h-8 ${isSelected ? "text-amber-500" : "text-slate-500"}`} />
                <div className="text-center w-full">
                  <p className={`font-bold text-sm truncate ${isSelected ? "text-white" : "text-slate-300"}`}>
                    {p.name}
                  </p>
                  <p className={`text-xs mt-1 font-mono ${isSelected ? "text-amber-400" : "text-slate-400"}`}>
                    {p.price.toFixed(2)} {selectedGame.currency}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Checkout Footer */}
      <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row-reverse items-center justify-between gap-6">
        <div className="flex flex-col text-center sm:text-right w-full sm:w-auto">
          <span className="text-sm text-slate-400">الإجمالي المستحق</span>
          <span className="text-2xl font-bold font-mono text-white">
            {selectedPackage ? `${selectedPackage.price.toFixed(2)} ${selectedGame.currency}` : "0.00 JOD"}
          </span>
          <span className="text-xs text-slate-500 mt-1">الرصيد المتاح: {walletBalance.toFixed(2)} JOD</span>
        </div>

        <button 
          onClick={handlePurchasePackage}
          className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <span>تأكيد الشراء</span>
          <ShoppingBag className="w-5 h-5" />
        </button>
      </div>

    </motion.div>
  );
}
