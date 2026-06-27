/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum GameCategory {
  BATTLE_ROYALE = "Battle Royale",
  GIFT_CARDS = "Gift Cards",
  MOBA = "MOBA",
  JAWAKER = "جواكر",
  ALL = "الكل"
}

export enum OrderStatus {
  COMPLETED = "مكتمل",
  PROCESSING = "قيد المعالجة",
  PENDING = "قيد الانتظار",
  REJECTED = "مرفوض"
}

export enum PaymentMethod {
  CLIQ = "CliQ",
  ARAB_BANK = "البنك العربي",
  ORANGE_MONEY = "Orange Money"
}

export interface Game {
  id: string;
  name: string;
  category: GameCategory;
  imageUrl: string;
  startingPrice: number;
  rating: number;
  ratingCount: string;
  isPopular?: boolean;
  isComingSoon?: boolean;
  currency: string;
  packages: GamePackage[];
  description?: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
}

export interface GamePackage {
  id: string;
  name: string;
  price: number;
  bonusPercent?: number;
  badge?: string;
  isPreferred?: boolean;
  imageUrl?: string;
  imageFit?: "cover" | "contain";
  imageBg?: string;
}

export interface Order {
  id: string;
  product: string;
  date: string;
  price: number;
  currency: string;
  status: OrderStatus;
  user: string;
  paymentMethod?: PaymentMethod | string;
  receiptUrl?: string;
  playerId?: string;
  userId?: string;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  avatarLetter: string;
  joinDate: string;
  balance: number;
  status: "نشط" | "محظور";
  imageUrl?: string;
  email?: string;
  role?: "admin" | "user";
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "success" | "warning" | "info";
  isRead: boolean;
}

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export interface JoPaySettings {
  token: string;
  quantityMap: Record<string, number>;
}

export interface BannerSlide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  badgeText: string;
  buttonText: string;
  buttonUrl: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
}

export interface ShippingProof {
  id: string;
  imageUrl: string;
  caption: string;
  date: string;
}
