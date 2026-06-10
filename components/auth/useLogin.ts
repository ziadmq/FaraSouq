/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "../../lib/firebase";
import { User } from "../../types";

interface UseLoginProps {
  onLoginSuccess: (user: User, isNew?: boolean) => void;
}

export function useLogin({ onLoginSuccess }: UseLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [shakeError, setShakeError] = useState(false);



  const triggerShakeError = (msg: string) => {
    setErrorMessage(msg);
    setShakeError(true);
    setTimeout(() => setShakeError(false), 600);
  };

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
      setErrorMessage(err.message || "فشل تسجيل الدخول باستخدام Google Auth.");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setShakeError(false);

    if (!email.trim() || !password.trim()) {
      triggerShakeError("الرجاء إدخال البريد الإلكتروني وكلمة المرور بشكل صحيح.");
      return;
    }

    setIsLoading(true);
    const rawEmail = email.trim().toLowerCase();
    const formattedEmail = rawEmail.includes("@") ? rawEmail : `${rawEmail}@farasouq.com`;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formattedEmail, password);
      const user = userCredential.user;

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
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    errorMessage,
    successMessage,
    shakeError,
    handleSubmit,
    handleGoogleLogin
  };
}
