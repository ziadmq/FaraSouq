/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Phone, Mail, Clock, Calendar, Link as LinkIcon, Save } from "lucide-react";
import { ContactSettings } from "../../types";

interface SupportTabProps {
  contactSettings: ContactSettings;
  handleSaveContactSettings: (settings: ContactSettings) => void;
  showToast: (text: string, type: "success" | "error" | "info") => void;
}

export default function SupportTab({
  contactSettings,
  handleSaveContactSettings,
  showToast
}: SupportTabProps) {
  const [localContact, setLocalContact] = useState<ContactSettings>(contactSettings);

  return (
    <div className="bg-[#191f2f] rounded-2xl p-6 border border-[#4f4633]/40 space-y-5 text-right">
      <div className="flex items-center gap-3 pb-3 border-b border-[#4f4633]/20 justify-start">
        <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
          <Phone className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="font-black text-base text-amber-400">بيانات التواصل والدعم الفني</h3>
          <p className="text-[11px] text-[#9c8f79] mt-0.5">تظهر في قسم "تواصل معنا" بالصفحة الرئيسية</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* WhatsApp */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#d3c5ac] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-green-400" /> رقم الواتساب
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <span className="text-[10px] text-slate-500">تفعيل</span>
              <div
                className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${localContact.isWhatsappEnabled ? "bg-green-500" : "bg-slate-700"}`}
                onClick={() => setLocalContact(p => ({ ...p, isWhatsappEnabled: !p.isWhatsappEnabled }))}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${localContact.isWhatsappEnabled ? "left-4.5 translate-x-0" : "left-0.5"}`} />
              </div>
            </label>
          </div>
          <div className="relative">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 text-xs font-bold">+</span>
            <input
              type="text"
              dir="ltr"
              placeholder="962791234567"
              value={localContact.whatsapp}
              onChange={e => setLocalContact(p => ({ ...p, whatsapp: e.target.value }))}
              className="w-full bg-[#0c1322] border border-[#4f4633]/30 text-white rounded-xl pl-3 pr-7 py-2.5 text-sm focus:border-green-400 outline-none font-mono text-left placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#d3c5ac] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" /> البريد الإلكتروني
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <span className="text-[10px] text-slate-500">تفعيل</span>
              <div
                className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${localContact.isEmailEnabled ? "bg-blue-500" : "bg-slate-700"}`}
                onClick={() => setLocalContact(p => ({ ...p, isEmailEnabled: !p.isEmailEnabled }))}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${localContact.isEmailEnabled ? "left-4.5 translate-x-0" : "left-0.5"}`} />
              </div>
            </label>
          </div>
          <input
            type="email"
            dir="ltr"
            placeholder="support@farasouq.com"
            value={localContact.email}
            onChange={e => setLocalContact(p => ({ ...p, email: e.target.value }))}
            className="w-full bg-[#0c1322] border border-[#4f4633]/30 text-white rounded-xl px-3 py-2.5 text-sm focus:border-blue-400 outline-none font-mono text-left placeholder:text-slate-600"
          />
        </div>

        {/* Working Hours */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#d3c5ac] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> ساعات العمل
          </label>
          <input
            type="text"
            placeholder="9:00 ص - 11:00 م"
            value={localContact.workingHours}
            onChange={e => setLocalContact(p => ({ ...p, workingHours: e.target.value }))}
            className="w-full bg-[#0c1322] border border-[#4f4633]/30 text-white rounded-xl px-3 py-2.5 text-sm focus:border-amber-400 outline-none text-right"
            dir="rtl"
          />
        </div>

        {/* Working Days */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#d3c5ac] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" /> أيام العمل
          </label>
          <input
            type="text"
            placeholder="السبت - الخميس"
            value={localContact.workingDays}
            onChange={e => setLocalContact(p => ({ ...p, workingDays: e.target.value }))}
            className="w-full bg-[#0c1322] border border-[#4f4633]/30 text-white rounded-xl px-3 py-2.5 text-sm focus:border-amber-400 outline-none text-right"
            dir="rtl"
          />
        </div>
      </div>

      {/* Footer Links */}
      <div className="space-y-3 pt-3 border-t border-[#4f4633]/15">
        <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5 justify-start">
          <LinkIcon className="w-3.5 h-3.5" /> روابط الفوتر (اتركها فارغة لتعطيلها)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: "terms" as const, label: "الشروط والأحكام" },
            { key: "about" as const, label: "من نحن" },
            { key: "support" as const, label: "الدعم الفني والشكاوى" },
            { key: "payment" as const, label: "طرق الدفع والتحصيل" },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <label className="text-[10px] font-bold text-[#9c8f79]">{label}</label>
              <input
                type="text"
                dir="ltr"
                placeholder="https://... أو /page"
                value={localContact.footerLinks?.[key] || ""}
                onChange={e => setLocalContact(p => ({
                  ...p,
                  footerLinks: { ...p.footerLinks, [key]: e.target.value }
                }))}
                className="w-full bg-[#0c1322] border border-[#4f4633]/30 text-white rounded-xl px-3 py-2 text-xs focus:border-amber-400 outline-none font-mono text-left placeholder:text-slate-700"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-[#4f4633]/15">
        <button
          type="button"
          onClick={() => { handleSaveContactSettings(localContact); showToast("تم حفظ بيانات التواصل!", "success"); }}
          className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-black px-6 py-2.5 rounded-xl cursor-pointer text-sm shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all active:scale-95 flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          <span>حفظ بيانات التواصل</span>
        </button>
      </div>
    </div>
  );
}
