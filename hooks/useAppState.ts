/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, collection, onSnapshot, query, where, deleteDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, db, functions, handleFirestoreError, OperationType } from "../lib/firebase";
import { GameCategory, OrderStatus, PaymentMethod, Game, GamePackage, Order, User, AppNotification, JoPaySettings } from "../types";
import { GAMES_DATA, INITIAL_ORDERS, INITIAL_USERS, INITIAL_NOTIFICATIONS } from "../data";

export function useAppState() {
  // Navigation tabs: 'home' | 'game-detail' | 'wallet' | 'admin' | 'login'
  const [activeTab, setActiveTab] = useState<"home" | "game-detail" | "wallet" | "admin" | "login">("home");
  
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

  // CMS & Banner States
  const [cmsBannerBadgeText, setCmsBannerBadgeText] = useState("");
  const [cmsBannerText, setCmsBannerText] = useState("");
  const [cmsBannerSubtitle, setCmsBannerSubtitle] = useState("");
  const [cmsBannerButtonText, setCmsBannerButtonText] = useState("");
  const [cmsBannerUrl, setCmsBannerUrl] = useState("");
  const [cmsBannerImage, setCmsBannerImage] = useState("");

  // Game/Package States
  const [playerId, setPlayerId] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<GamePackage | null>(null);
  const [playerIdError, setPlayerIdError] = useState("");
  const [showIdHelp, setShowIdHelp] = useState(false);

  // Deposit/Wallet States
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [depositAmount, setDepositAmount] = useState("");
  const [copiedText, setCopiedText] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptFileName, setReceiptFileName] = useState("");
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);

  // UI/Admin States
  const [toasts, setToasts] = useState<any[]>([]);
  const [activeAdminTab, setActiveAdminTab] = useState("dashboard");
  const [zoomReceiptUrl, setZoomReceiptUrl] = useState("");
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Admin Dashboard Stats
  const totalSalesToDisplay = 0;
  const pendingDepositsToDisplay = 0;
  const totalMembersToDisplay = 0;
  const totalInstantDepositsToDisplay = 0;
  const isAdmin = loggedUser?.role === "admin";
  const filteredGames = gamesList;

  // Settings
  const [joPaySettings, setJoPaySettings] = useState<JoPaySettings | null>(null);

  // Handlers
  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {};
  const navigateToTab = (tab: any) => setActiveTab(tab);
  const handleLoginSuccess = (user: User) => {
    setLoggedUser(user);
    setActiveTab("home");
  };
  const handleLogout = () => {
    setLoggedUser(null);
    setActiveTab("home");
  };
  const handleCopyText = (text: string) => {};
  const handleReceiptUpload = (e: any) => {};
  const handleDepositSubmit = () => {};
  const handlePurchasePackage = () => {};
  const handleAdminAcceptDeposit = () => {};
  const handleAdminRejectDeposit = () => {};
  const handleToggleUserStatus = () => {};
  const handleDeleteUser = () => {};
  const confirmDeleteUser = () => {};
  const handleNewsletterSubmit = (e: any) => {};
  const handleSaveCMS = () => {};
  const handleMarkAllNotificationsRead = () => {};
  const saveGamesList = () => {};
  const handleSavePackages = () => {};
  const handleAddPackage = () => {};
  const handleRemovePackage = () => {};
  const handleUpdatePackageField = () => {};
  const handleUpdateJawakerPackage = () => {};
  const confirmDeleteItem = () => {};

  return {
    activeTab, setActiveTab,
    gamesList, setGamesList,
    selectedGame, setSelectedGame,
    formPackages, setFormPackages,
    adminUsers, setAdminUsers,
    loggedUser, setLoggedUser,
    walletBalance, setWalletBalance,
    loyaltyXp, setLoyaltyXp,
    userOrders, setUserOrders,
    notifications, setNotifications,
    showNotificationDropdown, setShowNotificationDropdown,
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    cmsBannerBadgeText, setCmsBannerBadgeText,
    cmsBannerText, setCmsBannerText,
    cmsBannerSubtitle, setCmsBannerSubtitle,
    cmsBannerButtonText, setCmsBannerButtonText,
    cmsBannerUrl, setCmsBannerUrl,
    cmsBannerImage, setCmsBannerImage,
    playerId, setPlayerId,
    selectedPackage, setSelectedPackage,
    playerIdError, setPlayerIdError,
    showIdHelp, setShowIdHelp,
    paymentMethod, setPaymentMethod,
    depositAmount, setDepositAmount,
    copiedText, setCopiedText,
    receiptFile, setReceiptFile,
    receiptFileName, setReceiptFileName,
    receiptPreviewUrl, setReceiptPreviewUrl,
    isDepositing, setIsDepositing,
    toasts, setToasts,
    activeAdminTab, setActiveAdminTab,
    zoomReceiptUrl, setZoomReceiptUrl,
    itemToDelete, setItemToDelete,
    userToDelete, setUserToDelete,
    newsletterEmail, setNewsletterEmail,
    newsletterSubscribed, setNewsletterSubscribed,
    totalSalesToDisplay, pendingDepositsToDisplay,
    totalMembersToDisplay, totalInstantDepositsToDisplay,
    isAdmin, filteredGames, showToast, navigateToTab,
    handleLoginSuccess, handleLogout, handleCopyText,
    handleReceiptUpload, handleDepositSubmit, handlePurchasePackage,
    handleAdminAcceptDeposit, handleAdminRejectDeposit,
    handleToggleUserStatus, handleDeleteUser, confirmDeleteUser,
    handleNewsletterSubmit, handleSaveCMS, handleMarkAllNotificationsRead,
    saveGamesList, handleSavePackages, handleAddPackage, handleRemovePackage,
    handleUpdatePackageField, handleUpdateJawakerPackage, confirmDeleteItem,
    joPaySettings, setJoPaySettings
  };
}
