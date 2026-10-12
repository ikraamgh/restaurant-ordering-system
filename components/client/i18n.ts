import type { DishTag, Moment } from '@/lib/types'

export type Lang = 'fr' | 'en' | 'ar'

type Dict = {
  welcome: string
  table: string
  question: string
  moments: Record<Moment, string>
  tags: Record<DishTag, string>
  search: string
  all: string
  favorites: string
  add: string
  addToCart: string
  ingredients: string
  allergens: string
  noAllergens: string
  spice: string
  portion: string
  customize: string
  without: string
  extras: string
  spicePref: { mild: string; normal: string; hot: string }
  note: string
  notePlaceholder: string
  cart: string
  emptyCart: string
  total: string
  order: string
  payment: string
  payCounter: string
  payTable: string
  myOrders: string
  requestBill: string
  billRequested: string
  noResults: string
  unavailable: string
  viewCart: string
  items: string
  rate: string
  thanks: string
  send: string
  popular: string
  changeMoment: string
}

export const DICT: Record<Lang, Dict> = {
  fr: {
    welcome: 'Bienvenue chez Dar Zitoun',
    table: 'Table',
    question: 'Que souhaitez-vous consulter ?',
    moments: {
      breakfast: 'Petit-déjeuner',
      lunch: 'Déjeuner',
      dinner: 'Dîner',
      drinks: 'Boissons',
      desserts: 'Desserts',
    },
    tags: { vegetarian: 'Végétarien', spicy: 'Épicé', meat: 'Viande', fish: 'Poisson', dessert: 'Dessert' },
    search: 'Rechercher un plat...',
    all: 'Tout',
    favorites: 'Favoris',
    add: 'Ajouter',
    addToCart: 'Ajouter au panier',
    ingredients: 'Ingrédients',
    allergens: 'Allergènes',
    noAllergens: 'Aucun allergène majeur',
    spice: 'Piquant',
    portion: 'Portion',
    customize: 'Personnaliser',
    without: 'Retirer',
    extras: 'Suppléments',
    spicePref: { mild: 'Peu épicé', normal: 'Normal', hot: 'Très épicé' },
    note: 'Note pour la cuisine',
    notePlaceholder: 'Allergie, cuisson, demande particulière...',
    cart: 'Ma commande',
    emptyCart: 'Votre panier est vide',
    total: 'Total',
    order: 'Commander',
    payment: 'Paiement',
    payCounter: 'À la caisse',
    payTable: 'À table',
    myOrders: 'Mes commandes',
    requestBill: "Demander l'addition",
    billRequested: 'Addition demandée',
    noResults: 'Aucun plat ne correspond à votre recherche.',
    unavailable: 'Indisponible',
    viewCart: 'Voir le panier',
    items: 'articles',
    rate: 'Comment était votre expérience ?',
    thanks: 'Merci pour votre avis !',
    send: 'Envoyer',
    popular: 'Populaire',
    changeMoment: 'Changer',
  },
  en: {
    welcome: 'Welcome to Dar Zitoun',
    table: 'Table',
    question: 'What would you like to see?',
    moments: { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', drinks: 'Drinks', desserts: 'Desserts' },
    tags: { vegetarian: 'Vegetarian', spicy: 'Spicy', meat: 'Meat', fish: 'Fish', dessert: 'Dessert' },
    search: 'Search a dish...',
    all: 'All',
    favorites: 'Favorites',
    add: 'Add',
    addToCart: 'Add to order',
    ingredients: 'Ingredients',
    allergens: 'Allergens',
    noAllergens: 'No major allergens',
    spice: 'Spice',
    portion: 'Portion',
    customize: 'Customize',
    without: 'Remove',
    extras: 'Extras',
    spicePref: { mild: 'Mild', normal: 'Regular', hot: 'Extra hot' },
    note: 'Note for the kitchen',
    notePlaceholder: 'Allergy, cooking, special request...',
    cart: 'My order',
    emptyCart: 'Your cart is empty',
    total: 'Total',
    order: 'Place order',
    payment: 'Payment',
    payCounter: 'At the counter',
    payTable: 'At the table',
    myOrders: 'My orders',
    requestBill: 'Ask for the bill',
    billRequested: 'Bill requested',
    noResults: 'No dish matches your search.',
    unavailable: 'Unavailable',
    viewCart: 'View cart',
    items: 'items',
    rate: 'How was your experience?',
    thanks: 'Thanks for your feedback!',
    send: 'Send',
    popular: 'Popular',
    changeMoment: 'Change',
  },
  ar: {
    welcome: 'مرحباً بكم في دار الزيتون',
    table: 'طاولة',
    question: 'ماذا تودون أن تطلبوا؟',
    moments: { breakfast: 'الفطور', lunch: 'الغداء', dinner: 'العشاء', drinks: 'المشروبات', desserts: 'الحلويات' },
    tags: { vegetarian: 'نباتي', spicy: 'حار', meat: 'لحوم', fish: 'سمك', dessert: 'حلوى' },
    search: 'ابحث عن طبق...',
    all: 'الكل',
    favorites: 'المفضلة',
    add: 'أضف',
    addToCart: 'أضف إلى الطلب',
    ingredients: 'المكونات',
    allergens: 'مسببات الحساسية',
    noAllergens: 'لا توجد مسببات حساسية رئيسية',
    spice: 'الحرارة',
    portion: 'الحصة',
    customize: 'تخصيص',
    without: 'بدون',
    extras: 'إضافات',
    spicePref: { mild: 'قليل الحرارة', normal: 'عادي', hot: 'حار جداً' },
    note: 'ملاحظة للمطبخ',
    notePlaceholder: 'حساسية، طريقة الطهي، طلب خاص...',
    cart: 'طلبي',
    emptyCart: 'سلتك فارغة',
    total: 'المجموع',
    order: 'اطلب الآن',
    payment: 'الدفع',
    payCounter: 'في الصندوق',
    payTable: 'على الطاولة',
    myOrders: 'طلباتي',
    requestBill: 'اطلب الحساب',
    billRequested: 'تم طلب الحساب',
    noResults: 'لا يوجد طبق مطابق لبحثك.',
    unavailable: 'غير متوفر',
    viewCart: 'عرض السلة',
    items: 'عناصر',
    rate: 'كيف كانت تجربتك؟',
    thanks: 'شكراً على تقييمك!',
    send: 'إرسال',
    popular: 'الأكثر طلباً',
    changeMoment: 'تغيير',
  },
}
