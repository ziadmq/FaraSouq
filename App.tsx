/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles,
  Home,
  Gamepad2,
  CreditCard,
  Wallet,
  Phone,
  X,
  Coins
} from "lucide-react";
import { GameCategory } from "./types";

import { useAppState } from "./hooks/useAppState";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ToastContainer from "./components/common/ToastContainer";
import HomeScreen from "./screens/HomeScreen";
import GameDetailScreen from "./screens/GameDetailScreen";
import WalletScreen from "./screens/WalletScreen";
import AdminScreen from "./screens/AdminScreen";
import AuthScreen from "./components/AuthScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ZoomReceiptModal from "./components/modals/ZoomReceiptModal";
import { ProductDeleteModal, UserDeleteModal } from "./components/modals/DeleteConfirmModal";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [showSupportModal, setShowSupportModal] = React.useState(false);

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
    cmsBannerBadgeText,
    setCmsBannerBadgeText,
    cmsBannerText,
    setCmsBannerText,
    cmsBannerSubtitle,
    setCmsBannerSubtitle,
    cmsBannerButtonText,
    setCmsBannerButtonText,
    cmsBannerUrl,
    setCmsBannerUrl,
    cmsBannerImage,
    setCmsBannerImage,
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
    handleMarkAllNotificationsRead,
    handleSavePackages,
    handleAddPackage,
    handleRemovePackage,
    handleUpdatePackageField,
    handleUpdateJawakerPackage,
    confirmDeleteItem,
    handleSaveCMS,
    joPaySettings,
    setJoPaySettings,
    bannerSlides,
    handleSaveBannerSlides,
    shippingProofs,
    handleSaveShippingProofs
  } = useAppState();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#0c1322] text-[#dce2f7] flex flex-col antialiased selection:bg-amber-500 selection:text-white font-sans pb-16 md:pb-0">
      
      {/* Toast notifications portal */}
      <ToastContainer toasts={toasts} />

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
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Container Router */}
      <main className="flex-grow w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: Home Store Dashboard */}
          {activeTab === "home" && (
            <HomeScreen 
              cmsBannerImage={cmsBannerImage}
              cmsBannerBadgeText={cmsBannerBadgeText}
              cmsBannerText={cmsBannerText}
              cmsBannerSubtitle={cmsBannerSubtitle}
              cmsBannerButtonText={cmsBannerButtonText}
              cmsBannerUrl={cmsBannerUrl}
              gamesList={gamesList}
              setSelectedGame={setSelectedGame}
              navigateToTab={navigateToTab}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              showToast={showToast}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredGames={filteredGames}
              loggedUser={loggedUser}
              bannerSlides={bannerSlides}
              shippingProofs={shippingProofs}
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
              cmsBannerBadgeText={cmsBannerBadgeText}
              setCmsBannerBadgeText={setCmsBannerBadgeText}
              cmsBannerText={cmsBannerText}
              setCmsBannerText={setCmsBannerText}
              cmsBannerSubtitle={cmsBannerSubtitle}
              setCmsBannerSubtitle={setCmsBannerSubtitle}
              cmsBannerButtonText={cmsBannerButtonText}
              setCmsBannerButtonText={setCmsBannerButtonText}
              cmsBannerImage={cmsBannerImage}
              setCmsBannerImage={setCmsBannerImage}
              cmsBannerUrl={cmsBannerUrl}
              setCmsBannerUrl={setCmsBannerUrl}
              handleSaveCMS={handleSaveCMS}
              formPackages={formPackages}
              handleSavePackages={handleSavePackages}
              handleAddPackage={handleAddPackage}
              handleRemovePackage={handleRemovePackage}
              handleUpdatePackageField={handleUpdatePackageField}
              handleUpdateJawakerPackage={handleUpdateJawakerPackage}
              gamesList={gamesList}
              joPaySettings={joPaySettings}
              setJoPaySettings={setJoPaySettings}
              showToast={showToast}
              bannerSlides={bannerSlides}
              handleSaveBannerSlides={handleSaveBannerSlides}
              shippingProofs={shippingProofs}
              handleSaveShippingProofs={handleSaveShippingProofs}
            />
          )}

          {/* SCREEN 5: AuthScreen Login/Register View */}
          {activeTab === "login" && (
            <AuthScreen 
              onLoginSuccess={handleLoginSuccess} 
              availableDemoUsers={adminUsers} 
            />
          )}

          {/* SCREEN 6: User Profile Screen */}
          {activeTab === "profile" && loggedUser && (
            <ProfileScreen
              loggedUser={loggedUser}
              handleLogout={handleLogout}
              handleUpdateProfile={handleUpdateProfile}
              isAdmin={isAdmin}
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

      {/* Sidebar Navigation Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100]"
            />

            {/* Sidebar Slide-in Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-[320px] bg-[#0f1626] border-l border-slate-800 shadow-2xl z-[101] flex flex-col text-right"
            >
              {/* Header inside Sidebar */}
              <div className="p-6 border-b border-slate-800/60 flex items-center justify-between bg-[#131b2e]">
                <div className="font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent text-xl">
                  فارة | سوق
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links inside Sidebar */}
              <div className="flex-grow overflow-y-auto p-6 space-y-3">
                {[
                  {
                    label: "الرئيسية",
                    icon: Home,
                    onClick: () => {
                      setSelectedCategory(GameCategory.ALL);
                      navigateToTab("home");
                      setIsSidebarOpen(false);
                    }
                  },
                  {
                    label: "الألعاب",
                    icon: Gamepad2,
                    comingSoon: true,
                    onClick: () => {
                      setSelectedCategory(GameCategory.ALL);
                      navigateToTab("home");
                      setIsSidebarOpen(false);
                      setTimeout(() => {
                        const el = document.getElementById("games-section");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                        } else {
                          window.scrollTo({ top: 600, behavior: 'smooth' });
                        }
                      }, 100);
                    }
                  },
                  {
                    label: "ألعاب الجوال",
                    icon: Phone,
                    comingSoon: true,
                    onClick: () => {
                      setSelectedCategory(GameCategory.JAWAKER);
                      navigateToTab("home");
                      setIsSidebarOpen(false);
                    }
                  },
                  {
                    label: "بطاقات الألعاب",
                    icon: CreditCard,
                    comingSoon: true,
                    onClick: () => {
                      setSelectedCategory(GameCategory.GIFT_CARDS);
                      navigateToTab("home");
                      setIsSidebarOpen(false);
                    }
                  },
                  {
                    label: "إدارة الرصيد",
                    icon: Wallet,
                    onClick: () => {
                      if (!loggedUser) {
                        navigateToTab("login");
                      } else {
                        navigateToTab("wallet");
                      }
                      setIsSidebarOpen(false);
                    }
                  },
                  {
                    label: "طرق الدفع",
                    icon: CreditCard,
                    onClick: () => {
                      setIsSidebarOpen(false);
                      setShowPaymentModal(true);
                    }
                  },
                  {
                    label: "الدعم الفني",
                    icon: Phone,
                    onClick: () => {
                      setIsSidebarOpen(false);
                      setShowSupportModal(true);
                    }
                  }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={item.onClick}
                      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[#dce2f7] hover:text-white hover:bg-amber-500/10 hover:border-amber-500/20 border border-transparent transition-all text-right font-bold text-sm cursor-pointer group"
                    >
                      <Icon className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors animate-none" />
                      <span className="flex-1">{item.label}</span>
                      {item.comingSoon && (
                        <span className="text-[9px] font-black bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full whitespace-nowrap">قريباً</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer info inside Sidebar */}
              <div className="p-6 border-t border-slate-800/60 bg-[#131b2e] text-center text-[10px] text-slate-500 font-mono">
                جميع الحقوق محفوظة © فارة سوق {new Date().getFullYear()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Payment Methods Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <>
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150]" onClick={() => setShowPaymentModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#111827] border border-slate-800/80 rounded-3xl p-6 shadow-2xl z-[151] text-right font-sans"
            >
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-800">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-amber-400" />
                  طرق الدفع المتاحة
                </h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-[#191f2f] rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors flex items-start gap-4">
                  <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 shrink-0">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1 text-right">
                    <h4 className="font-extrabold text-white text-base">البنك العربي (Arab Bank)</h4>
                    <p className="text-xs text-slate-300 mt-1">تحويل مباشر إلى رقم الجوال:</p>
                    <p className="text-sm font-black text-blue-400 mt-1 font-mono tracking-wider">0779191371</p>
                    <p className="text-[10px] text-slate-500 mt-1">المستفيد: مؤسسة فارة (Fara Souq)</p>
                  </div>
                </div>

                <div className="p-4 bg-[#191f2f] rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors flex items-start gap-4">
                  <div className="bg-orange-500/10 p-2.5 rounded-xl border border-orange-500/20 shrink-0">
                    <CreditCard className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="flex-1 text-right">
                    <h4 className="font-extrabold text-white text-base">أورانج ماني (Orange Money)</h4>
                    <p className="text-xs text-slate-300 mt-1">محفظة أورانج ماني. اسم المستخدم:</p>
                    <p className="text-sm font-black text-orange-400 mt-1 font-mono tracking-wider">FARASOUQ</p>
                    <p className="text-[10px] text-slate-500 mt-1">المستفيد: مؤسسة فارة (Fara Souq)</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    if (loggedUser) {
                      navigateToTab("wallet");
                    } else {
                      navigateToTab("login");
                    }
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold py-3.5 rounded-2xl transition-all active:scale-[0.98] text-sm text-center shadow-lg cursor-pointer"
                >
                  اشحن رصيدك الآن
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Technical Support Modal */}
      <AnimatePresence>
        {showSupportModal && (
          <>
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150]" onClick={() => setShowSupportModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#111827] border border-slate-800/80 rounded-3xl p-6 shadow-2xl z-[151] text-right font-sans"
            >
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-800">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Phone className="w-6 h-6 text-amber-400" />
                  الدعم الفني والمساعدة
                </h3>
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-[#191f2f] rounded-2xl p-4 border border-slate-800 text-slate-300 space-y-3 leading-relaxed text-sm">
                  <p>أهلاً بك في الدعم الفني لمتجر <strong>فارة | سوق</strong>.</p>
                  <p>فريق الدعم الفني متواجد لمساعدتك في أي استفسارات تخص شحن الحسابات، طلبات الإيداع المعلقة، أو أي مشكلة تقنية تواجهك.</p>
                  <div className="pt-2 border-t border-slate-800 flex flex-col gap-1 text-xs text-slate-400 font-medium">
                    <span>⏰ أوقات العمل: يومياً من 10:00 صباحاً وحتى 12:00 منتصف الليل.</span>
                    <span>⚡ سرعة الاستجابة: خلال دقائق معدودة.</span>
                  </div>
                </div>

                <a
                  href="https://wa.me/962790000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-2xl transition-all active:scale-[0.98] text-sm text-center shadow-lg cursor-pointer"
                >
                  <span>تواصل معنا عبر واتساب</span>
                </a>
                
                <a
                  href="mailto:support@farasouq.com"
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-extrabold py-3.5 rounded-2xl transition-all active:scale-[0.98] text-sm text-center border border-slate-700 cursor-pointer"
                >
                  <span>راسلنا عبر البريد الإلكتروني</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
