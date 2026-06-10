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
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Immersive Glowing Neon Orbs in Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(16,185,129,0.03)_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-75 pointer-events-none" />

      <div className="w-full max-w-md mx-auto z-10 relative flex flex-col items-center">
        
        {/* Header Branding */}
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="p-3 bg-[#152033] border border-emerald-500/20 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <Gamepad2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            فارة | سوق
          </h1>
          <p className="text-[#6e82a3] text-xs font-medium">البوابة الأولى لخدمات الألعاب الرقمية</p>
        </div>

        {/* Dynamic Form content */}
        <div className="w-full">
          {children}
        </div>

      </div>
    </div>
  );
}
