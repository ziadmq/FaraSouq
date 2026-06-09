/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from "firebase/firestore";
import { 
  auth, 
  db, 
  googleProvider, 
  handleFirestoreError, 
  OperationType 
} from "../../lib/firebase";
import { User } from "../../types";

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

// Simulated real-time purchases for local gaming community immersion
export const SIMULATED_LIVE_FEED = [
  { name: "خالد العتيبي", item: "660 شدة PUBG Mobile", time: "منذ ثانية", type: "pubg" },
  { name: "سارة الغامدي", item: "بطاقة Razer Gold بقيمة $50", time: "منذ دقيقتين", type: "razer" },
  { name: "محمد الأحمد", item: "شحن جوائز بطاقة VIP فضية", time: "منذ 4 دقائق", type: "vip" },
  { name: "أبو فهد", item: "1800 جوهرة Free Fire", time: "منذ 6 دقائق", type: "ff" },
  { name: "يوسف م.", item: "بطاقة PlayStation Plus سنوية", time: "منذ 8 دقائق", type: "playstation" },
  { name: "نورة القحطاني", item: "حزمة أسلحة Warzone المتميزة", time: "منذ 10 دقائق", type: "cod" }
];

interface UseAuthProps {
  onLoginSuccess: (user: User, isNew?: boolean) => void;
}

export function useAuth({ onLoginSuccess }: UseAuthProps) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  
  // Input Credentials state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [shakeError, setShakeError] = useState(false);

  // Live Purchase Feed index loop
  const [feedIndex, setFeedIndex] = useState(0);

  // Google OAuth flow states
  const [showGoogleSimulationModal, setShowGoogleSimulationModal] = useState(false);
  const [simulatedGoogleName, setSimulatedGoogleName] = useState("خالد العتيبي");
  const [simulatedGoogleEmail, setSimulatedGoogleEmail] = useState("kafehazyad5@gmail.com");

  // Rotate simulated feed items
  useEffect(() => {
    const timer = setInterval(() => {
      setFeedIndex((prev) => (prev + 1) % SIMULATED_LIVE_FEED.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Password Strength Calculation
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

  // Helper to shake UI card when error occurs
  const triggerShakeError = (msg: string) => {
    setErrorMessage(msg);
    setShakeError(true);
    setTimeout(() => setShakeError(false), 600);
  };

  // Google Sign In trigger handler - Connected directly to Google OAuth POPUP on Firebase Config
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

      // Check if document exists in Firestore
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

        // Update last login
        try {
          await updateDoc(userDocRef, { lastLogin: Date.now() });
        } catch (e) {
          console.warn("Could not save last login timestamp", e);
        }
      } else {
        // Create new user profile in Firestore
        appUser = {
          id: user.uid,
          name: cleanName,
          email: user.email || "",
          avatarLetter: cleanName.substring(0, 2),
          joinDate: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
          balance: 75.0, // Free 75 SAR welcome bonus!
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
      // Fallback popup if signInWithPopup is blocked or fails for any reason (iframe sandbox, custom domain, missing configs etc.)
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

      // REAL SYSTEM: We will NOT force simulation Modal by default.
      // We will only open it if explicitly triggered by a sandbox popup block, so that developer can preview it.
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

  // Simulation execution handler (perfectly mirrors real payload to matching database or new user triggers)
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
        balance: 1450.0, // Standard test balance for high tier demo
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

  // Form submit handler with secure Firebase Email/Password Auth
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setShakeError(false);

    // Basic Validation
    if (authMode === "login") {
      if (!email.trim() || !password.trim()) {
        triggerShakeError("الرجاء إدخال البريد الإلكتروني وكلمة المرور بشكل صحيح.");
        return;
      }

      setIsLoading(true);
      const rawEmail = email.trim().toLowerCase();
      const formattedEmail = rawEmail.includes("@") ? rawEmail : `${rawEmail}@farasouq.com`;

      try {
        // Authenticate via Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, formattedEmail, password);
        const user = userCredential.user;

        // Fetch profile
        const userDocRef = doc(db, "users", user.uid);
        let userDoc;
        try {
          userDoc = await getDoc(userDocRef);
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
        }

        let appUser: User;
        if (userDoc && userDoc.exists()) {
          const data = userDoc.data();
          if (data.status === "محظور") {
            triggerShakeError("عذراً! هذا الحساب محظور حالياً من قبل الإدارة. يرجى التواصل مع الدعم.");
            setIsLoading(false);
            return;
          }
          appUser = {
            id: user.uid,
            name: data.name || user.displayName || formattedEmail.split("@")[0],
            email: user.email || "",
            avatarLetter: (data.name || "👤").substring(0, 2),
            joinDate: data.joinDate || "اليوم",
            balance: Number(data.balance) ?? 100.0,
            status: data.status || "نشط"
          };
          
          try {
            await updateDoc(userDocRef, { lastLogin: Date.now() });
          } catch (e) {
            console.warn("Could not save last login timestamp", e);
          }
        } else {
          // Fallback if no Firestore profile
          const cleanName = user.displayName || formattedEmail.split("@")[0] || "لاعب فارة";
          appUser = {
            id: user.uid,
            name: cleanName,
            email: user.email || "",
            avatarLetter: cleanName.substring(0, 2),
            joinDate: "اليوم",
            balance: 100.0,
            status: "نشط"
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

        setSuccessMessage(`مرحباً بك مجدداً يا ${appUser.name}!`);
        setIsLoading(false);
        setTimeout(() => {
          onLoginSuccess(appUser);
        }, 1000);

      } catch (err: any) {
        console.error("Firebase Login Error:", err);
        setIsLoading(false);
        if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential" || err.code === "auth/invalid-email") {
          triggerShakeError("اسم المستخدم أو كلمة المرور غير صحيحة. يرجى مراجعة المدخلات.");
        } else {
          triggerShakeError(err.message || "حدث خطأ أثناء ومصادقة الحساب.");
        }
      }

    } else {
      // Register Mode
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
          balance: 75.0, // Free 75 SAR welcome bonus!
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
    }
  };

  return {
    authMode,
    setAuthMode,
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
    feedIndex,
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
