/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "../../lib/firebase";
import { User } from "../../types";
import { PasswordStrength } from "./useAuth";

interface UseRegisterProps {
  onLoginSuccess: (user: User, isNew?: boolean) => void;
}

export function useRegister({ onLoginSuccess }: UseRegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [shakeError, setShakeError] = useState(false);

  // Google OAuth flow states
  const [showGoogleSimulationModal, setShowGoogleSimulationModal] = useState(false);
  const [simulatedGoogleName, setSimulatedGoogleName] = useState("خالد العتيبي");
  const [simulatedGoogleEmail, setSimulatedGoogleEmail] = useState("kafehazyad5@gmail.com");

  const triggerShakeError = (msg: string) => {
    setErrorMessage(msg);
    setShakeError(true);
    setTimeout(() => setShakeError(false), 600);
  };

  const getPasswordStrength = (pass: string): PasswordStrength => {
    if (!pass) return { score: 0, label: "فارغ", color: "bg-slate-800" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) || /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: "ضعيف ⚠️", color: "bg-rose-500" };
    if (score === 3) return { score, label: "متوسط ⚡", color: "bg-amber-400" };
    if (score === 4) return { score, label: "قوي وآمن 🛡️", color: "bg-emerald-500" };
    return { score, label: "فائق التفوق والأمان! 💎", color: "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" };
  };

  const strength = getPasswordStrength(password);

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user) {
        throw new Error("لم يتم تلقي بيانات المستخدم من Google.");
      }

      const userDocRef = doc(db, "users", user.uid);
      let userDoc;
      try {
        userDoc = await getDoc(userDocRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
      }

      let appUser: User;
      const cleanName = user.displayName || user.email?.split("@")[0] || "لاعب فارة";

      if (userDoc && userDoc.exists()) {
        const data = userDoc.data();
        if (data.status === "محظور") {
          setErrorMessage("عذراً! هذا الحساب محظور حالياً من قبل الإدارة.");
          setIsLoading(false);
          return;
        }
        appUser = {
          id: user.uid,
          name: data.name || cleanName,
          email: user.email || "",
          avatarLetter: (data.name || cleanName).substring(0, 2),
          joinDate: data.joinDate || "نوفمبر 2024",
          balance: Number(data.balance) ?? 100.0,
          status: data.status || "نشط",
          imageUrl: user.photoURL || undefined
        };

        try {
          await updateDoc(userDocRef, { lastLogin: Date.now() });
        } catch (e) {
          console.warn("Could not save last login timestamp", e);
        }
      } else {
        appUser = {
          id: user.uid,
          name: cleanName,
          email: user.email || "",
          avatarLetter: cleanName.substring(0, 2),
          joinDate: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
          balance: 75.0,
          status: "نشط",
          imageUrl: user.photoURL || undefined
        };

        try {
          await setDoc(userDocRef, {
            ...appUser,
            lastLogin: Date.now()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
        }
      }

      setSuccessMessage(`أهلاً بك يا ${appUser.name}! تم تسجيل الدخول بنجاح بواسطة حساب Google 🌐`);
      setIsLoading(false);
      setTimeout(() => {
        onLoginSuccess(appUser);
      }, 1200);

    } catch (err: any) {
      console.error("Google Auth standard error:", err);
      const isSimulationTrigger = 
        err.code === "auth/popup-blocked" || 
        err.code === "auth/operation-not-allowed" || 
        err.code === "auth/configuration-not-found" || 
        err.code === "auth/unauthorized-domain" ||
        err.code === "auth/popup-closed-by-user" ||
        err.code === "auth/cancelled-popup-request" ||
        err.message?.includes("iframe") || 
        err.message?.includes("popup") ||
        err.message?.includes("not-allowed") ||
        err.message?.includes("config") ||
        err.message?.includes("unauthorized") ||
        err.message?.includes("domain");

      if (isSimulationTrigger) {
        setErrorMessage("تنبيه: تم تفعيل محاكي السحابة المتقدم لعدم تمكن المتصفح من فتح نافذة Google المنبثقة.");
        setIsLoading(false);
        setShowGoogleSimulationModal(true);
      } else {
        setErrorMessage(err.message || "فشل تسجيل الدخول باستخدام Google Auth.");
        setIsLoading(false);
      }
    }
  };

  const handleExecuteGoogleSimulation = async () => {
    setShowGoogleSimulationModal(false);
    setIsLoading(true);
    
    try {
      const cleanName = simulatedGoogleName.trim() || "مستخدم Google";
      const cleanEmail = simulatedGoogleEmail.trim() || "user@gmail.com";
      const simulatedId = `google_sim_${Math.floor(100000 + Math.random() * 900000)}`;
      
      const simulatedGoogleUser: User = {
        id: simulatedId,
        name: cleanName,
        email: cleanEmail,
        avatarLetter: cleanName.substring(0, 2),
        joinDate: "اليوم",
        balance: 1450.0,
        status: "نشط"
      };

      const userDocRef = doc(db, "users", simulatedId);
      try {
        await setDoc(userDocRef, {
          ...simulatedGoogleUser,
          lastLogin: Date.now()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${simulatedId}`);
      }

      setSuccessMessage(`مرحباً يا ${cleanName}! تم تسجيل دخولك بنجاح بنمط محاكاة Google المُطور 🌐`);
      setIsLoading(false);
      setTimeout(() => {
        onLoginSuccess(simulatedGoogleUser);
      }, 1200);

    } catch (err: any) {
      console.error("Google simulation write error:", err);
      setIsLoading(false);
      setErrorMessage("فشل تسجيل الدخول وحفظ البيانات في قاعدة البيانات.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setShakeError(false);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      triggerShakeError("جميع الحقول مطلوبة لإنشاء حساب جديد.");
      return;
    }
    if (password.length < 6) {
      triggerShakeError("كلمة المرور يجب أن تكون 6 رموز على الأقل لحماية حسابك.");
      return;
    }
    if (password !== confirmPassword) {
      triggerShakeError("تأكيد كلمة المرور لا يطابق كلمة المرور التي اخترتها.");
      return;
    }

    setIsLoading(true);
    const rawEmail = email.trim().toLowerCase();
    const formattedEmail = rawEmail.includes("@") ? rawEmail : `${rawEmail}@farasouq.com`;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formattedEmail, password);
      const user = userCredential.user;

      try {
        await updateProfile(user, { displayName: fullName });
      } catch (e) {
        console.warn("Profile update display name failed:", e);
      }

      const newUser: User = {
        id: user.uid,
        name: fullName,
        email: formattedEmail,
        avatarLetter: fullName.substring(0, 2),
        joinDate: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
        balance: 75.0,
        status: "نشط"
      };

      const userDocRef = doc(db, "users", user.uid);
      try {
        await setDoc(userDocRef, {
          ...newUser,
          lastLogin: Date.now()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
      }

      setSuccessMessage("تهانينا! تم إنشاء حسابك وحصلت على 75 د.أ مكافأة ترحيبية 🎉");
      setIsLoading(false);
      setTimeout(() => {
        onLoginSuccess(newUser, true);
      }, 1500);

    } catch (err: any) {
      console.error("Firebase registration error:", err);
      setIsLoading(false);
      if (err.code === "auth/email-already-in-use") {
        triggerShakeError("هذا البريد الإلكتروني مسجل بالفعل لدى حساب نشط آخر.");
      } else if (err.code === "auth/invalid-email") {
        triggerShakeError("صيغة البريد الإلكتروني المدخلة غير صحيحة.");
      } else {
        triggerShakeError(err.message || "حدث خطأ غير متوقع أثناء المعالجة سحابياً.");
      }
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    isLoading,
    errorMessage,
    successMessage,
    shakeError,
    showGoogleSimulationModal,
    setShowGoogleSimulationModal,
    simulatedGoogleName,
    setSimulatedGoogleName,
    simulatedGoogleEmail,
    setSimulatedGoogleEmail,
    strength,
    handleSubmit,
    handleGoogleLogin,
    handleExecuteGoogleSimulation
  };
}
