import React, { useState } from "react";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile
} from "firebase/auth";
import { initializeApp } from "firebase/app";

// Initialize Firebase using your config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function AuthSample() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isRegister) {
        // 1. Create User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // 2. Add Name to profile
        if (name.trim()) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        setSuccess("تم إنشاء الحساب بنجاح!");
      } else {
        // 1. Sign In
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess("تم تسجيل الدخول بنجاح!");
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء العملية.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      setSuccess("تم تسجيل الدخول بواسطة Google بنجاح!");
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء الاتصال بـ Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>{isRegister ? "إنشاء حساب جديد" : "تسجيل الدخول"}</h2>
      
      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
      {success && <div style={{ color: "green", marginBottom: "10px" }}>{success}</div>}

      <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {isRegister && (
          <input 
            type="text" 
            placeholder="الاسم الكامل" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        )}
        <input 
          type="email" 
          placeholder="البريد الإلكتروني" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="كلمة المرور" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <button type="submit" disabled={loading}>
          {loading ? "جاري المعالجة..." : (isRegister ? "سجل الآن" : "دخول")}
        </button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      <button onClick={handleGoogleAuth} disabled={loading} style={{ width: "100%", padding: "10px", backgroundColor: "#4285F4", color: "white", border: "none", borderRadius: "4px" }}>
        تسجيل الدخول بواسطة Google
      </button>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        <button onClick={() => setIsRegister(!isRegister)} style={{ background: "none", border: "none", color: "blue", cursor: "pointer", textDecoration: "underline" }}>
          {isRegister ? "لديك حساب بالفعل؟ سجل دخولك" : "ليس لديك حساب؟ أنشئ حساباً جديداً"}
        </button>
      </p>
    </div>
  );
}
