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
  ZoomIn,
  Search,
  Star,
  Phone,
  Mail,
  Clock,
  MessageCircle
} from "lucide-react";
import { GameCategory, Game, User, BannerSlide, ShippingProof, ContactSettings } from "../types";
import BannerSlider from "../components/common/BannerSlider";

interface HomeScreenProps {
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
  contactSettings: ContactSettings;
}

export default function HomeScreen({
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
  shippingProofs,
  contactSettings
}: HomeScreenProps) {
  const [zoomProof, setZoomProof] = React.useState<ShippingProof | null>(null);

  // Build effective slides: use bannerSlides directly
  const effectiveSlides: BannerSlide[] = bannerSlides || [];

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

      {/* === AVAILABLE GAMES SECTION === */}
      <section id="games-section" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
            <h2 className="text-xl font-black text-white">أقسام ألعاب الشحن المتوفرة</h2>
          </div>

        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" dir="rtl">
          {[
            { id: GameCategory.JAWAKER, label: "جواكر" },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer border ${
                  isSelected
                    ? "bg-gradient-to-r from-amber-600 to-amber-500 border-amber-500/20 text-white shadow-lg shadow-amber-500/10 scale-[1.02]"
                    : "bg-[#191f2f] hover:bg-[#20273a] text-slate-400 border-slate-800"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Games Grid */}
        {filteredGames.length === 0 ? (
          <div className="bg-[#191f2f] rounded-3xl p-12 text-center border border-slate-800">
            <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-bold">لم يتم العثور على أي ألعاب تطابق بحثك</p>
            <p className="text-slate-600 text-xs mt-1">تأكد من كتابة الاسم بشكل صحيح أو تصفح الأقسام الأخرى</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                onClick={() => {
                  setSelectedGame(game);
                  navigateToTab("game-detail");
                }}
                className="group relative overflow-hidden rounded-3xl bg-[#191f2f] border border-slate-800 hover:border-amber-500/40 transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between"
              >
                {/* Image Wrap */}
                <div className="aspect-[16/9] w-full bg-slate-900 relative overflow-hidden shrink-0">
                  <img
                    src={game.imageUrl}
                    alt={game.name}
                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                    style={{
                      objectFit: game.imageFit || "cover",
                      objectPosition: game.imagePosition || "center"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-3 right-3 bg-slate-950/80 border border-slate-800 text-[10px] font-black px-2.5 py-1 rounded-lg text-amber-400">
                    {game.category === GameCategory.JAWAKER ? "جواكر" : game.category}
                  </span>
                </div>

                {/* Info Content */}
                <div className="p-5 flex-grow flex flex-col justify-between gap-4 text-right">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                      {game.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {game.description || "اشحن حسابك فوراً وبكل سهولة بالمعرف الخاص بك."}
                    </p>
                  </div>

                  <div className="flex items-center justify-end border-t border-slate-800/60 pt-4">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-slate-500 font-medium">يبدأ من</span>
                      <span className="text-sm font-black text-amber-400 font-mono">
                        {game.startingPrice.toFixed(2)} <span className="text-[10px] font-sans font-bold">{game.currency}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Browse Hover Overlay Bar */}
                <div className="bg-amber-500 py-2.5 text-center text-slate-950 font-black text-xs transition-all transform translate-y-full group-hover:translate-y-0 duration-300 absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1 shadow-inner">
                  <span>تصفح باقات الشحن ⚡</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* === SHIPPING PROOFS SECTION === */}
      {shippingProofs && shippingProofs.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
              <h2 className="text-xl font-black text-white">إثباتات الشحن</h2>
            </div>
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400">شحن مؤكد</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 -mt-2">عمليات شحن حقيقية أتمها عملاؤنا مع متجرنا</p>
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
                    alt={proof.caption || "إثبات شحن"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <div className="flex items-center gap-1.5">
                    <ZoomIn className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs font-bold text-white truncate">{proof.caption || "اضغط للتكبير"}</span>
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
              ×
            </button>
          </motion.div>
        </div>
      )}
      {/* ====== CONTACT SECTION ====== */}
      {(contactSettings.isWhatsappEnabled || contactSettings.isEmailEnabled) && (
        <section className="rounded-3xl bg-gradient-to-br from-[#191f2f] to-[#0f1623] border border-[#4f4633]/30 p-6 md:p-8 space-y-5 shadow-xl" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
            <h2 className="text-xl font-black text-white">تواصل معنا</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* WhatsApp Card */}
            {contactSettings.isWhatsappEnabled && contactSettings.whatsapp && (
              <a
                href={`https://wa.me/${contactSettings.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-2xl bg-green-500/5 border border-green-500/20 hover:border-green-400/50 hover:bg-green-500/10 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <MessageCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium mb-0.5">واتساب</p>
                  <p className="text-white font-bold text-sm" dir="ltr">{contactSettings.whatsapp}</p>
                  <p className="text-green-400 text-[10px] font-semibold mt-0.5">اضغط للمحادثة ←</p>
                </div>
              </a>
            )}

            {/* Email Card */}
            {contactSettings.isEmailEnabled && contactSettings.email && (
              <a
                href={`mailto:${contactSettings.email}`}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 hover:border-blue-400/50 hover:bg-blue-500/10 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium mb-0.5">البريد الإلكتروني</p>
                  <p className="text-white font-bold text-sm" dir="ltr">{contactSettings.email}</p>
                  <p className="text-blue-400 text-[10px] font-semibold mt-0.5">اضغط للمراسلة ←</p>
                </div>
              </a>
            )}

            {/* Working Hours Card */}
            {(contactSettings.workingHours || contactSettings.workingDays) && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium mb-0.5">أوقات الدعم</p>
                  {contactSettings.workingDays && <p className="text-white font-bold text-sm">{contactSettings.workingDays}</p>}
                  {contactSettings.workingHours && <p className="text-amber-300 text-xs font-semibold mt-0.5">{contactSettings.workingHours}</p>}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

    </motion.div>
  );
}
