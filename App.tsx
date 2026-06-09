/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Coins, 
  Search, 
  Bell, 
  Wallet, 
  User as UserIcon, 
  History, 
  Sparkles, 
  Star, 
  Gamepad2, 
  Gift, 
  Sliders, 
  LogOut, 
  Check, 
  X, 
  FileText, 
  Filter, 
  UserCheck, 
  UserMinus, 
  Percent, 
  ShoppingBag, 
  BellRing, 
  Info, 
  XCircle, 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  CheckCircle2, 
  Zap, 
  Award, 
  TrendingUp, 
  Eye, 
  ArrowRight, 
  BadgeHelp,
  Flame,
  Trophy,
  LayoutDashboard,
  Users,
  Settings,
  ShieldAlert,
  Send,
  Plus,
  Edit2,
  Trash2
} from "lucide-react";

import { GameCategory, OrderStatus, PaymentMethod, Game, GamePackage, Order, User, AppNotification } from "./types";
import { GAMES_DATA, SIMILAR_GAMES, INITIAL_ORDERS, INITIAL_USERS, INITIAL_NOTIFICATIONS } from "./data";
import AuthScreen from "./components/AuthScreen";

// Firebase integration
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./lib/firebase";

export default function App() {
  // Navigation tabs: 'home' | 'game-detail' | 'wallet' | 'admin' | 'login'
  const [activeTab, setActiveTab] = useState<"home" | "game-detail" | "wallet" | "admin" | "login">("home");
  
  // Dynamic list of games state
  const [gamesList, setGamesList] = useState<Game[]>(() => {
    const saved = localStorage.getItem("fara_games_list");
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
    const saved = localStorage.getItem("fara_games_list");
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

  // Item management form states
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<GameCategory>(GameCategory.BATTLE_ROYALE);
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStartingPrice, setFormStartingPrice] = useState(1.99);
  const [formPackages, setFormPackages] = useState<GamePackage[]>([
    { id: "pkg_1", name: "شحن فئة أساسية", price: 1.99, bonusPercent: 5, badge: "أساسي" },
    { id: "pkg_2", name: "شحن فئة متقدمة", price: 4.99, bonusPercent: 12, badge: "شائع", isPreferred: true },
    { id: "pkg_3", name: "شحن فظيع التوفير", price: 9.99, bonusPercent: 25, badge: "توفير فائق" }
  ]);
  
  // Custom states
  const [adminUsers, setAdminUsers] = useState<User[]>(INITIAL_USERS);
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(1450.0);
  const [loyaltyXp, setLoyaltyXp] = useState<number>(4820);
  const [userOrders, setUserOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>(GameCategory.ALL);

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
  const isAdmin = loggedUser?.email?.trim().toLowerCase() === "kafehazyad5@gmail.com";

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
      setUserOrders(INITIAL_ORDERS);
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
          date: data.date || "اليوم",
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

  // 4. Boostrap Firestore database with default users and orders if completely empty
  useEffect(() => {
    const bootstrapDB = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        if (usersSnapshot.empty) {
          for (const u of INITIAL_USERS) {
            await setDoc(doc(db, "users", u.id), {
              id: u.id,
              name: u.name,
              email: u.id === "usr_3" ? "kafehazyad5@gmail.com" : `${u.id}@farasouq.com`,
              avatarLetter: u.avatarLetter,
              joinDate: u.joinDate,
              balance: u.balance,
              status: u.status,
              lastLogin: Date.now()
            });
          }
        }
        
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        if (ordersSnapshot.empty) {
          for (const o of INITIAL_ORDERS) {
            await setDoc(doc(db, "orders", o.id), {
              id: o.id,
              product: o.product,
              date: o.date,
              price: o.price,
              currency: o.currency,
              status: o.status,
              user: o.user,
              paymentMethod: o.paymentMethod || "Zain Cash",
              receiptUrl: o.receiptUrl || "",
              timestamp: o.timestamp,
              userId: o.id === "FA-88002" ? "usr_1" : "usr_3"
            });
          }
        }
      } catch (e) {
        console.warn("Bootstrap skipped:", e);
      }
    };
    bootstrapDB();
  }, []);

  // Centralized navigation guard
  const navigateToTab = (tab: "home" | "game-detail" | "wallet" | "admin" | "login") => {
    if (isAdmin) {
      if (tab === "login") {
        setActiveTab("login");
      } else {
        setActiveTab("admin");
      }
      return;
    }

    if (tab === "home") {
      setActiveTab("home");
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
    const isUserAdmin = user.email?.trim().toLowerCase() === "kafehazyad5@gmail.com";
    setActiveTab(isUserAdmin ? "admin" : "home");
    if (isNew) {
      setAdminUsers(prev => [user, ...prev]);
      showToast(`مرحباً بك يا ${user.name}! تم منحك 75 د.أ رصيد ترحيبي مجاناً 🎁`, "success");
    } else {
      showToast(`مرحباً بك مجدداً يا ${user.name}!`, "success");
    }
  };

  const handleLogout = () => {
    setLoggedUser(null);
    setActiveTab("home");
    showToast("تم تسجيل الخروج بنجاح. ركّز على انتصاراتك القادمة!", "info");
  };

  // States for CMS & alert configurations (loaded into memory)
  const [cmsBannerText, setCmsBannerText] = useState<string>("اشحن توكنز جواكر (Jawaker Tokens) واحصل على 20% رصيد إضافي ⭐");
  const [cmsBannerUrl, setCmsBannerUrl] = useState<string>("https://fara-souq.com/offers/jawaker-20");
  const [cmsBannerImage, setCmsBannerImage] = useState<string>("https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=1200&auto=format&fit=crop");
  const [cmsPopupText, setCmsPopupText] = useState<string>("خصم خاص بمناسبة إطلاق التحديث الجديد! استخدم الكود JAWAKER26 للحصول على 20% خصم إضافي.");

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

  // Toast show helper
  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Helper inside detail view to automatically preset package
  useEffect(() => {
    if (selectedGame && selectedGame.packages.length > 0) {
      // pre-select second item by default (typically 300 gems, similar to mockup)
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
          // Downscale to max 600px to ensure the Base64 remains incredibly lightweight (~15KB-40KB) 
          // to easily fit inside Firestore's 1MB document size limit and load instantaneously.
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
      date: "اليوم",
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
      // Save order to Firestore
      await setDoc(doc(db, "orders", newId), newOrder);
      // Optimistic state update for instant rendering feedback
      setUserOrders(prev => {
        if (!prev.some(o => o.id === newOrder.id)) {
          return [newOrder, ...prev];
        }
        return prev;
      });
      showToast("تم تقديم طلب شحن الرصيد بنجاح! سيتم التحقق من قبل الإدارة.", "info");
    } catch (err) {
      console.error("Firestore save deposit failed:", err);
      // Fallback
      setUserOrders(prev => {
        if (!prev.some(o => o.id === newOrder.id)) {
          return [newOrder, ...prev];
        }
        return prev;
      });
      showToast("تم تقديم طلب شحن الرصيد بنجاح (محلياً)! سيتم التحقق من قبل الإدارة.", "info");
      handleFirestoreError(err, OperationType.WRITE, `orders/${newId}`);
    }

    // Reset form
    setDepositAmount("");
    setReceiptFile(null);
    setReceiptFileName("");
    setReceiptPreviewUrl("");
    setIsDepositing(false);

    // Add user notification
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

  // Purchase charging package selection
  const handlePurchasePackage = async () => {
    if (!playerId.trim()) {
      setPlayerIdError("الرجاء إدخال معرف اللاعب (Player ID) بشكل صحيح!");
      showToast("خطأ: يرجى إدخال معرف اللاعب قبل الشراء!", "error");
      return;
    }
    setPlayerIdError("");

    if (!selectedPackage) {
      showToast("الرجاء تحديد باقة شحن أولاً!", "error");
      return;
    }

    // Convert price to current simulated balance currency context directly
    const packagePrice = selectedPackage.price;
    if (walletBalance < packagePrice) {
      showToast("رصيدك الحالي غير كافٍ لإتمام هذه المعاملة! يرجى تعبئة الرصيد.", "error");
      return;
    }

    // Process Transaction
    const finalBalance = walletBalance - packagePrice;
    
    // Add XP rewards
    const gainedXp = Math.floor(packagePrice * 10);
    setLoyaltyXp(prev => prev + gainedXp);

    const newId = `FA-${Math.floor(87000 + Math.random() * 999)}`;
    const newOrder: Order = {
      id: newId,
      product: `${selectedPackage.name} - ${selectedGame.name}`,
      date: "اليوم",
      price: packagePrice,
      currency: "JD",
      status: OrderStatus.COMPLETED,
      user: loggedUser?.name || "لاعب فارة",
      playerId: playerId,
      paymentMethod: "رصيد المحفظة",
      userId: loggedUser?.id || undefined,
      timestamp: Date.now()
    };

    try {
      if (loggedUser?.id) {
        // Update user's balance in Firestore
        await updateDoc(doc(db, "users", loggedUser.id), { balance: finalBalance });
      }
      // Save order transaction to Firestore
      await setDoc(doc(db, "orders", newId), newOrder);
      // Optimistic state update for instant rendering feedback
      setUserOrders(prev => {
        if (!prev.some(o => o.id === newOrder.id)) {
          return [newOrder, ...prev];
        }
        return prev;
      });
      showToast(`تم شراء شحنة ${selectedPackage.name} بنجاح لـ ${selectedGame.name}!`, "success");
    } catch (err) {
      console.error("Firestore buy package error:", err);
      // Fallback
      setWalletBalance(finalBalance);
      setUserOrders(prev => {
        if (!prev.some(o => o.id === newOrder.id)) {
          return [newOrder, ...prev];
        }
        return prev;
      });
      showToast(`تم شراء شحنة ${selectedPackage.name} بنجاح (محلياً)!`, "success");
    }

    // Add notification
    const newNotification: AppNotification = {
      id: Math.random().toString(),
      title: "عملية شراء ناجحة ✅",
      description: `تم شحن ${selectedPackage.name} بنجاح إلى المعرف ${playerId}. تم خصم ${packagePrice} د.أ.`,
      time: "الآن",
      type: "success",
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);

    setPlayerId(""); // Clear input on success
  };

  // Interactive Admin Dashboard Controls
  const handleAdminAcceptDeposit = async (orderId: string, amount: number) => {
    const targetOrder = userOrders.find(o => o.id === orderId);
    if (!targetOrder) return;

    try {
      // 1. Update order status to Completed in Firestore
      await updateDoc(doc(db, "orders", orderId), { status: OrderStatus.COMPLETED });

      // 2. Locate target user ID to credit balance
      const targetUserId = targetOrder.userId || adminUsers.find(u => u.name === targetOrder.user)?.id;
      if (targetUserId) {
        const targetUserObj = adminUsers.find(u => u.id === targetUserId);
        const currentBalance = targetUserObj ? targetUserObj.balance : 0;
        const nextBalance = currentBalance + amount;
        
        // Update user document in Firestore to credit balance!
        await updateDoc(doc(db, "users", targetUserId), { balance: nextBalance });
        
        if (loggedUser && loggedUser.id === targetUserId) {
          setLoyaltyXp(prev => prev + Math.floor(amount * 15));
        }
      } else {
        // Fallback for simulation / unmatched name
        if (loggedUser) {
          setWalletBalance(prev => prev + amount);
          setLoyaltyXp(prev => prev + Math.floor(amount * 15));
        }
      }

      showToast(`تم قبول طلب الإيداع بقيمة ${amount} JD وإيداعه للعميل!`, "success");
    } catch (err) {
      console.error("Firestore admin accept deposit failed:", err);
      // Fallback
      setUserOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.COMPLETED } : o));
      setWalletBalance(prev => prev + amount);
      showToast(`تم قبول طلب الإيداع بقيمة ${amount} JD (محلياً)!`, "success");
    }

    // Send instant success notification to notifications
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
      // Fallback
      setUserOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.REJECTED } : o));
      showToast("تم رفض طلب الإيداع (محلياً).", "info");
    }

    // Send notification
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
      // Fallback
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
      // Fallback
      setAdminUsers(prev => prev.filter(u => u.id !== id));
      showToast(`تم حذف حساب اللاعب "${name}" بنجاح (محلياً).`, "info");
    }
    setUserToDelete(null);
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
    localStorage.setItem("fara_games_list", JSON.stringify(updated));
  };

  // Submit handler for adding or editing a game/item
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast("الرجاء إدخال اسم المنتج ⚠️", "error");
      return;
    }
    if (!formImageUrl.trim()) {
      showToast("الرجاء إدخال رابط صورة المنتج ⚠️", "error");
      return;
    }
    if (formPackages.length === 0) {
      showToast("الرجاء إضافة حزمة شحن واحدة على الأقل المنتج ⚠️", "error");
      return;
    }

    // Ensure only up to one preferred package is set (by user input)
    // If none is selected, we can let it be, but users should be encouraged to have one preferred package.

    if (editingGame) {
      // Editing Mode
      const updated = gamesList.map(g => {
        if (g.id === editingGame.id) {
          return {
            ...g,
            name: formName.trim(),
            category: formCategory,
            imageUrl: formImageUrl.trim(),
            description: formDescription.trim(),
            startingPrice: Number(formStartingPrice) || 1.99,
            packages: formPackages.map(pkg => ({
              ...pkg,
              price: Number(pkg.price) || 0,
              bonusPercent: pkg.bonusPercent ? Number(pkg.bonusPercent) : undefined
            }))
          };
        }
        return g;
      });
      saveGamesList(updated);
      showToast(`تم تعديل المنتج "${formName}" بنجاح! ✨`, "success");
      
      if (selectedGame.id === editingGame.id) {
        const matching = updated.find(g => g.id === editingGame.id);
        if (matching) setSelectedGame(matching);
      }
    } else {
      // Create Mode
      const newId = `game_${Date.now()}`;
      const basePrice = Number(formStartingPrice) || 1.99;
      
      const newGame: Game = {
        id: newId,
        name: formName.trim(),
        category: formCategory,
        imageUrl: formImageUrl.trim(),
        description: formDescription.trim(),
        startingPrice: basePrice,
        rating: 4.8,
        ratingCount: "1",
        isPopular: false,
        currency: "د.أ",
        packages: formPackages.map((pkg, idx) => ({
          ...pkg,
          id: pkg.id.startsWith("pkg_") ? `${newId}_p${idx + 1}` : pkg.id,
          price: Number(pkg.price) || 0,
          bonusPercent: pkg.bonusPercent ? Number(pkg.bonusPercent) : undefined
        }))
      };
      
      const updated = [newGame, ...gamesList];
      saveGamesList(updated);
      showToast(`تمت إضافة المنتج الجديد "${formName}" بنجاح! 🎮`, "success");
    }

    handleResetItemForm();
  };

  const handleResetItemForm = () => {
    setEditingGame(null);
    setFormName("");
    setFormCategory(GameCategory.BATTLE_ROYALE);
    setFormImageUrl("");
    setFormDescription("");
    setFormStartingPrice(1.99);
    setFormPackages([
      { id: "pkg_1", name: "شحن فئة أساسية", price: 1.99, bonusPercent: 5, badge: "أساسي" },
      { id: "pkg_2", name: "شحن فئة متقدمة", price: 4.99, bonusPercent: 12, badge: "شائع", isPreferred: true },
      { id: "pkg_3", name: "شحن فظيع التوفير", price: 9.99, bonusPercent: 25, badge: "توفير فائق" }
    ]);
  };

  const handleEditClick = (game: Game) => {
    setEditingGame(game);
    setFormName(game.name);
    setFormCategory(game.category);
    setFormImageUrl(game.imageUrl);
    setFormDescription(game.description || "");
    setFormStartingPrice(game.startingPrice);
    setFormPackages(game.packages ? JSON.parse(JSON.stringify(game.packages)) : []);
  };

  const handleAddPackage = () => {
    const newPkg: GamePackage = {
      id: `pkg_${Date.now()}`,
      name: "حزمة جديدة",
      price: 1.99,
      bonusPercent: 0,
      badge: ""
    };
    setFormPackages([...formPackages, newPkg]);
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
        // Unmark preferred on all other packages
        return { ...p, isPreferred: false };
      }
      return p;
    }));
  };

  const handleDeleteItem = (id: string, name: string) => {
    setItemToDelete({ id, name });
  };

  const confirmDeleteItem = () => {
    if (!itemToDelete) return;
    const { id, name } = itemToDelete;
    const updated = gamesList.filter(g => g.id !== id);
    saveGamesList(updated);
    showToast(`تم حذف منتج "${name}" بنجاح.`, "info");
    
    if (selectedGame.id === id && updated.length > 0) {
      setSelectedGame(updated[0]);
    }
    setItemToDelete(null);
  };

  // Filters store games based on queries and category chips selection
  const filteredGames = gamesList.filter(game => {
    const matchesCategory = selectedCategory === GameCategory.ALL || game.category === selectedCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          game.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });



  return (
    <div className="min-h-screen bg-[#0c1322] text-[#dce2f7] flex flex-col antialiased selection:bg-amber-400 selection:text-[#402d00] font-sans pb-16 md:pb-0">
      
      {/* Toast notifications portal */}
      <div className="fixed top-24 left-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`p-4 rounded-xl shadow-lg border pointer-events-auto flex items-center justify-between gap-3 text-sm font-medium ${
                toast.type === "success" 
                  ? "bg-slate-900/95 text-emerald-400 border-emerald-500/30 shadow-emerald-950/25" 
                  : toast.type === "error"
                  ? "bg-slate-900/95 text-rose-400 border-rose-500/30 shadow-rose-950/25"
                  : "bg-slate-900/95 text-amber-400 border-amber-500/30 shadow-amber-950/25"
              }`}
            >
              <div className="flex items-center gap-2">
                {toast.type === "success" && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                {toast.type === "error" && <XCircle className="w-5 h-5 flex-shrink-0" />}
                {toast.type === "info" && <Zap className="w-5 h-5 flex-shrink-0" />}
                <span>{toast.text}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dynamic Popups based on Admin Settings */}
      {cmsPopupText && (
        <div className="bg-amber-400 text-slate-950 text-xs sm:text-sm py-1.5 px-4 font-bold text-center relative flex justify-center items-center gap-2">
          <Sparkles className="w-4 h-4 animate-bounce" />
          <span>{cmsPopupText}</span>
        </div>
      )}

      {/* Top Header Navigation Bar */}
      <header className="bg-[#0c1322]/80 backdrop-blur-xl border-b border-[#4f4633]/30 sticky top-0 z-40 transition-shadow shadow-[0_0_20px_rgba(5,102,217,0.15)]">
        <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-7xl mx-auto w-full">
          
          {/* Brand Logo & Basic Web Links */}
          <div className="flex items-center gap-6 sm:gap-10">
            <a 
              onClick={() => navigateToTab("home")} 
              className="font-headline-lg text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent cursor-pointer drop-shadow-[0_0_12px_rgba(251,191,36,0.5)] select-none hover:opacity-90 active:scale-95 transition-all"
            >
              فارة | سوق
            </a>
            <nav className="hidden md:flex items-center gap-8">
              {!isAdmin ? (
                <>
                  <a 
                    onClick={() => { navigateToTab("home"); handleMarkAllNotificationsRead(); }}
                    className={`cursor-pointer pb-1 transition-all ${activeTab === "home" ? "text-amber-400 border-b-2 border-amber-400 font-bold" : "text-[#d3c5ac] hover:text-white"}`}
                  >
                    الرئيسية
                  </a>
                  <a 
                    onClick={() => {
                      setSelectedGame(gamesList[0]);
                      navigateToTab("game-detail");
                    }}
                    className={`cursor-pointer pb-1 transition-all ${activeTab === "game-detail" ? "text-amber-400 border-b-2 border-amber-400 font-bold" : "text-[#d3c5ac] hover:text-white"}`}
                  >
                    المتجر والمنتجات
                  </a>
                  <a 
                    onClick={() => navigateToTab("wallet")}
                    className={`cursor-pointer pb-1 transition-all ${activeTab === "wallet" ? "text-amber-400 border-b-2 border-amber-400 font-bold" : "text-[#d3c5ac] hover:text-white"}`}
                  >
                    المحفظة والرصيد
                  </a>
                </>
              ) : (
                <a 
                  onClick={() => navigateToTab("admin")}
                  className={`cursor-pointer pb-1 transition-all flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${activeTab === "admin" ? "bg-amber-400 text-slate-950 border-amber-400" : "bg-slate-900 text-amber-400 border-amber-500/30 hover:border-amber-400 hover:text-white animate-pulse"}`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>لوحة التحكم (Admin)</span>
                </a>
              )}
            </nav>
          </div>

          {/* Right Header Navigation Widgets */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Live Search bar for games (hidden on mobile header or for admin) */}
            {!isAdmin && (
              <div className="relative hidden md:block">
                <input 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (activeTab !== "home") navigateToTab("home");
                  }}
                  type="text" 
                  placeholder="ابحث عن شدات أو ألعاب..."
                  className="bg-[#191f2f] text-[#dce2f7] border border-[#4f4633]/30 rounded-full pr-10 pl-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-amber-400 w-52 focus:w-64 transition-all placeholder:text-[#9c8f79]/50 text-right"
                />
                <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#d3c5ac]" />
                {searchQuery && (
                  <X 
                    onClick={() => setSearchQuery("")}
                    className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d3c5ac] cursor-pointer hover:text-white"
                  />
                )}
              </div>
            )}

            {/* Wallet Quick Balance Card (hidden for admin) */}
            {loggedUser && !isAdmin && (
              <div 
                onClick={() => navigateToTab("wallet")}
                className="flex items-center gap-2 bg-slate-900 border border-amber-500/20 active:border-amber-400/50 hover:bg-slate-900/80 px-3 py-1.5 rounded-full cursor-pointer transition-all active:scale-95"
              >
                <Wallet className="w-4 h-4 text-amber-400 shadow-glow flex-shrink-0" />
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-amber-400 font-bold text-xs sm:text-sm">
                    {loggedUser ? walletBalance.toFixed(2) : "0.00"}
                  </span>
                  <span className="text-[10px] text-[#adc6ff] font-sans">JD</span>
                </div>
              </div>
            )}

            {/* Notifications Popover Bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  if (!loggedUser) {
                    navigateToTab("login");
                  } else {
                    setShowNotificationDropdown(!showNotificationDropdown);
                  }
                }}
                className="p-2 text-[#d3c5ac] hover:text-white hover:bg-white/5 rounded-full relative transition-all active:scale-95 cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {loggedUser && unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 border border-[#0c1322] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover content */}
              <AnimatePresence>
                {loggedUser && showNotificationDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotificationDropdown(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute left-0 mt-3 w-80 bg-[#141b2b] border border-[#4f4633]/40 rounded-2xl shadow-2xl z-50 text-right overflow-hidden shadow-black"
                    >
                      <div className="p-4 bg-[#191f2f] border-b border-[#4f4633]/30 flex justify-between items-center">
                        <h4 className="font-bold text-sm text-amber-400">آخر التنبيهات والإشعارات ({notifications.length})</h4>
                        {unreadCount > 0 && (
                          <button 
                            onClick={handleMarkAllNotificationsRead}
                            className="text-xs text-[#adc6ff] hover:text-[#e6ecff] underline"
                          >
                            تحديد كالمقروءة
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-[#4f4633]/20">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-[#9c8f79] text-xs">
                            <BellRing className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            لا توجد إشعارات حالياً
                          </div>
                        ) : (
                          notifications.map(item => (
                            <div 
                              key={item.id} 
                              className={`p-3 text-xs leading-relaxed transition-colors ${!item.isRead ? "bg-amber-400/5 hover:bg-amber-400/10" : "hover:bg-slate-900"}`}
                            >
                              <div className="flex justify-between items-start mb-1 gap-2">
                                <span className={`font-bold flex items-center gap-1.5 ${item.type === "success" ? "text-emerald-400" : item.type === "warning" ? "text-rose-400" : "text-amber-400"}`}>
                                  {item.type === "success" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                                  {item.type === "warning" && <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
                                  {item.type === "info" && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                                  {item.title}
                                </span>
                                <span className="text-[10px] text-[#9c8f79] font-mono">{item.time}</span>
                              </div>
                              <p className="text-[#dce2f7] opacity-80">{item.description}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile & Logout Segment */}
            <div className="flex items-center gap-3 border-r border-[#4f4633]/20 pr-3 mr-1">
              {!loggedUser ? (
                <button
                  onClick={() => navigateToTab("login")}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-4.5 py-2 rounded-xl font-bold text-xs cursor-pointer shadow-md transition-all active:scale-95"
                >
                  تسجيل الدخول
                </button>
              ) : (
                <>
                  {/* Profile Details (Name & Avatar Letter) */}
                  <div 
                    onClick={() => isAdmin ? navigateToTab("admin") : navigateToTab("wallet")}
                    className="flex items-center gap-2 cursor-pointer group"
                    title={isAdmin ? "لوحة الإدارة والحساب" : "المحفظة والحساب"}
                  >
                    <div className="hidden sm:flex flex-col items-end text-right">
                      <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                        {loggedUser?.name}
                      </span>
                      <span className="text-[9px] text-amber-400/80 font-mono">
                        {loggedUser?.status === "نشط" ? "لاعب نشط" : "لاعب محظور"}
                      </span>
                    </div>

                    {/* Avatar circle */}
                    <div className="w-9 h-9 rounded-full border border-amber-400 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 font-bold text-slate-950 text-xs shadow-glow transition-all duration-300 group-hover:scale-105">
                      {loggedUser?.imageUrl ? (
                        <img 
                          src={loggedUser.imageUrl} 
                          alt={loggedUser.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : loggedUser?.name === "خالد العتيبي" || loggedUser?.name === "محمد الأحمد" || loggedUser?.name === "سارة الغامدي" ? (
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuClUyDMeNNz5EDpcJCOarsYRF7voJzugEoI4HSCJS8V4iCWY2D1b0aqGI39rnvy3R_NzKhUWZGjFxX_Hg4wqxLsxLCmy7ISBL2ETVyqF6a5fsYgxg_k-xnilnmvbLYKxP9tg7mt_hqE_kSeGnb5OCMZRozlfoKPxzTNEP573bGAn7kcgrPD2H6VC6jAEZebbpWLOp0bHJ-VX39y98II53ZCHIUzq4O5oydK6_1jVabzn9Q9FRf2bhwX51c-bjsnHlYSx4z77O--pWg" 
                          alt={loggedUser?.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{loggedUser?.avatarLetter || "👤"}</span>
                      )}
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-full transition-all cursor-pointer active:scale-95"
                    title="تسجيل الخروج"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Container Router */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: Home Store Dashboard */}
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              
              {/* Giant Glowing Banner */}
              <section className="relative overflow-hidden rounded-2xl border border-[#4f4633]/40 bg-[#191f2f] group shadow-2xl h-[330px] md:h-[400px]">
                <div className="absolute inset-0 hero-gradient z-10" />
                <img 
                  src={cmsBannerImage}
                  alt="Hero Promo" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12 gap-4 text-right">
                  <span className="bg-amber-400 text-slate-950 font-bold text-xs uppercase px-3 py-1 rounded-full w-fit shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse">
                    عرض لفترة محدودة
                  </span>
                  <h1 className="font-headline-xl text-2xl sm:text-4xl lg:text-5xl text-white font-black leading-tight max-w-2xl drop-shadow-md">
                    {cmsBannerText}
                  </h1>
                  <p className="text-sm sm:text-lg text-[#d3c5ac] max-w-md drop-shadow-md">
                    أقوى العروض على بطاقات الهدايا وشحن الألعاب في الشرق الأوسط. اشحن الآن ونافس المحترفين.
                  </p>
                  <div className="flex gap-4 mt-4">
                    <button 
                      onClick={() => {
                        const jwGame = gamesList.find(g => g.id.includes("jw")) || gamesList[0];
                        setSelectedGame(jwGame);
                        navigateToTab("game-detail");
                      }}
                      className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-3 rounded-xl glow-secondary transition-all hover:scale-105 active:scale-95 text-sm sm:text-base cursor-pointer"
                    >
                      اشحن جواكر الآن 🃏
                    </button>
                  </div>
                </div>
              </section>

              {/* Bento Grid layout for (Categories Filter) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Categories and Category Chips */}
                <div className="lg:col-span-12 flex flex-col justify-between gap-6">
                  <div className="flex items-center justify-between border-b border-[#4f4633]/20 pb-3">
                    <h2 className="font-headline-md text-xl sm:text-2xl font-bold">تصفح حسب فئات الألعاب</h2>
                    <span className="text-amber-400 text-xs font-semibold">تصفح بالكل</span>
                  </div>

                  {/* Filtering Categories Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {[
                      { type: GameCategory.BATTLE_ROYALE, label: "ألعاب باتل رويال", count: "قريباً ⏳", icon: Flame },
                      { type: GameCategory.GIFT_CARDS, label: "بطاقات الهدايا", count: "قريباً ⏳", icon: Gift },
                      { type: GameCategory.MOBA, label: "موبا وفانتازي", count: "قريباً ⏳", icon: Coins },
                      { type: GameCategory.JAWAKER, label: "شحن جواكر", count: "متوفر الآن ✨", icon: Trophy },
                      { type: GameCategory.ALL, label: "عرض كل التصنيفات", count: "الألعاب النشطة", icon: Gamepad2 }
                    ].map(card => {
                      const IconComp = card.icon;
                      const isSelected = selectedCategory === card.type;
                      return (
                        <button 
                          key={card.label}
                          onClick={() => {
                            if (card.type !== GameCategory.JAWAKER && card.type !== GameCategory.ALL) {
                              showToast(`قريباً جداً... فئة "${card.label}" ستكون متوفرة للشحن قريباً! ⏳`, "info");
                            } else {
                              setSelectedCategory(card.type);
                            }
                          }}
                          className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all text-center gap-1 group cursor-pointer ${
                            isSelected 
                              ? "bg-amber-400 border-amber-400 text-slate-950 shadow-lg shadow-amber-950/20" 
                              : "bg-[#191f2f] border-[#4f4633]/30 hover:border-amber-400/50 hover:bg-[#232a3a]"
                          }`}
                        >
                          <IconComp className={`w-8 h-8 mb-2 group-hover:scale-110 transition-transform ${isSelected ? "text-slate-950" : "text-[#d3c5ac]"}`} />
                          <span className="font-bold text-sm truncate w-full">{card.label}</span>
                          <span className={`text-[10px] ${isSelected ? "text-slate-950 font-medium" : "text-[#9c8f79]"}`}>{card.count}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search query tag feedback or clear actions */}
                  {searchQuery && (
                    <div className="bg-[#191f2f] border border-[#4f4633]/20 p-3 rounded-xl flex items-center justify-between">
                      <p className="text-xs text-[#d3c5ac]">
                        نتائج البحث لـ <span className="text-amber-400 font-bold">"{searchQuery}"</span> ({filteredGames.length} منتجات)
                      </p>
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="text-xs text-rose-400 font-bold hover:underline"
                      >
                        إلغاء البحث
                      </button>
                    </div>
                  )}

                </div>
              </div>

              {/* Section 2: Best Selling Games GRID */}
              <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-headline-lg text-xl sm:text-3xl font-black bg-gradient-to-l from-white to-[#dce2f7] bg-clip-text text-transparent">الأكثر مبيعاً ورواجاً</h2>
                  <div className="flex gap-2">
                    <button className="p-2 aspect-square border border-[#4f4633]/30 hover:bg-[#191f2f] rounded-xl text-white transition-colors">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Games Cards Dynamic Responsive Grid (Exactly 5 item aesthetics as screenshots) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {filteredGames.length === 0 ? (
                    <div className="col-span-full bg-[#191f2f] border border-[#4f4633]/30 rounded-xl p-12 text-center text-[#9c8f79]">
                      <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-30 animate-pulse" />
                      <p className="font-bold">عذراً! لم نجد أي ألعاب تتطابق مع بحثك أو الفئة المدخلة.</p>
                      <button 
                        onClick={() => { setSelectedCategory(GameCategory.ALL); setSearchQuery(""); }}
                        className="mt-4 px-4 py-2 bg-amber-400 text-slate-950 text-xs font-bold rounded-lg"
                      >
                        إعادة تعيين الفلترة
                      </button>
                    </div>
                  ) : (
                    filteredGames.map(game => (
                      <motion.div 
                        key={game.id}
                        whileHover={game.isComingSoon ? {} : { y: -6 }}
                        className={`bg-[#191f2f] rounded-2xl border overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between ${
                          game.isComingSoon 
                            ? "border-[#4f4633]/20 opacity-75 grayscale-[20%]" 
                            : "border-[#4f4633]/40 hover:border-amber-400/50 group cursor-pointer"
                        }`}
                        onClick={() => {
                          if (game.isComingSoon) {
                            showToast(`قريباً جداً... خدمة "${game.name}" ستكون متوفرة للشحن قريباً! ⏳`, "info");
                          } else {
                            setSelectedGame(game);
                            navigateToTab("game-detail");
                          }
                        }}
                      >
                        <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-950">
                          <img 
                            src={game.imageUrl} 
                            alt={game.name} 
                            className={`w-full h-full object-cover transition-transform duration-500 ${
                              game.isComingSoon ? "" : "group-hover:scale-105"
                            }`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#191f2f] via-transparent to-transparent opacity-75" />
                          <div className="absolute top-2 left-2 flex flex-col gap-1 items-end">
                            {game.isComingSoon ? (
                              <span className="bg-rose-500/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow animate-pulse">
                                قريباً
                              </span>
                            ) : game.isPopular ? (
                              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow">
                                رائج
                              </span>
                            ) : null}
                            <span className="bg-slate-900/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-amber-500/20">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{game.rating}</span>
                            </span>
                          </div>
                        </div>

                        <div className="p-4 flex flex-col gap-3 flex-grow justify-between">
                          <div>
                            <h3 className="font-bold text-sm sm:text-base text-white truncate text-right">
                              {game.name}
                            </h3>
                            <div className="flex items-center justify-between mt-1 text-xs">
                              <span className="text-[#9c8f79]">{game.isComingSoon ? "متوفر" : "يبدأ من"}</span>
                              <span className="text-amber-400 font-extrabold">{game.isComingSoon ? "قريباً ⏳" : `${game.startingPrice.toFixed(2)} ${game.currency}`}</span>
                            </div>
                          </div>

                          <button 
                            className={`w-full text-center py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                              game.isComingSoon
                                ? "bg-slate-800/80 border border-slate-700/40 text-slate-500 cursor-not-allowed"
                                : "bg-[#2e3545] border border-[#4f4633]/40 text-[#dce2f7] group-hover:bg-amber-400 group-hover:text-slate-950 group-hover:border-amber-400"
                            }`}
                          >
                            {game.isComingSoon ? "متوفر قريباً ⏳" : "عرض الفئات"}
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </section>



            </motion.div>
          )}

          {/* SCREEN 2: Game Selector & Package Selection View */}
          {activeTab === "game-detail" && (
            <motion.div
              key="game-detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              
              {/* Left Column: Sidebar with Similar Games & Balance Card */}
              <aside className="lg:col-span-3 lg:order-1 order-2 space-y-6">
                
                {/* Simulated list of recommended games with active states */}
                <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/30">
                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-[#4f4633]/20 pb-2">
                    ألعاب مشابهة بالموقع
                  </h3>
                  <div className="space-y-3">
                    {gamesList.filter(g => g.id !== selectedGame.id).slice(0, 3).map(game => (
                      <div 
                        key={game.id}
                        onClick={() => {
                          setSelectedGame(game);
                          setPlayerId(""); // reset player details
                        }}
                        className="group flex items-center gap-4 p-2.5 rounded-xl hover:bg-[#232a3a] transition-all duration-300 cursor-pointer border border-transparent hover:border-[#4f4633]/20 bg-[#111827]/40"
                      >
                        <img 
                          src={game.imageUrl} 
                          alt={game.name} 
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                            {game.name}
                          </p>
                          <p className="text-[10px] text-[#9c8f79]">شحن مباشر فوري</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subsidized Wallet Promo inside Side Grid */}
                <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/30 space-y-4">
                  <div className="bg-[#0566d9]/15 p-4 rounded-xl border border-sky-500/20 text-right">
                    <span className="text-[10px] text-sky-300 font-bold block mb-1 uppercase tracking-widest">رصيد حسابك المتاح</span>
                    <p className="font-mono text-xl sm:text-2xl font-black text-white">{loggedUser ? walletBalance.toFixed(2) : "0.00"} د.أ</p>
                    <button 
                      onClick={() => navigateToTab("wallet")}
                      className="w-full mt-3 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 rounded-lg text-xs cursor-pointer shadow-md transition-colors"
                    >
                      شحن المحفظة فوراً
                    </button>
                  </div>
                </div>

              </aside>

              {/* Center/Right Main Section: Title banner and detailed selectors */}
              <div className="lg:col-span-9 lg:order-2 order-1 space-y-6">
                
                <button 
                  onClick={() => setActiveTab("home")}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-200 transition-colors cursor-pointer group mb-2"
                >
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  <span>العودة لمتجر العروض</span>
                </button>

                {/* RPG Dynamic Selected Game Header Banner */}
                <section className="relative h-[220px] md:h-[300px] rounded-2xl overflow-hidden group shadow-xl">
                  <img 
                    src={selectedGame.imageUrl} 
                    alt={selectedGame.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-[#0c1322]/40 to-transparent" />
                  
                  {/* Absolute positioning of game banner metadata */}
                  <div className="absolute bottom-0 right-0 p-6 flex flex-row items-center gap-4 md:gap-6 w-full text-right">
                    
                    {/* Dragon Shield Emblem */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-amber-400 shadow-xl overflow-hidden flex-shrink-0 bg-slate-900 hidden sm:block">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_1-_0lD0z3KW5jAbgAfnO-kGYZkb8d46WN7CQaQR9GGFrRG-iJyRfX_iDCZMd5lnSBEWoZwyuAYh6LOzSuFzLSWmItKAzXzETUc7tNAvPT6c3GZpcz69F2LeeoWNvJqr1Jy0JLmsd8p6Mb7SRdt6PPVKewHwdJASl-kRqLXClzS0frtL7gT6cJS-pp5Je6kEkvTvvm0Nd5eeiz8u6CiwIlY_qgpiLRZVeuI4_nsvpSuH4I6eKdT32xz5sZtS3k_zzhaooiCd6erw" 
                        alt="Dragon Emblem" 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <h1 className="font-headline-xl text-xl sm:text-3xl font-black text-white hover:text-amber-300 transition-colors drop-shadow-md">
                        {selectedGame.name}
                      </h1>
                      <div className="flex items-center gap-3 mt-1.5 text-xs">
                        <span className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-bold">
                          باقة فورية آمنة
                        </span>
                        <span className="text-[#d3c5ac] flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{selectedGame.rating} ({selectedGame.ratingCount} تقييم)</span>
                        </span>
                      </div>
                    </div>

                  </div>
                </section>

                {/* Game description */}
                {selectedGame.description && (
                  <section className="bg-[#191f2f] rounded-2xl p-6 border border-[#4f4633]/30 text-right space-y-2 shadow-md">
                    <h3 className="text-sm font-bold text-amber-400 border-b border-[#4f4633]/20 pb-2 uppercase tracking-wider mb-2">الوصف والتعليمات والسياسة</h3>
                    <p className="text-[#d3c5ac] text-xs sm:text-sm leading-relaxed whitespace-pre-line">{selectedGame.description}</p>
                  </section>
                )}

                {/* PLAYER ID INPUT PANEL (exactly matching screen 2) */}
                <section className="bg-[#191f2f] rounded-2xl p-6 border border-[#4f4633]/30 text-right space-y-4 shadow-md">
                  <div className="flex items-center gap-2 text-amber-200">
                    <UserIcon className="w-5 h-5 text-amber-400" />
                    <label className="font-bold text-base">
                      أدخل معرف اللاعب بضمير (Player ID)
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-stretch max-w-lg relative">
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={playerId}
                        onChange={(e) => {
                          setPlayerId(e.target.value);
                          if (e.target.value.trim()) setPlayerIdError("");
                        }}
                        placeholder="مثال: 123456789"
                        className={`w-full bg-[#070e1d] border rounded-xl px-4 py-3.5 text-right text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-400 transition-all ${
                          playerIdError ? "border-rose-500 ring-rose-500/20" : "border-[#4f4633]/40"
                        }`}
                      />
                      {playerIdError && (
                        <p className="text-xs text-rose-400 font-bold mt-1 text-right">{playerIdError}</p>
                      )}
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => setShowIdHelp(!showIdHelp)}
                      className="bg-[#2e3545] hover:bg-[#232a3a] px-4 py-3 rounded-xl border border-[#4f4633]/30 text-xs font-bold text-[#dce2f7] flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                    >
                      <BadgeHelp className="w-4 h-4 text-amber-400" />
                      <span>أين أجد المعرف المعني؟</span>
                    </button>
                  </div>

                  {/* ID instruction help box */}
                  <AnimatePresence>
                    {showIdHelp && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#111827]/80 rounded-xl p-4 border border-[#4f4633]/20 overflow-hidden text-xs text-[#d3c5ac] leading-relaxed space-y-1"
                      >
                        <p className="font-bold text-amber-400">كيفية إيجاد معرف اللاعب الخاص بك:</p>
                        <p>1. قم بفتح تطبيق اللعبة على هاتفك.</p>
                        <p>2. اذهب إلى ملفك الشخصي (Profile) بالزاوية العلوية.</p>
                        <p>3. ستجد رقماً طويلاً بجانب كلمة (ID or Character ID). اضغط على زر نسخ والحقه هنا لضمان سرعة شحن الجواهر والشدات.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="text-xs text-[#9c8f79]">
                    تنبيه: يرجى التحقق من صحة الرقم التعريفي لتجنب ضياع الرصيد أو إرساله لحساب عشوائي بالخطأ.
                  </p>
                </section>

                {/* GAME CATEGORIES PACKAGES LISTGRID */}
                <section className="space-y-4">
                  <h3 className="font-bold text-lg text-white text-right">
                    اختر باقة وحزمة الشحن المفضلة
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-sans">
                    {selectedGame.packages.map(p => {
                      const isSelected = selectedPackage?.id === p.id;
                      return (
                        <div 
                          key={p.id}
                          onClick={() => setSelectedPackage(p)}
                          className={`relative cursor-pointer p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                            isSelected 
                              ? "bg-amber-400 border-amber-400 text-slate-950 shadow-lg scale-[1.01]" 
                              : p.isPreferred
                                ? "bg-[#1f283d] border-amber-400 hover:border-amber-300 hover:bg-[#28334f] text-white ring-1 ring-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]"
                                : "bg-[#191f2f] border-[#4f4633]/30 hover:border-amber-400/40 hover:bg-[#232a3a] text-white"
                          }`}
                        >
                          {p.badge && (
                            <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase scale-90">
                              {p.badge}
                            </span>
                          )}

                          {p.isPreferred && (
                            <span className={`absolute top-2 left-2 ${isSelected ? "bg-slate-950 text-amber-400" : "bg-amber-400 text-slate-950"} text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 scale-90 shadow-md`}>
                              <span>المفضلة</span>
                              <Star className="w-2.5 h-2.5 fill-current" />
                            </span>
                          )}

                          <div className={`p-3 rounded-xl mb-1 flex items-center justify-center ${isSelected ? "bg-slate-950/25" : "bg-[#111827]"}`}>
                            <Coins className={`w-8 h-8 ${isSelected ? "text-slate-950" : "text-amber-400"}`} />
                          </div>

                          <span className="font-extrabold text-[#dce2f7] text-sm sm:text-base text-center truncate w-full" style={{ color: isSelected ? "#000" : "" }}>
                            {p.name}
                          </span>
                          
                          <div className="flex flex-col items-center flex-shrink-0">
                            <span className={`text-xs ${isSelected ? "text-slate-950 font-black" : "text-amber-400 font-bold"}`}>
                              {p.price.toFixed(2)} {selectedGame.currency}
                            </span>
                            {p.bonusPercent && (
                              <span className={`text-[10px] mt-0.5 px-1 py-0.2 rounded font-mono ${isSelected ? "bg-[#111827] text-white" : "bg-rose-500/20 text-rose-400"}`}>
                                +{p.bonusPercent}% رصيد إضافي
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* BUY BUTTON ACTION BAR CONTAINER (exactly matching screen 2) */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-[#141b2b] p-6 rounded-2xl border border-[#4f4633]/30 gap-4 text-right">
                  <div className="flex flex-col text-center sm:text-right">
                    <span className="text-xs text-[#9c8f79]">المجموع الإجمالي المستحق:</span>
                    <span className="text-amber-400 font-headline-lg text-2xl sm:text-3xl font-black drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                      {selectedPackage ? `${selectedPackage.price.toFixed(2)} ${selectedGame.currency}` : "0.00 د.أ"}
                    </span>
                  </div>

                  <button 
                    onClick={handlePurchasePackage}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black rounded-xl cursor-pointer glow-primary transform active:scale-95 transition-all text-base flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>تأكيد الشراء الآن</span>
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>

              </div>

            </motion.div>
          )}

          {/* SCREEN 3: Wallet Funds deposit Request View */}
          {activeTab === "wallet" && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto w-full space-y-8 text-right font-sans"
            >
              
              {/* Simulated Center Wallet Status Card */}
              <div className="bg-[#191f2f] rounded-2xl p-6 border border-amber-400/20 relative overflow-hidden group shadow-[0_0_30px_rgba(251,191,36,0.06)] hover:border-amber-400/40 transition-all text-center">
                <div className="absolute -right-10 -top-10 w-44 h-44 bg-amber-400/5 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
                  <div className="flex items-center gap-2 justify-center">
                    <Wallet className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                    <span className="text-[#9c8f79] text-xs font-bold uppercase tracking-wider">رصيد حسابك الحالي</span>
                  </div>
                  <div className="flex items-baseline gap-1 bg-gradient-to-l from-white to-[#dce2f7] bg-clip-text text-transparent font-sans">
                    <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight">{walletBalance.toFixed(2)}</span>
                    <span className="text-sm font-semibold text-amber-400">د.أ</span>
                  </div>
                </div>
              </div>

              {/* Request form (Exclusive CliQ payment layout) */}
              <section className="bg-[#191f2f] rounded-2xl p-6 sm:p-8 border border-[#4f4633]/30 space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full" />
                
                <div className="flex items-center gap-3 justify-end border-b border-[#4f4633]/20 pb-4">
                  <div>
                    <h2 className="font-headline-md text-xl sm:text-2xl font-black text-white">طلب شحن وتعبئة الرصيد</h2>
                    <p className="text-xs text-[#9c8f79] mt-1">اشحن محفظتك فوراً ومجاناً عبر الإيداع البنكي السريع</p>
                  </div>
                  <div className="p-3 bg-sky-500/10 rounded-xl border border-sky-500/20 text-sky-400 flex-shrink-0">
                    <Coins className="w-6 h-6" />
                  </div>
                </div>

                <form onSubmit={handleDepositSubmit} className="space-y-6">
                  
                  {/* Select Payment channels (Only showing CLIQ as requested) */}
                  <div className="space-y-2">
                    <label className="text-xs text-[#d3c5ac] font-bold block">بوابة الشحن المعتمدة</label>
                    <div className="p-4 rounded-xl border border-sky-450 bg-sky-500/5 flex items-center justify-between transition-all">
                      <div className="text-left font-mono text-[10px] text-sky-400 font-extrabold bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                        طلب مباشر فوراً
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-[#dce2f7] text-sm block">CliQ مباشر ومجاني</span>
                        <span className="text-[10px] text-[#9c8f79]">أسرع طريقة شحن معتمدة ومجانية</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Account details & QR Panel */}
                  <div className="space-y-4 bg-[#070e1d] p-5 rounded-xl border border-[#4f4633]/30">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-[#4f4633]/20 pb-1">بيانات حساب الإدارة للتحويل</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      
                      {/* Left Block: QR code box */}
                      <div className="flex flex-col items-center justify-center p-3.5 bg-white rounded-xl shadow-inner border border-slate-200">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvMuv-hPMQ_2n5zqlH_yd1mCI8KQyQF7iusj3GZCkBkBZ1u37TSW6qt6Fya284c6fSIVANE0wG8C9tmiZ1MnCxDyGvK_1JmviFupI_9G5oJ5PoqiRbKps_ISgCFQPjddWrf9_wPNad6SLidtdKRzrzsMuUml3AvfwwyPhjP1eEnHalk0CCrJso2ItA1p0uVADRPikdbRqiFOsgJiUumVlBX1EGfY4A0OQo37lJLwXQuietl40GN53vUpjAYK8Lo_MknYpmCTZ4Q94" 
                          alt="CliQ Payment QR" 
                          className="w-28 h-28 object-contain"
                        />
                        <span className="text-[10px] text-slate-500 font-extrabold mt-1.5">امسح كود CliQ للتحويل</span>
                      </div>

                      {/* Right Block: Account Coordinates for Copying */}
                      <div className="space-y-3">
                        <div className="bg-[#191f2f] rounded-lg p-3 flex items-center justify-between border border-[#4f4633]/30">
                          <button 
                            type="button"
                            onClick={() => handleCopyText("FAARA-SHOP-99")}
                            className="text-xs text-amber-400 hover:text-amber-200 flex items-center gap-1 font-semibold transition-colors shrink-0 font-sans"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedText ? "تم النسخ" : "نسخ الاسم"}</span>
                          </button>
                          <div className="min-w-0 pr-2">
                            <p className="text-[10px] text-[#9c8f79]">اسم مستعار CliQ (Alias)</p>
                            <p className="font-mono font-bold text-sm text-white tracking-wider truncate">FAARA-SHOP-99</p>
                          </div>
                        </div>

                        <div className="p-3 bg-amber-400/5 rounded-lg border border-amber-400/10">
                          <p className="text-[10px] text-[#d3c5ac] leading-relaxed">
                            💡 يرجى تحويل كامل المبلغ المطلوب عبر تطبيق البنك الخاص بك عن طريق خدمة CliQ باستخدام اسم المستعار أعلاه، وتنزيل صورة الإيصال لإرفاقها في الحقل أدناه.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Input and upload Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Amount Input */}
                    <div className="space-y-1">
                      <label className="text-xs text-[#d3c5ac] block font-bold">المبلغ المراد شحنه</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          placeholder="0.00"
                          required
                          className="w-full bg-[#070e1d] border border-[#4f4633]/40 rounded-xl px-4 py-3 text-sm text-left font-mono font-bold outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-white"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-sky-400 font-mono">JOD</span>
                      </div>
                    </div>

                    {/* Receipt image file picker */}
                    <div className="space-y-1">
                      <label className="text-xs text-[#d3c5ac] block font-bold">إرفاق إيصال الحوالة (صورة)</label>
                      <label className="flex flex-col items-center justify-center w-full h-[46px] border border-dashed border-[#4f4633]/40 hover:border-sky-500/50 rounded-xl cursor-pointer bg-[#070e1d] hover:bg-[#111827] transition-all px-4">
                        <div className="flex items-center justify-between w-full h-full gap-2">
                          <ExternalLink className="w-4 h-4 text-[#9c8f79] shrink-0" />
                          <div className="min-w-0 text-right">
                            {receiptFileName ? (
                              <p className="text-xs text-emerald-400 font-bold max-w-[180px] truncate">{receiptFileName}</p>
                            ) : (
                              <p className="text-xs text-[#d3c5ac] truncate font-semibold">اضغط لاختيار صورة الإيصال</p>
                            )}
                          </div>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleReceiptUpload}
                          required
                          className="hidden" 
                        />
                      </label>
                    </div>

                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isDepositing}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-4 rounded-xl cursor-pointer shadow-lg hover:shadow-sky-800/20 text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 border border-sky-500/25"
                  >
                    {isDepositing ? (
                      <span>جاري إرسال وتدقيق البيانات الحالية...</span>
                    ) : (
                      <>
                        <span>أرسل طلب الشحن فوراً</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                </form>
              </section>

              {/* HISTORICAL RECENT REQUESTS - Screen 3 components */}
              <section className="bg-[#191f2f] rounded-2xl border border-[#4f4633]/30 overflow-hidden shadow-md text-right">
                <div className="p-5 border-b border-[#4f4633]/30 bg-[#232a3a] flex justify-between items-center bg-gradient-to-l from-[#232a3a] to-[#191f2f]">
                  <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2 justify-end">
                    <span>سجل طلبات المحفظة والشراء الأخيرة</span>
                    <History className="w-5 h-5 text-amber-400" />
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-[#070e1d] text-[#9c8f79] uppercase font-bold tracking-wider border-b border-[#4f4633]/20">
                        <th className="px-5 py-3.5">رقم المعاملة</th>
                        <th className="px-5 py-3.5">المنتج / العملية</th>
                        <th className="px-5 py-3.5">تاريخ الإرسال</th>
                        <th className="px-5 py-3.5">المبلغ المدفوع</th>
                        <th className="px-5 py-3.5">حالة المعاملة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#4f4633]/10">
                      {userOrders.map(item => (
                        <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="px-5 py-4 font-mono font-bold text-white">{item.id}</td>
                          <td className="px-5 py-4 font-semibold">{item.product}</td>
                          <td className="px-5 py-4 text-[#9c8f79]">{item.date}</td>
                          <td className="px-5 py-4 font-mono font-extrabold text-amber-400">
                            {item.price.toFixed(2)} {item.currency}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold border inline-block ${
                              item.status === OrderStatus.COMPLETED 
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                : item.status === OrderStatus.PENDING
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : item.status === OrderStatus.PROCESSING
                                ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

            </motion.div>
          )}

          {/* SCREEN 4: Admin CMS Dashboard Management Control Panel */}
          {activeTab === "admin" && isAdmin && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-right"
            >
              
              {/* Left Column Admin Side Navigation Panel */}
              <aside className="lg:col-span-3 space-y-4">
                <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/40 flex flex-col gap-5">
                  <div className="flex items-center gap-3 justify-end mb-2">
                    <div>
                      <h2 className="font-bold text-base text-amber-400">لوحة الإشراف</h2>
                      <p className="text-[10px] text-[#9c8f79]">إدارة محتويات المتجر</p>
                    </div>
                    <Sliders className="w-5 h-5 text-amber-400" />
                  </div>

                  <nav className="flex flex-col gap-2">
                    {[
                      { id: "analytics", label: "التحليلات والمبيعات", icon: TrendingUp },
                      { id: "deposits", label: "مراقبة الإيداعات المعلقة", icon: Wallet },
                      { id: "users", label: "إدارة اللاعبين المعتمدين", icon: Users },
                      { id: "items", label: "إدارة المنتجات والألعاب", icon: Gamepad2 },
                      { id: "settings", label: "إعدادات واجهة المتجر (CMS)", icon: Settings }
                    ].map(menu => {
                      const Icon = menu.icon;
                      const isSelected = activeAdminTab === menu.id;
                      return (
                        <button 
                          key={menu.id}
                          onClick={() => setActiveAdminTab(menu.id as any)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm text-right transition-all transform hover:-translate-x-1 cursor-pointer ${
                            isSelected 
                              ? "bg-amber-400 text-slate-950 shadow-md" 
                              : "text-[#d3c5ac] hover:bg-[#232a3a]"
                          }`}
                        >
                          <Icon className="w-4.5 h-4.5 shrink-0" />
                          <span>{menu.label}</span>
                        </button>
                      );
                    })}
                  </nav>

                  <div className="border-t border-[#4f4633]/20 pt-4 flex flex-col gap-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs sm:text-sm font-bold transition-all text-right cursor-pointer"
                    >
                      <LogOut className="w-4.5 h-4.5" />
                      <span>تسجيل الخروج من الحساب</span>
                    </button>
                  </div>
                </div>
              </aside>

              {/* Right Column Content Areas based on selected inner administrative tabs */}
              <div className="lg:col-span-9 space-y-6">
                
                {/* 1. Analytics Sub Tab Dashboard statistics view (Bento Style) */}
                {activeAdminTab === "analytics" && (
                  <div className="space-y-6">
                    
                    {/* Bento Grid Header statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      
                      <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/30 text-right space-y-1 hover:border-amber-400/30 transition-all shadow-sm">
                        <div className="flex justify-between items-start">
                          <span className="text-[#9c8f79] text-xs font-bold">إجمالي المبيعات</span>
                          <Coins className="w-5 h-5 text-amber-400" />
                        </div>
                        <p className="font-mono text-xl sm:text-2xl font-black text-white">{totalSalesToDisplay.toFixed(2)} د.أ</p>
                        <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5 justify-end">
                          <span>مباشرة من قاعدة البيانات Firestore</span>
                          <TrendingUp className="w-3.5 h-3.5" />
                        </p>
                      </div>

                      <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/30 text-right space-y-1 hover:border-rose-500/20 transition-all shadow-sm">
                        <div className="flex justify-between items-start">
                          <span className="text-[#9c8f79] text-xs font-bold">إيداعات قيد المراجعة</span>
                          <AlertCircle className="w-5 h-5 text-rose-400 animate-pulse" />
                        </div>
                        {/* Calculate currently pending order sums */}
                        <p className="font-mono text-xl sm:text-2xl font-black text-rose-400">
                          {pendingDepositsToDisplay} طلبات
                        </p>
                        <p className="text-[10px] text-rose-400 font-bold">تتطلب تدقيق يدوي فوري</p>
                      </div>

                      <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/30 text-right space-y-1 hover:border-sky-500/20 transition-all shadow-sm">
                        <div className="flex justify-between items-start">
                          <span className="text-[#9c8f79] text-xs font-bold">أعضاء فارة الجدد</span>
                          <Users className="w-5 h-5 text-sky-400" />
                        </div>
                        <p className="font-mono text-xl sm:text-2xl font-black text-white">{totalMembersToDisplay} لاعب</p>
                        <p className="text-[10px] text-sky-400 font-bold">مسجلين في Firebase Auth</p>
                      </div>

                      <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/30 text-right space-y-1 hover:border-amber-400/30 transition-all shadow-sm">
                        <div className="flex justify-between items-start">
                          <span className="text-[#9c8f79] text-xs font-bold">إجمالي الإيداعات المقبولة</span>
                          <Wallet className="w-5 h-5 text-amber-300" />
                        </div>
                        <p className="font-mono text-xl sm:text-2xl font-black text-white">{totalInstantDepositsToDisplay.toFixed(2)} د.أ</p>
                        <p className="text-[10px] text-[#9c8f79]">تأكيد مباشر ومزامن</p>
                      </div>

                    </div>

                    {/* Deposit Request Lists (Same layout as screen 4 last item queue) */}
                    <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/30 space-y-4">
                      <div className="flex justify-between items-center border-b border-[#4f4633]/20 pb-3">
                        <h3 className="font-bold text-base text-amber-200 flex items-center gap-1.5 justify-end">
                          <span>طلبات تأكيد الشحن والإيداع الأخيرة بالمتجر</span>
                          <Wallet className="w-5 h-5 text-amber-400" />
                        </h3>
                        <span className="text-xs text-[#9c8f79]">مراجعة يدوية نشطة</span>
                      </div>

                      <div className="space-y-3">
                        {userOrders.filter(o => o.status === OrderStatus.PENDING).length === 0 ? (
                          <div className="p-12 text-center text-[#9c8f79] text-sm">
                            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400 mb-2" />
                            <p className="font-bold">كل الطلبات والإيداعات تم البت ومراجعتها بنجاح!</p>
                            <p className="text-xs text-[#9c8f79] mt-1">لا توجد دفوعات معلقة حالياً في طابور الانتظار.</p>
                          </div>
                        ) : (
                          userOrders.filter(o => o.status === OrderStatus.PENDING).map(order => (
                            <div key={order.id} className="bg-[#111827]/80 rounded-xl p-4 border border-[#4f4633]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="flex items-center gap-4 w-full sm:w-auto text-right">
                                
                                {/* Receipt thumbnail preview clickable to Zoom Modal Lightbox */}
                                {order.receiptUrl ? (
                                  <div className="relative w-28 h-16 bg-[#191f2f] border border-[#4f4633]/30 rounded-lg overflow-hidden shrink-0 group">
                                    <img src={order.receiptUrl} alt="Receipt proof" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    <div 
                                      onClick={() => setZoomReceiptUrl(order.receiptUrl || null)}
                                      className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                    >
                                      <Eye className="w-4 h-4 text-white" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-28 h-16 bg-slate-900 border border-[#4f4633]/20 rounded-lg flex items-center justify-center shrink-0">
                                    <span className="text-[10px] text-[#9c8f79]">بدون إيصال</span>
                                  </div>
                                )}

                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-white text-sm">{order.user}</h4>
                                    <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-mono text-[9px] font-black">
                                      {order.paymentMethod}
                                    </span>
                                  </div>
                                  <p className="text-xs text-[#d3c5ac] mt-1">رقم الطلب: <span className="font-mono">{order.id}</span> | تعبئة رصيد يدوي </p>
                                </div>
                              </div>

                              <div className="flex flex-row sm:flex-row items-center gap-4 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
                                <span className="font-mono text-amber-400 font-extrabold text-sm sm:text-base">
                                  {order.price.toFixed(2)} JOD
                                </span>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleAdminAcceptDeposit(order.id, order.price)}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-transform active:scale-95 cursor-pointer"
                                  >
                                    قبول وتأكيد
                                  </button>
                                  <button 
                                    onClick={() => handleAdminRejectDeposit(order.id)}
                                    className="border border-rose-500 text-rose-400 hover:bg-rose-500/10 font-bold px-4 py-2 rounded-lg text-xs transition-transform active:scale-95 cursor-pointer"
                                  >
                                    رفض
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Quick System Alerts Inside Admin panel */}
                    <div className="bg-[#191f2f] rounded-2xl p-5 border-r-4 border-rose-500/80 border-t border-b border-l border-[#4f4633]/30 flex items-start gap-4 text-right">
                      <ShieldAlert className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5 animate-pulse" />
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-sm">تنبيهات الأنظمة والمخزون</h4>
                        <p className="text-xs text-[#9c8f79] leading-relaxed">
                          نظام الكشف الآلي يشير إلى وجود 5 طلبات تحويل تأخر معالجتها لعدم تحميل العميل الإيصال الصحيح، يرجى مراجعة كشوفاتCliQ البنكية لمطابقة حوالات FAARA-SHOP-99.
                        </p>
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. Pending Deposits Management Specific Queue tab */}
                {activeAdminTab === "deposits" && (
                  <div className="space-y-6">
                    <div className="bg-[#191f2f] p-6 rounded-2xl border border-[#4f4633]/30 text-right space-y-4">
                      <div>
                        <h3 className="font-black text-xl text-white">إدارة طلبات شحن الرصيد المعلقة</h3>
                        <p className="text-xs text-[#9c8f79] mt-0.5">يمكنك هنا تأكيد ومراجعة إيصالات دفع CliQ والمحافظ الإلكترونية لإيداع الأموال للعملاء بالريال.</p>
                      </div>

                      <div className="space-y-3 pt-3">
                        {userOrders.filter(o => o.status === OrderStatus.PENDING).length === 0 ? (
                          <div className="text-center p-12 text-[#9c8f79]">
                            <Wallet className="w-12 h-12 mx-auto text-amber-500 opacity-20 mb-2" />
                            <p className="font-bold">أحسنت! لا توجد طلبات إيداع معلقة متبقية.</p>
                          </div>
                        ) : (
                          userOrders.filter(o => o.status === OrderStatus.PENDING).map(order => (
                            <div key={order.id} className="bg-[#070e1d] p-4 rounded-xl border border-[#4f4633]/20 flex flex-col md:flex-row items-center justify-between gap-4">
                              <div className="flex items-center gap-4 text-right w-full md:w-auto">
                                <img 
                                  src={order.receiptUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDt_Ia8NFL2910LQeWD6l1aebyCE2kukULD1velcJLQl8uxf8BNG6bmT9RCWyjQ5XYBDD81Gf5WmECKJKNtb3_tO1LjPRHqQpYcWPeXnT2kjNAv7PPqQBCLqXXsZOL0gpfWkAIGwUaZk8FsriyFuKdvZUIYbzgtrlM__6Ey1GK8IQio_TjAdVifw5ZDFuLswkEjzGafYxCFsDtnJq_Uyif092IF3JVA5I0ir-K6ZarVDHB8ky6rr3A7GyYvY7ttzh4jpMOkr6RgUFo"} 
                                  alt="إيصال" 
                                  onClick={() => setZoomReceiptUrl(order.receiptUrl || null)}
                                  className="w-16 h-16 object-cover rounded border border-[#4f4633]/30 cursor-pointer hover:border-amber-400"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <p className="font-bold text-white text-sm">{order.user}</p>
                                  <p className="text-xs text-[#d3c5ac] mt-0.5">الرقم المرجعي: <span className="font-mono text-amber-400">{order.id}</span></p>
                                  <p className="text-[10px] text-[#9c8f79]">وسيلة الدفع: <span className="font-bold">{order.paymentMethod}</span></p>
                                </div>
                              </div>

                              <div className="flex flex-row items-center gap-4 text-right shrink-0 w-full md:w-auto justify-between md:justify-end">
                                <span className="font-mono text-amber-400 font-extrabold text-lg">
                                  {order.price.toFixed(2)} JOD
                                </span>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleAdminAcceptDeposit(order.id, order.price)}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs"
                                  >
                                    قبول كلي
                                  </button>
                                  <button 
                                    onClick={() => handleAdminRejectDeposit(order.id)}
                                    className="border border-rose-500 text-rose-500 hover:bg-rose-500/10 font-bold px-3 py-1.5 rounded-lg text-xs"
                                  >
                                    رفض الإيداع
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. User Accounts Management Tab (Block / Reactivate exactly like screen 4 table) */}
                {activeAdminTab === "users" && (
                  <div className="space-y-6">
                    <div className="bg-[#191f2f] rounded-2xl border border-[#4f4633]/30 overflow-hidden shadow-lg">
                      <div className="p-5 bg-[#232a3a] border-b border-[#4f4633]/30 flex justify-between items-center text-right">
                        <h3 className="font-black text-lg text-white">إدارة اللاعبين المسجلين بالموقع</h3>
                        <span className="text-xs text-[#9c8f79]">تعديل الحظر والأرصدة</span>
                      </div>

                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-right">
                          <thead>
                            <tr className="bg-[#070e1d] text-[#9c8f79] font-bold uppercase tracking-wider border-b border-[#4f4633]/20">
                              <th className="px-5 py-3">اللاعب / الاسم</th>
                              <th className="px-5 py-3">حالة الحساب</th>
                              <th className="px-5 py-3">تاريخ الانضمام</th>
                              <th className="px-5 py-3">الرصيد المحفظي</th>
                              <th className="px-5 py-3">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#4f4633]/10">
                            {adminUsers.map(user => (
                              <tr key={user.id} className="hover:bg-slate-900/35 transition-colors">
                                <td className="px-5 py-4 font-bold text-white flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-400 font-extrabold flex items-center justify-center text-[10px] select-none uppercase">
                                    {user.avatarLetter.substr(0, 1)}
                                  </div>
                                  <span>{user.name}</span>
                                </td>
                                <td className="px-5 py-4">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                    user.status === "نشط" 
                                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                  }`}>
                                    {user.status}
                                  </span>
                                </td>
                                <td className="px-5 py-4 text-[#9c8f79] font-mono">{user.joinDate}</td>
                                <td className="px-5 py-4 font-mono font-bold text-white">
                                  {user.balance.toFixed(2)} د.أ
                                </td>
                                <td className="px-5 py-4 flex gap-1.5">
                                  <button 
                                    onClick={() => handleToggleUserStatus(user.id)}
                                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                      user.status === "نشط" 
                                        ? "bg-rose-600/20 border border-rose-500/30 text-rose-400 hover:bg-rose-600 hover:text-white" 
                                        : "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                                    }`}
                                  >
                                    {user.status === "نشط" ? "حظر اللاعب" : "إعادة تفعيل"}
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteUser(user.id, user.name)}
                                    title="حذف اللاعب نهائياً"
                                    className="p-1 px-1.5 border border-rose-500/20 hover:border-rose-500/60 bg-rose-500/5 hover:bg-rose-500/20 text-rose-400 hover:text-rose-200 rounded transition-all cursor-pointer flex items-center justify-center gap-1 text-[10px] font-bold"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>حذف</span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. CMS Settings Frontend Customization Tab (Exactly matching Screen 4 CMS config sidebar) */}
                {activeAdminTab === "settings" && (
                  <div className="space-y-6">
                    <section className="bg-[#191f2f] p-6 rounded-2xl border border-[#4f4633]/30 text-right space-y-6 shadow-md">
                      
                      <div className="flex items-center gap-3 justify-end border-b border-[#4f4633]/20 pb-3">
                        <div>
                          <h3 className="font-extrabold text-lg text-white">تخصيص واجهة فارة (CMS Control)</h3>
                          <p className="text-xs text-[#9c8f79] mt-0.5">يمكنك هنا تغيير صورة البنر الرئيسي، ونصوص الإعلانات المنبثقة بشكل فوري.</p>
                        </div>
                        <Settings className="w-5 h-5 text-amber-400" />
                      </div>

                      <form onSubmit={handleSaveCMS} className="space-y-4">
                        
                        <div className="space-y-1">
                          <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block">بنر العروض الرئيسي (رابط الصورة)</label>
                          <input 
                            type="text" 
                            value={cmsBannerText}
                            onChange={(e) => setCmsBannerText(e.target.value)}
                            placeholder="العنوان الأساسي بالبنر"
                            className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-right focus:border-amber-400 outline-none"
                          />
                        </div>

                        {/* Interactive Banner Preview Image exactly as layout 4 right column */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#9c8f79] block">معاينة بنر العروض الترويجي النشط</label>
                          <div className="border border-[#4f4633]/30 rounded-xl overflow-hidden aspect-video relative max-w-md bg-slate-950">
                            <img src={cmsBannerImage} alt="Banner layout" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex flex-col justify-end p-4 text-right">
                              <span className="bg-amber-400 text-slate-950 text-[10px] uppercase font-bold px-2 py-0.5 rounded w-fit mb-1">
                                عرض ترويجي
                              </span>
                              <h4 className="text-white text-xs sm:text-sm font-bold truncate">{cmsBannerText}</h4>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block">رابط التوجيه عند النقر</label>
                          <input 
                            type="text" 
                            value={cmsBannerUrl}
                            onChange={(e) => setCmsBannerUrl(e.target.value)}
                            className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-left font-mono outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block">نص الإعلان المنبثق العلوي</label>
                          <textarea 
                            value={cmsPopupText}
                            onChange={(e) => setCmsPopupText(e.target.value)}
                            rows={2}
                            className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-right focus:border-amber-400 outline-none"
                            placeholder="أدخل النص الإعلاني المنبثق بالشريط العلوي للموقع"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 rounded-xl cursor-pointer text-sm shadow-md transition-all active:scale-95"
                        >
                          حفظ وتطبيق جميع التعديلات فورياً
                        </button>

                      </form>
                    </section>
                  </div>
                )}

                {/* SCREEN 4 SUB-TAB: ITEM MANAGEMENT */}
                {activeAdminTab === "items" && (
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 text-right w-full">
                    
                    {/* Add/Edit Product Form */}
                    <div id="game-edit-form-anchor" className="xl:col-span-12 lg:col-span-12 space-y-3 w-full">
                      <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/30 shadow-md">
                        <div className="flex items-center gap-2 justify-end border-b border-[#4f4633]/20 pb-3 mb-4">
                          <h3 className="font-extrabold text-base text-white">
                            {editingGame ? `تعديل منتج: ${editingGame.name}` : "إضافة منتج أو لعبة جديدة"}
                          </h3>
                          {editingGame ? <Edit2 className="w-4 h-4 text-amber-400" /> : <Plus className="w-4 h-4 text-amber-400" />}
                        </div>

                        <form onSubmit={handleSaveItem} className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block">اسم اللعبة / المنتج *</label>
                            <input 
                              type="text" 
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              placeholder="مثال: ببجي لايت (PUBG Mobile Lite)"
                              className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-right focus:border-amber-400 outline-none animate-none"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block">السعر المبدئي د.أ *</label>
                              <input 
                                type="number" 
                                step="0.01" 
                                min="0.1"
                                value={formStartingPrice}
                                onChange={(e) => setFormStartingPrice(parseFloat(e.target.value) || 0)}
                                className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-left font-mono outline-none animate-none"
                                required
                              />
                            </div>
                            <div className="space-y-1 text-right">
                              <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block">تصنيف المنتج *</label>
                              <select 
                                value={formCategory}
                                onChange={(e) => setFormCategory(e.target.value as GameCategory)}
                                className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-[#d3c5ac] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-right focus:border-amber-400 outline-none cursor-pointer"
                              >
                                <option value={GameCategory.BATTLE_ROYALE}>{GameCategory.BATTLE_ROYALE}</option>
                                <option value={GameCategory.GIFT_CARDS}>{GameCategory.GIFT_CARDS}</option>
                                <option value={GameCategory.MOBA}>{GameCategory.MOBA}</option>
                                <option value={GameCategory.JAWAKER}>{GameCategory.JAWAKER}</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block">رابط صورة/أيقونة المنتج *</label>
                            <input 
                              type="text" 
                              value={formImageUrl}
                              onChange={(e) => setFormImageUrl(e.target.value)}
                              placeholder="https://example.com/image.jpg"
                              className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-left font-mono outline-none"
                              required
                            />
                            
                            {/* Suggestions panel */}
                            <div className="mt-2 space-y-1">
                              <span className="text-[10px] text-[#9c8f79] block mb-1">نقرات سريعة لملء صور تجريبية للتجربة:</span>
                              <div className="flex flex-wrap gap-1.5 justify-end">
                                {[
                                  { n: "PUBG Mobile", u: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZKSXhjQxPqdIk83dHeK6ZZL7wh1HAo_lj7OMcTo899WEsTb6NBSUoBgg0nxG_DZJrC-BB6RHOv1patvRvGl7dtTiVgwPWSvPeZVMqr1Tx5Ee2e6RDl1sbaUQBXFY_itU8GFclYLlXyv6dz9HubtHAjcxzzitrtniK77kRXWeglDKh6xS5APIDBeIcp538GVS6rplU36qZR4lvn5AffPHrmhaAD9fSzVfJFtVgQeNchCSHZs18tu9jp6xxr_EI_YhXqIFbHssfVfI" },
                                  { n: "بطاقات جارينا", u: "https://lh3.googleusercontent.com/AB6AXuAtvA8l_Yh8J4r133dHeK_zGzG7_fD_5p9R_34U6_E5dFz5aU_r_a_b4X_9_e5G_E5Y8u5r_W_2" },
                                  { n: "روبلكس", u: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_T35B6LpXqP-o3-f9i27-9wRE8XgGfpx60SszHq78rD_2_BcoJqG2YmJpUu6D4C82eY7wXnI1h2R9P_W_y8_M7T_8p8hU8Z-RzKxF_V6PoPZ8Ld9z2_R9p2X4Z_Yv3Y7d_1p7R9p8S" },
                                  { n: "فورتنايت", u: "https://lh3.googleusercontent.com/aida-public/AB6AXuBV0GR_CXtMSlbcmlw9uYjxzsD7pxpG85G4rnqxSBNmOwO9uS6rEPqRh_9iTLqWovLmhlYfcNzj5ejSywKSsZXlAaFLgtslAEp_QDf7ebPgGW67hAy5k0LKR3z9917rFaaJREnyts8sSgoTkEq8VuHz6bMD-98iDgBIl0QdDUdA_VNsCw3osJBdhXmPM4VcBPCQI3PO_uhDoJi-w8Bp-NYAlmGZMIAwj99EPLWzaB7u07bAuegjxZeMbrFy0aaIfYHaTtSIeN49cdo" }
                                ].map(preset => (
                                  <button
                                    key={preset.n}
                                    type="button"
                                    onClick={() => setFormImageUrl(preset.u)}
                                    className="bg-[#070e1d] hover:bg-slate-900 border border-[#4f4633]/20 hover:border-amber-400 px-2.5 py-1 rounded text-[10px] text-[#d3c5ac] transition-all cursor-pointer"
                                  >
                                    {preset.n}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs sm:text-sm font-bold text-[#d3c5ac] block">الوصف والتعليمات (Description) *</label>
                            <textarea 
                              value={formDescription}
                              onChange={(e) => setFormDescription(e.target.value)}
                              rows={3}
                              className="w-full bg-[#070e1d] border border-[#4f4633]/30 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-right focus:border-amber-400 outline-none"
                              placeholder="أدخل الوصف الخاص بالخدمة وتفاصيل شحن الباقات للعملاء..."
                              required
                            />
                          </div>

                          {/* PACKAGES EDITOR SECTION */}
                          <div className="space-y-3 bg-[#111827]/60 rounded-2xl p-4 border border-[#4f4633]/20 text-right">
                            <div className="flex justify-between items-center border-b border-[#4f4633]/15 pb-2 mb-3">
                              <button 
                                type="button"
                                onClick={handleAddPackage}
                                className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-md"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>إضافة باقة شحن جديدة</span>
                              </button>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-[#d3c5ac] text-xs sm:text-sm">باقات وحزم الشحن للشراء والطلب</h4>
                                <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
                              </div>
                            </div>

                            {formPackages.length === 0 ? (
                              <p className="text-center text-[#9c8f79] text-xs py-4">لا توجد باقات حالياً. اضغط على زر "إضافة باقة شحن جديدة" أعلاه للبدء.</p>
                            ) : (
                              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                {formPackages.map((pkg, idx) => (
                                  <div key={pkg.id} className={`p-3 rounded-xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 transition-colors ${pkg.isPreferred ? "bg-amber-400/5 border-amber-400" : "bg-[#070e1d]/80 border-[#4f4633]/15"}`}>
                                    {/* Actions side */}
                                    <div className="flex items-center gap-2 justify-between md:justify-start w-full md:w-auto shrink-0 order-2 md:order-1">
                                      {/* Remove package button */}
                                      <button 
                                        type="button"
                                        onClick={() => handleRemovePackage(pkg.id)}
                                        className="p-2 text-rose-400 hover:text-white hover:bg-rose-500 bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                                        title="حذف الباقة"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>

                                      {/* Star / Preferred package toggle */}
                                      <button 
                                        type="button"
                                        onClick={() => handleUpdatePackageField(pkg.id, "isPreferred", !pkg.isPreferred)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                                          pkg.isPreferred 
                                            ? "bg-amber-400 border-amber-400 text-slate-950 font-extrabold shadow-sm" 
                                            : "bg-[#070e1d] border-[#4f4633]/25 text-[#9c8f79] hover:text-[#d3c5ac] hover:border-amber-400/40"
                                        }`}
                                      >
                                        <Star className={`w-3.5 h-3.5 ${pkg.isPreferred ? "fill-current" : ""}`} />
                                        <span>{pkg.isPreferred ? "الحزمة المفضلة الحالية ⭐" : "تعيين كالحزمة المفضلة"}</span>
                                      </button>
                                    </div>

                                    {/* Core fields inputs */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full text-right order-1 md:order-2">
                                      {/* Badge field */}
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-[#9c8f79] block">شارة مميزة (مثال: شائع أو توفير)</label>
                                        <input 
                                          type="text"
                                          placeholder="شارة مميزة"
                                          value={pkg.badge || ""}
                                          onChange={(e) => handleUpdatePackageField(pkg.id, "badge", e.target.value)}
                                          className="w-full bg-[#070e1d] border border-[#4f4633]/25 text-white rounded-lg px-2 py-1.5 text-xs text-right focus:border-amber-400 outline-none"
                                        />
                                      </div>

                                      {/* Bonus percent */}
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-[#9c8f79] block">نسبة بونص % مجاني</label>
                                        <input 
                                          type="number"
                                          placeholder="بونص %"
                                          value={pkg.bonusPercent === undefined || pkg.bonusPercent === 0 ? "" : pkg.bonusPercent}
                                          onChange={(e) => handleUpdatePackageField(pkg.id, "bonusPercent", e.target.value === "" ? undefined : (parseInt(e.target.value) || 0))}
                                          className="w-full bg-[#070e1d] border border-[#4f4633]/25 text-white rounded-lg px-2 py-1.5 text-xs text-left font-mono focus:border-amber-400 outline-none"
                                        />
                                      </div>

                                      {/* Price field */}
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-[#9c8f79] block">سعر الباقة د.أ *</label>
                                        <input 
                                          type="number"
                                          step="0.01"
                                          min="0.1"
                                          placeholder="السعر"
                                          value={pkg.price}
                                          onChange={(e) => handleUpdatePackageField(pkg.id, "price", parseFloat(e.target.value) || 0)}
                                          className="w-full bg-[#070e1d] border border-[#4f4633]/25 text-white rounded-lg px-2 py-1.5 text-xs text-left font-mono focus:border-amber-400 outline-none"
                                          required
                                        />
                                      </div>

                                      {/* Name field */}
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-[#9c8f79] block">اسم حزمة الشحن *</label>
                                        <input 
                                          type="text"
                                          placeholder="مثال: 325 شدة"
                                          value={pkg.name}
                                          onChange={(e) => handleUpdatePackageField(pkg.id, "name", e.target.value)}
                                          className="w-full bg-[#070e1d] border border-[#4f4633]/25 text-white rounded-lg px-2 py-1.5 text-xs text-right focus:border-amber-400 outline-none"
                                          required
                                        />
                                      </div>
                                    </div>

                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-3 justify-end pt-2">
                            {(editingGame || formName || formImageUrl || formDescription) && (
                              <button 
                                type="button"
                                onClick={handleResetItemForm}
                                className="px-5 py-2.5 bg-[#2a303e] hover:bg-[#343b4c] text-neutral-300 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer"
                              >
                                إلغاء التعبئة
                              </button>
                            )}
                            <button 
                              type="submit"
                              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-2.5 rounded-xl cursor-pointer text-xs sm:text-sm shadow-md transition-all active:scale-95"
                            >
                              {editingGame ? "تحديث وتعديل المنتج" : "حفظ إضافة المنتج الجديد"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* All Products List Table */}
                    <div className="xl:col-span-12 lg:col-span-12 space-y-4">
                      <div className="bg-[#191f2f] rounded-2xl p-5 border border-[#4f4633]/30 shadow-md">
                        <div className="flex justify-between items-center border-b border-[#4f4633]/20 pb-3 mb-4">
                          <span className="text-xs text-[#9c8f79] font-mono font-bold">إجمالي المتوفر: {gamesList.length} منتجات</span>
                          <h3 className="font-extrabold text-base text-amber-200">المنتجات المعروضة بالمتجر حالياً</h3>
                        </div>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                          {gamesList.map(game => (
                            <div 
                              key={game.id} 
                              className="bg-[#111827]/80 rounded-xl p-3 border border-[#4f4633]/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 hover:border-amber-400/20 transition-all group"
                            >
                              <div className="flex items-center gap-2 justify-end sm:justify-start order-2 sm:order-1">
                                <button
                                  onClick={() => handleEditClick(game)}
                                  title="تعديل"
                                  className="p-2.5 bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(game.id, game.name)}
                                  title="حذف"
                                  className="p-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Game info */}
                              <div className="flex items-center gap-4 text-right shrink min-w-0 order-1 sm:order-2 w-full">
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-bold text-white text-sm sm:text-base truncate group-hover:text-amber-400 transition-colors">
                                    {game.name}
                                  </h4>
                                  <div className="flex justify-end gap-3 items-center text-xs text-[#9c8f79] mt-1">
                                    <span>السعر الأساسي: <b className="font-mono text-amber-400">{game.startingPrice}</b> {game.currency}</span>
                                    <span>•</span>
                                    <span className="bg-slate-900 border border-[#4f4633]/20 text-[10px] px-2 py-0.5 rounded text-amber-200 font-bold">
                                      {game.category}
                                    </span>
                                  </div>
                                  {game.description && (
                                    <p className="text-xs text-zinc-400 max-w-full mt-1.5 text-right whitespace-pre-wrap leading-relaxed">
                                      {game.description}
                                    </p>
                                  )}
                                  {game.packages && game.packages.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 justify-end mt-2">
                                      {game.packages.map(p => (
                                        <span 
                                          key={p.id} 
                                          className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                                            p.isPreferred 
                                              ? "bg-amber-400/10 border-amber-400 text-amber-300 font-black shadow-[0_0_8px_rgba(251,191,36,0.1)]" 
                                              : "bg-[#070e1d]/90 border-[#4f4633]/15 text-[#9c8f79]"
                                          }`}
                                        >
                                          {p.isPreferred && <Star className="w-2.5 h-2.5 fill-current text-amber-400 animate-pulse" />}
                                          <span>{p.name} ({p.price.toFixed(2)} د.أ)</span>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <img 
                                  src={game.imageUrl} 
                                  alt={game.name} 
                                  className="w-14 h-14 rounded-xl object-cover border border-[#4f4633]/20 flex-shrink-0 bg-slate-900"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </motion.div>
          )}

          {/* SCREEN 5: AuthScreen Login/Register View */}
          {activeTab === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl mx-auto"
            >
              <AuthScreen onLoginSuccess={handleLoginSuccess} availableDemoUsers={adminUsers} />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Dynamic Receipt Zoom overlay Lightbox Modal */}
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

      {/* Product deletion confirmation Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-[#191f2f] border border-rose-500/30 rounded-2xl max-w-md w-full p-6 text-right space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-2xl rounded-full" />
              
              <div className="flex items-center gap-3 justify-end text-rose-400">
                <span className="text-base font-extrabold font-headline">تأكيد حذف المنتج</span>
                <AlertCircle className="w-6 h-6 shrink-0" />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-[#dce2f7] leading-relaxed">
                  هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً من المتجر؟
                </p>
                <p className="text-sm font-black text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                  {itemToDelete.name}
                </p>
                <p className="text-xs text-[#9c8f79]">
                  ⚠️ تنبيه: هذا الإجراء لا يمكن التراجع عنه وسيتم إزالة المنتج وباقاته بشكل دائم من قاعدة البيانات.
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs sm:text-sm cursor-pointer border border-[#4f4633]/20 transition-all active:scale-95"
                >
                  إلغاء والتراجع
                </button>
                <button 
                  onClick={confirmDeleteItem}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl text-xs sm:text-sm cursor-pointer shadow-lg shadow-rose-950/20 transition-all active:scale-95"
                >
                  نعم، احذف المنتج
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player account deletion confirmation Modal */}
      <AnimatePresence>
        {userToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-[#191f2f] border border-rose-500/30 rounded-2xl max-w-md w-full p-6 text-right space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-2xl rounded-full" />
              
              <div className="flex items-center gap-3 justify-end text-rose-400">
                <span className="text-base font-extrabold font-headline">تأكيد حذف اللاعب</span>
                <AlertCircle className="w-6 h-6 shrink-0" />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-[#dce2f7] leading-relaxed">
                  هل أنت متأكد من رغبتك في حذف حساب هذا اللاعب نهائياً من الموقع؟
                </p>
                <p className="text-sm font-black text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                  {userToDelete.name}
                </p>
                <p className="text-xs text-[#9c8f79]">
                  ⚠️ تنبيه: هذا الإجراء سيقوم بحذف اللاعب نهائياً وإلغاء رصيده الحالي ولن يتمكن من تسجيل الدخول به مرة أخرى إلا بإنشاء حساب جديد.
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  onClick={() => setUserToDelete(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs sm:text-sm cursor-pointer border border-[#4f4633]/20 transition-all active:scale-95"
                >
                  إلغاء والتراجع
                </button>
                <button 
                  onClick={confirmDeleteUser}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl text-xs sm:text-sm cursor-pointer shadow-lg shadow-rose-950/20 transition-all active:scale-95"
                >
                  نعم، احذف الحساب
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* High contrast responsive Footer */}
      <footer className="bg-[#070e1d] border-t border-[#4f4633]/20 mt-12 py-8 text-xs select-none">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col md:flex-row-reverse justify-between items-center gap-6 text-center">
          
          <div className="flex gap-6 font-bold flex-wrap justify-center text-[#9c8f79]">
            <a onClick={() => showToast("اتفاقية المستخدم والشروط متاحة باللائحة.", "info")} className="hover:text-[#adc6ff] cursor-pointer transition-colors">الشروط والأحكام</a>
            <a onClick={() => showToast("من نحن: متجر فارة الأكبر لخدمات الألعاب.", "info")} className="hover:text-[#adc6ff] cursor-pointer transition-colors">من نحن</a>
            <a onClick={() => showToast("تواصل عبر Kafehazyad5@gmail.com للدعم.", "info")} className="hover:text-[#adc6ff] cursor-pointer transition-colors">الدعم الفني والشكاوى</a>
            <a onClick={() => showToast("طرق الدفع شاملة CliQ, Zain Cash, Orange Money.", "info")} className="hover:text-[#adc6ff] cursor-pointer transition-colors">طرق الدفع والتحصيل</a>
          </div>

          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-headline-md text-base sm:text-lg text-amber-400 font-extrabold shadow-glow">فارة | سوق</span>
            <span className="text-[#9c8f79]">© 2026 فارة | سوق. جميع حقوق الألعاب والملكيات محفوظة للمنصات.</span>
          </div>

        </div>
      </footer>

      {/* MOBILE LOWER NAVIGATION NAV RAIL HUD (as screenshots Bottom Nav, shown on thin mobile screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0c1322]/90 backdrop-blur-xl border-t border-[#4f4633]/30 z-40 py-2 shadow-2xl">
        <div className="flex justify-around items-center">
          
          {!isAdmin ? (
            <>
              <button 
                onClick={() => { navigateToTab("home"); handleMarkAllNotificationsRead(); }}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === "home" ? "text-amber-400" : "text-[#9c8f79]"}`}
              >
                <Gamepad2 className="w-5 h-5" />
                <span className="text-[10px] font-bold">الرئيسية</span>
              </button>

              <button 
                onClick={() => {
                  setSelectedGame(gamesList[0]);
                  navigateToTab("game-detail");
                }}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === "game-detail" ? "text-amber-400" : "text-[#9c8f79]"}`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-[10px] font-bold">المتجر</span>
              </button>

              <button 
                onClick={() => navigateToTab("wallet")}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === "wallet" ? "text-amber-400" : "text-[#9c8f79]"}`}
              >
                <Wallet className="w-5 h-5" />
                <span className="text-[10px] font-bold">المحفظة</span>
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigateToTab("admin")}
              className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === "admin" ? "text-amber-400" : "text-[#9c8f79]"}`}
            >
              <Sliders className="w-5 h-5" />
              <span className="text-[10px] font-bold">لوحة التحكم (Admin)</span>
            </button>
          )}

        </div>
      </div>

    </div>
  );
}
