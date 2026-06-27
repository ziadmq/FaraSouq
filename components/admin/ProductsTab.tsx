/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Coins, Plus, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { Game, GamePackage } from "../../types";

interface ProductsTabProps {
  formPackages: GamePackage[];
  handleSavePackages: (e: React.FormEvent) => void;
  handleAddPackage: () => void;
  handleRemovePackage: (id: string) => void;
  handleUpdatePackageField: (id: string, field: keyof GamePackage, value: any) => void;
  handleUpdateJawakerPackage: (oldId: string, newId: string, newName: string) => void;
  gamesList: Game[];
}

export default function ProductsTab({
  formPackages,
  handleSavePackages,
  handleAddPackage,
  handleRemovePackage,
  handleUpdatePackageField,
  handleUpdateJawakerPackage,
  gamesList
}: ProductsTabProps) {
  const jawakerGame = gamesList.find(g => g.id === "jawaker") || gamesList[0];
  const [previewingPkgId, setPreviewingPkgId] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-[#191f2f] rounded-2xl p-6 border border-[#4f4633]/30 shadow-md">


        <form onSubmit={handleSavePackages} className="space-y-5">
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center border-b border-[#4f4633]/15 pb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <h4 className="font-extrabold text-amber-200 text-sm sm:text-base">إدارة باقات الشحن</h4>
              </div>
              <button 
                type="button"
                onClick={handleAddPackage}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors active:scale-95 shadow-sm"
              >
                <span>إضافة باقة شحن جديدة</span>
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {formPackages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 bg-[#111827]/50 rounded-xl border border-[#4f4633]/20">
                <Coins className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-center text-[#9c8f79] text-sm font-bold">لا توجد باقات حالياً. اضغط على زر "إضافة باقة شحن جديدة" للبدء.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {formPackages.map((pkg, idx) => {
                  const isPreviewOpen = previewingPkgId === pkg.id;
                  return (
                    <div key={pkg.id} className="space-y-2 border-b border-[#4f4633]/15 pb-4 last:border-0 last:pb-0">
                      <div className={`p-4 rounded-xl border flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 transition-all duration-300 ${pkg.isPreferred ? "bg-gradient-to-r from-amber-500/10 to-[#070e1d] border-amber-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "bg-[#0a1120] hover:bg-[#111827] border-[#4f4633]/30"}`}>
                        
                        {/* Actions side */}
                        <div className="flex flex-wrap items-center gap-2 justify-end xl:justify-start w-full xl:w-auto shrink-0 order-3 xl:order-1 border-t xl:border-t-0 xl:border-r border-[#4f4633]/20 pt-3 xl:pt-0 xl:pr-4 mt-2 xl:mt-0">
                          <button 
                            type="button"
                            onClick={() => handleRemovePackage(pkg.id)}
                            className="p-2.5 text-rose-400 hover:text-white hover:bg-rose-500 bg-rose-500/10 rounded-lg transition-all cursor-pointer active:scale-90"
                            title="حذف الباقة"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>

                          <button 
                            type="button"
                            onClick={() => handleUpdatePackageField(pkg.id, "isPreferred", !pkg.isPreferred)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer active:scale-95 ${
                              pkg.isPreferred 
                                ? "bg-amber-400 border-amber-400 text-slate-950 font-extrabold shadow-md" 
                                : "bg-[#111827] border-[#4f4633]/40 text-[#9c8f79] hover:text-[#d3c5ac] hover:border-amber-400/50"
                            }`}
                          >
                            <Star className={`w-4 h-4 ${pkg.isPreferred ? "fill-current" : ""}`} />
                            <span>{pkg.isPreferred ? "مفضلة مميزة" : "تعيين كمفضلة"}</span>
                          </button>

                          <button 
                            type="button"
                            onClick={() => setPreviewingPkgId(isPreviewOpen ? null : pkg.id)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer active:scale-95 ${
                              isPreviewOpen 
                                ? "bg-indigo-600 border-indigo-500 text-white font-extrabold shadow-md" 
                                : "bg-[#111827] border-[#4f4633]/40 text-[#9c8f79] hover:text-[#d3c5ac] hover:border-[#4f4633]/80"
                            }`}
                          >
                            {isPreviewOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            <span>{isPreviewOpen ? "إغلاق المعاينة" : "معاينة وضبط المظهر 👁️"}</span>
                          </button>
                        </div>

                        {/* Image Upload/Preview Box */}
                        <div className="flex items-center gap-3 shrink-0 order-2 xl:order-2 bg-[#111827]/40 p-2 rounded-xl border border-[#4f4633]/10">
                          <div className="relative w-14 h-14 rounded-lg border border-slate-700 bg-slate-900 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-amber-400 group/img transition-all" title="اضغط لرفع صورة للمنتج">
                            {pkg.imageUrl ? (
                              <>
                                <img src={pkg.imageUrl} className="w-full h-full object-cover" alt="" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-[9px] text-white font-bold">
                                  تغيير
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center p-0.5 text-slate-500 group-hover/img:text-amber-400 transition-colors">
                                <Plus className="w-4 h-4 mb-0.5" />
                                <span className="text-[8px] font-bold">رفع صورة</span>
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
                                      const MAX_DIM = 300; 
                                      let width = img.width;
                                      let height = img.height;
                                      if (width > height) {
                                        if (width > MAX_DIM) {
                                          height = Math.round((height * MAX_DIM) / width);
                                          width = MAX_DIM;
                                        }
                                      } else {
                                        if (height > MAX_DIM) {
                                          width = Math.round((width * MAX_DIM) / height);
                                          height = MAX_DIM;
                                        }
                                      }
                                      canvas.width = width;
                                      canvas.height = height;
                                      const ctx = canvas.getContext("2d");
                                      if (ctx) {
                                        ctx.drawImage(img, 0, 0, width, height);
                                        const compressed = canvas.toDataURL("image/jpeg", 0.7);
                                        handleUpdatePackageField(pkg.id, "imageUrl", compressed);
                                      } else {
                                        handleUpdatePackageField(pkg.id, "imageUrl", event.target?.result as string || "");
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
                          <div className="flex flex-col gap-1 w-28">
                            <label className="text-[9px] font-bold text-slate-400 block text-right">أو رابط الصورة</label>
                            <input 
                              type="text" 
                              placeholder="رابط الصورة..."
                              value={pkg.imageUrl && !pkg.imageUrl.startsWith("data:") ? pkg.imageUrl : ""}
                              onChange={(e) => handleUpdatePackageField(pkg.id, "imageUrl", e.target.value)}
                              className="bg-[#111827] border border-[#4f4633]/40 text-white rounded px-2 py-1 text-[10px] focus:border-amber-400 outline-none w-full text-right"
                            />
                            {pkg.imageUrl && (
                              <button 
                                type="button"
                                onClick={() => handleUpdatePackageField(pkg.id, "imageUrl", "")}
                                className="text-[9px] text-rose-400 hover:text-rose-300 hover:underline text-right font-bold mt-0.5"
                              >
                                حذف الصورة
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Core fields inputs */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full text-right order-1 xl:order-3">
                          {/* Badge field */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-[#d3c5ac] block">شارة مميزة (اختياري)</label>
                            <select 
                              value={pkg.badge || ""}
                              onChange={(e) => handleUpdatePackageField(pkg.id, "badge", e.target.value)}
                              className="w-full bg-[#111827] border border-[#4f4633]/40 text-white rounded-lg px-3 py-2 text-xs sm:text-sm text-right focus:border-amber-400 outline-none transition-colors appearance-none"
                            >
                              <option value="">بدون شارة</option>
                              <option value="شائع">شائع</option>
                              <option value="الأكثر مبيعاً">الأكثر مبيعاً</option>
                              <option value="توفير فائق">توفير فائق</option>
                              <option value="عرض خاص">عرض خاص</option>
                              <option value="أساسي">أساسي</option>
                            </select>
                          </div>

                          {/* Bonus percent */}
                          <div className="space-y-1.5 relative">
                            <label className="text-[11px] font-bold text-[#d3c5ac] block">نسبة البونص (مثال: 5%)</label>
                            <div className="relative">
                              <input 
                                type="number"
                                placeholder="5"
                                value={pkg.bonusPercent === undefined || pkg.bonusPercent === 0 ? "" : pkg.bonusPercent}
                                onChange={(e) => handleUpdatePackageField(pkg.id, "bonusPercent", e.target.value === "" ? undefined : (parseInt(e.target.value) || 0))}
                                className="w-full bg-[#111827] border border-[#4f4633]/40 text-amber-400 font-bold rounded-lg px-3 py-2 pr-7 text-xs sm:text-sm text-left font-mono focus:border-amber-400 outline-none transition-colors placeholder:font-sans placeholder:text-slate-600"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
                            </div>
                          </div>

                          {/* Price field */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-[#d3c5ac] block">سعر الباقة (JOD) *</label>
                            <input 
                              type="number"
                              step="0.01"
                              min="0.1"
                              placeholder="0.00"
                              value={pkg.price}
                              onChange={(e) => handleUpdatePackageField(pkg.id, "price", parseFloat(e.target.value) || 0)}
                              className="w-full bg-[#111827] border border-[#4f4633]/40 text-white font-bold rounded-lg px-3 py-2 text-xs sm:text-sm text-left font-mono focus:border-amber-400 outline-none transition-colors"
                              required
                            />
                          </div>

                          {/* Name field */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-[#d3c5ac] block">كمية التوكنز *</label>
                            <div className="relative">
                              <input 
                                type="number"
                                placeholder="مثال: 50000"
                                value={pkg.name.replace(/\D/g, "")}
                                onChange={(e) => {
                                  const amount = e.target.value.replace(/\D/g, "");
                                  const newName = amount ? `${parseInt(amount).toLocaleString('en-US')} توكنز` : "";
                                  handleUpdatePackageField(pkg.id, "name", newName);
                                }}
                                className="w-full bg-[#111827] border border-[#4f4633]/40 text-white font-bold rounded-lg pl-12 pr-3 py-2 text-xs sm:text-sm text-right focus:border-amber-400 outline-none transition-colors"
                                required
                              />
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none">
                                توكنز
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Live Preview and Image custom options */}
                      {isPreviewOpen && (
                        <div className="bg-[#111827]/70 rounded-2xl p-5 border border-[#4f4633]/30 flex flex-col md:flex-row gap-6 items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
                          
                          {/* Left controls */}
                          <div className="flex-1 w-full text-right space-y-4">
                            <div className="flex items-center gap-2 justify-start">
                              <span className="w-2 h-4 bg-indigo-500 rounded-full" />
                              <h5 className="font-extrabold text-[#d3c5ac] text-xs sm:text-sm">إعدادات ملاءمة الصورة وأبعادها</h5>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-400 block text-right">طريقة ملاءمة الصورة (Image Fit)</label>
                                <select 
                                  value={pkg.imageFit || "cover"}
                                  onChange={(e) => handleUpdatePackageField(pkg.id, "imageFit", e.target.value)}
                                  className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-lg px-3 py-2 text-xs focus:border-amber-400 outline-none transition-colors"
                                >
                                  <option value="cover">قص تلقائي وتعبئة بالكامل (Cover)</option>
                                  <option value="contain">ملاءمة كاملة بدون قص (Contain)</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-400 block text-right">لون خلفية الصورة (Background)</label>
                                <select 
                                  value={pkg.imageBg || "bg-slate-900"}
                                  onChange={(e) => handleUpdatePackageField(pkg.id, "imageBg", e.target.value)}
                                  className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-lg px-3 py-2 text-xs focus:border-amber-400 outline-none transition-colors"
                                >
                                  <option value="bg-slate-900">رمادي داكن للمتجر</option>
                                  <option value="bg-black">أسود كامل (Pure Black)</option>
                                  <option value="bg-slate-950">داكن جداً (Dark Gray)</option>
                                  <option value="bg-gradient-to-br from-[#1b1509]/30 to-[#0d111d]/30">تدرج برونزي ناعم</option>
                                </select>
                              </div>
                            </div>

                            <div className="bg-[#070e1d]/50 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-400 space-y-1">
                              <p>💡 <b>معلومة:</b> المعاينة على اليسار تُحدث حياً ولحظياً عند تغيير أي حقل (الاسم، السعر، البونص، الصورة) لتعطيك النتيجة النهائية للمتجر بدقة.</p>
                            </div>
                          </div>

                          {/* Right preview card rendering */}
                          <div className="w-52 shrink-0 flex flex-col items-center">
                            <span className="text-[10px] font-black text-amber-400 mb-2 tracking-wider">معاينة حية للمتجر (لايف)</span>
                            
                            {(() => {
                              const displayName = pkg.name.replace(/\s*\+\s*بونص/gi, "").trim();
                              const totalTokensStr = pkg.name.replace(/\D/g, "");
                              const totalTokens = parseInt(totalTokensStr);
                              let baseTokens = totalTokens;
                              let bonusTokens = 0;
                              if (pkg.bonusPercent && !isNaN(totalTokens)) {
                                const bonusMultiplier = 1 + (pkg.bonusPercent / 100);
                                baseTokens = Math.round(totalTokens / bonusMultiplier);
                                bonusTokens = totalTokens - baseTokens;
                              }
                              const baseTokensStr = baseTokens.toLocaleString('en-US');
                              const bonusTokensStr = bonusTokens.toLocaleString('en-US');

                              const imgFit = pkg.imageFit || "cover";
                              const imgBg = pkg.imageBg || "bg-slate-900";

                              return (
                                <div className="w-full p-4 rounded-3xl border text-right flex flex-col items-center justify-start gap-3 relative overflow-hidden bg-[#0f172a]/70 border-slate-800 pointer-events-none shadow-lg">
                                  {/* Badges Container - placed in standard flow above image */}
                                  <div className="w-full flex justify-between items-center gap-1 min-h-[22px] z-20">
                                    {pkg.isPreferred ? (
                                      <div className="bg-gradient-to-r from-amber-400 to-amber-600 shadow-sm text-slate-950 text-[8px] font-black px-2 py-0.5 rounded flex items-center gap-0.5">
                                        <Star className="w-2 h-2 fill-current" />
                                        <span>مفضلة</span>
                                      </div>
                                    ) : pkg.badge ? (
                                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 shadow-sm text-white text-[8px] font-bold px-2 py-0.5 rounded">
                                        {pkg.badge}
                                      </div>
                                    ) : <div />}

                                    {pkg.bonusPercent ? (
                                      <div className="bg-gradient-to-l from-emerald-500 to-teal-600 shadow-sm text-white text-[8px] font-extrabold px-2 py-0.5 rounded">
                                        +{pkg.bonusPercent}% بونص
                                      </div>
                                    ) : <div />}
                                  </div>

                                  {/* Image Section */}
                                  <div className={`w-full h-20 rounded-xl overflow-hidden relative shrink-0 border border-slate-800/50 ${imgBg}`}>
                                    {pkg.imageUrl ? (
                                      <img 
                                        src={pkg.imageUrl} 
                                        alt="" 
                                        className={`w-full h-full ${
                                          imgFit === "contain" ? "object-contain p-1" : "object-cover"
                                        }`} 
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1b1509]/30 to-[#0d111d]/30 relative overflow-hidden">
                                        <Coins className="w-6 h-6 text-amber-500/60" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Content */}
                                  <div className="text-center w-full flex flex-col items-center justify-center flex-grow gap-1">
                                    <h4 className="font-black text-xs text-white leading-tight min-h-[20px] flex items-center justify-center">
                                      {displayName || "باقة جديدة"}
                                    </h4>
                                    
                                    {pkg.bonusPercent ? (
                                      <div className="text-[8px] text-slate-400 font-bold bg-[#1e293b]/50 border border-slate-800/80 px-2 py-0.5 rounded w-fit mx-auto shadow-sm leading-tight text-center">
                                        <span className="line-through">الكمية الأساسية: {baseTokensStr}</span>
                                      </div>
                                    ) : (
                                      <div className="text-[8px] text-slate-500 font-bold bg-slate-800/10 border border-slate-800/20 px-2 py-0.5 rounded w-fit mx-auto whitespace-nowrap">
                                        شحن آمن وفوري ⚡
                                      </div>
                                    )}
                                  </div>

                                  {/* Price */}
                                  <div className="pt-2 border-t border-slate-800/60 w-full flex flex-col items-center gap-0.5">
                                    <span className="text-[7px] uppercase font-bold text-slate-500 tracking-wider">السعر الإجمالي</span>
                                    <span className="text-sm font-black font-mono tracking-tight text-slate-300">
                                      {pkg.price.toFixed(2)} <span className="text-[10px] font-sans font-bold">{jawakerGame.currency || "JD"}</span>
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-[#4f4633]/20">
            <button 
              type="submit"
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-black px-8 py-3 rounded-xl cursor-pointer text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all active:scale-95 flex items-center gap-2"
            >
              <Coins className="w-5 h-5" />
              <span>حفظ جميع الباقات وتحديث المتجر</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
