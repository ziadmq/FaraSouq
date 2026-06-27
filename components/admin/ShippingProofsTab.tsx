/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Plus, Trash2, Save, Upload, Calendar } from "lucide-react";
import { ShippingProof } from "../../types";

interface ShippingProofsTabProps {
  shippingProofs: ShippingProof[];
  handleSaveShippingProofs: (proofs: ShippingProof[]) => void;
  showToast: (text: string, type: "success" | "error" | "info") => void;
}

export default function ShippingProofsTab({
  shippingProofs,
  handleSaveShippingProofs,
  showToast
}: ShippingProofsTabProps) {
  const [localProofs, setLocalProofs] = useState<ShippingProof[]>(shippingProofs || []);

  const handleAddProof = () => {
    const newProof: ShippingProof = {
      id: `proof_${Date.now()}`,
      imageUrl: "",
      caption: "إثبات شحن جديد",
      date: new Date().toLocaleDateString('en-GB')
    };
    setLocalProofs([...localProofs, newProof]);
  };

  const handleUpdateProof = (id: string, field: keyof ShippingProof, value: string) => {
    setLocalProofs(localProofs.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleRemoveProof = (id: string) => {
    setLocalProofs(localProofs.filter(p => p.id !== id));
  };

  const handleSaveAllProofs = () => {
    handleSaveShippingProofs(localProofs);
    showToast("تم حفظ إثباتات الشحن بنجاح!", "success");
  };

  return (
    <section className="bg-[#191f2f] p-6 rounded-2xl border border-[#4f4633]/30 text-right space-y-6 shadow-md">
      <div className="flex justify-between items-center border-b border-[#4f4633]/20 pb-4">
        <div className="flex items-center gap-3 justify-start">
          <Calendar className="w-7 h-7 text-amber-400" />
          <div>
            <h3 className="font-extrabold text-xl text-white">إدارة إثباتات الشحن (Shipping Proofs)</h3>
            <p className="text-sm font-medium text-[#9c8f79] mt-1">تعديل وإضافة صور إيصالات الشحن الناجحة لزيادة ثقة العملاء وعرضها بالرئيسية.</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={handleAddProof}
          className="bg-[#312e81] hover:bg-[#3730a3] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors active:scale-95 shadow-sm"
        >
          <span>إضافة إثبات شحن</span>
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {localProofs.map((proof, idx) => (
          <div key={proof.id} className="p-4 rounded-xl border border-[#4f4633]/20 bg-[#070e1d] flex flex-col gap-3 relative">
            <button 
              type="button"
              onClick={() => handleRemoveProof(proof.id)}
              className="absolute top-2 left-2 p-1.5 text-rose-400 hover:text-white hover:bg-rose-500 bg-rose-500/10 rounded-lg transition-all cursor-pointer active:scale-90"
              title="حذف الإثبات"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-slate-500">إثبات #{idx + 1}</span>

            {/* Image Input Container (both File Upload and URL) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#d3c5ac] block">صورة الإثبات</label>
              <div className="flex gap-2 items-center">
                {/* Studio File uploader box */}
                <div className="relative w-12 h-12 rounded-lg border border-slate-700 bg-slate-900 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-amber-400 group/proofimg transition-all shrink-0 shadow-inner">
                  {proof.imageUrl ? (
                    <>
                      <img src={proof.imageUrl} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/proofimg:opacity-100 flex items-center justify-center transition-opacity text-[8px] text-white font-bold">تغيير</div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500 text-center p-0.5">
                      <Upload className="w-4 h-4 mb-0.5" />
                      <span className="text-[7px] font-bold">رفع</span>
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
                            const MAX_DIM = 500; 
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
                              handleUpdateProof(proof.id, "imageUrl", compressed);
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

                {/* URL Text input */}
                <input 
                  type="text" 
                  placeholder="أو رابط صورة الإثبات المباشر..."
                  value={proof.imageUrl.startsWith("data:") ? "" : proof.imageUrl}
                  onChange={(e) => handleUpdateProof(proof.id, "imageUrl", e.target.value)}
                  className="flex-1 bg-[#0c1322] border border-[#4f4633]/30 text-white rounded-lg px-2.5 py-2 text-[10px] focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            {/* Caption */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#d3c5ac]">التعليق (Caption)</label>
              <input 
                type="text" 
                placeholder="مثال: شحن 50 ألف توكنز..."
                value={proof.caption}
                onChange={(e) => handleUpdateProof(proof.id, "caption", e.target.value)}
                className="w-full bg-[#0c1322] border border-[#4f4633]/30 text-white rounded-xl px-3 py-1.5 text-xs focus:border-amber-400 outline-none"
              />
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#d3c5ac]">التاريخ</label>
              <input 
                type="text" 
                placeholder="مثال: 27/06/2026"
                value={proof.date}
                onChange={(e) => handleUpdateProof(proof.id, "date", e.target.value)}
                className="w-full bg-[#0c1322] border border-[#4f4633]/30 text-white rounded-xl px-3 py-1.5 text-xs focus:border-amber-400 outline-none font-mono"
                dir="ltr"
              />
            </div>
          </div>
        ))}
        {localProofs.length === 0 && (
          <p className="text-center text-xs text-[#9c8f79] py-4 col-span-full">لم يتم إضافة إثباتات شحن بعد. اضغط على زر "إضافة إثبات شحن" للبدء.</p>
        )}
      </div>

      <div className="flex justify-end pt-2 border-t border-[#4f4633]/15">
        <button 
          type="button"
          onClick={handleSaveAllProofs}
          className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-black px-6 py-2.5 rounded-xl cursor-pointer text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all active:scale-95 flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          <span>حفظ وتطبيق إثباتات الشحن</span>
        </button>
      </div>
    </section>
  );
}
