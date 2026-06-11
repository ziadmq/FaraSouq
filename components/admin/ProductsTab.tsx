/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Coins, Plus, Trash2, Star } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <div className="bg-[#191f2f] rounded-2xl p-6 border border-[#4f4633]/30 shadow-md">


        <form onSubmit={handleSavePackages} className="space-y-5">
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center border-b border-[#4f4633]/15 pb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-400" />
                <h4 className="font-extrabold text-emerald-200 text-sm sm:text-base">إدارة باقات الشحن</h4>
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
                {formPackages.map((pkg, idx) => (
                  <div key={pkg.id} className={`p-4 rounded-xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-all duration-300 ${pkg.isPreferred ? "bg-gradient-to-r from-emerald-500/10 to-[#070e1d] border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "bg-[#0a1120] hover:bg-[#111827] border-[#4f4633]/30"}`}>
                    
                    {/* Actions side */}
                    <div className="flex items-center gap-2 justify-end md:justify-start w-full md:w-auto shrink-0 order-2 md:order-1 border-t md:border-t-0 md:border-r border-[#4f4633]/20 pt-3 md:pt-0 md:pr-4 mt-2 md:mt-0">
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
                            ? "bg-emerald-400 border-emerald-400 text-slate-950 font-extrabold shadow-md" 
                            : "bg-[#111827] border-[#4f4633]/40 text-[#9c8f79] hover:text-[#d3c5ac] hover:border-emerald-400/50"
                        }`}
                      >
                        <Star className={`w-4 h-4 ${pkg.isPreferred ? "fill-current" : ""}`} />
                        <span>{pkg.isPreferred ? "الحزمة المفضلة المميزة" : "تعيين كالحزمة المفضلة"}</span>
                      </button>
                    </div>

                    {/* Core fields inputs */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full text-right order-1 md:order-2">
                      {/* Badge field */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#d3c5ac] block">شارة مميزة (اختياري)</label>
                        <select 
                          value={pkg.badge || ""}
                          onChange={(e) => handleUpdatePackageField(pkg.id, "badge", e.target.value)}
                          className="w-full bg-[#111827] border border-[#4f4633]/40 text-white rounded-lg px-3 py-2 text-xs sm:text-sm text-right focus:border-emerald-400 outline-none transition-colors appearance-none"
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
                            className="w-full bg-[#111827] border border-[#4f4633]/40 text-emerald-400 font-bold rounded-lg px-3 py-2 pr-7 text-xs sm:text-sm text-left font-mono focus:border-emerald-400 outline-none transition-colors placeholder:font-sans placeholder:text-slate-600"
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
                          className="w-full bg-[#111827] border border-[#4f4633]/40 text-white font-bold rounded-lg px-3 py-2 text-xs sm:text-sm text-left font-mono focus:border-emerald-400 outline-none transition-colors"
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
                            className="w-full bg-[#111827] border border-[#4f4633]/40 text-white font-bold rounded-lg pl-12 pr-3 py-2 text-xs sm:text-sm text-right focus:border-emerald-400 outline-none transition-colors"
                            required
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none">
                            توكنز
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-[#4f4633]/20">
            <button 
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black px-8 py-3 rounded-xl cursor-pointer text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all active:scale-95 flex items-center gap-2"
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
