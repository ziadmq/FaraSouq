/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Key, Plus, Trash2, Save } from "lucide-react";
import { JoPaySettings } from "../../types";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

interface CMSSettingsTabProps {
  joPaySettings: JoPaySettings;
  setJoPaySettings: React.Dispatch<React.SetStateAction<JoPaySettings>>;
  showToast: (text: string, type: "success" | "error" | "info") => void;
}

export default function CMSSettingsTab({
  joPaySettings,
  setJoPaySettings,
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
                className="bg-[#312e81] hover:bg-[#3730a3] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors active:scale-95 shadow-sm"
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
                    className="flex-1 bg-[#0c1322] text-amber-400 font-bold border border-[#4f4633]/30 rounded-xl px-4 py-2.5 text-sm sm:text-base text-center outline-none focus:border-amber-400"
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
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-black px-6 py-2.5 rounded-xl cursor-pointer text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all active:scale-95 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>حفظ إعدادات Jo-Pay</span>
            </button>
          </div>
        </div>
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
