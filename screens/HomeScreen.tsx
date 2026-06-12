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
  Trophy,
  Wallet
} from "lucide-react";
import { GameCategory, Game, User } from "../types";

interface HomeScreenProps {
  cmsBannerBadgeText: string;
  cmsBannerImage: string;
  cmsBannerText: string;
  cmsBannerSubtitle: string;
  cmsBannerButtonText: string;
  cmsBannerUrl: string;
  gamesList: Game[];
  setSelectedGame: (game: Game) => void;
  navigateToTab: (tab: "home" | "game-detail" | "wallet" | "admin" | "login") => void;
  selectedCategory: GameCategory;
  setSelectedCategory: (category: GameCategory) => void;
  showToast: (text: string, type?: "success" | "error" | "info") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredGames: Game[];
  loggedUser: User | null;
}

export default function HomeScreen({
  cmsBannerBadgeText,
  cmsBannerImage,
  cmsBannerText,
  cmsBannerSubtitle,
  cmsBannerButtonText,
  cmsBannerUrl,
  gamesList,
  setSelectedGame,
  navigateToTab,
  selectedCategory,
  setSelectedCategory,
  showToast,
  searchQuery,
  setSearchQuery,
  filteredGames,
  loggedUser
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
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-slate-950 group shadow-2xl h-[380px] md:h-[450px]">
        {/* Deep amber overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950/90 via-slate-900/60 to-transparent z-10" />
        <img 
          src={cmsBannerImage}
          alt="Hero Promo" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1 select-none"
        />
        
        {/* Floating Glow Orbs */}
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-amber-500/30 rounded-full blur-[100px] z-10 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-1/4 w-72 h-72 bg-amber-600/20 rounded-full blur-[120px] z-10 pointer-events-none" />

        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-16 items-start">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 max-w-2xl shadow-2xl flex flex-col gap-5 text-right relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-r from-amber-400 to-transparent" />
            
            {cmsBannerBadgeText && (
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/50 font-bold text-xs uppercase px-4 py-1.5 rounded-full w-fit shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                {cmsBannerBadgeText}
              </span>
            )}
            
            <h1 className="font-headline-xl text-3xl sm:text-4xl lg:text-5xl text-white font-black leading-tight drop-shadow-lg">
              {cmsBannerText}
            </h1>
            
            {cmsBannerSubtitle && (
              <p className="text-sm sm:text-lg text-slate-300 drop-shadow-md leading-relaxed">
                {cmsBannerSubtitle}
              </p>
            )}
            
            <div className="flex gap-4 mt-2">
              <button 
                onClick={() => {
                  if (cmsBannerUrl) {
                    if (cmsBannerUrl.startsWith('http')) {
                      window.open(cmsBannerUrl, '_blank');
                    } else {
                      window.location.href = cmsBannerUrl;
                    }
                    return;
                  }
                  const jwGame = gamesList.find(g => g.id.includes("jw")) || gamesList[0];
                  if (jwGame) {
                    setSelectedGame(jwGame);
                  }
                  navigateToTab("game-detail");
                }}
                className="bg-gradient-to-r from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-white font-black px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>{cmsBannerButtonText || "اشحن جواكر الآن"}</span>
                <Flame className="w-5 h-5 text-yellow-300 group-hover:scale-125 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <div className={`grid grid-cols-1 ${loggedUser ? "sm:grid-cols-2" : ""} gap-6`}>
        {loggedUser && (
          <button 
            onClick={() => navigateToTab("wallet")}
            className="group relative overflow-hidden rounded-3xl bg-[#191f2f] border border-[#4f4633]/30 p-8 text-right flex flex-col items-start gap-4 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-amber-500/20 group-hover:scale-110 transition-transform shadow-lg z-10">
              <Wallet className="w-8 h-8 text-amber-400" />
            </div>
            <div className="z-10 mt-2">
              <h3 className="text-2xl font-black text-white mb-2">إدارة الرصيد</h3>
              <p className="text-[#d3c5ac] text-sm">قم بشحن رصيد محفظتك، ومتابعة حوالاتك ومعرفة رصيدك المتاح للشراء فوراً.</p>
            </div>
          </button>
        )}

        <button 
          onClick={() => {
            const jwGame = gamesList.find(g => g.id.includes("jw")) || gamesList[0];
            if (jwGame) setSelectedGame(jwGame);
            navigateToTab("game-detail");
          }}
          className="group relative overflow-hidden rounded-3xl bg-[#191f2f] border border-[#4f4633]/30 p-8 text-right flex flex-col items-start gap-4 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-amber-500/20 group-hover:scale-110 transition-transform shadow-lg z-10">
            <Gamepad2 className="w-8 h-8 text-amber-400" />
          </div>
          <div className="z-10 mt-2">
            <h3 className="text-2xl font-black text-white mb-2">باقات الشحن</h3>
            <p className="text-[#d3c5ac] text-sm">تصفح الباقات المتوفرة، واختر الباقة الأنسب لك لتشحنها مباشرة وتستمتع باللعب.</p>
          </div>
        </button>
      </div>



    </motion.div>
  );
}
