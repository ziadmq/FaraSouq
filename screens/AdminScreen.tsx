/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  Wallet, 
  Users, 
  Gamepad2, 
  Settings, 
  LogOut, 
  Sliders 
} from "lucide-react";
import { Game, GameCategory, GamePackage, Order, User, BannerSlide, ShippingProof } from "../types";
import AnalyticsTab from "../components/admin/AnalyticsTab";
import DepositsTab from "../components/admin/DepositsTab";
import UsersTab from "../components/admin/UsersTab";
import CMSSettingsTab from "../components/admin/CMSSettingsTab";
import ProductsTab from "../components/admin/ProductsTab";

interface AdminScreenProps {
  activeAdminTab: "analytics" | "deposits" | "users" | "settings" | "items";
  setActiveAdminTab: (tab: "analytics" | "deposits" | "users" | "settings" | "items") => void;
  handleLogout: () => void;
  
  // Analytics
  totalSalesToDisplay: number;
  pendingDepositsToDisplay: number;
  totalMembersToDisplay: number;
  totalInstantDepositsToDisplay: number;
  userOrders: Order[];
  handleAdminAcceptDeposit: (orderId: string, amount: number) => void;
  handleAdminRejectDeposit: (orderId: string) => void;
  setZoomReceiptUrl: (url: string | null) => void;

  // Users
  adminUsers: User[];
  handleToggleUserStatus: (userId: string) => void;
  handleDeleteUser: (userId: string, userName: string) => void;

  // CMS
  cmsBannerBadgeText: string;
  setCmsBannerBadgeText: (text: string) => void;
  cmsBannerText: string;
  setCmsBannerText: (text: string) => void;
  cmsBannerSubtitle: string;
  setCmsBannerSubtitle: (text: string) => void;
  cmsBannerButtonText: string;
  setCmsBannerButtonText: (text: string) => void;
  cmsBannerImage: string;
  setCmsBannerImage: (img: string) => void;
  cmsBannerUrl: string;
  setCmsBannerUrl: (url: string) => void;
  joPaySettings: any;
  setJoPaySettings: (settings: any) => void;
  handleSaveCMS: (e: React.FormEvent) => void;

  // Products
  formPackages: GamePackage[];
  handleSavePackages: (e: React.FormEvent) => void;
  handleAddPackage: () => void;
  handleRemovePackage: (id: string) => void;
  handleUpdatePackageField: (id: string, field: keyof GamePackage, value: any) => void;
  handleUpdateJawakerPackage: (oldId: string, newId: string, newName: string) => void;
  gamesList: Game[];
  showToast: (text: string, type: "success" | "error" | "info") => void;
  bannerSlides: BannerSlide[];
  handleSaveBannerSlides: (slides: BannerSlide[]) => void;
  shippingProofs: ShippingProof[];
  handleSaveShippingProofs: (proofs: ShippingProof[]) => void;
  handleUpdateGameDetails: (
    gameId: string,
    name: string,
    description: string,
    imageUrl: string,
    imageFit?: "cover" | "contain",
    imagePosition?: string
  ) => void;
}

export default function AdminScreen({
  activeAdminTab,
  setActiveAdminTab,
  handleLogout,
  totalSalesToDisplay,
  pendingDepositsToDisplay,
  totalMembersToDisplay,
  totalInstantDepositsToDisplay,
  userOrders,
  handleAdminAcceptDeposit,
  handleAdminRejectDeposit,
  setZoomReceiptUrl,
  adminUsers,
  handleToggleUserStatus,
  handleDeleteUser,
  cmsBannerBadgeText,
  setCmsBannerBadgeText,
  cmsBannerText,
  setCmsBannerText,
  cmsBannerSubtitle,
  setCmsBannerSubtitle,
  cmsBannerButtonText,
  setCmsBannerButtonText,
  cmsBannerImage,
  setCmsBannerImage,
  cmsBannerUrl,
  setCmsBannerUrl,
  joPaySettings,
  setJoPaySettings,
  handleSaveCMS,
  showToast,
  formPackages,
  handleSavePackages,
  handleAddPackage,
  handleRemovePackage,
  handleUpdatePackageField,
  handleUpdateJawakerPackage,
  gamesList,
  bannerSlides,
  handleSaveBannerSlides,
  shippingProofs,
  handleSaveShippingProofs,
  handleUpdateGameDetails
}: AdminScreenProps) {
  return (
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
          <div className="flex items-center gap-3 justify-start mb-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-bold text-base text-amber-400">لوحة تحكم الأدمن</h2>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {[
              { id: "analytics", label: "الرئيسية", icon: TrendingUp },
              { id: "deposits", label: "الطلبات المعلقة", icon: Wallet },
              { id: "users", label: "المستخدمين", icon: Users },
              { id: "items", label: "المنتجات", icon: Gamepad2 },
              { id: "settings", label: "إعدادات المتجر", icon: Settings }
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
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Right Column Content Areas based on selected inner administrative tabs */}
      <div className="lg:col-span-9 space-y-6">
        {activeAdminTab === "analytics" && (
          <AnalyticsTab
            totalSalesToDisplay={totalSalesToDisplay}
            pendingDepositsToDisplay={pendingDepositsToDisplay}
            totalMembersToDisplay={totalMembersToDisplay}
            totalInstantDepositsToDisplay={totalInstantDepositsToDisplay}
            userOrders={userOrders}
            handleAdminAcceptDeposit={handleAdminAcceptDeposit}
            handleAdminRejectDeposit={handleAdminRejectDeposit}
            setZoomReceiptUrl={setZoomReceiptUrl}
          />
        )}

        {activeAdminTab === "deposits" && (
          <DepositsTab
            userOrders={userOrders}
            handleAdminAcceptDeposit={handleAdminAcceptDeposit}
            handleAdminRejectDeposit={handleAdminRejectDeposit}
            setZoomReceiptUrl={setZoomReceiptUrl}
          />
        )}

        {activeAdminTab === "users" && (
          <UsersTab
            adminUsers={adminUsers}
            handleToggleUserStatus={handleToggleUserStatus}
            handleDeleteUser={handleDeleteUser}
            userOrders={userOrders}
          />
        )}

        {activeAdminTab === "items" && (
          <ProductsTab
            formPackages={formPackages}
            handleSavePackages={handleSavePackages}
            handleAddPackage={handleAddPackage}
            handleRemovePackage={handleRemovePackage}
            handleUpdatePackageField={handleUpdatePackageField}
            handleUpdateJawakerPackage={handleUpdateJawakerPackage}
            gamesList={gamesList}
            handleUpdateGameDetails={handleUpdateGameDetails}
          />
        )}

        {activeAdminTab === "settings" && (
          <CMSSettingsTab
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
            joPaySettings={joPaySettings}
            setJoPaySettings={setJoPaySettings}
            handleSaveCMS={handleSaveCMS}
            showToast={showToast}
            bannerSlides={bannerSlides}
            handleSaveBannerSlides={handleSaveBannerSlides}
            shippingProofs={shippingProofs}
            handleSaveShippingProofs={handleSaveShippingProofs}
          />
        )}
      </div>

    </motion.div>
  );
}
