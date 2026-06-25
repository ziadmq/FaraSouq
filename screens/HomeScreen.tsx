/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { 
  Gamepad2, 
  Wallet,
  CheckCircle2,
  ZoomIn
} from "lucide-react";
import { GameCategory, Game, User, BannerSlide, ShippingProof } from "../types";
import BannerSlider from "../components/common/BannerSlider";

interface HomeScreenProps {
  cmsBannerBadgeText: string;
  cmsBannerImage: string;
  cmsBannerText: string;
  cmsBannerSubtitle: string;
  cmsBannerButtonText: string;
  cmsBannerUrl: string;
  gamesList: Game[];
  setSelectedGame: (game: Game) => void;
  navigateToTab: (tab: "home" | "game-detail" | "wallet" | "admin" | "login" | "profile") => void;
  selectedCategory: GameCategory;
  setSelectedCategory: (category: GameCategory) => void;
  showToast: (text: string, type?: "success" | "error" | "info") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredGames: Game[];
  loggedUser: User | null;
  bannerSlides: BannerSlide[];
  shippingProofs: ShippingProof[];
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
  loggedUser,
  bannerSlides,
  shippingProofs
}: HomeScreenProps) {
  const [zoomProof, setZoomProof] = React.useState<ShippingProof | null>(null);

  // Build effective slides: use bannerSlides if available, otherwise fallback to single CMS banner
  const effectiveSlides: BannerSlide[] = bannerSlides && bannerSlides.length > 0
    ? bannerSlides
    : [{
        id: "cms_default",
        imageUrl: cmsBannerImage,
        title: cmsBannerText,
        subtitle: cmsBannerSubtitle,
        badgeText: cmsBannerBadgeText,
        buttonText: cmsBannerButtonText || "\u0627\u0643\u062a\u0634\u0641 \u0627\u0644\u0639\u0631\u0648\u0636",
        buttonUrl: cmsBannerUrl
      }];

  const handleSlideButtonClick = (slide: BannerSlide) => {
    if (slide.buttonUrl) {
      if (slide.buttonUrl.startsWith("http")) {
        window.open(slide.buttonUrl, "_blank");
      } else {
        window.location.href = slide.buttonUrl;
      }
      return;
    }
    const jwGame = gamesList.find(g => g.id.includes("jw")) || gamesList[0];
    if (jwGame) setSelectedGame(jwGame);
    navigateToTab("game-detail");
  };

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      
      {/* === BANNER SLIDER === */}
      <BannerSlider slides={effectiveSlides} onButtonClick={handleSlideButtonClick} />

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
              <h3 className="text-2xl font-black text-white mb-2">\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0631\u0635\u064a\u062f</h3>
              <p className="text-[#d3c5ac] text-sm">\u0642\u0645 \u0628\u0634\u062d\u0646 \u0631\u0635\u064a\u062f \u0645\u062d\u0641\u0638\u062a\u0643\u060c \u0648\u0645\u062a\u0627\u0628\u0639\u0629 \u062d\u0648\u0627\u0644\u0627\u062a\u0643 \u0648\u0645\u0639\u0631\u0641\u0629 \u0631\u0635\u064a\u062f\u0643 \u0627\u0644\u0645\u062a\u0627\u062d \u0644\u0644\u0634\u0631\u0627\u0621 \u0641\u0648\u0631\u0627\u064b.</p>
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
            <h3 className="text-2xl font-black text-white mb-2">\u0628\u0627\u0642\u0627\u062a \u0627\u0644\u0634\u062d\u0646</h3>
            <p className="text-[#d3c5ac] text-sm">\u062a\u0635\u0641\u062d \u0627\u0644\u0628\u0627\u0642\u0627\u062a \u0627\u0644\u0645\u062a\u0648\u0641\u0631\u0629\u060c \u0648\u0627\u062e\u062a\u0631 \u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u0623\u0646\u0633\u0628 \u0644\u0643 \u0644\u062a\u0634\u062d\u0646\u0647\u0627 \u0645\u0628\u0627\u0634\u0631\u0629 \u0648\u062a\u0633\u062a\u0645\u062a\u0639 \u0628\u0627\u0644\u0644\u0639\u0628.</p>
          </div>
        </button>
      </div>

      {/* === SHIPPING PROOFS SECTION === */}
      {shippingProofs && shippingProofs.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
              <h2 className="text-xl font-black text-white">\u0625\u062b\u0628\u0627\u062a\u0627\u062a \u0627\u0644\u0634\u062d\u0646</h2>
            </div>
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400">\u0634\u062d\u0646 \u0645\u0624\u0643\u062f</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 -mt-2">\u0639\u0645\u0644\u064a\u0627\u062a \u0634\u062d\u0646 \u062d\u0642\u064a\u0642\u064a\u0629 \u0623\u062a\u0645\u0647\u0627 \u0639\u0645\u0644\u0627\u0624\u0646\u0627 \u0645\u0639 \u0645\u062a\u062c\u0631\u0646\u0627</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {shippingProofs.map((proof) => (
              <div
                key={proof.id}
                className="relative group rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/40 transition-all duration-300 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                onClick={() => setZoomProof(proof)}
              >
                <div className="aspect-square bg-slate-900">
                  <img
                    src={proof.imageUrl}
                    alt={proof.caption || "\u0625\u062b\u0628\u0627\u062a \u0634\u062d\u0646"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <div className="flex items-center gap-1.5">
                    <ZoomIn className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs font-bold text-white truncate">{proof.caption || "\u0627\u0636\u063a\u0637 \u0644\u0644\u062a\u0643\u0628\u064a\u0631"}</span>
                  </div>
                  {proof.date && (
                    <span className="text-[10px] text-slate-400 mt-0.5">{proof.date}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Zoom lightbox for shipping proofs */}
      {zoomProof && (
        <div
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[200] flex items-center justify-center p-4"
          onClick={() => setZoomProof(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-xl w-full bg-[#111827] rounded-3xl overflow-hidden border border-slate-700 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <img src={zoomProof.imageUrl} alt={zoomProof.caption} className="w-full object-contain max-h-[70vh]" />
            {(zoomProof.caption || zoomProof.date) && (
              <div className="p-4 text-right">
                {zoomProof.caption && <p className="font-bold text-white text-sm">{zoomProof.caption}</p>}
                {zoomProof.date && <p className="text-xs text-slate-400 mt-1">{zoomProof.date}</p>}
              </div>
            )}
            <button
              onClick={() => setZoomProof(null)}
              className="absolute top-3 left-3 bg-slate-900/80 text-white p-2 rounded-full border border-slate-700 hover:bg-slate-800 transition-all text-xs font-bold cursor-pointer"
            >
              \u00d7
            </button>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}
