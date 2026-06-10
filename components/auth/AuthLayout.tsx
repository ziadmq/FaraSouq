/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gamepad2, Award, Coins, Zap, ShieldCheck, Star } from "lucide-react";

export const SIMULATED_LIVE_FEED = [
  { name: "خالد العتيبي", item: "660 شدة PUBG Mobile", time: "منذ ثانية", type: "pubg" },
  { name: "سارة الغامدي", item: "بطاقة Razer Gold بقيمة $50", time: "منذ دقيقتين", type: "razer" },
  { name: "محمد الأحمد", item: "شحن جوائز بطاقة VIP فضية", time: "منذ 4 دقائق", type: "vip" },
  { name: "أبو فهد", item: "1800 جوهرة Free Fire", time: "منذ 6 دقائق", type: "ff" },
  { name: "يوسف م.", item: "بطاقة PlayStation Plus سنوية", time: "منذ 8 دقائق", type: "playstation" },
  { name: "نورة القحطاني", item: "حزمة أسلحة Warzone المتميزة", time: "منذ 10 دقائق", type: "cod" }
];

interface AuthLayoutProps {
  children: React.ReactNode;
  emailOrNameForCard: string;
  isRegister?: boolean;
}

export default function AuthLayout({ children, emailOrNameForCard, isRegister = false }: AuthLayoutProps) {
  const [feedIndex, setFeedIndex] = useState(0);

  // Rotate simulated feed items
  useEffect(() => {
    const timer = setInterval(() => {
      setFeedIndex((prev) => (prev + 1) % SIMULATED_LIVE_FEED.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#11192a]/50 backdrop-blur-2xl border border-slate-800/80 flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]">
      
      {/* Immersive Glowing Neon Orbs in Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-amber-500/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[250px] h-[250px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(251,191,36,0.03)_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-75 pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10 relative">
        
        {/* Left Column: branding & VIP card & simulated feed */}
        <div className="lg:col-span-5 text-right flex flex-col justify-between gap-8 text-white p-2 lg:p-4 order-2 lg:order-1 h-full min-h-[480px]">
          
          {/* Header Branding */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 justify-end">
              <div>
                <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                  فارة | سوق
                </h1>
              </div>
              <div className="p-3 bg-[#152033] border border-[#2b3952] rounded-2xl shadow-xl hover:border-amber-400/40 hover:rotate-6 transition-all duration-300">
                <Gamepad2 className="w-8 h-8 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Interactive Card Graphic - Dynamically Reflected Name */}
          <div className="relative group perspective-1000 py-4 my-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <motion.div 
              whileHover={{ rotateY: -10, rotateX: 5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative bg-[#172338]/95 border border-amber-500/20 rounded-2xl p-6 shadow-2xl overflow-hidden min-h-[190px] flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-tr from-transparent via-white/[0.03] to-amber-300/[0.02] transform -translate-x-12 -translate-y-12 rotate-12 pointer-events-none" />
              
              <div className="flex justify-between items-start">
                <div className="w-10 h-8 rounded-md bg-gradient-to-br from-amber-300 via-yellow-100 to-amber-600 p-[1.5px] relative">
                  <div className="w-full h-full bg-[#18253c]/90 rounded-sm border-r border-[#2c3d59]" />
                  <div className="absolute top-[30%] left-0 w-full h-[1px] bg-amber-200/40" />
                  <div className="absolute top-[60%] left-0 w-full h-[1px] bg-amber-200/40" />
                  <div className="absolute left-[50%] top-0 w-[1px] h-full bg-amber-200/40" />
                </div>
                <div className="flex items-center gap-1.5 uppercase tracking-wide font-mono text-xs font-black text-amber-400/90">
                  <span>VIP MEMBER</span>
                  <Award className="w-4 h-4 text-amber-400 animate-pulse" />
                </div>
              </div>

              <div className="space-y-1 z-10">
                <p className="text-[10px] text-[#6e82a3] uppercase tracking-wider">اسم اللاعب المعتمد</p>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white tracking-wide">
                    {emailOrNameForCard ? emailOrNameForCard.split("@")[0] : "لاعب فارة متميز"}
                  </span>
                  <div className="bg-[#111c2d] px-2.5 py-0.5 rounded-md border border-[#2b3c56] text-[10px] text-amber-300 font-bold">
                    نشط ●
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-[#23334c] pt-3 z-10">
                <div>
                  <p className="text-[8px] text-[#6e82a3]">الرصيد الافتتاحي</p>
                  <p className="text-sm font-black text-amber-400 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{isRegister ? "75.00" : "0.00"} د.أ</span>
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-[8px] text-[#6e82a3]">تاريخ الانضمام</p>
                  <p className="text-[10px] font-mono font-bold text-white">
                    {new Date().toISOString().split("T")[0].replace(/-/g, "/")}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Interactive Live-Purchase/Delivery Ticker - Real-Time look */}
          <div className="bg-[#0b1220]/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between border-b border-[#1b2b45] pb-2 mb-2.5">
              <span className="text-[10px] text-[#6e82a3] font-bold">نشاط المتجر المباشر الآن 🟢</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9px] text-emerald-400 font-bold">متصل</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={feedIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center justify-between text-right gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#121c2e] to-[#1c2c48] flex items-center justify-center border border-slate-700 font-bold text-xs text-amber-400">
                    {SIMULATED_LIVE_FEED[feedIndex].name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{SIMULATED_LIVE_FEED[feedIndex].name}</h4>
                    <p className="text-[10px] text-amber-400/80 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-amber-400" />
                      <span>{SIMULATED_LIVE_FEED[feedIndex].item}</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500">{SIMULATED_LIVE_FEED[feedIndex].time}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Clean platform quality badges */}
          <div className="grid grid-cols-3 gap-2 pb-1">
            {[
              { title: "تسليم فوري ومبرمج", icon: Zap, color: "text-amber-400" },
              { title: "حماية مشفرة 100%", icon: ShieldCheck, color: "text-emerald-400" },
              { title: "تقييم ممتاز 4.9⭐", icon: Star, color: "text-yellow-400" }
            ].map((feature, i) => {
              const IconComp = feature.icon;
              return (
                <div key={i} className="bg-[#101b2d]/60 border border-slate-800 p-2.5 rounded-xl flex flex-col items-center text-center gap-1 hover:border-[#1a2b49] transition-colors">
                  <IconComp className={`w-4 h-4 ${feature.color}`} />
                  <span className="text-[8.5px] font-bold text-[#94a5c5] leading-tight-none">{feature.title}</span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Dynamic Form content */}
        <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center w-full">
          {children}
        </div>

      </div>
    </div>
  );
}
