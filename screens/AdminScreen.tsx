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
import { Game, GameCategory, GamePackage, Order, User } from "../types";
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
  cmsBannerText: string;
  setCmsBannerText: (text: string) => void;
  cmsBannerImage: string;
  setCmsBannerImage: (img: string) => void;
  cmsBannerUrl: string;
  setCmsBannerUrl: (url: string) => void;
  cmsPopupText: string;
  setCmsPopupText: (text: string) => void;
  handleSaveCMS: (e: React.FormEvent) => void;

  // Products
  editingGame: Game | null;
  formName: string;
  setFormName: (name: string) => void;
  formCategory: GameCategory;
  setFormCategory: (category: GameCategory) => void;
  formImageUrl: string;
  setFormImageUrl: (url: string) => void;
  formDescription: string;
  setFormDescription: (desc: string) => void;
  formStartingPrice: number;
  setFormStartingPrice: (price: number) => void;
  formPackages: GamePackage[];
  handleSaveItem: (e: React.FormEvent) => void;
  handleResetItemForm: () => void;
  handleAddPackage: () => void;
  handleRemovePackage: (id: string) => void;
  handleUpdatePackageField: (id: string, field: keyof GamePackage, value: any) => void;
  gamesList: Game[];
  handleEditClick: (game: Game) => void;
  handleDeleteItem: (id: string, name: string) => void;
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
  cmsBannerText,
  setCmsBannerText,
  cmsBannerImage,
  setCmsBannerImage,
  cmsBannerUrl,
  setCmsBannerUrl,
  cmsPopupText,
  setCmsPopupText,
  handleSaveCMS,
  editingGame,
  formName,
  setFormName,
  formCategory,
  setFormCategory,
  formImageUrl,
  setFormImageUrl,
  formDescription,
  setFormDescription,
  formStartingPrice,
  setFormStartingPrice,
  formPackages,
  handleSaveItem,
  handleResetItemForm,
  handleAddPackage,
  handleRemovePackage,
  handleUpdatePackageField,
  gamesList,
  handleEditClick,
  handleDeleteItem
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
          />
        )}

        {activeAdminTab === "items" && (
          <ProductsTab
            editingGame={editingGame}
            formName={formName}
            setFormName={setFormName}
            formCategory={formCategory}
            setFormCategory={setFormCategory}
            formImageUrl={formImageUrl}
            setFormImageUrl={setFormImageUrl}
            formDescription={formDescription}
            setFormDescription={setFormDescription}
            formStartingPrice={formStartingPrice}
            setFormStartingPrice={setFormStartingPrice}
            formPackages={formPackages}
            handleSaveItem={handleSaveItem}
            handleResetItemForm={handleResetItemForm}
            handleAddPackage={handleAddPackage}
            handleRemovePackage={handleRemovePackage}
            handleUpdatePackageField={handleUpdatePackageField}
            gamesList={gamesList}
            handleEditClick={handleEditClick}
            handleDeleteItem={handleDeleteItem}
          />
        )}

        {activeAdminTab === "settings" && (
          <CMSSettingsTab
            cmsBannerText={cmsBannerText}
            setCmsBannerText={setCmsBannerText}
            cmsBannerImage={cmsBannerImage}
            setCmsBannerImage={setCmsBannerImage}
            cmsBannerUrl={cmsBannerUrl}
            setCmsBannerUrl={setCmsBannerUrl}
            cmsPopupText={cmsPopupText}
            setCmsPopupText={setCmsPopupText}
            handleSaveCMS={handleSaveCMS}
          />
        )}
      </div>

    </motion.div>
  );
}
