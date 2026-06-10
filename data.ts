import { Game, GameCategory, GamePackage, Order, OrderStatus, User, AppNotification } from "./types";

export const GAMES_DATA: Game[] = [
  {
    id: "jawaker",
    name: "توكنز جواكر (Jawaker Tokens)",
    category: GameCategory.JAWAKER,
    imageUrl: "https://play-lh.googleusercontent.com/fS6e5Xh-YfJq4QpWwS90VMy5X437ZOfwP1uXWlgf6yYyGvv6zN0P-k_CpH0xL-o_H-g=w256-h256",
    startingPrice: 1.99,
    rating: 4.8,
    ratingCount: "12.4k",
    isPopular: true,
    currency: "د.أ",
    description: "اشحن توكنز لعبة جواكر بشكل فوري وبأفضل الأسعار في الأردن والوطن العربي. أدخل رقم الـ ID الخاص بك في لعبة Jawaker واحصل على توكنز مباشرة في حسابك خلال ثوانٍ معدودة!",
    packages: [
      { id: "jw_50k", name: "50,000 توكنز (Tokens)", price: 1.99, badge: "أساسي" },
      { id: "jw_100k", name: "100,000 توكنز + بونص", price: 3.99, bonusPercent: 5, badge: "شائع", isPreferred: true },
      { id: "jw_250k", name: "250,000 توكنز + بونص", price: 8.99, bonusPercent: 10 },
      { id: "jw_750k", name: "750,000 توكنز (Tokens)", price: 24.99, bonusPercent: 15, badge: "توفير فائق" },
      { id: "jw_1.5m", name: "1,500,000 توكنز (Tokens)", price: 47.99, bonusPercent: 20 },
      { id: "jw_3m", name: "3,000,000 توكنز (Tokens)", price: 89.99, bonusPercent: 25, badge: "أفضل قيمة" }
    ]
  }
];

export const SIMILAR_GAMES: any[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_USERS: User[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
