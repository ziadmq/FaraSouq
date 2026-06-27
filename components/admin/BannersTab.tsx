/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Plus, Trash2, Save, Upload, Image as ImageIcon } from "lucide-react";
import { BannerSlide } from "../../types";

interface BannersTabProps {
  bannerSlides: BannerSlide[];
  handleSaveBannerSlides: (slides: BannerSlide[]) => void;
  showToast: (text: string, type: "success" | "error" | "info") => void;
}

export default function BannersTab({
  bannerSlides,
  handleSaveBannerSlides,
  showToast
}: BannersTabProps) {
  const [localSlides, setLocalSlides] = useState<BannerSlide[]>(bannerSlides || []);

  const handleAddSlide = () => {
    const newSlide: BannerSlide = {
      id: `slide_${Date.now()}`,
      imageUrl: "",
      title: "عنوان العرض الجديد",
      subtitle: "وصف العرض الجديد",
      badgeText: "جديد!",
      buttonText: "اشحن الآن",
      buttonUrl: ""
    };
    setLocalSlides([...localSlides, newSlide]);
  };

  const handleUpdateSlide = (id: string, field: keyof BannerSlide, value: string) => {
    setLocalSlides(localSlides.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleRemoveSlide = (id: string) => {
    setLocalSlides(localSlides.filter(s => s.id !== id));
  };

  const handleSaveAllSlides = () => {
    handleSaveBannerSlides(localSlides);
    showToast("تم حفظ شرائح البنر بنجاح!", "success");
  };

  return (
    <section className="bg-[#191f2f] p-6 rounded-2xl border border-[#4f4633]/30 text-right space-y-6 shadow-md">
      <div className="flex justify-between items-center border-b border-[#4f4633]/20 pb-4">
        <div className="flex items-center gap-3 justify-start">
          <ImageIcon className="w-7 h-7 text-amber-400" />
          <div>
            <h3 className="font-extrabold text-xl text-white">إدارة شرائح البنر (Banner Slides)</h3>
            <p className="text-sm font-medium text-[#9c8f79] mt-1">تعديل وإضافة الصور والعروض الترويجية المتحركة أعلى الصفحة الرئيسية.</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={handleAddSlide}
          className="bg-[#312e81] hover:bg-[#3730a3] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors active:scale-95 shadow-sm"
        >
          <span>إضافة شريحة عروض</span>
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {localSlides.map((slide, idx) => (
          <div key={slide.id} className="p-4 rounded-xl border border-[#4f4633]/20 bg-[#070e1d] space-y-4">
            <div className="flex justify-between items-center border-b border-[#4f4633]/10 pb-2">
              <span className="text-xs font-bold text-slate-500">شريحة #{idx + 1}</span>
              <button 
                type="button"
                onClick={() => handleRemoveSlide(slide.id)}
                className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-500 bg-rose-500/10 rounded-lg transition-all cursor-pointer active:scale-90 flex items-center gap-1 text-xs font-bold"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف الشريحة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image Upload/Link field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#d3c5ac] block">صورة الشريحة</label>
                <div className="flex gap-3 items-center">
                  <div className="relative w-16 h-16 rounded-xl border border-slate-700 bg-slate-900 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-amber-400 group/slideimg transition-all shrink-0">
                    {slide.imageUrl ? (
                      <>
                        <img src={slide.imageUrl} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/slideimg:opacity-100 flex items-center justify-center transition-opacity text-[8px] text-white font-bold">تغيير</div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-500 text-center p-1">
                        <Upload className="w-4 h-4 mb-0.5" />
                        <span className="text-[7px] font-bold">رفع ملف</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const img = new Image();
                            img.onload = () => {
                              const canvas = document.createElement("canvas");
                              const MAX_DIM = 800; 
                              let width = img.width;
                              let height = img.height;
                              if (width > height) {
                                  height = Math.round((height * MAX_DIM) / width);
                                  width = MAX_DIM;
                              } else {
                                  width = Math.round((width * MAX_DIM) / height);
                                  height = MAX_DIM;
                              }
                              canvas.width = width;
                              canvas.height = height;
                              const ctx = canvas.getContext("2d");
                              if (ctx) {
                                ctx.drawImage(img, 0, 0, width, height);
                                const compressed = canvas.toDataURL("image/jpeg", 0.7);
                                handleUpdateSlide(slide.id, "imageUrl", compressed);
                              }
                            };
                            img.src = event.target?.result as string || "";
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="أو رابط الصورة المباشر..."
                    value={slide.imageUrl.startsWith("data:") ? "" : slide.imageUrl}
                    onChange={(e) => handleUpdateSlide(slide.id, "imageUrl", e.target.value)}
                    className="flex-1 bg-[#0c1322] border border-[#4f4633]/30 text-white rounded-xl px-3 py-3 text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                {/* Image Fit and Position Settings */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-amber-400">طريقة احتواء الصورة</label>
                    <select
                      value={slide.imageFit || "cover"}
                      onChange={(e) => handleUpdateSlide(slide.id, "imageFit", e.target.value as "cover" | "contain")}
                      className="w-full bg-[#0c1322] border border-[#4f4633]/30 text-white rounded-xl px-2 py-2 text-[10px] text-right focus:border-amber-400 outline-none cursor-pointer"
                    >
                      <option value="cover">قص تلقائي متناسق (Cover)</option>
                      <option value="contain">احتواء كامل بدون قص (Contain)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-amber-400">موضع الصورة (التركيز)</label>
                    <select
                      value={slide.imagePosition || "center"}
                      onChange={(e) => handleUpdateSlide(slide.id, "imagePosition", e.target.value)}
                      className="w-full bg-[#0c1322] border border-[#4f4633]/30 text-white rounded-xl px-2 py-2 text-[10px] text-right focus:border-amber-400 outline-none cursor-pointer"
                    >
                      <option value="center">المنتصف (Center)</option>
                      <option value="top">الأعلى (Top)</option>
                      <option value="bottom">الأسفل (Bottom)</option>
                      <option value="left">اليسار (Left)</option>
                      <option value="right">اليمين (Right)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Redirect URL */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#d3c5ac] block">الوجهة عند النقر (رابط الصفحة)</label>
                <input 
                  type="text" 
                  placeholder="أدخل الرابط أو اسم الصفحة هنا..."
                  value={slide.buttonUrl}
                  onChange={(e) => handleUpdateSlide(slide.id, "buttonUrl", e.target.value)}
                  className="w-full bg-[#0c1322] border border-[#4f4633]/30 text-white rounded-xl px-3 py-3 text-xs focus:border-amber-400 outline-none text-right"
                  dir="rtl"
                />
                <span className="text-[10px] text-[#9c8f79] block mt-1 leading-relaxed">
                  💡 يحدد أين يذهب الزائر عند الضغط على إعلان السلايدر. لفتح صفحة شحن جواكر اكتب: <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-400 font-mono text-[9px]">game-detail</code> أو ضع رابطاً خارجياً.
                </span>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#d3c5ac] block">العنوان الرئيسي للبنر</label>
                <input 
                  type="text" 
                  value={slide.title}
                  onChange={(e) => handleUpdateSlide(slide.id, "title", e.target.value)}
                  className="w-full bg-[#0c1322] border border-[#4f4633]/30 text-white rounded-xl px-3 py-3 text-xs focus:border-amber-400 outline-none"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#d3c5ac] block">العنوان الفرعي للبنر</label>
                <input 
                  type="text" 
                  value={slide.subtitle}
                  onChange={(e) => handleUpdateSlide(slide.id, "subtitle", e.target.value)}
                  className="w-full bg-[#0c1322] border border-[#4f4633]/30 text-white rounded-xl px-3 py-3 text-xs focus:border-amber-400 outline-none"
                />
              </div>

              {/* Badge text */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#d3c5ac] block">نص الشارة</label>
                <input 
                  type="text" 
                  value={slide.badgeText}
                  onChange={(e) => handleUpdateSlide(slide.id, "badgeText", e.target.value)}
                  className="w-full bg-[#0c1322] border border-[#4f4633]/30 text-white rounded-xl px-3 py-3 text-xs focus:border-amber-400 outline-none"
                />
              </div>

              {/* Button text */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#d3c5ac] block">نص الزر</label>
                <input 
                  type="text" 
                  value={slide.buttonText}
                  onChange={(e) => handleUpdateSlide(slide.id, "buttonText", e.target.value)}
                  className="w-full bg-[#0c1322] border border-[#4f4633]/30 text-white rounded-xl px-3 py-3 text-xs focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            {/* Live Slide Preview — matches BannerSlider exactly */}
            <div className="mt-4 rounded-2xl overflow-hidden relative shadow-lg border border-amber-500/20" style={{ height: "180px" }}>
              <span className="absolute top-2 left-2 z-30 bg-amber-500/80 text-white text-[8px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">معاينة حية</span>

              {/* Background image — same method as BannerSlider */}
              <div
                className="absolute inset-0 bg-no-repeat"
                style={{
                  backgroundImage: slide.imageUrl ? `url(${slide.imageUrl})` : undefined,
                  backgroundSize: slide.imageFit === "contain" ? "contain" : "cover",
                  backgroundPosition: slide.imagePosition || "center",
                  backgroundColor: slide.imageUrl ? undefined : "#0f172a"
                }}
              />

              {/* Same gradient overlays as BannerSlider */}
              <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/60 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

              {!slide.imageUrl && (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                  لا توجد صورة
                </div>
              )}

              {/* Content — same side/alignment as BannerSlider (RTL, right side) */}
              <div className="relative z-10 h-full flex flex-col justify-center px-5 text-right" dir="rtl">
                {slide.badgeText && (
                  <span className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-semibold px-2.5 py-1 rounded-full mb-2 w-fit">
                    🔥 {slide.badgeText}
                  </span>
                )}
                <h4 className="text-white text-sm font-bold leading-tight truncate drop-shadow-lg" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
                  {slide.title || "عنوان الشريحة"}
                </h4>
                {slide.subtitle && (
                  <p className="text-slate-300 text-[10px] mt-1 line-clamp-1 leading-relaxed">{slide.subtitle}</p>
                )}
                {slide.buttonText && (
                  <div className="mt-2">
                    <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-3 py-1 rounded-xl shadow-md shadow-amber-500/30 border border-amber-400/30">
                      {slide.buttonText}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {localSlides.length === 0 && (
          <p className="text-center text-xs text-[#9c8f79] py-4">لم يتم إضافة شرائح متحركة بعد. اضغط على زر "إضافة شريحة عروض" للبدء.</p>
        )}
      </div>

      <div className="flex justify-end pt-2 border-t border-[#4f4633]/15">
        <button 
          type="button"
          onClick={handleSaveAllSlides}
          className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-black px-6 py-2.5 rounded-xl cursor-pointer text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all active:scale-95 flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          <span>حفظ وتطبيق شرائح البنر</span>
        </button>
      </div>
    </section>
  );
}
