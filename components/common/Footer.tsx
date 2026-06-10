/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Gamepad2, ShoppingBag, Wallet, Sliders } from "lucide-react";
import { Game } from "../../types";

interface FooterProps {
  isAdmin: boolean;
  activeTab: string;
  gamesList: Game[];
  navigateToTab: (tab: "home" | "game-detail" | "wallet" | "admin" | "login") => void;
  showToast: (text: string, type: "success" | "error" | "info") => void;
  handleMarkAllNotificationsRead: () => void;
  setSelectedGame: (game: Game) => void;
}

export default function Footer({
  isAdmin,
  activeTab,
  gamesList,
  navigateToTab,
  showToast,
  handleMarkAllNotificationsRead,
  setSelectedGame
}: FooterProps) {
  return (
    <>
      {/* High contrast responsive Footer */}
      <footer className="bg-[#070e1d] border-t border-[#4f4633]/20 mt-12 py-8 text-xs select-none">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col md:flex-row-reverse justify-between items-center gap-6 text-center">
          
          <div className="flex gap-6 font-bold flex-wrap justify-center text-[#9c8f79]">
            <a onClick={() => showToast("اتفاقية المستخدم والشروط متاحة باللائحة.", "info")} className="hover:text-[#adc6ff] cursor-pointer transition-colors">الشروط والأحكام</a>
            <a onClick={() => showToast("من نحن: متجر فارة الأكبر لخدمات الألعاب.", "info")} className="hover:text-[#adc6ff] cursor-pointer transition-colors">من نحن</a>
            <a onClick={() => showToast("تواصل عبر Kafehazyad5@gmail.com للدعم.", "info")} className="hover:text-[#adc6ff] cursor-pointer transition-colors">الدعم الفني والشكاوى</a>
            <a onClick={() => showToast("طرق الدفع شاملة CliQ, Zain Cash, Orange Money.", "info")} className="hover:text-[#adc6ff] cursor-pointer transition-colors">طرق الدفع والتحصيل</a>
          </div>

          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-headline-md text-base sm:text-lg text-emerald-400 font-extrabold shadow-glow">فارة | سوق</span>
            <span className="text-[#9c8f79]">© 2026 فارة | سوق. جميع حقوق الألعاب والملكيات محفوظة للمنصات.</span>
          </div>

        </div>
      </footer>

      {/* MOBILE LOWER NAVIGATION NAV RAIL HUD */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0c1322]/90 backdrop-blur-xl border-t border-[#4f4633]/30 z-40 py-2 shadow-2xl">
        <div className="flex justify-around items-center">
          
          {!isAdmin ? (
            <>
              <button 
                onClick={() => { navigateToTab("home"); handleMarkAllNotificationsRead(); }}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === "home" ? "text-emerald-400" : "text-[#9c8f79]"}`}
              >
                <Gamepad2 className="w-5 h-5" />
                <span className="text-[10px] font-bold">الرئيسية</span>
              </button>

              <button 
                onClick={() => {
                  if (gamesList.length > 0) {
                    setSelectedGame(gamesList[0]);
                  }
                  navigateToTab("game-detail");
                }}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === "game-detail" ? "text-emerald-400" : "text-[#9c8f79]"}`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-[10px] font-bold">المتجر</span>
              </button>

              <button 
                onClick={() => navigateToTab("wallet")}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === "wallet" ? "text-emerald-400" : "text-[#9c8f79]"}`}
              >
                <Wallet className="w-5 h-5" />
                <span className="text-[10px] font-bold">المحفظة</span>
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigateToTab("admin")}
              className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === "admin" ? "text-emerald-400" : "text-[#9c8f79]"}`}
            >
              <Sliders className="w-5 h-5" />
              <span className="text-[10px] font-bold">لوحة التحكم (Admin)</span>
            </button>
          )}

        </div>
      </div>
    </>
  );
}
