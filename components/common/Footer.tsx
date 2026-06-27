/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Gamepad2, ShoppingBag, Wallet, Sliders } from "lucide-react";
import { Game, ContactSettings } from "../../types";

interface FooterProps {
  isAdmin: boolean;
  activeTab: string;
  gamesList: Game[];
  navigateToTab: (tab: "home" | "game-detail" | "wallet" | "admin" | "login" | "profile") => void;
  showToast: (text: string, type: "success" | "error" | "info") => void;
  handleMarkAllNotificationsRead: () => void;
  setSelectedGame: (game: Game) => void;
  contactSettings: ContactSettings;
}

export default function Footer({
  isAdmin,
  activeTab,
  gamesList,
  navigateToTab,
  showToast,
  handleMarkAllNotificationsRead,
  setSelectedGame,
  contactSettings
}: FooterProps) {

  const footerLinks = [
    { label: "الشروط والأحكام", url: contactSettings.footerLinks?.terms },
    { label: "من نحن",          url: contactSettings.footerLinks?.about },
    { label: "الدعم الفني والشكاوى", url: contactSettings.footerLinks?.support },
    { label: "طرق الدفع والتحصيل",   url: contactSettings.footerLinks?.payment },
  ];

  const handleFooterLinkClick = (url?: string, label?: string) => {
    if (url) {
      if (url.startsWith("http")) {
        window.open(url, "_blank");
      } else {
        window.location.href = url;
      }
    } else {
      showToast("سيتم إضافة هذه الصفحة قريباً", "info");
    }
  };

  return (
    <>
      {/* High contrast responsive Footer */}
      <footer className="relative bg-[#070e1d] mt-24 py-12 text-sm select-none overflow-hidden">
        {/* Decorative Top Border Gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        {/* Background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-40 bg-amber-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col md:flex-row-reverse justify-between items-center gap-10 text-center relative z-10">
          
          <div className="flex gap-8 font-semibold flex-wrap justify-center text-slate-400">
            {footerLinks.map((link, idx) => (
              <a 
                key={idx}
                onClick={() => handleFooterLinkClick(link.url, link.label)} 
                className="hover:text-amber-400 cursor-pointer transition-all duration-300 hover:-translate-y-1 relative group"
              >
                {link.label}
                <span className="absolute -bottom-2 left-1/2 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </a>
            ))}
          </div>

          <div className="flex flex-col items-center md:items-start gap-3">
            <span className="font-headline-md text-2xl sm:text-3xl text-amber-400 font-black tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              فارة | سوق
            </span>
            <span className="text-slate-500/70 text-xs font-mono">
              © 2026 فارة | سوق. جميع الحقوق محفوظة.
            </span>
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
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === "home" ? "text-amber-400" : "text-[#9c8f79]"}`}
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
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === "game-detail" ? "text-amber-400" : "text-[#9c8f79]"}`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-[10px] font-bold">المتجر</span>
              </button>

              <button 
                onClick={() => navigateToTab("wallet")}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === "wallet" ? "text-amber-400" : "text-[#9c8f79]"}`}
              >
                <Wallet className="w-5 h-5" />
                <span className="text-[10px] font-bold">المحفظة</span>
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigateToTab("admin")}
              className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === "admin" ? "text-amber-400" : "text-[#9c8f79]"}`}
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
