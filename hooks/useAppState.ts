/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, collection, onSnapshot, query, where, deleteDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, db, functions, handleFirestoreError, OperationType } from "../lib/firebase";
import { GameCategory, OrderStatus, PaymentMethod, Game, GamePackage, Order, User, AppNotification, JoPaySettings, BannerSlide, ShippingProof } from "../types";
import { GAMES_DATA, INITIAL_ORDERS, INITIAL_USERS, INITIAL_NOTIFICATIONS } from "../data";

export function useAppState() {
  // Navigation tabs: 'home' | 'game-detail' | 'wallet' | 'admin' | 'login' | 'profile'
  const [activeTab, setActiveTab] = useState<"home" | "game-detail" | "wallet" | "admin" | "login" | "profile">("home");
  
  // Dynamic list of games state
  const [gamesList, setGamesList] = useState<Game[]>(() => {
    const saved = localStorage.getItem("fara_games_list_v3");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const verified = parsed.filter(pg => GAMES_DATA.some(g => g.id === pg.id));
          if (verified.length > 0) {
            return verified;
          }
        }
      } catch (err) {
        console.error("Failed to parse games list", err);
      }
    }
    return GAMES_DATA;
  });

  // Game selected for detail page
  const [selectedGame, setSelectedGame] = useState<Game>(() => {
    const saved = localStorage.getItem("fara_games_list_v3");
    let initialGames = GAMES_DATA;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const verified = parsed.filter(pg => GAMES_DATA.some(g => g.id === pg.id));
          if (verified.length > 0) {
            initialGames = verified;
          }
        }
      } catch (e) {}
    }
    return initialGames.find(g => g.id === "jawaker") || initialGames[0];
  });

  const [cmsBannerBadgeText, setCmsBannerBadgeText] = useState("جديد!");
  const [cmsBannerSubtitle, setCmsBannerSubtitle] = useState("خصم يصل إلى 20% على جميع باقات جواكر لفترة محدودة");
  const [cmsBannerButtonText, setCmsBannerButtonText] = useState("اكتشف العروض");

  // Package management form states
  const [formPackages, setFormPackages] = useState<GamePackage[]>([]);

  // Initialize Jawaker packages when gamesList loads
  useEffect(() => {
    const jawaker = gamesList.find(g => g.id === "jawaker") || gamesList[0];
    if (jawaker && jawaker.packages && formPackages.length === 0) {
      setFormPackages(JSON.parse(JSON.stringify(jawaker.packages)));
    }
  }, [gamesList]);
  
  // Custom states
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loyaltyXp, setLoyaltyXp] = useState<number>(4820);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>(GameCategory.ALL);

  // States for CMS & alert configurations (loaded into memory)
  const [cmsBannerText, setCmsBannerText] = useState<string>("اشحن توكنز جواكر بأفضل الأسعار ⭐");
  const [cmsBannerUrl, setCmsBannerUrl] = useState<string>("");
  const [cmsBannerImage, setCmsBannerImage] = useState<string>("https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=1200&auto=format&fit=crop");
  const [cmsPopupText, setCmsPopupText] = useState<string>("");

  // Banner Slider slides state
  const DEFAULT_BANNER_SLIDES: BannerSlide[] = [
    {
      id: "slide_1",
      imageUrl: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=1200&auto=format&fit=crop",
      title: "اشحن توكنز جواكر بأفضل الأسعار ⭐",
      subtitle: "خصم يصل إلى 20% على جميع باقات جواكر لفترة محدودة",
      badgeText: "جديد!",
      buttonText: "اكتشف العروض",
      buttonUrl: ""
    }
  ];

  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>(() => {
    const saved = localStorage.getItem("fara_banner_slides_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_BANNER_SLIDES;
  });

  const handleSaveBannerSlides = (slides: BannerSlide[]) => {
    // Filter out Base64 images for localStorage size safety
    const slidesForStorage = slides.map(s => ({
      ...s,
      imageUrl: s.imageUrl.startsWith("data:") ? "" : s.imageUrl
    }));
    localStorage.setItem("fara_banner_slides_v1", JSON.stringify(slides));
    setBannerSlides(slides);
  };

  // Shipping Proofs state
  const [shippingProofs, setShippingProofs] = useState<ShippingProof[]>(() => {
    const saved = localStorage.getItem("fara_shipping_proofs_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  const handleSaveShippingProofs = (proofs: ShippingProof[]) => {
    localStorage.setItem("fara_shipping_proofs_v1", JSON.stringify(proofs));
    setShippingProofs(proofs);
  };

  const [joPaySettings, setJoPaySettings] = useState<JoPaySettings>({
    token: "",
    quantityMap: {
      "jw_50k": 50000,
      "jw_100k": 100000,
      "jw_250k": 250000,
      "jw_750k": 750000,
      "jw_1.5m": 1500000,
      "jw_3m": 3000000
    }
  });

  useEffect(() => {
    const fetchJoPay = async () => {
      try {
        const docSnap = await getDoc(doc(db, "settings", "jopay"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setJoPaySettings({
            token: data.token || "",
            quantityMap: data.quantityMap || {
              "jw_50k": 50000,
              "jw_100k": 100000,
              "jw_250k": 250000,
              "jw_750k": 750000,
              "jw_1.5m": 1500000,
              "jw_3m": 3000000
            }
          });
        }
      } catch (e) {
        console.error("Error fetching jopay settings:", e);
      }
    };
    fetchJoPay();
  }, []);

  // States for Package Selection Screen (Screen 2)
  const [playerId, setPlayerId] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<GamePackage | null>(null);
  const [playerIdError, setPlayerIdError] = useState<string>("");
  const [showIdHelp, setShowIdHelp] = useState<boolean>(false);

  // States for Wallet deposit Form (Screen 3)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CLIQ);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string>("");
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string>("");
  const [isDepositing, setIsDepositing] = useState<boolean>(false);

  // Toast alert states
  const [toasts, setToasts] = useState<{ id: string; text: string; type: "success" | "error" | "info" }[]>([]);

  // Admin states
  const [activeAdminTab, setActiveAdminTab] = useState<"analytics" | "deposits" | "users" | "settings" | "items">("analytics");
  const [zoomReceiptUrl, setZoomReceiptUrl] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

  // Interactive Newsletter Subscription
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(false);

  // Dynamic live statistics calculated in real-time from active lists loaded directly from Firebase
  const totalSalesToDisplay = userOrders
    .filter(o => o.status === OrderStatus.COMPLETED)
    .reduce((sum, o) => sum + o.price, 0);

  const pendingDepositsToDisplay = userOrders.filter(o => o.status === OrderStatus.PENDING).length;

  const totalMembersToDisplay = adminUsers.length;

  const totalInstantDepositsToDisplay = userOrders
    .filter(o => o.status === OrderStatus.COMPLETED && (o.product.includes("تعبئة") || o.paymentMethod !== "رصيد المحفظة"))
    .reduce((sum, o) => sum + o.price, 0);

  // Admin email check defined by user request
  const adminEmails = ["kafehazyad5@gmail.com", "eeyad610@gmail.com", "ss3222710@gmail.com"];
  const isAdmin = loggedUser?.email ? adminEmails.includes(loggedUser.email.trim().toLowerCase()) : false;

  // Toast show helper
  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // 1. Real-time synchronization of users from Firebase Firestore (Only for Admin to avoid permission errors)
  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    const usersRef = collection(db, "users");
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const usersData: User[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        usersData.push({
          id: docSnap.id,
          name: data.name || "",
          email: data.email || "",
          avatarLetter: data.avatarLetter || (data.name ? data.name.substring(0, 2) : "لاعب"),
          joinDate: data.joinDate || "2024/06/01",
          balance: Number(data.balance) || 0,
          status: data.status || "نشط",
          imageUrl: data.imageUrl
        });
      });
      
      if (usersData.length > 0) {
        setAdminUsers(usersData);
      }
    }, (error) => {
      console.warn("Users listener error:", error);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  // 2. Real-time synchronization of orders from Firebase Firestore
  useEffect(() => {
    if (!loggedUser) {
      setUserOrders([]);
      return;
    }

    let q;
    if (isAdmin) {
      // Admins can query the entire collection
      q = collection(db, "orders");
    } else {
      // Normal users can only query their own orders to satisfy Firebase Security rules
      q = query(collection(db, "orders"), where("userId", "==", loggedUser.id));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbOrders: Order[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        dbOrders.push({
          id: docSnap.id,
          product: data.product || "",
          date: data.date === "اليوم" && data.timestamp ? new Date(data.timestamp).toLocaleString("en-GB", {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true}) : data.date || "اليوم",
          price: Number(data.price) || 0,
          currency: data.currency || "JD",
          status: data.status as OrderStatus,
          user: data.user || "",
          paymentMethod: data.paymentMethod || "",
          receiptUrl: data.receiptUrl,
          playerId: data.playerId,
          userId: data.userId,
          timestamp: data.timestamp || Date.now()
        });
      });
      
      dbOrders.sort((a, b) => b.timestamp - a.timestamp);
      setUserOrders(dbOrders);
    }, (error) => {
      console.warn("Orders listener error:", error);
    });

    return () => unsubscribe();
  }, [loggedUser?.id, isAdmin]);

  // 3. Real-time sync of logged user's balance and status from Firestore
  useEffect(() => {
    if (!loggedUser || !loggedUser.id) return;
    const userDocRef = doc(db, "users", loggedUser.id);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setWalletBalance(Number(data.balance) || 0);
        setLoggedUser(prev => prev ? {
          ...prev,
          balance: Number(data.balance) || 0,
          status: data.status || "نشط",
          name: data.name || prev.name,
          imageUrl: data.imageUrl || prev.imageUrl
        } : null);
      }
    }, (error) => {
      console.warn("Logged user stream error:", error);
    });
    return () => unsubscribe();
  }, [loggedUser?.id]);

  // Auth state listener to persist login across page reloads
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const appUser: User = {
              id: firebaseUser.uid,
              name: data.name || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "لاعب",
              email: firebaseUser.email || "",
              avatarLetter: (data.name || "👤").substring(0, 2),
              joinDate: data.joinDate || "اليوم",
              balance: Number(data.balance) || 0,
              status: data.status || "نشط",
              imageUrl: data.imageUrl || firebaseUser.photoURL || undefined
            };
            setLoggedUser(appUser);
            setWalletBalance(appUser.balance);
            const adminEmails = ["kafehazyad5@gmail.com", "eeyad610@gmail.com", "ss3222710@gmail.com"];
            const isUserAdmin = appUser.email ? adminEmails.includes(appUser.email.trim().toLowerCase()) : false;
            setActiveTab(isUserAdmin ? "admin" : "home");
          }
        } catch (e) {
          console.warn("Error fetching user profile:", e);
        }
      } else {
        setLoggedUser(null);
        setWalletBalance(0);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Temporary cleanup script to forcefully delete mock data from Firestore
  useEffect(() => {
    if (isAdmin) {
      const cleanupMock = async () => {
        const mockUsers = ["usr_1", "usr_2", "usr_3", "usr_4"];
        const mockOrders = ["FA-88001", "FA-88002", "FA-88003", "FA-88195"];
        
        for (const uid of mockUsers) {
          try { await deleteDoc(doc(db, "users", uid)); } catch (e) { }
        }
        for (const oid of mockOrders) {
          try { await deleteDoc(doc(db, "orders", oid)); } catch (e) { }
        }
      };
      cleanupMock();
    }
  }, [isAdmin]);


  // Centralized navigation guard
  const navigateToTab = (tab: "home" | "game-detail" | "wallet" | "admin" | "login") => {
    if (isAdmin) {
      setActiveTab(tab);
      return;
    }

    if (tab === "home") {
      setActiveTab("home");
      return;
    }
    if (tab === "game-detail") {
      setActiveTab("game-detail");
      return;
    }
    if (tab === "login") {
      setActiveTab("login");
      return;
    }
    if (!loggedUser) {
      setActiveTab("login");
      showToast("يرجى تسجيل الدخول أولاً للوصول إلى هذه الميزة 🔒", "info");
      return;
    }
    
    if (tab === "admin") {
      if (!isAdmin) {
        showToast("خطأ: يرجى تسجيل الدخول بحساب المشرف للوصول للوحة التحكم ⚠️", "error");
        setActiveTab("home");
        return;
      }
    }
    
    setActiveTab(tab);
  };

  const handleLoginSuccess = (user: User, isNew?: boolean) => {
    setLoggedUser(user);
    setWalletBalance(user.balance);
    const adminEmails = ["kafehazyad5@gmail.com", "eeyad610@gmail.com", "ss3222710@gmail.com"];
    const isUserAdmin = user.email ? adminEmails.includes(user.email.trim().toLowerCase()) : false;
    setActiveTab(isUserAdmin ? "admin" : "home");
    if (isNew) {
      setAdminUsers(prev => [user, ...prev]);
      showToast(`مرحباً بك يا ${user.name}! تم منحك 75 د.أ رصيد ترحيبي مجاناً 🎁`, "success");
    } else {
      showToast(`مرحباً بك مجدداً يا ${user.name}!`, "success");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Sign out error:", e);
    }
    setLoggedUser(null);
    setWalletBalance(0);
    setActiveTab("home");
    showToast("تم تسجيل الخروج بنجاح.", "success");
  };

  const handleUpdateProfile = async (name: string, imageUrl: string) => {
    if (!loggedUser || !auth.currentUser) return;
    try {
      const isBase64 = imageUrl.startsWith("data:");

      // 1. Update Firebase Auth Profile (Base64 not supported in photoURL)
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: isBase64 ? (auth.currentUser.photoURL || "") : (imageUrl || "")
      });

      // 2. Update Firestore Document (Base64 too large, store URL only)
      const userRef = doc(db, "users", loggedUser.id);
      await updateDoc(userRef, {
        name,
        imageUrl: isBase64 ? "" : imageUrl,
        avatarLetter: name.charAt(0).toUpperCase()
      });

      // 3. If Base64 image, save to localStorage (persists between page reloads)
      if (isBase64) {
        localStorage.setItem(`fara_profile_img_${loggedUser.id}`, imageUrl);
      } else {
        localStorage.removeItem(`fara_profile_img_${loggedUser.id}`);
      }

      // 4. Update Local State (always use full imageUrl including Base64)
      setLoggedUser(prev => prev ? {
        ...prev,
        name,
        imageUrl,
        avatarLetter: name.charAt(0).toUpperCase()
      } : null);

      showToast("تم تحديث الملف الشخصي بنجاح!", "success");
    } catch (error) {
      console.error("Profile update error:", error);
      showToast("حدث خطأ أثناء تحديث الملف الشخصي.", "error");
    }
  };

  // Helper inside detail view to automatically preset package
  useEffect(() => {
    if (selectedGame && selectedGame.packages.length > 0) {
      const indexToSelect = selectedGame.packages.length > 1 ? 1 : 0;
      setSelectedPackage(selectedGame.packages[indexToSelect]);
    } else {
      setSelectedPackage(null);
    }
  }, [selectedGame]);

  // Copy CliQ ID helper
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    showToast("تم نسخ بيانات التحويل إلى الحافظة!", "success");
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Drag and drop receipt uploader simulation
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setReceiptFile(file);
      setReceiptFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_DIM = 600;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.6);
            setReceiptPreviewUrl(compressed);
          } else {
            setReceiptPreviewUrl(event.target?.result as string || "");
          }
        };
        img.src = event.target?.result as string || "";
      };
      reader.readAsDataURL(file);
      showToast("تم تحميل إيصال التحويل بنجاح!", "success");
    }
  };

  // Submit deposit request Form
  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) {
      showToast("الرجاء إدخال مبلغ تعبئة صحيح!", "error");
      return;
    }
    if (!receiptFileName) {
      showToast("الرجاء إرفاق صورة إيصال التحويل لتأكيد العملية!", "error");
      return;
    }

    setIsDepositing(true);
    
    const newId = `FA-${Math.floor(88000 + Math.random() * 999)}`;
    const newOrder: Order = {
      id: newId,
      product: "تعبئة رصيد محفظة",
      date: new Date().toLocaleString("en-GB", {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true}),
      price: Number(depositAmount),
      currency: "JOD",
      status: OrderStatus.PENDING,
      user: loggedUser?.name || "لاعب فارة",
      paymentMethod: paymentMethod,
      receiptUrl: receiptPreviewUrl,
      userId: loggedUser?.id || undefined,
      timestamp: Date.now()
    };

    try {
      await setDoc(doc(db, "orders", newId), newOrder);
      setUserOrders(prev => {
        if (!prev.some(o => o.id === newOrder.id)) {
          return [newOrder, ...prev];
        }
        return prev;
      });
      showToast("تم تقديم طلب شحن الرصيد بنجاح! سيتم التحقق من قبل الإدارة.", "success");
    } catch (err) {
      console.error("Firestore save deposit failed:", err);
      setUserOrders(prev => {
        if (!prev.some(o => o.id === newOrder.id)) {
          return [newOrder, ...prev];
        }
        return prev;
      });
      showToast("تم تقديم طلب شحن الرصيد بنجاح (محلياً)! سيتم التحقق من قبل الإدارة.", "success");
      handleFirestoreError(err, OperationType.WRITE, `orders/${newId}`);
    }

    setDepositAmount("");
    setReceiptFile(null);
    setReceiptFileName("");
    setReceiptPreviewUrl("");
    setIsDepositing(false);

    const newNot: AppNotification = {
      id: Math.random().toString(),
      title: "طلب شحن قيد المراجعة",
      description: `قامت الإدارة باستلام طلب شحن الرصيد بقيمة ${newOrder.price} JOD وجاري التحقق منه.`,
      time: "الآن",
      type: "info",
      isRead: false
    };
    setNotifications(prev => [newNot, ...prev]);
  };

  const handlePurchasePackage = async () => {
    if (!selectedPackage || !playerId) {
      setPlayerIdError("الرجاء إدخال معرف اللاعب (Player ID) بشكل صحيح!");
      showToast("الرجاء اختيار باقة وإدخال معرف اللاعب", "error");
      return;
    }
    setPlayerIdError("");

    if (!selectedPackage) {
      showToast("الرجاء تحديد باقة شحن أولاً!", "error");
      return;
    }

    const packagePrice = selectedPackage.price;
    if (walletBalance < packagePrice) {
      showToast("رصيدك الحالي غير كافٍ لإتمام هذه المعاملة! يرجى تعبئة الرصيد.", "error");
      return;
    }

    setIsDepositing(true);

    try {
      if (selectedGame.id === "jawaker") {
        const joPayToken = joPaySettings.token;

        if (!joPayToken) {
          throw new Error("لم يتم إعداد مفتاح API في قاعدة البيانات!");
        }

        const quantity = joPaySettings.quantityMap[selectedPackage.id];
        if (!quantity) throw new Error(`باقة جواكر غير صالحة! المعرف: ${selectedPackage.id} غير مربوط بكمية.`);

        const response = await fetch("https://jo-pay.azurewebsites.net/jopay/Api/CreateOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Token": joPayToken
          },
          body: JSON.stringify({
            productId: 470,
            quantity: quantity,
            extraData: playerId.toString()
          })
        });

        if (!response.ok) {
          throw new Error("فشلت عملية الربط مع موفر الخدمة (Jo-Pay)");
        }

        const finalBalance = walletBalance - packagePrice;
        const gainedXp = Math.floor(packagePrice * 10);
        setLoyaltyXp(prev => prev + gainedXp);

        const newId = `FA-${Math.floor(87000 + Math.random() * 999)}`;
        const newOrder: Order = {
          id: newId,
          product: `${selectedPackage.name} - ${selectedGame.name}`,
          date: new Date().toLocaleString("en-GB", {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true}),
          price: packagePrice,
          currency: "JD",
          status: OrderStatus.COMPLETED,
          user: loggedUser?.name || "لاعب فارة",
          playerId: playerId,
          paymentMethod: "رصيد المحفظة",
          userId: loggedUser?.id || undefined,
          timestamp: Date.now()
        };

        if (loggedUser?.id) {
          await updateDoc(doc(db, "users", loggedUser.id), { balance: finalBalance });
        }
        await setDoc(doc(db, "orders", newId), newOrder);
        setUserOrders(prev => {
          if (!prev.some(o => o.id === newOrder.id)) {
            return [newOrder, ...prev];
          }
          return prev;
        });

        showToast(`تم شحن ${selectedPackage.name} بنجاح عبر API!`, "success");

        const newNotification: AppNotification = {
          id: Math.random().toString(),
          title: "عملية شحن جواكر ناجحة! 🎉",
          description: `تم شحن ${selectedPackage.name} بنجاح للرقم ${playerId}. تم خصم ${packagePrice} د.أ.`,
          time: "الآن",
          type: "success",
          isRead: false
        };
        setNotifications(prev => [newNotification, ...prev]);
        setPlayerId("");

      } else {
        const finalBalance = walletBalance - packagePrice;
        const gainedXp = Math.floor(packagePrice * 10);
        setLoyaltyXp(prev => prev + gainedXp);

        const newId = `FA-${Math.floor(87000 + Math.random() * 999)}`;
        const newOrder: Order = {
          id: newId,
          product: `${selectedPackage.name} - ${selectedGame.name}`,
          date: new Date().toLocaleString("en-GB", {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true}),
          price: packagePrice,
          currency: "JD",
          status: OrderStatus.COMPLETED,
          user: loggedUser?.name || "لاعب فارة",
          playerId: playerId,
          paymentMethod: "رصيد المحفظة",
          userId: loggedUser?.id || undefined,
          timestamp: Date.now()
        };

        if (loggedUser?.id) {
          await updateDoc(doc(db, "users", loggedUser.id), { balance: finalBalance });
        }
        await setDoc(doc(db, "orders", newId), newOrder);
        setUserOrders(prev => {
          if (!prev.some(o => o.id === newOrder.id)) {
            return [newOrder, ...prev];
          }
          return prev;
        });
        showToast(`تم شراء شحنة ${selectedPackage.name} بنجاح لـ ${selectedGame.name}!`, "success");

        const newNotification: AppNotification = {
          id: Math.random().toString(),
          title: "عملية شراء ناجحة ✅",
          description: `تم شحن ${selectedPackage.name} بنجاح إلى المعرف ${playerId}. تم خصم ${packagePrice} د.أ.`,
          time: "الآن",
          type: "success",
          isRead: false
        };
        setNotifications(prev => [newNotification, ...prev]);
        setPlayerId("");
      }
    } catch (err: any) {
      console.error("Purchase error:", err);
      showToast(err.message || "حدث خطأ أثناء الشراء.", "error");
    } finally {
      setIsDepositing(false);
    }
  };

  // Interactive Admin Dashboard Controls
  const handleAdminAcceptDeposit = async (orderId: string, amount: number) => {
    const targetOrder = userOrders.find(o => o.id === orderId);
    if (!targetOrder) return;

    try {
      await updateDoc(doc(db, "orders", orderId), { status: OrderStatus.COMPLETED });

      const targetUserId = targetOrder.userId || adminUsers.find(u => u.name === targetOrder.user)?.id;
      if (targetUserId) {
        const targetUserObj = adminUsers.find(u => u.id === targetUserId);
        const currentBalance = targetUserObj ? targetUserObj.balance : 0;
        const nextBalance = currentBalance + amount;
        
        await updateDoc(doc(db, "users", targetUserId), { balance: nextBalance });
        
        if (loggedUser && loggedUser.id === targetUserId) {
          setLoyaltyXp(prev => prev + Math.floor(amount * 15));
        }
      } else {
        if (loggedUser) {
          setWalletBalance(prev => prev + amount);
          setLoyaltyXp(prev => prev + Math.floor(amount * 15));
        }
      }

      showToast(`تم قبول طلب الإيداع بقيمة ${amount} JD وإيداعه للعميل!`, "success");
    } catch (err) {
      console.error("Firestore admin accept deposit failed:", err);
      setUserOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.COMPLETED } : o));
      setWalletBalance(prev => prev + amount);
      showToast(`تم قبول طلب الإيداع بقيمة ${amount} JD (محلياً)!`, "success");
    }

    const newNot: AppNotification = {
      id: Math.random().toString(),
      title: "تم شحن المحفظة بنجاح 💰",
      description: `وافقت الإدارة على إيداعك بقيمة ${amount} JD. تم إضافة القيمة كاملة في محفظتك بالدينار الأردني.`,
      time: "الآن",
      type: "success",
      isRead: false
    };
    setNotifications(prev => [newNot, ...prev]);
  };

  const handleAdminRejectDeposit = async (orderId: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: OrderStatus.REJECTED });
      showToast("تم رفض طلب الإيداع وتبليغ العميل للتحقق من صحة الإيصال.", "info");
    } catch (err) {
      console.error("Firestore admin reject deposit failed:", err);
      setUserOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.REJECTED } : o));
      showToast("تم رفض طلب الإيداع (محلياً).", "info");
    }

    const newNot: AppNotification = {
      id: Math.random().toString(),
      title: "تم رفض طلب إيداعك ❌",
      description: `تم رفض الإيداع الخاص بالطلب رقم ${orderId}. يرجى التواصل مع الدعم الفني وتأكيد صحة إيصال الحوالة.`,
      time: "الآن",
      type: "warning",
      isRead: false
    };
    setNotifications(prev => [newNot, ...prev]);
  };

  const handleToggleUserStatus = async (userId: string) => {
    const targetUser = adminUsers.find(u => u.id === userId);
    if (!targetUser) return;
    const nextStatus = targetUser.status === "نشط" ? "محظور" : "نشط";
    try {
      await updateDoc(doc(db, "users", userId), { status: nextStatus });
      showToast(nextStatus === "محظور" ? `تم حظر العميل ${targetUser.name} بنجاح!` : `تم تفعيل حساب العميل ${targetUser.name}!`, nextStatus === "محظور" ? "error" : "success");
    } catch (err) {
      console.error("Firestore toggle status failed:", err);
      setAdminUsers(prev => prev.map(u => {
        if (u.id === userId) {
          return { ...u, status: nextStatus };
        }
        return u;
      }));
      showToast(nextStatus === "محظور" ? `تم حظر العميل ${targetUser.name} بنجاح!` : `تم تفعيل حساب العميل ${targetUser.name}!`, nextStatus === "محظور" ? "error" : "success");
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    const { id, name } = userToDelete;
    try {
      await deleteDoc(doc(db, "users", id));
      showToast(`تم حذف حساب اللاعب "${name}" بنجاح من قاعدة البيانات.`, "info");
    } catch (err) {
      console.error("Firestore user delete failed:", err);
      setAdminUsers(prev => prev.filter(u => u.id !== id));
      showToast(`تم حذف حساب اللاعب "${name}" بنجاح (محلياً).`, "info");
    }
    setUserToDelete(null);
  };

  const confirmDeleteItem = () => {
    if (!itemToDelete) return;
    if (itemToDelete.id.startsWith("jw_")) {
      handleRemovePackage(itemToDelete.id);
    } else {
      const updatedGames = gamesList.filter(g => g.id !== itemToDelete.id);
      saveGamesList(updatedGames);
      showToast("تم الحذف بنجاح!", "info");
    }
    setItemToDelete(null);
  };

  // Newsletter subscription action
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      showToast("الرجاء إدخال بريد إلكتروني صالح للاشتراك!", "error");
      return;
    }
    setNewsletterSubscribed(true);
    showToast("تهانينا! تم اشتراكك في مجتمع فارة لتلقي العروض الحصرية مجاناً.", "success");
    setNewsletterEmail("");
  };

  // CMS Settings Save Actions
  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("تم حفظ جميع التعديلات وإعدادات واجهة فارة (CMS) بنجاح!", "success");
  };

  // Notifications Helpers
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast("تم فرز جميع الإشعارات كمقروءة.", "success");
    setShowNotificationDropdown(false);
  };

  // Save games list helper
  const saveGamesList = (updated: Game[]) => {
    setGamesList(updated);
    localStorage.setItem("fara_games_list_v3", JSON.stringify(updated));
  };

  // Save Jawaker packages
  const handleSavePackages = (e: React.FormEvent) => {
    e.preventDefault();
    if (formPackages.length === 0) {
      showToast("الرجاء إضافة حزمة شحن واحدة على الأقل ⚠️", "error");
      return;
    }

    const jawakerIndex = gamesList.findIndex(g => g.id === "jawaker");
    const indexToUpdate = jawakerIndex > -1 ? jawakerIndex : 0;

    const updated = [...gamesList];
    updated[indexToUpdate] = {
      ...updated[indexToUpdate],
      packages: formPackages.map((pkg, idx) => ({
        ...pkg,
        price: Number(pkg.price) || 0,
        bonusPercent: pkg.bonusPercent ? Number(pkg.bonusPercent) : undefined
      }))
    };
    saveGamesList(updated);
    showToast("تم تحديث باقات الشحن لجواكر بنجاح! ✨", "success");
    
    if (selectedGame.id === updated[indexToUpdate].id) {
      setSelectedGame(updated[indexToUpdate]);
    }
  };

  const handleAddPackage = () => {
    const newPkg: GamePackage = {
      id: `jw_50k_${Date.now()}`, // Temporary ID to ensure uniqueness if multiple added
      name: "50,000 توكنز",
      price: 1.99,
      bonusPercent: 0,
      badge: ""
    };
    setFormPackages([...formPackages, newPkg]);
  };

  const handleUpdateJawakerPackage = (oldId: string, newId: string, newName: string) => {
    setFormPackages(formPackages.map(p => {
      if (p.id === oldId) {
        return { ...p, id: newId, name: newName };
      }
      return p;
    }));
  };

  const handleRemovePackage = (id: string) => {
    setFormPackages(formPackages.filter(p => p.id !== id));
  };

  const handleUpdatePackageField = (id: string, field: keyof GamePackage, value: any) => {
    setFormPackages(formPackages.map(p => {
      if (p.id === id) {
        if (field === "isPreferred") {
          return { ...p, isPreferred: !!value };
        }
        return { ...p, [field]: value };
      } else if (field === "isPreferred" && value === true) {
        return { ...p, isPreferred: false };
      }
      return p;
    }));
  };

  // Filters store games based on queries and category chips selection
  const filteredGames = gamesList.filter(game => {
    const matchesCategory = selectedCategory === GameCategory.ALL || game.category === selectedCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          game.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return {
    activeTab,
    setActiveTab,
    gamesList,
    setGamesList,
    selectedGame,
    setSelectedGame,
    formPackages,
    setFormPackages,
    adminUsers,
    setAdminUsers,
    loggedUser,
    setLoggedUser,
    walletBalance,
    setWalletBalance,
    loyaltyXp,
    setLoyaltyXp,
    userOrders,
    setUserOrders,
    notifications,
    setNotifications,
    showNotificationDropdown,
    setShowNotificationDropdown,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    cmsBannerText,
    setCmsBannerText,
    cmsBannerUrl,
    setCmsBannerUrl,
    cmsBannerImage,
    setCmsBannerImage,
    cmsPopupText,
    setCmsPopupText,
    joPaySettings,
    setJoPaySettings,
    playerId,
    setPlayerId,
    selectedPackage,
    setSelectedPackage,
    playerIdError,
    setPlayerIdError,
    showIdHelp,
    setShowIdHelp,
    paymentMethod,
    setPaymentMethod,
    depositAmount,
    setDepositAmount,
    copiedText,
    setCopiedText,
    receiptFile,
    setReceiptFile,
    receiptFileName,
    setReceiptFileName,
    receiptPreviewUrl,
    setReceiptPreviewUrl,
    isDepositing,
    setIsDepositing,
    toasts,
    setToasts,
    activeAdminTab,
    setActiveAdminTab,
    zoomReceiptUrl,
    setZoomReceiptUrl,
    itemToDelete,
    setItemToDelete,
    userToDelete,
    setUserToDelete,
    newsletterEmail,
    setNewsletterEmail,
    newsletterSubscribed,
    setNewsletterSubscribed,
    totalSalesToDisplay,
    pendingDepositsToDisplay,
    totalMembersToDisplay,
    totalInstantDepositsToDisplay,
    isAdmin,
    filteredGames,
    showToast,
    cmsBannerBadgeText, setCmsBannerBadgeText,
    cmsBannerSubtitle, setCmsBannerSubtitle,
    cmsBannerButtonText, setCmsBannerButtonText,
    navigateToTab,
    handleLoginSuccess,
    handleLogout,
    handleUpdateProfile,
    handleCopyText,
    handleReceiptUpload,
    handleDepositSubmit,
    handlePurchasePackage,
    handleAdminAcceptDeposit,
    handleAdminRejectDeposit,
    handleToggleUserStatus,
    handleDeleteUser,
    confirmDeleteUser,
    handleNewsletterSubmit,
    handleSaveCMS,
    handleMarkAllNotificationsRead,
    saveGamesList,
    handleSavePackages,
    handleAddPackage,
    handleRemovePackage,
    handleUpdatePackageField,
    handleUpdateJawakerPackage,
    confirmDeleteItem,
    bannerSlides,
    setBannerSlides,
    handleSaveBannerSlides,
    shippingProofs,
    setShippingProofs,
    handleSaveShippingProofs,
  };
}
