/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Coins, Plus, Trash2, Star, Edit2 } from "lucide-react";
import { Game, GameCategory, GamePackage } from "../../types";

interface ProductsTabProps {
  editingGame: Game | null;
  formName: string;
  setFormName: (name: string) => void;
  formCategory: GameCategory;
  setFormCategory: (category: GameCategory) => void;
  formImageUrl: string;
  setFormImageUrl: (url: string) => void;
  formDescription: string;
  setFormDescription: (desc: string) => void;
  formStartingPrice: number;
  setFormStartingPrice: (price: number) => void;
  formPackages: GamePackage[];
  handleSaveItem: (e: React.FormEvent) => void;
  handleResetItemForm: () => void;
  handleAddPackage: () => void;
  handleRemovePackage: (id: string) => void;
  handleUpdatePackageField: (id: string, field: keyof GamePackage, value: any) => void;
  gamesList: Game[];
  handleEditClick: (game: Game) => void;
  handleDeleteItem: (id: string, name: string) => void;
}

export default function ProductsTab({
  editingGame,
  formName,
  setFormName,
  formCategory,
  setFormCategory,
  formImageUrl,
  setFormImageUrl,
  formDescription,
  setFormDescription,
  formStartingPrice,
  setFormStartingPrice,
  formPackages,
  handleSaveItem,
  handleResetItemForm,
  handleAddPackage,
  handleRemovePackage,
  handleUpdatePackageField,
  gamesList,
  handleEditClick,
  handleDeleteItem
}: ProductsTabProps) {
  return (
    <div className="space-y-6">
      
      {/* Game/Item Adding & Editing Form Panel */}
      <div className="bg-[#191f2f] rounded-2xl p-6 border border-[#4f4633]/30 shadow-md">
        <div className="flex justify-between items-center border-b border-[#4f4633]/20 pb-3 mb-4">
          <span className="text-[10px] text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded-full">
            {editingGame ? "تعديل نشط" : "إضافة منتج جديد"}
          </span>
          <h3 className="font-extrabold text-base text-emerald-200">
            {editingGame ? `تعديل بيانات المنتج: ${editingGame.name}` : "إضافة منتج أو لعبة جديدة للمتجر"}
          </h3>
        </div>

        <form onSubmit={handleSaveItem} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Game Category */}
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block text-right">فئة اللعبة أو المنتج</label>
              <select 
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as GameCategory)}
                className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-right focus:border-emerald-400 outline-none"
              >
                <option value={GameCategory.JAWAKER}>شحن جواكر (Jawaker)</option>
                <option value={GameCategory.BATTLE_ROYALE}>ألعاب باتل رويال (Battle Royale)</option>
                <option value={GameCategory.GIFT_CARDS}>بطاقات الهدايا (Gift Cards)</option>
                <option value={GameCategory.MOBA}>موبا وفانتازي (MOBA)</option>
              </select>
            </div>

            {/* Game Name */}
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block text-right">اسم اللعبة أو بطاقة الهدية *</label>
              <input 
                type="text" 
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="مثال: توكنز جواكر (Jawaker Tokens)"
                required
                className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-right focus:border-emerald-400 outline-none"
              />
            </div>

            {/* Starting Price */}
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block text-right">سعر البدء المعروض د.أ *</label>
              <input 
                type="number" 
                step="0.01"
                min="0.01"
                value={formStartingPrice}
                onChange={(e) => setFormStartingPrice(parseFloat(e.target.value) || 0)}
                placeholder="1.99"
                required
                className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-left font-mono outline-none focus:border-emerald-400"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block text-right">رابط صورة المنتج (Unsplash أو Google) *</label>
              <input 
                type="text" 
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                required
                className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-left font-mono outline-none focus:border-emerald-400"
              />
            </div>

          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block text-right">الوصف التفصيلي والتعليمات</label>
            <textarea 
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows={3}
              placeholder="اكتب تعليمات الشحن وسياسة الاسترجاع والوصف الترويجي للمنتج..."
              className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-right focus:border-emerald-400 outline-none resize-none"
            />
          </div>

          {/* Product Packages Section */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center border-b border-[#4f4633]/15 pb-2">
              <button 
                type="button"
                onClick={handleAddPackage}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة باقة شحن جديدة</span>
              </button>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-[#d3c5ac] text-xs sm:text-sm">باقات وحزم الشحن للشراء والطلب</h4>
                <Coins className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
            </div>

            {formPackages.length === 0 ? (
              <p className="text-center text-[#9c8f79] text-xs py-4">لا توجد باقات حالياً. اضغط على زر "إضافة باقة شحن جديدة" أعلاه للبدء.</p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {formPackages.map((pkg, idx) => (
                  <div key={pkg.id} className={`p-3 rounded-xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 transition-colors ${pkg.isPreferred ? "bg-emerald-400/5 border-emerald-400" : "bg-[#070e1d]/80 border-[#4f4633]/15"}`}>
                    {/* Actions side */}
                    <div className="flex items-center gap-2 justify-between md:justify-start w-full md:w-auto shrink-0 order-2 md:order-1">
                      {/* Remove package button */}
                      <button 
                        type="button"
                        onClick={() => handleRemovePackage(pkg.id)}
                        className="p-2 text-rose-400 hover:text-white hover:bg-rose-500 bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                        title="حذف الباقة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Star / Preferred package toggle */}
                      <button 
                        type="button"
                        onClick={() => handleUpdatePackageField(pkg.id, "isPreferred", !pkg.isPreferred)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                          pkg.isPreferred 
                            ? "bg-emerald-400 border-emerald-400 text-slate-950 font-extrabold shadow-sm" 
                            : "bg-[#070e1d] border-[#4f4633]/25 text-[#9c8f79] hover:text-[#d3c5ac] hover:border-emerald-400/40"
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${pkg.isPreferred ? "fill-current" : ""}`} />
                        <span>{pkg.isPreferred ? "الحزمة المفضلة الحالية ⭐" : "تعيين كالحزمة المفضلة"}</span>
                      </button>
                    </div>

                    {/* Core fields inputs */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full text-right order-1 md:order-2">
                      {/* Badge field */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-[#9c8f79] block">شارة مميزة (مثال: شائع أو توفير)</label>
                        <input 
                          type="text"
                          placeholder="شارة مميزة"
                          value={pkg.badge || ""}
                          onChange={(e) => handleUpdatePackageField(pkg.id, "badge", e.target.value)}
                          className="w-full bg-[#070e1d] border border-[#4f4633]/25 text-white rounded-lg px-2 py-1.5 text-xs text-right focus:border-emerald-400 outline-none"
                        />
                      </div>

                      {/* Bonus percent */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-[#9c8f79] block">نسبة بونص % مجاني</label>
                        <input 
                          type="number"
                          placeholder="بونص %"
                          value={pkg.bonusPercent === undefined || pkg.bonusPercent === 0 ? "" : pkg.bonusPercent}
                          onChange={(e) => handleUpdatePackageField(pkg.id, "bonusPercent", e.target.value === "" ? undefined : (parseInt(e.target.value) || 0))}
                          className="w-full bg-[#070e1d] border border-[#4f4633]/25 text-white rounded-lg px-2 py-1.5 text-xs text-left font-mono focus:border-emerald-400 outline-none"
                        />
                      </div>

                      {/* Price field */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-[#9c8f79] block">سعر الباقة د.أ *</label>
                        <input 
                          type="number"
                          step="0.01"
                          min="0.1"
                          placeholder="السعر"
                          value={pkg.price}
                          onChange={(e) => handleUpdatePackageField(pkg.id, "price", parseFloat(e.target.value) || 0)}
                          className="w-full bg-[#070e1d] border border-[#4f4633]/25 text-white rounded-lg px-2 py-1.5 text-xs text-left font-mono focus:border-emerald-400 outline-none"
                          required
                        />
                      </div>

                      {/* Name field */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-[#9c8f79] block">اسم حزمة الشحن *</label>
                        <input 
                          type="text"
                          placeholder="مثال: 325 شدة"
                          value={pkg.name}
                          onChange={(e) => handleUpdatePackageField(pkg.id, "name", e.target.value)}
                          className="w-full bg-[#070e1d] border border-[#4f4633]/25 text-white rounded-lg px-2 py-1.5 text-xs text-right focus:border-emerald-400 outline-none"
                          required
                        />
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            {(editingGame || formName || formImageUrl || formDescription) && (
              <button 
                type="button"
                onClick={handleResetItemForm}
                className="px-5 py-2.5 bg-[#2a303e] hover:bg-[#343b4c] text-neutral-300 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                إلغاء التعبئة
              </button>
            )}
            <button 
              type="submit"
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black px-6 py-2.5 rounded-xl cursor-pointer text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              {editingGame ? "تحديث وتعديل المنتج" : "حفظ إضافة المنتج الجديد"}
            </button>
          </div>
        </form>
      </div>

      {/* All Products List Table */}
      <div className="xl:col-span-12 lg:col-span-12 space-y-4">
        <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/30 shadow-md">
          <div className="flex justify-between items-center border-b border-[#4f4633]/20 pb-3 mb-4">
            <span className="text-xs text-[#9c8f79] font-mono font-bold">إجمالي المتوفر: {gamesList.length} منتجات</span>
            <h3 className="font-extrabold text-base text-emerald-200">المنتجات المعروضة بالمتجر حالياً</h3>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {gamesList.map(game => (
              <div 
                key={game.id} 
                className="bg-[#111827]/80 rounded-xl p-3 border border-[#4f4633]/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 hover:border-emerald-400/20 transition-all group"
              >
                <div className="flex items-center gap-2 justify-end sm:justify-start order-2 sm:order-1">
                  <button
                    onClick={() => handleEditClick(game)}
                    title="تعديل"
                    className="p-2.5 bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(game.id, game.name)}
                    title="حذف"
                    className="p-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Game info */}
                <div className="flex items-center gap-4 text-right shrink min-w-0 order-1 sm:order-2 w-full">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-white text-sm sm:text-base truncate group-hover:text-emerald-400 transition-colors">
                      {game.name}
                    </h4>
                    <div className="flex justify-end gap-3 items-center text-xs text-[#9c8f79] mt-1">
                      <span>السعر الأساسي: <b className="font-mono text-emerald-400">{game.startingPrice}</b> {game.currency}</span>
                      <span>•</span>
                      <span className="bg-slate-900 border border-[#4f4633]/20 text-[10px] px-2 py-0.5 rounded text-emerald-200 font-bold">
                        {game.category}
                      </span>
                    </div>
                    {game.description && (
                      <p className="text-xs text-zinc-400 max-w-full mt-1.5 text-right whitespace-pre-wrap leading-relaxed">
                        {game.description}
                      </p>
                    )}
                    {game.packages && game.packages.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 justify-end mt-2">
                        {game.packages.map(p => (
                          <span 
                            key={p.id} 
                            className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                              p.isPreferred 
                                ? "bg-emerald-400/10 border-emerald-400 text-emerald-300 font-black shadow-[0_0_8px_rgba(251,191,36,0.1)]" 
                                : "bg-[#070e1d]/90 border-[#4f4633]/15 text-[#9c8f79]"
                            }`}
                          >
                            {p.isPreferred && <Star className="w-2.5 h-2.5 fill-current text-emerald-400 animate-pulse" />}
                            <span>{p.name} ({p.price.toFixed(2)} د.أ)</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <img 
                    src={game.imageUrl} 
                    alt={game.name} 
                    className="w-14 h-14 rounded-xl object-cover border border-[#4f4633]/20 flex-shrink-0 bg-slate-900"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
