/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Filter, 
  Gamepad2, 
  Star, 
  Flame, 
  Gift, 
  Coins, 
  Trophy 
} from "lucide-react";
import { GameCategory, Game } from "../types";

interface HomeScreenProps {
  cmsBannerImage: string;
  cmsBannerText: string;
  gamesList: Game[];
  setSelectedGame: (game: Game) => void;
  navigateToTab: (tab: "home" | "game-detail" | "wallet" | "admin" | "login") => void;
  selectedCategory: GameCategory;
  setSelectedCategory: (category: GameCategory) => void;
  showToast: (text: string, type?: "success" | "error" | "info") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredGames: Game[];
}

export default function HomeScreen({
  cmsBannerImage,
  cmsBannerText,
  gamesList,
  setSelectedGame,
  navigateToTab,
  selectedCategory,
  setSelectedCategory,
  showToast,
  searchQuery,
  setSearchQuery,
  filteredGames
}: HomeScreenProps) {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      
      {/* Giant Glowing Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-slate-950 group shadow-2xl h-[380px] md:h-[450px]">
        {/* Deep emerald overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950/90 via-slate-900/60 to-transparent z-10" />
        <img 
          src={cmsBannerImage}
          alt="Hero Promo" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1 select-none"
        />
        
        {/* Floating Glow Orbs */}
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-emerald-500/30 rounded-full blur-[100px] z-10 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-1/4 w-72 h-72 bg-emerald-600/20 rounded-full blur-[120px] z-10 pointer-events-none" />

        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-16 items-start">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 max-w-2xl shadow-2xl flex flex-col gap-5 text-right relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-r from-emerald-400 to-transparent" />
            
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 font-bold text-xs uppercase px-4 py-1.5 rounded-full w-fit shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              عرض لفترة محدودة
            </span>
            
            <h1 className="font-headline-xl text-3xl sm:text-4xl lg:text-5xl text-white font-black leading-tight drop-shadow-lg">
              {cmsBannerText}
            </h1>
            
            <p className="text-sm sm:text-lg text-slate-300 drop-shadow-md leading-relaxed">
              أقوى العروض على بطاقات الهدايا وشحن الألعاب في الشرق الأوسط. اشحن الآن ونافس المحترفين بأفضل وأرخص الأسعار المتوفرة.
            </p>
            
            <div className="flex gap-4 mt-2">
              <button 
                onClick={() => {
                  const jwGame = gamesList.find(g => g.id.includes("jw")) || gamesList[0];
                  if (jwGame) {
                    setSelectedGame(jwGame);
                  }
                  navigateToTab("game-detail");
                }}
                className="bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-white font-black px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>اشحن جواكر الآن</span>
                <Flame className="w-5 h-5 text-yellow-300 group-hover:scale-125 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid layout for (Categories Filter) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Categories and Category Chips */}
        <div className="lg:col-span-12 flex flex-col justify-between gap-6">
          <div className="flex items-center justify-between border-b border-[#4f4633]/20 pb-3">
            <h2 className="font-headline-md text-xl sm:text-2xl font-bold">تصفح حسب فئات الألعاب</h2>
          </div>

          {/* Filtering Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { type: GameCategory.BATTLE_ROYALE, label: "ألعاب باتل رويال", count: "قريباً ⏳", icon: Flame },
              { type: GameCategory.GIFT_CARDS, label: "بطاقات الهدايا", count: "قريباً ⏳", icon: Gift },
              { type: GameCategory.MOBA, label: "موبا وفانتازي", count: "قريباً ⏳", icon: Coins },
              { type: GameCategory.JAWAKER, label: "شحن جواكر", count: "متوفر الآن ✨", icon: Trophy },
              { type: GameCategory.ALL, label: "عرض كل التصنيفات", count: "الألعاب النشطة", icon: Gamepad2 }
            ].map(card => {
              const IconComp = card.icon;
              const isSelected = selectedCategory === card.type;
              return (
                <button 
                  key={card.label}
                  onClick={() => {
                    if (card.type !== GameCategory.JAWAKER && card.type !== GameCategory.ALL) {
                      showToast(`قريباً جداً... فئة "${card.label}" ستكون متوفرة للشحن قريباً! ⏳`, "info");
                    } else {
                      setSelectedCategory(card.type);
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all text-center gap-1 group cursor-pointer ${
                    isSelected 
                      ? "bg-emerald-400 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-950/20" 
                      : "bg-[#191f2f] border-[#4f4633]/30 hover:border-emerald-400/50 hover:bg-[#232a3a]"
                  }`}
                >
                  <IconComp className={`w-8 h-8 mb-2 group-hover:scale-110 transition-transform ${isSelected ? "text-slate-950" : "text-[#d3c5ac]"}`} />
                  <span className="font-bold text-sm truncate w-full">{card.label}</span>
                  <span className={`text-[10px] ${isSelected ? "text-slate-950 font-medium" : "text-[#9c8f79]"}`}>{card.count}</span>
                </button>
              );
            })}
          </div>

          {/* Search query tag feedback or clear actions */}
          {searchQuery && (
            <div className="bg-[#191f2f] border border-[#4f4633]/20 p-3 rounded-xl flex items-center justify-between">
              <p className="text-xs text-[#d3c5ac]">
                نتائج البحث لـ <span className="text-emerald-400 font-bold">"{searchQuery}"</span> ({filteredGames.length} منتجات)
              </p>
              <button 
                onClick={() => setSearchQuery("")}
                className="text-xs text-rose-400 font-bold hover:underline"
              >
                إلغاء البحث
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Section 2: Best Selling Games GRID */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-headline-lg text-xl sm:text-3xl font-black bg-gradient-to-l from-white to-[#dce2f7] bg-clip-text text-transparent">الأكثر مبيعاً ورواجاً</h2>
          <div className="flex gap-2">
            <button className="p-2 aspect-square border border-[#4f4633]/30 hover:bg-[#191f2f] rounded-xl text-white transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Games Cards Dynamic Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredGames.length === 0 ? (
            <div className="col-span-full bg-[#191f2f] border border-[#4f4633]/30 rounded-xl p-12 text-center text-[#9c8f79]">
              <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-30 animate-pulse" />
              <p className="font-bold">عذراً! لم نجد أي ألعاب تتطابق مع بحثك أو الفئة المدخلة.</p>
              <button 
                onClick={() => { setSelectedCategory(GameCategory.ALL); setSearchQuery(""); }}
                className="mt-4 px-4 py-2 bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg"
              >
                إعادة تعيين الفلترة
              </button>
            </div>
          ) : (
            filteredGames.map(game => (
              <motion.div 
                key={game.id}
                whileHover={game.isComingSoon ? {} : { y: -6 }}
                className={`bg-[#191f2f] rounded-2xl border overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between ${
                  game.isComingSoon 
                    ? "border-[#4f4633]/20 opacity-75 grayscale-[20%]" 
                    : "border-[#4f4633]/40 hover:border-emerald-400/50 group cursor-pointer"
                }`}
                onClick={() => {
                  if (game.isComingSoon) {
                    showToast(`قريباً جداً... خدمة "${game.name}" ستكون متوفرة للشحن قريباً! ⏳`, "info");
                  } else {
                    setSelectedGame(game);
                    navigateToTab("game-detail");
                  }
                }}
              >
                <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-950">
                  <img 
                    src={game.imageUrl} 
                    alt={game.name} 
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      game.isComingSoon ? "" : "group-hover:scale-105"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#191f2f] via-transparent to-transparent opacity-75" />
                  <div className="absolute top-2 left-2 flex flex-col gap-1 items-end">
                    {game.isComingSoon ? (
                      <span className="bg-rose-500/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow animate-pulse">
                        قريباً
                      </span>
                    ) : game.isPopular ? (
                      <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow">
                        رائج
                      </span>
                    ) : null}
                    <span className="bg-slate-900/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-emerald-500/20">
                      <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                      <span>{game.rating}</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3 flex-grow justify-between">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white truncate text-right">
                      {game.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className="text-[#9c8f79]">{game.isComingSoon ? "متوفر" : "يبدأ من"}</span>
                      <span className="text-emerald-400 font-extrabold">{game.isComingSoon ? "قريباً ⏳" : `${game.startingPrice.toFixed(2)} ${game.currency}`}</span>
                    </div>
                  </div>

                  <button 
                    className={`w-full text-center py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      game.isComingSoon
                        ? "bg-slate-800/80 border border-slate-700/40 text-slate-500 cursor-not-allowed"
                        : "bg-[#2e3545] border border-[#4f4633]/40 text-[#dce2f7] group-hover:bg-emerald-400 group-hover:text-slate-950 group-hover:border-emerald-400"
                    }`}
                  >
                    {game.isComingSoon ? "متوفر قريباً ⏳" : "عرض الفئات"}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

    </motion.div>
  );
}
