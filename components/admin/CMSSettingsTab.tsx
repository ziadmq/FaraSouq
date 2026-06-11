/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Settings, Key, Plus, Trash2, Save, Tag, Type, Text, MousePointerClick, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { JoPaySettings } from "../../types";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

interface CMSSettingsTabProps {
  cmsBannerBadgeText: string;
  setCmsBannerBadgeText: (text: string) => void;
  cmsBannerText: string;
  setCmsBannerText: (text: string) => void;
  cmsBannerSubtitle: string;
  setCmsBannerSubtitle: (text: string) => void;
  cmsBannerButtonText: string;
  setCmsBannerButtonText: (text: string) => void;
  cmsBannerImage: string;
  setCmsBannerImage: (img: string) => void;
  cmsBannerUrl: string;
  setCmsBannerUrl: (url: string) => void;
  joPaySettings: JoPaySettings;
  setJoPaySettings: React.Dispatch<React.SetStateAction<JoPaySettings>>;
  handleSaveCMS: (e: React.FormEvent) => void;
  showToast: (text: string, type: "success" | "error" | "info") => void;
}

export default function CMSSettingsTab({
  cmsBannerBadgeText,
  setCmsBannerBadgeText,
  cmsBannerText,
  setCmsBannerText,
  cmsBannerSubtitle,
  setCmsBannerSubtitle,
  cmsBannerButtonText,
  setCmsBannerButtonText,
  cmsBannerImage,
  setCmsBannerImage,
  cmsBannerUrl,
  setCmsBannerUrl,
  joPaySettings,
  setJoPaySettings,
  handleSaveCMS,
  showToast
}: CMSSettingsTabProps) {

  const [newRowId, setNewRowId] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

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
    if (!newRowId.trim()) return;
    updateQuantityMap(newRowId.trim(), 0);
    setNewRowId("");
    setShowAddModal(false);
  };

  const handleSaveJoPay = async () => {
    try {
      await setDoc(doc(db, "settings", "jopay"), joPaySettings);
      showToast("تم حفظ إعدادات جواكر Jo-Pay بنجاح!", "success");
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ أثناء حفظ إعدادات Jo-Pay", "error");
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-[#191f2f] p-6 rounded-2xl border border-[#4f4633]/30 text-right space-y-6 shadow-md">
        
        <div className="flex items-center gap-3 justify-start border-b border-[#4f4633]/20 pb-4">
          <Key className="w-7 h-7 text-amber-400" />
          <div>
            <h3 className="font-extrabold text-xl text-white">إعدادات ربط جواكر (Jo-Pay) التلقائي</h3>
            <p className="text-sm font-medium text-[#9c8f79] mt-1">يمكنك هنا وضع الرمز السري وربط الباقات بكمياتها المطلوبة.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block">الرمز السري للربط (API Token)</label>
            <input 
              type="text" 
              value={joPaySettings?.token || ""}
              onChange={(e) => handleJoPayChange("token", e.target.value)}
              placeholder="ضع الرمز السري هنا"
              className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-sm sm:text-base text-right font-mono focus:border-amber-400 outline-none"
              dir="ltr"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm sm:text-base font-bold text-[#d3c5ac] block">جدول كميات الباقات (Quantity Map)</label>
              <button 
                type="button"
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors active:scale-95 shadow-sm"
              >
                <span>إضافة باقة ربط جديدة</span>
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 bg-[#070e1d] p-3 rounded-xl border border-[#4f4633]/30">
              {Object.keys(joPaySettings?.quantityMap || {}).length > 0 && (
                <div className="flex gap-3 items-center px-1 mb-1">
                  <div className="w-11"></div>
                  <div className="flex-1 text-center text-xs text-[#9c8f79] font-bold">الكمية (Quantity)</div>
                  <div className="flex-1 text-center text-xs text-[#9c8f79] font-bold">المعرف (ID)</div>
                </div>
              )}
              {Object.entries(joPaySettings?.quantityMap || {}).map(([key, value]) => (
                <div key={key} className="flex gap-3 items-center">
                  <button 
                    onClick={() => removeQuantityMapKey(key)}
                    className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-colors shrink-0"
                    title="حذف الباقة"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <input 
                    type="number"
                    value={value}
                    onChange={(e) => updateQuantityMap(key, parseInt(e.target.value) || 0)}
                    className="flex-1 bg-[#0c1322] text-emerald-400 font-bold border border-[#4f4633]/30 rounded-xl px-4 py-2.5 text-sm sm:text-base text-center outline-none focus:border-amber-400"
                    placeholder="الكمية (مثال: 50000)"
                  />
                  <input 
                    type="text"
                    readOnly
                    value={key}
                    className="flex-1 bg-[#191f2f] text-white font-bold border border-[#4f4633]/30 rounded-xl px-4 py-2.5 text-sm sm:text-base text-center outline-none"
                    dir="ltr"
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
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black px-6 py-2.5 rounded-xl cursor-pointer text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all active:scale-95 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>حفظ إعدادات Jo-Pay</span>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#191f2f] p-6 rounded-2xl border border-[#4f4633]/30 text-right space-y-6 shadow-md">
        
        <div className="flex items-center gap-3 justify-start border-b border-[#4f4633]/20 pb-4">
          <Settings className="w-7 h-7 text-emerald-400" />
          <div>
            <h3 className="font-extrabold text-xl text-white">تخصيص واجهة فارة سوق (CMS Control)</h3>
            <p className="text-sm font-medium text-[#9c8f79] mt-1">يمكنك هنا تغيير صورة البنر الرئيسي، ونصوص الإعلانات المنبثقة بشكل فوري.</p>
          </div>
        </div>

        <form onSubmit={handleSaveCMS} className="space-y-4">
          
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-amber-400 mb-1.5">
              <Tag className="w-4 h-4" />
              شارة الإشعار العلوية (Badge)
            </label>
            <input 
              type="text" 
              value={cmsBannerBadgeText}
              onChange={(e) => setCmsBannerBadgeText(e.target.value)}
              placeholder="مثال: عرض لفترة محدودة"
              className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-sm sm:text-base text-right focus:border-emerald-400 outline-none"
              dir="rtl"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-amber-400 mb-1.5">
              <Type className="w-4 h-4" />
              العنوان الرئيسي للبنر (Headline)
            </label>
            <input 
              type="text" 
              value={cmsBannerText}
              onChange={(e) => setCmsBannerText(e.target.value)}
              placeholder="العنوان الأساسي بالبنر"
              className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-sm sm:text-base text-right focus:border-emerald-400 outline-none"
              dir="rtl"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-amber-400 mb-1.5">
              <Text className="w-4 h-4" />
              النص الوصفي التفصيلي (Subtitle)
            </label>
            <textarea 
              value={cmsBannerSubtitle}
              onChange={(e) => setCmsBannerSubtitle(e.target.value)}
              rows={2}
              placeholder="وصف العرض الترويجي..."
              className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-sm sm:text-base text-right focus:border-emerald-400 outline-none resize-none leading-relaxed"
              dir="rtl"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-amber-400 mb-1.5">
              <MousePointerClick className="w-4 h-4" />
              النص المكتوب على الزر (Button Text)
            </label>
            <input 
              type="text" 
              value={cmsBannerButtonText}
              onChange={(e) => setCmsBannerButtonText(e.target.value)}
              placeholder="مثال: اشحن جواكر الان"
              className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-sm sm:text-base text-right focus:border-emerald-400 outline-none"
              dir="rtl"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-amber-400 mb-1.5">
              <ImageIcon className="w-4 h-4" />
              رابط صورة البنر (Image URL)
            </label>
            <input 
              type="text" 
              value={cmsBannerImage}
              onChange={(e) => setCmsBannerImage(e.target.value)}
              placeholder="رابط الصورة للبنر"
              className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-sm sm:text-base text-left font-mono outline-none focus:border-amber-400"
              dir="ltr"
            />
            <div className="flex flex-col gap-1 mt-1.5 text-xs sm:text-sm text-[#9c8f79] text-right bg-slate-900/50 p-3 rounded-lg border border-[#4f4633]/20">
              <p>💡 <b>ملاحظة هامة:</b> يجب أن يكون رابطاً مباشراً لصورة مرفوعة على الإنترنت ويبدأ بـ (http/https). مثال: روابط من Imgur أو Discord.</p>
              <p>💡 <b>الحجم:</b> النظام سيقوم بقص الصورة تلقائياً لتناسب المساحة (ولا يهم الحجم الدقيق)، ولكن للحصول على أفضل مظهر يُفضل استخدام صورة <b>عرضية (Landscape)</b> مثل 1200x400.</p>
            </div>
          </div>

          {/* Interactive Banner Preview Image */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#9c8f79] block">معاينة بنر العروض الترويجي النشط</label>
            <div className="border border-[#4f4633]/30 rounded-xl overflow-hidden aspect-video relative max-w-md bg-slate-950 mx-auto">
              <img src={cmsBannerImage} alt="Banner layout" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex flex-col justify-end p-4 text-right">
                {cmsBannerBadgeText && (
                  <span className="bg-emerald-400 text-slate-950 text-[10px] uppercase font-bold px-2 py-0.5 rounded w-fit mb-1">
                    {cmsBannerBadgeText}
                  </span>
                )}
                <h4 className="text-white text-xs sm:text-sm font-bold truncate">{cmsBannerText}</h4>
                {cmsBannerSubtitle && (
                  <p className="text-white/80 text-[9px] mt-1 line-clamp-2">{cmsBannerSubtitle}</p>
                )}
                {cmsBannerButtonText && (
                  <div className="mt-2">
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">{cmsBannerButtonText}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-amber-400 mb-1.5">
              <LinkIcon className="w-4 h-4" />
              الرابط الموجه عند النقر (Redirect URL)
            </label>
            <input 
              type="text" 
              value={cmsBannerUrl}
              onChange={(e) => setCmsBannerUrl(e.target.value)}
              className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-sm sm:text-base text-left font-mono outline-none"
              dir="ltr"
            />
          </div>



          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black px-6 py-2.5 rounded-xl cursor-pointer text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all active:scale-95 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>حفظ وتطبيق تغييرات التخصيص</span>
            </button>
          </div>
        </form>
      </section>

      {/* Modal for adding Jo-Pay package */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070e1d]/80 backdrop-blur-sm px-4">
          <div className="bg-[#191f2f] border border-[#4f4633]/30 rounded-2xl w-full max-w-sm p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-white font-extrabold text-lg text-right">إضافة باقة ربط جديدة</h3>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#d3c5ac] block text-right">معرف الباقة (ID)</label>
              <input 
                type="text" 
                value={newRowId}
                onChange={(e) => setNewRowId(e.target.value)}
                placeholder="jw_new :مثال"
                className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-3 text-sm text-right font-mono focus:border-indigo-400 outline-none"
                dir="ltr"
                autoFocus
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => { setShowAddModal(false); setNewRowId(""); }}
                className="flex-1 px-4 py-2.5 rounded-xl text-white font-bold bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={addQuantityMapRow}
                disabled={!newRowId.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl text-white font-bold bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed transition-colors"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
