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
  ZAIN_CASH = "Zain Cash",
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
}

export interface GamePackage {
  id: string;
  name: string;
  price: number;
  bonusPercent?: number;
  badge?: string;
  isPreferred?: boolean;
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
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "success" | "warning" | "info";
  isRead: boolean;
}
