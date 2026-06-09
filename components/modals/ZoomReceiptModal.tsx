/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface ZoomReceiptModalProps {
  zoomReceiptUrl: string | null;
  setZoomReceiptUrl: (url: string | null) => void;
}

export default function ZoomReceiptModal({
  zoomReceiptUrl,
  setZoomReceiptUrl
}: ZoomReceiptModalProps) {
  return (
    <AnimatePresence>
      {zoomReceiptUrl && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4"
        >
          <div className="absolute top-4 left-4 flex gap-2">
            <button 
              onClick={() => setZoomReceiptUrl(null)}
              className="p-3 bg-slate-900 border border-slate-700 text-rose-400 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="max-w-xl w-full text-center space-y-4">
            <div className="bg-[#191f2f] p-2 rounded-2xl border border-[#4f4633]/30 overflow-hidden shadow-2xl">
              <img 
                src={zoomReceiptUrl} 
                alt="Zoom Receipt Proof" 
                className="w-full h-auto max-h-[75vh] object-contain rounded-xl select-none"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-sm text-[#d3c5ac] font-bold">إثبات وإيصال المعاملة البنكية لطلب العميل</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
