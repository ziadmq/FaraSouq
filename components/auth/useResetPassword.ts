import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";

export function useResetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [shakeError, setShakeError] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrorMessage("الرجاء إدخال البريد الإلكتروني.");
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح.");
    } catch (error: any) {
      let message = "حدث خطأ أثناء إرسال الرابط. حاول مرة أخرى.";
      if (error.code === "auth/user-not-found") {
        message = "لا يوجد حساب مسجل بهذا البريد الإلكتروني.";
      } else if (error.code === "auth/invalid-email") {
        message = "البريد الإلكتروني المدخل غير صالح.";
      }
      setErrorMessage(message);
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    errorMessage,
    successMessage,
    shakeError,
    handleResetPassword,
  };
}
