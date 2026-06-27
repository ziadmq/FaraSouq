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
  Star,
  Copy,
  Landmark,
  CreditCard
} from "lucide-react";
import { Game, GamePackage, User } from "../types";

interface GameDetailScreenProps {
  gamesList: Game[];
  selectedGame: Game;
  setSelectedGame: (game: Game) => void;
  loggedUser: User | null;
  walletBalance: number;
  navigateToTab: (tab: "home" | "game-detail" | "wallet" | "admin" | "login" | "profile") => void;
  setActiveTab: (tab: "home" | "game-detail" | "wallet" | "admin" | "login" | "profile") => void;
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
  handlePurchasePackage,
  loggedUser,
  navigateToTab
}: GameDetailScreenProps) {
  const [copiedValue, setCopiedValue] = React.useState<string | null>(null);

  const handleLocalCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(type);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  return (
    <motion.div
      key="game-detail"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="max-w-4xl mx-auto w-full space-y-6 text-right font-sans"
    >
      {loggedUser && (
        <div className="flex justify-start">
          <button 
            onClick={() => setActiveTab("home")}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors cursor-pointer group"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <span>العودة للمتجر</span>
          </button>
        </div>
      )}

      {/* Game Info Header */}
      <div className="bg-[#111827] rounded-2xl border border-slate-800 overflow-hidden shadow-sm flex flex-col md:flex-row-reverse">
        <div className="md:w-1/3 h-48 md:h-auto">
          <img 
            src={selectedGame.imageUrl} 
            alt={selectedGame.name} 
            className="w-full h-full"
            style={{
              objectFit: selectedGame.imageFit || "cover",
              objectPosition: selectedGame.imagePosition || "center"
            }}
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
      {loggedUser ? (
        <section className="bg-[#111827] rounded-2xl p-6 md:p-8 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-start gap-2 text-white">
            <UserIcon className="w-5 h-5 text-amber-500" />
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
                className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-right text-white font-mono placeholder:font-sans placeholder:text-slate-500 placeholder:text-sm outline-none focus:border-amber-500 transition-colors ${
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
              className="text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-start gap-1 shrink-0 px-2 cursor-pointer"
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
      ) : (
        <div className="w-full bg-[#111827] border border-slate-800 rounded-2xl px-6 py-6 text-center shadow-sm flex flex-col items-center justify-center gap-4">
          <p className="text-slate-300 text-sm font-medium">يجب عليك تسجيل الدخول لتتمكن من اختيار الباقة المناسبة وإتمام الشراء.</p>
          <button 
            onClick={() => navigateToTab("login")}
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-10 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-95 cursor-pointer"
          >
            تسجيل الدخول الآن
          </button>
        </div>
      )}

      {/* Packages Section */}
      <section className="space-y-4">
        <h3 className="font-bold text-lg text-white text-right px-2">
          الباقات المتوفرة
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {selectedGame.packages.map(p => {
            const isSelected = selectedPackage?.id === p.id;
            
            // Clean up name duplicate
            const displayName = p.name.replace(/\s*\+\s*بونص/gi, "").trim();

            const totalTokensStr = p.name.replace(/\D/g, "");
            const totalTokens = parseInt(totalTokensStr);
            let baseTokens = totalTokens;
            let bonusTokens = 0;
            if (p.bonusPercent && !isNaN(totalTokens)) {
              const bonusMultiplier = 1 + (p.bonusPercent / 100);
              baseTokens = Math.round(totalTokens / bonusMultiplier);
              bonusTokens = totalTokens - baseTokens;
            }
            const baseTokensStr = baseTokens.toLocaleString('en-US');
            const bonusTokensStr = bonusTokens.toLocaleString('en-US');

            // Image fit and background defaults
            const imgFit = p.imageFit || "cover";
            const imgBg = p.imageBg || "bg-slate-900";

            return (
              <div 
                key={p.id}
                onClick={() => setSelectedPackage(p)}
                className={`cursor-pointer p-4 sm:p-6 rounded-3xl border transition-all duration-350 flex flex-col items-center justify-start gap-3 sm:gap-4 relative overflow-hidden group min-h-[250px] sm:min-h-[320px] ${
                  isSelected 
                    ? "bg-gradient-to-b from-amber-500/12 to-[#0a0f1d] border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.18)] scale-[1.02] z-10" 
                    : "bg-[#0f172a]/70 border-slate-800/80 hover:border-slate-700/60 hover:bg-[#1e293b]/50"
                }`}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-amber-500/[0.03] mix-blend-overlay pointer-events-none" />
                )}
                {/* Badges Container - placed in standard flow above image */}
                <div className="w-full flex justify-between items-center gap-1 min-h-[22px] z-20 pointer-events-none">
                  {/* Preferred/Badge label */}
                  {p.isPreferred ? (
                    <div className="bg-gradient-to-r from-amber-400 to-amber-600 shadow-sm text-slate-950 text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                      <Star className="w-2 h-2 fill-current" />
                      <span>مفضلة</span>
                    </div>
                  ) : p.badge ? (
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 shadow-sm text-white text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-lg">
                      {p.badge}
                    </div>
                  ) : <div />}

                  {/* Bonus percentage label */}
                  {p.bonusPercent ? (
                    <div className="bg-gradient-to-l from-emerald-500 to-teal-600 shadow-sm text-white text-[8px] sm:text-[9px] font-extrabold px-2 py-0.5 rounded-lg">
                      +{p.bonusPercent}% بونص
                    </div>
                  ) : <div />}
                </div>

                {/* Product Image Section */}
                <div className={`w-full h-22 sm:h-28 rounded-2xl overflow-hidden relative shrink-0 border border-slate-800/50 ${imgBg}`}>
                  {p.imageUrl ? (
                    <img 
                      src={p.imageUrl} 
                      alt={p.name} 
                      className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                        imgFit === "contain" ? "object-contain p-1" : "object-cover"
                      }`} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1b1509]/30 to-[#0d111d]/30 relative overflow-hidden">
                      <div className="absolute -top-6 -left-6 w-16 h-16 bg-amber-500/5 rounded-full blur-xl" />
                      <div className="p-2 sm:p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                        <Coins className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-300 ${isSelected ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" : "text-amber-500/60"}`} />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent pointer-events-none" />
                </div>

                {/* Card Title & Content */}
                <div className="text-center w-full flex flex-col items-center justify-center flex-grow gap-2">
                  <h4 className={`font-black text-sm sm:text-lg leading-tight transition-colors duration-300 whitespace-normal break-words text-center min-h-[28px] flex items-center justify-center gap-1 ${isSelected ? "text-white" : "text-slate-200 group-hover:text-white"}`}>
                    {displayName}
                  </h4>
                  
                  {p.bonusPercent ? (
                    <div className="text-[9px] sm:text-[10px] text-slate-400 font-bold bg-[#1e293b]/50 border border-slate-800/80 px-2.5 sm:px-3 py-1 rounded-xl w-fit mx-auto shadow-sm leading-tight text-center">
                      <span className="line-through">الكمية الأساسية: {baseTokensStr}</span>
                    </div>
                  ) : (
                    <div className="text-[9px] sm:text-[10px] text-slate-500 font-bold bg-slate-800/10 border border-slate-800/20 px-2 sm:px-3 py-1 rounded-xl w-fit mx-auto whitespace-nowrap">
                      شحن آمن وفوري ⚡
                    </div>
                  )}
                </div>

                {/* Price tag */}
                <div className="mt-auto pt-2 sm:pt-3 border-t border-slate-800/60 w-full flex flex-col items-center gap-0.5">
                  <span className="text-[8px] uppercase font-bold text-slate-500 tracking-wider">السعر الإجمالي</span>
                  <span className={`text-base sm:text-2xl font-black font-mono tracking-tight transition-colors duration-350 ${isSelected ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "text-slate-300 group-hover:text-amber-400"}`}>
                    {p.price.toFixed(2)} <span className="text-xs font-sans font-bold">{selectedGame.currency}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Payment methods guide for checkout */}
      {loggedUser && selectedPackage && walletBalance < selectedPackage.price && (
        <section className="bg-slate-900/60 rounded-3xl p-6 border border-[#4f4633]/20 shadow-xl space-y-4 text-right">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-white text-base">طرق الدفع المتوفرة لتعبئة الرصيد</h3>
            </div>
            <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full font-bold">شحن مباشر ⚡</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Arab Bank */}
            <div className="p-4 bg-[#111827]/80 rounded-2xl border border-blue-500/20 flex items-start gap-4 hover:border-blue-500/40 transition-all duration-300 relative group">
              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleLocalCopy("0779191371", "bank")}
                  className="p-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer border border-slate-700/50"
                  title="نسخ رقم الهاتف"
                >
                  {copiedValue === "bank" ? "تم النسخ!" : "نسخ رقم الهاتف"}
                </button>
              </div>
              <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 shrink-0">
                <Landmark className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-white text-sm">البنك العربي (Arab Bank)</h4>
                <p className="text-xs text-slate-400 mt-1">تحويل مباشر إلى رقم الجوال:</p>
                <div className="flex items-center justify-start gap-2 mt-1">
                  <span className="text-base font-black text-blue-400 font-mono tracking-wider">0779191371</span>
                  <button
                    type="button"
                    onClick={() => handleLocalCopy("0779191371", "bank")}
                    className="p-1 hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 rounded transition-all cursor-pointer sm:hidden"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">المستفيد: مؤسسة فارة (Fara Souq)</p>
              </div>
            </div>

            {/* Orange Money */}
            <div className="p-4 bg-[#111827]/80 rounded-2xl border border-orange-500/20 flex items-start gap-4 hover:border-orange-500/40 transition-all duration-300 relative group">
              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleLocalCopy("FARASOUQ", "orange")}
                  className="p-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer border border-slate-700/50"
                  title="نسخ اسم المستخدم"
                >
                  {copiedValue === "orange" ? "تم النسخ!" : "نسخ اسم المستخدم"}
                </button>
              </div>
              <div className="bg-orange-500/10 p-2.5 rounded-xl border border-orange-500/20 shrink-0">
                <CreditCard className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-white text-sm">أورانج ماني (Orange Money)</h4>
                <p className="text-xs text-slate-400 mt-1">اسم المستخدم (المحفظة):</p>
                <div className="flex items-center justify-start gap-2 mt-1">
                  <span className="text-base font-black text-orange-400 font-mono tracking-wider">FARASOUQ</span>
                  <button
                    type="button"
                    onClick={() => handleLocalCopy("FARASOUQ", "orange")}
                    className="p-1 hover:bg-orange-500/10 text-slate-400 hover:text-orange-400 rounded transition-all cursor-pointer sm:hidden"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">المستفيد: مؤسسة فارة (Fara Souq)</p>
              </div>
            </div>
          </div>
          
          {/* Important Action Alert */}
          <div className="bg-[#1e1b4b]/60 border border-indigo-500/30 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 mt-4 text-right">
            <div className="space-y-1 flex-1">
              <h5 className="text-indigo-300 font-black text-sm flex items-center gap-1.5 justify-start">
                <span>⚠️ خطوة هامة جداً لإكمال الشحن!</span>
              </h5>
              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                التحويل المالي المباشر لا يشحن حسابك تلقائياً. يجب عليك الانتقال لصفحة إدارة الرصيد ورفع صورة إيصال التحويل لتأكيد الدفع، ليتم مراجعة الطلب من قبل الإدارة وشحن رصيدك.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("wallet")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-xl text-xs sm:text-sm shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all active:scale-95 whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 self-stretch md:self-auto"
            >
              <span>اضغط هنا لرفع الإيصال وتأكيد الدفع 📥</span>
            </button>
          </div>
        </section>
      )}

      {/* Checkout Footer */}
      {loggedUser && (
        <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden mt-8">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

          <div className="flex flex-col items-center sm:items-start w-full sm:w-auto z-10">
            <span className="text-sm text-slate-400 font-medium mb-1">الإجمالي المستحق</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-white tracking-tight">
                {selectedPackage ? selectedPackage.price.toFixed(2) : "0.00"}
              </span>
              <span className="text-amber-500 font-bold text-lg">
                {selectedGame.currency}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span>الرصيد المتاح:</span>
              <span className="font-mono text-slate-400">{walletBalance.toFixed(2)}</span>
              <span className="text-slate-400">{selectedGame.currency}</span>
            </div>
          </div>

          {(() => {
            const hasPackage = !!selectedPackage;
            const hasBalance = selectedPackage ? (walletBalance >= selectedPackage.price) : true;
            
            // Disable only if no package is chosen OR if they have insufficient balance
            const isBtnDisabled = !hasPackage || !hasBalance;
            
            let btnText = "تأكيد الشراء";
            if (!hasPackage) {
              btnText = "اختر باقة للشراء";
            } else if (!hasBalance) {
              btnText = "رصيدك غير كافٍ ⚠️";
            }

            return (
              <button 
                onClick={handlePurchasePackage}
                disabled={isBtnDisabled}
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:from-[#1e293b] disabled:to-[#0f172a] disabled:text-slate-500 disabled:border-slate-800 disabled:cursor-not-allowed border border-transparent text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] active:scale-95 z-10 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-base">{btnText}</span>
              </button>
            );
          })()}
        </div>
      )}

    </motion.div>
  );
}