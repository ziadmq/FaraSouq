/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Settings, Key, Plus, Trash2 } from "lucide-react";
import { JoPaySettings } from "../../types";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

interface CMSSettingsTabProps {
  cmsBannerText: string;
  setCmsBannerText: (text: string) => void;
  cmsBannerImage: string;
  setCmsBannerImage: (img: string) => void;
  cmsBannerUrl: string;
  setCmsBannerUrl: (url: string) => void;
  cmsPopupText: string;
  setCmsPopupText: (text: string) => void;
  joPaySettings: JoPaySettings;
  setJoPaySettings: React.Dispatch<React.SetStateAction<JoPaySettings>>;
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
  joPaySettings,
  setJoPaySettings,
  handleSaveCMS
}: CMSSettingsTabProps) {

  const handleJoPayChange = (field: keyof JoPaySettings, value: any) => {
    setJoPaySettings(prev => ({ ...prev, [field]: value }));
  };

  const updateQuantityMap = (key: string, value: number) => {
    const updatedMap = { ...joPaySettings.quantityMap, [key]: value };
    handleJoPayChange("quantityMap", updatedMap);
  };

  const removeQuantityMapKey = (key: string) => {
    const updatedMap = { ...joPaySettings.quantityMap };
    delete updatedMap[key];
    handleJoPayChange("quantityMap", updatedMap);
  };

  const addQuantityMapRow = () => {
    const newKey = prompt("أدخل معرف الباقة (مثال: jw_new)");
    if (newKey) {
      updateQuantityMap(newKey, 0);
    }
  };

  const handleSaveJoPay = async () => {
    try {
      await setDoc(doc(db, "settings", "jopay"), joPaySettings);
      alert("تم حفظ إعدادات جواكر Jo-Pay بنجاح!");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ إعدادات Jo-Pay");
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-[#191f2f] p-6 rounded-2xl border border-[#4f4633]/30 text-right space-y-6 shadow-md">
        
        <div className="flex items-center gap-3 justify-end border-b border-[#4f4633]/20 pb-3">
          <div>
            <h3 className="font-extrabold text-lg text-white">إعدادات ربط جواكر (Jo-Pay) التلقائي</h3>
            <p className="text-xs text-[#9c8f79] mt-0.5">يمكنك هنا وضع الرمز السري وربط الباقات بكمياتها المطلوبة.</p>
          </div>
          <Key className="w-5 h-5 text-amber-400" />
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block">الرمز السري (X-Token)</label>
            <input 
              type="text" 
              value={joPaySettings?.token || ""}
              onChange={(e) => handleJoPayChange("token", e.target.value)}
              placeholder="0741f3ea-..."
              className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-left font-mono focus:border-amber-400 outline-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <button 
                type="button"
                onClick={addQuantityMapRow}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs font-bold bg-amber-400/10 px-3 py-1.5 rounded-lg"
              >
                <Plus className="w-3 h-3" />
                إضافة باقة
              </button>
              <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block">جدول كميات الباقات (Quantity Map)</label>
            </div>
            
            <div className="space-y-2 bg-[#070e1d] p-3 rounded-xl border border-[#4f4633]/30">
              {Object.entries(joPaySettings?.quantityMap || {}).map(([key, value]) => (
                <div key={key} className="flex gap-2 items-center">
                  <button 
                    onClick={() => removeQuantityMapKey(key)}
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <input 
                    type="number"
                    value={value}
                    onChange={(e) => updateQuantityMap(key, parseInt(e.target.value) || 0)}
                    className="flex-1 bg-[#191f2f] text-white border border-[#4f4633]/30 rounded-lg px-3 py-2 text-sm text-center outline-none"
                    placeholder="الكمية (مثال: 50000)"
                  />
                  <input 
                    type="text"
                    readOnly
                    value={key}
                    className="flex-1 bg-[#191f2f] text-[#9c8f79] border border-[#4f4633]/30 rounded-lg px-3 py-2 text-sm text-right outline-none opacity-70"
                  />
                </div>
              ))}
              {Object.keys(joPaySettings?.quantityMap || {}).length === 0 && (
                <p className="text-center text-xs text-[#9c8f79] py-4">لم يتم إضافة باقات بعد</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="button"
              onClick={handleSaveJoPay}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-2.5 rounded-xl cursor-pointer text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              حفظ إعدادات Jo-Pay في قاعدة البيانات
            </button>
          </div>
        </div>
      </section>

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
            <div className="border border-[#4f4633]/30 rounded-xl overflow-hidden aspect-video relative max-w-md bg-slate-950 mx-auto">
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
