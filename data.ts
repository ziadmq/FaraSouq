import { Game, GameCategory, GamePackage, Order, OrderStatus, User, AppNotification } from "./types";

export const GAMES_DATA: Game[] = [
  {
    id: "jawaker",
    name: "توكنز جواكر",
    category: GameCategory.JAWAKER,
    imageUrl: "https://images.unsplash.com/photo-1541278107931-e006523892df?q=80&w=600&auto=format&fit=crop",
    startingPrice: 1.99,
    rating: 4.8,
    ratingCount: "12.4k",
    isPopular: true,
    currency: "د.أ",
    description: "اشحن حسابك في لعبة جواكر فوراً وبكل سهولة. احصل على التوكنز خلال ثوانٍ واستمتع باللعب والمنافسة دون انقطاع مع أصدقائك. خدماتنا تضمن لك سرعة الإنجاز والموثوقية التامة.",
    packages: [
      { id: "jw_50k", name: "50,000 توكنز", price: 1.99, badge: "أساسي" },
      { id: "jw_100k", name: "100,000 توكنز + بونص", price: 3.99, bonusPercent: 5, badge: "شائع", isPreferred: true },
      { id: "jw_250k", name: "250,000 توكنز + بونص", price: 8.99, bonusPercent: 10 },
      { id: "jw_750k", name: "750,000 توكنز", price: 24.99, bonusPercent: 15, badge: "توفير فائق" },
      { id: "jw_1.5m", name: "1,500,000 توكنز", price: 47.99, bonusPercent: 20 },
      { id: "jw_3m", name: "3,000,000 توكنز", price: 89.99, bonusPercent: 25, badge: "أفضل قيمة" }
    ]
  }
];

export const SIMILAR_GAMES: any[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_USERS: User[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
