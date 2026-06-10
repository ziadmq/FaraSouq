/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Settings } from "lucide-react";

interface CMSSettingsTabProps {
  cmsBannerText: string;
  setCmsBannerText: (text: string) => void;
  cmsBannerImage: string;
  setCmsBannerImage: (img: string) => void;
  cmsBannerUrl: string;
  setCmsBannerUrl: (url: string) => void;
  cmsPopupText: string;
  setCmsPopupText: (text: string) => void;
  handleSaveCMS: (e: React.FormEvent) => void;
}

export default function CMSSettingsTab({
  cmsBannerText,
  setCmsBannerText,
  cmsBannerImage,
  setCmsBannerImage,
  cmsBannerUrl,
  setCmsBannerUrl,
  cmsPopupText,
  setCmsPopupText,
  handleSaveCMS
}: CMSSettingsTabProps) {
  return (
    <div className="space-y-6">
      <section className="bg-[#191f2f] p-6 rounded-2xl border border-[#4f4633]/30 text-right space-y-6 shadow-md">
        
        <div className="flex items-center gap-3 justify-end border-b border-[#4f4633]/20 pb-3">
          <div>
            <h3 className="font-extrabold text-lg text-white">تخصيص واجهة فارة (CMS Control)</h3>
            <p className="text-xs text-[#9c8f79] mt-0.5">يمكنك هنا تغيير صورة البنر الرئيسي، ونصوص الإعلانات المنبثقة بشكل فوري.</p>
          </div>
          <Settings className="w-5 h-5 text-emerald-400" />
        </div>

        <form onSubmit={handleSaveCMS} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block">بنر العروض الرئيسي (عنوان البنر)</label>
            <input 
              type="text" 
              value={cmsBannerText}
              onChange={(e) => setCmsBannerText(e.target.value)}
              placeholder="العنوان الأساسي بالبنر"
              className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-right focus:border-emerald-400 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block">بنر العروض الرئيسي (رابط الصورة)</label>
            <input 
              type="text" 
              value={cmsBannerImage}
              onChange={(e) => setCmsBannerImage(e.target.value)}
              placeholder="رابط الصورة للبنر"
              className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-left font-mono outline-none"
            />
          </div>

          {/* Interactive Banner Preview Image */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#9c8f79] block">معاينة بنر العروض الترويجي النشط</label>
            <div className="border border-[#4f4633]/30 rounded-xl overflow-hidden aspect-video relative max-w-md bg-slate-950">
              <img src={cmsBannerImage} alt="Banner layout" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex flex-col justify-end p-4 text-right">
                <span className="bg-emerald-400 text-slate-950 text-[10px] uppercase font-bold px-2 py-0.5 rounded w-fit mb-1">
                  عرض ترويجي
                </span>
                <h4 className="text-white text-xs sm:text-sm font-bold truncate">{cmsBannerText}</h4>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block">رابط التوجيه عند النقر</label>
            <input 
              type="text" 
              value={cmsBannerUrl}
              onChange={(e) => setCmsBannerUrl(e.target.value)}
              className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-left font-mono outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block">نص الإعلان المنبثق العلوي</label>
            <textarea 
              value={cmsPopupText}
              onChange={(e) => setCmsPopupText(e.target.value)}
              rows={3}
              placeholder="اكتب نصوص العروض الترويجية هنا..."
              className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-right focus:border-emerald-400 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black px-6 py-2.5 rounded-xl cursor-pointer text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              حفظ وتطبيق تغييرات التخصيص
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
