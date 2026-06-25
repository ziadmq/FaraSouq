import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { User, Shield, Calendar, Edit3, LogOut, Check, X, Wallet, Mail, Camera } from "lucide-react";
import { User as UserType } from "../types";

interface ProfileScreenProps {
  loggedUser: UserType;
  handleLogout: () => void;
  handleUpdateProfile: (name: string, imageUrl: string) => void;
  isAdmin: boolean;
}

export default function ProfileScreen({
  loggedUser,
  handleLogout,
  handleUpdateProfile,
  isAdmin
}: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(loggedUser.name);
  const [editImage, setEditImage] = useState(loggedUser.imageUrl || "");
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!editName.trim()) return;
    handleUpdateProfile(editName.trim(), editImage.trim());
    setIsEditing(false);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_DIM = 250;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_DIM) { height = Math.round((height * MAX_DIM) / width); width = MAX_DIM; }
          } else {
            if (height > MAX_DIM) { width = Math.round((width * MAX_DIM) / height); height = MAX_DIM; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.7);
            setEditImage(compressed);
            if (!isEditing) setIsEditing(true);
          } else {
            setEditImage(event.target?.result as string || "");
            if (!isEditing) setIsEditing(true);
          }
        };
        img.src = event.target?.result as string || "";
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto w-full text-right"
    >
      <div className="bg-[#191f2f] border border-[#4f4633]/30 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Cover Background */}
        <div className="h-40 bg-gradient-to-r from-amber-600/20 via-amber-400/10 to-transparent relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          {isAdmin && (
            <div className="absolute top-4 right-4 bg-amber-500/20 border border-amber-400/50 text-amber-400 px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
              <Shield className="w-4 h-4" />
              مدير النظام
            </div>
          )}
        </div>

        <div className="px-6 sm:px-10 pb-10 relative">
          {/* Avatar */}
          <div className="flex justify-between items-end -mt-16 mb-8 relative z-10">
            <div className="flex gap-4 items-end flex-row-reverse w-full">
              <button 
                onClick={handleLogout}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <span>تسجيل الخروج</span>
                <LogOut className="w-4 h-4" />
              </button>

              <div className="flex-1"></div>

              <div className="relative group">
                {/* Avatar Circle */}
                <div className="w-32 h-32 rounded-full border-4 border-[#191f2f] bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-4xl font-black text-slate-900 overflow-hidden shadow-[0_0_30px_rgba(251,191,36,0.3)] relative cursor-pointer group-hover:border-amber-400 transition-all"
                  onClick={() => avatarFileInputRef.current?.click()}>
                  {editImage ? (
                    <img 
                      src={editImage} 
                      alt={editName} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : loggedUser.imageUrl ? (
                    <img 
                      src={loggedUser.imageUrl} 
                      alt={loggedUser.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    loggedUser.avatarLetter || "👤"
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Camera className="w-6 h-6 text-white mb-1" />
                    <span className="text-[10px] text-white font-bold">تغيير الصورة</span>
                  </div>
                </div>

                {/* Always-visible camera badge */}
                <button
                  type="button"
                  onClick={() => avatarFileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-400 text-slate-900 p-2 rounded-full border-2 border-[#191f2f] shadow-lg z-30 transition-all active:scale-95 cursor-pointer"
                  title="تغيير الصورة الشخصية"
                >
                  <Camera className="w-4 h-4" />
                </button>

                {/* Hidden file input triggered by camera badge or overlay */}
                <input 
                  ref={avatarFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-black text-white mb-2">{loggedUser.name}</h1>
                <div className="flex items-center gap-4 text-sm text-[#8da1c5]">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    {(loggedUser as any).email || "لا يوجد بريد إلكتروني"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    انضم: {loggedUser.joinDate}
                  </span>
                </div>
              </div>
              
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 active:scale-95 w-full md:w-auto justify-center"
                >
                  <Edit3 className="w-4 h-4" />
                  تعديل الملف الشخصي
                </button>
              )}
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column - Stats */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-[#11192a] border border-[#21314d] rounded-2xl p-6">
                  <div className="flex items-center gap-3 text-[#d3c5ac] mb-4">
                    <Wallet className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-lg">الرصيد المتاح</h3>
                  </div>
                  <div className="text-4xl font-black text-white flex items-baseline gap-2">
                    {loggedUser.balance.toFixed(2)}
                    <span className="text-sm text-amber-400">JOD</span>
                  </div>
                </div>

                <div className="bg-[#11192a] border border-[#21314d] rounded-2xl p-6">
                  <h3 className="font-bold text-[#d3c5ac] mb-4">حالة الحساب</h3>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm ${
                    loggedUser.status === "نشط" 
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  }`}>
                    {loggedUser.status === "نشط" ? (
                      <>
                        <Check className="w-4 h-4" /> حساب نشط وموثق
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" /> حساب محظور
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Edit Form or Details */}
              <div className="lg:col-span-2 bg-[#11192a] border border-[#21314d] rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 text-white mb-8 border-b border-[#21314d] pb-4">
                  <User className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-bold">المعلومات الشخصية</h2>
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#d3c5ac] block">الاسم المكتمل</label>
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-[#0a1120] border border-[#21314d] focus:border-amber-400/50 rounded-xl px-4 py-3 text-white outline-none transition-all"
                        placeholder="أدخل اسمك الجديد"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#d3c5ac] block">الصورة الشخصية</label>
                      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        <input 
                          type="text" 
                          value={editImage && !editImage.startsWith("data:") ? editImage : ""}
                          onChange={(e) => setEditImage(e.target.value)}
                          className="flex-grow bg-[#0a1120] border border-[#21314d] focus:border-amber-400/50 rounded-xl px-4 py-3 text-white outline-none transition-all text-left text-xs sm:text-sm"
                          dir="ltr"
                          placeholder="رابط الصورة (URL)..."
                        />
                        <div className="relative shrink-0">
                          <button
                            type="button"
                            className="w-full sm:w-auto bg-[#232a3a] hover:bg-[#2d3548] text-white border border-[#21314d] px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Camera className="w-4 h-4" />
                            <span>تحميل من الاستديو</span>
                          </button>
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-[#5e7193] mt-1.5 leading-relaxed">
                        يمكنك وضع رابط مباشر للصورة، أو الضغط على "تحميل من الاستديو" لرفعها من جهازك، أو تركها فارغة لاستخدام الصورة التلقائية.
                      </p>
                      {editImage && (
                        <button 
                          type="button"
                          onClick={() => setEditImage("")}
                          className="text-xs text-rose-400 hover:text-rose-300 hover:underline font-bold mt-1 block text-right cursor-pointer"
                        >
                          إزالة الصورة الشخصية
                        </button>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-[#21314d]">
                      <button 
                        onClick={handleSave}
                        className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 flex-1 sm:flex-none"
                      >
                        حفظ التغييرات
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          setEditName(loggedUser.name);
                          setEditImage(loggedUser.imageUrl || "");
                        }}
                        className="bg-[#232a3a] hover:bg-[#2d3548] text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 flex-1 sm:flex-none"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-[#5e7193] uppercase tracking-wider block">الاسم المعروض</span>
                        <div className="text-white font-medium text-lg">{loggedUser.name}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-[#5e7193] uppercase tracking-wider block">رقم الحساب التعريفي (ID)</span>
                        <div className="text-amber-400 font-mono text-sm">{loggedUser.id}</div>
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <span className="text-xs font-bold text-[#5e7193] uppercase tracking-wider block">البريد الإلكتروني</span>
                        <div className="text-white font-medium">{(loggedUser as any).email || "لم يتم تحديد بريد إلكتروني"}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
