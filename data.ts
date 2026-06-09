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

export const SIMILAR_GAMES = [
  {
    id: "cod_mobile",
    name: "نداء الواجب: موبايل (Call of Duty)",
    sub: "شحن عملات CP",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEbpuGr-lbbOwSE_rV9jo6AJsoSoXVbeOoYW7W0X-xidtKKcN71PNPlWVHQLK_W_g6ZiTGVgP60WZypKEFhwiIaSm9g4q1fZyR9IQSh48VJZA2V3pj0DczBIQ5m0fyO--8sKxpO1zJx8oYWhivrEdBJ_q8rSR_3rir123YA8s45xnwwTxMergCFuGfF91bzIupkEHtp0vgIo650vPMACs905ZKFDs6HvBwG-oPcBJnpwGE4QFV9nHWNUK4w9JNHVi8Qhxe-juVNVk"
  },
  {
    id: "pubg_alt",
    name: "ببجي موبايل",
    sub: "شحن شدات UC",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcg6UfZ27S2isUWKfwqAz3KrJXZXqCyJtbNzE_qsh7fbC_8afGt7Sl0_EbLMqSkxk7UhaP4Qwktp-je2PZobkPQuDeUY7WUMiyken4a5rY_MEhAvgproZB40LzpV2g8n3UC0JHuk2l33LtjVQNoufEY28vFX95H19V73FHFaB8sPtkhD3wv5qNlP7N7H7MvJVAA0gEK03Q8k5K-blGymbXKdVUcaj-k8QGKGRxJ5985MZQXY2SkX5OmmGaashv5g2pLa8t0J8fQ5E"
  },
  {
    id: "valorant_alt",
    name: "فالورانت",
    sub: "نقاط VP",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQSKJH25sd7zJRHWlr0SVhvn-G_RhxszzgC0CfTMjtQf0K7bxSKuEiPFaAvQWgT1dg1vPMm5DOSVUkUGDNHKrp3BFrD4ppZlD_0H7XTrDE1_TuO96MFiWnhGVV4tfZ8uJf_LNb1Syra-reuDjF-BV2CCDFvqu9r1B9tSZ-aqzvSJUwqC-IJG-w4PFW3o6pcmrRfTA5ewYt-wY-R_fbBI5mQ3s7AdSh9vqPGiGuZ72ksrmWPIIWefMd8W_ipITplbVZ031oq8R-29Q"
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "FA-88210",
    product: "سماعة Razer Basilisk V3 Pro",
    date: "24 مايو 2024",
    price: 155.00,
    currency: "JOD",
    status: OrderStatus.COMPLETED,
    user: "خالد العتيبي",
    paymentMethod: "مصرف الراجحي",
    receiptUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDt_Ia8NFL2910LQeWD6l1aebyCE2kukULD1velcJLQl8uxf8BNG6bmT9RCWyjQ5XYBDD81Gf5WmECKJKNtb3_tO1LjPRHqQpYcWPeXnT2kjNAv7PPqQBCLqXXsZOL0gpfWkAIGwUaZk8FsriyFuKdvZUIYbzgtrlM__6Ey1GK8IQio_TjAdVifw5ZDFuLswkEjzGafYxCFsDtnJq_Uyif092IF3JVA5I0ir-K6ZarVDHB8ky6rr3A7GyYvY7ttzh4jpMOkr6RgUFo",
    timestamp: 1716562800000
  },
  {
    id: "FA-88195",
    product: "كيبورد Corsair K70 RGB TKL",
    date: "20 مايو 2024",
    price: 120.00,
    currency: "JOD",
    status: OrderStatus.PROCESSING,
    user: "سارة الغامدي",
    paymentMethod: "STC Pay",
    receiptUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBN1E5xfyzX-4AgQIwhCHLnWIDaVBIHUCcBkXt6ClyYM2Cxvgmdx94m3tw9dyplDUzHcp2YA_3pbi4SWiSldTcqgY9R51PP5YyGjjqxtUQlSORDg8wWQKzsAlUSpJA6ylkuFnunHysEg-9H35LFgv1MziuQLIaI_F8p_-NFAE-QgEI86FM5eO1MIf-4Hv0jYX6flVwgoRgIB3gRAo7N4QzceFaPDEoKmqg_GHJpyZcCRP71RVWP9p8GLhE3y-kM2qjxugy1nEuM8PA",
    timestamp: 1716217200000
  },
  {
    id: "FA-88002",
    product: "تعبئة رصيد المحفظة",
    date: "18 مايو 2024",
    price: 50.00,
    currency: "JOD",
    status: OrderStatus.PENDING,
    user: "محمد الأحمد",
    paymentMethod: "Zain Cash",
    receiptUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDt_Ia8NFL2910LQeWD6l1aebyCE2kukULD1velcJLQl8uxf8BNG6bmT9RCWyjQ5XYBDD81Gf5WmECKJKNtb3_tO1LjPRHqQpYcWPeXnT2kjNAv7PPqQBCLqXXsZOL0gpfWkAIGwUaZk8FsriyFuKdvZUIYbzgtrlM__6Ey1GK8IQio_TjAdVifw5ZDFuLswkEjzGafYxCFsDtnJq_Uyif092IF3JVA5I0ir-K6ZarVDHB8ky6rr3A7GyYvY7ttzh4jpMOkr6RgUFo",
    timestamp: 1716044400000
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: "usr_1",
    name: "محمد الأحمد",
    avatarLetter: "محمد",
    joinDate: "2024/03/15",
    balance: 450,
    status: "نشط"
  },
  {
    id: "usr_2",
    name: "فهد جاسم",
    avatarLetter: "فهد",
    joinDate: "2024/01/10",
    balance: 0,
    status: "محظور"
  },
  {
    id: "usr_3",
    name: "خالد العتيبي",
    avatarLetter: "خالد",
    joinDate: "2024/02/20",
    balance: 1450,
    status: "نشط"
  },
  {
    id: "usr_4",
    name: "سارة الغامدي",
    avatarLetter: "سارة",
    joinDate: "2024/04/05",
    balance: 120,
    status: "نشط"
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "not_1",
    title: "تم قبول طلب الشحن",
    description: "تمت الموافقة على تحويل مبلغ 500 د.أ بنجاح وإيداعه في محفظتك.",
    time: "منذ 5 دقائق",
    type: "success",
    isRead: false
  },
  {
    id: "not_2",
    title: "مكافأة Loyalty XP",
    description: "لقد ارتفعت في نظام المكافآت الجديد! يتبقى لك 1500 XP للمستوى الذهبي.",
    time: "منذ ساعتين",
    type: "info",
    isRead: false
  },
  {
    id: "not_3",
    title: "تحديثات الخصومات",
    description: "خصم 20% رصيد إضافي متاح الآن على شدات PUBG MOBILE لفترة محدودة.",
    time: "منذ يوم",
    type: "info",
    isRead: true
  }
];
