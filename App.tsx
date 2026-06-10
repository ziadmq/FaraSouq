/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

import { useAppState } from "./hooks/useAppState";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ToastContainer from "./components/common/ToastContainer";
import HomeScreen from "./screens/HomeScreen";
import GameDetailScreen from "./screens/GameDetailScreen";
import WalletScreen from "./screens/WalletScreen";
import AdminScreen from "./screens/AdminScreen";
import AuthScreen from "./components/AuthScreen";
import ZoomReceiptModal from "./components/modals/ZoomReceiptModal";
import { ProductDeleteModal, UserDeleteModal } from "./components/modals/DeleteConfirmModal";

export default function App() {
  const {
    activeTab,
    setActiveTab,
    gamesList,
    selectedGame,
    setSelectedGame,
    formPackages,
    adminUsers,
    loggedUser,
    walletBalance,
    loyaltyXp,
    userOrders,
    notifications,
    showNotificationDropdown,
    setShowNotificationDropdown,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    cmsBannerText,
    cmsBannerUrl,
    cmsBannerImage,
    cmsPopupText,
    setCmsBannerText,
    setCmsBannerImage,
    setCmsBannerUrl,
    setCmsPopupText,
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
    receiptFileName,
    isDepositing,
    toasts,
    activeAdminTab,
    setActiveAdminTab,
    zoomReceiptUrl,
    setZoomReceiptUrl,
    itemToDelete,
    setItemToDelete,
    userToDelete,
    setUserToDelete,
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
    handleMarkAllNotificationsRead,
    handleSavePackages,
    handleAddPackage,
    handleRemovePackage,
    handleUpdatePackageField,
    handleUpdateJawakerPackage,
    confirmDeleteItem,
    handleSaveCMS
  } = useAppState();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#0c1322] text-[#dce2f7] flex flex-col antialiased selection:bg-emerald-500 selection:text-white font-sans pb-16 md:pb-0">
      
      {/* Toast notifications portal */}
      <ToastContainer toasts={toasts} />

      {/* Dynamic Popups based on Admin Settings */}
      {cmsPopupText && (
        <div className="bg-emerald-400 text-slate-950 text-xs sm:text-sm py-1.5 px-4 font-bold text-center relative flex justify-center items-center gap-2">
          <Sparkles className="w-4 h-4 animate-bounce" />
          <span>{cmsPopupText}</span>
        </div>
      )}

      {/* Top Header Navigation Bar */}
      <Header
        activeTab={activeTab}
        isAdmin={isAdmin}
        loggedUser={loggedUser}
        walletBalance={walletBalance}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        unreadCount={unreadCount}
        notifications={notifications}
        showNotificationDropdown={showNotificationDropdown}
        setShowNotificationDropdown={setShowNotificationDropdown}
        navigateToTab={navigateToTab}
        handleLogout={handleLogout}
        handleMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        setSelectedGame={setSelectedGame}
        gamesList={gamesList}
      />

      {/* Main Container Router */}
      <main className="flex-grow w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: Home Store Dashboard */}
          {activeTab === "home" && (
            <HomeScreen
              cmsBannerImage={cmsBannerImage}
              cmsBannerText={cmsBannerText}
              gamesList={gamesList}
              setSelectedGame={setSelectedGame}
              navigateToTab={navigateToTab}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              showToast={showToast}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredGames={filteredGames}
            />
          )}

          {/* SCREEN 2: Game Selector & Package Selection View */}
          {activeTab === "game-detail" && (
            <GameDetailScreen
              gamesList={gamesList}
              selectedGame={selectedGame}
              setSelectedGame={setSelectedGame}
              loggedUser={loggedUser}
              walletBalance={walletBalance}
              navigateToTab={navigateToTab}
              setActiveTab={setActiveTab}
              playerId={playerId}
              setPlayerId={setPlayerId}
              selectedPackage={selectedPackage}
              setSelectedPackage={setSelectedPackage}
              playerIdError={playerIdError}
              setPlayerIdError={setPlayerIdError}
              showIdHelp={showIdHelp}
              setShowIdHelp={setShowIdHelp}
              handlePurchasePackage={handlePurchasePackage}
            />
          )}

          {/* SCREEN 3: Wallet Funds deposit Request View */}
          {activeTab === "wallet" && (
            <WalletScreen
              walletBalance={walletBalance}
              depositAmount={depositAmount}
              setDepositAmount={setDepositAmount}
              handleDepositSubmit={handleDepositSubmit}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              copiedText={copiedText}
              handleCopyText={handleCopyText}
              receiptFileName={receiptFileName}
              handleReceiptUpload={handleReceiptUpload}
              isDepositing={isDepositing}
              userOrders={userOrders}
            />
          )}

          {/* SCREEN 4: Admin CMS Dashboard Management Control Panel */}
          {activeTab === "admin" && isAdmin && (
            <AdminScreen
              activeAdminTab={activeAdminTab}
              setActiveAdminTab={setActiveAdminTab}
              handleLogout={handleLogout}
              totalSalesToDisplay={totalSalesToDisplay}
              pendingDepositsToDisplay={pendingDepositsToDisplay}
              totalMembersToDisplay={totalMembersToDisplay}
              totalInstantDepositsToDisplay={totalInstantDepositsToDisplay}
              userOrders={userOrders}
              handleAdminAcceptDeposit={handleAdminAcceptDeposit}
              handleAdminRejectDeposit={handleAdminRejectDeposit}
              setZoomReceiptUrl={setZoomReceiptUrl}
              adminUsers={adminUsers}
              handleToggleUserStatus={handleToggleUserStatus}
              handleDeleteUser={handleDeleteUser}
              cmsBannerText={cmsBannerText}
              setCmsBannerText={setCmsBannerText}
              cmsBannerImage={cmsBannerImage}
              setCmsBannerImage={setCmsBannerImage}
              cmsBannerUrl={cmsBannerUrl}
              setCmsBannerUrl={setCmsBannerUrl}
              cmsPopupText={cmsPopupText}
              setCmsPopupText={setCmsPopupText}
              handleSaveCMS={handleSaveCMS}
              formPackages={formPackages}
              handleSavePackages={handleSavePackages}
              handleAddPackage={handleAddPackage}
              handleRemovePackage={handleRemovePackage}
              handleUpdatePackageField={handleUpdatePackageField}
              handleUpdateJawakerPackage={handleUpdateJawakerPackage}
              gamesList={gamesList}
            />
          )}

          {/* SCREEN 5: AuthScreen Login/Register View */}
          {activeTab === "login" && (
            <AuthScreen 
              onLoginSuccess={handleLoginSuccess} 
              availableDemoUsers={adminUsers} 
            />
          )}

        </AnimatePresence>
      </main>

      {/* Footer & Mobile HUD */}
      <Footer
        isAdmin={isAdmin}
        activeTab={activeTab}
        gamesList={gamesList}
        navigateToTab={navigateToTab}
        showToast={showToast}
        handleMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        setSelectedGame={setSelectedGame}
      />

      {/* Modals Lightboxes */}
      <ZoomReceiptModal 
        zoomReceiptUrl={zoomReceiptUrl} 
        setZoomReceiptUrl={setZoomReceiptUrl} 
      />

      <ProductDeleteModal
        itemToDelete={itemToDelete}
        setItemToDelete={setItemToDelete}
        confirmDeleteItem={confirmDeleteItem}
      />

      <UserDeleteModal
        userToDelete={userToDelete}
        setUserToDelete={setUserToDelete}
        confirmDeleteUser={confirmDeleteUser}
      />

    </div>
  );
}
