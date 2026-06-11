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

  // States for CMS & alert configurations (loaded into memory)
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
    navigateToTab,
    handleLoginSuccess,
    handleLogout,
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
  };
}
