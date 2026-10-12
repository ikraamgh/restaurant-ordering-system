import type { AppState, Category, Dish, Order, Restaurant, TableInfo } from './types'

/* ══════════════════════════════════════════════════════════
   SEED DATA — Resto QR (multi-restaurant)
   ══════════════════════════════════════════════════════════ */

const uid = (prefix = '') => prefix + Math.random().toString(36).slice(2, 10)

/* ── Restaurants ──────────────────────────────────────────── */

const RESTAURANTS: Restaurant[] = [
  {
    id: 'dar-zitoun',
    name: 'Dar Zitoun',
    slug: 'dar-zitoun',
    city: 'Marrakech',
    address: '12 Derb Dabachi, Médina, Marrakech',
    description: 'Restaurant traditionnel marocain au cœur de la Médina.',
    logo: '',
    status: 'active',
    languages: ['fr', 'en', 'ar'],
    createdAt: Date.now() - 180 * 86400000,
  },
  {
    id: 'cafe-atlas',
    name: 'Café Atlas',
    slug: 'cafe-atlas',
    city: 'Casablanca',
    address: 'Boulevard Hassan II, Casablanca',
    description: 'Café moderne avec brunchs et boissons de qualité.',
    logo: '',
    status: 'active',
    languages: ['fr', 'ar'],
    createdAt: Date.now() - 92 * 86400000,
  },
  {
    id: 'le-patio',
    name: 'Le Patio',
    slug: 'le-patio',
    city: 'Rabat',
    address: 'Rue Mohammed V, Agdal, Rabat',
    description: 'Restaurant méditerranéen avec terrasse intérieure.',
    logo: '',
    status: 'suspended',
    languages: ['fr'],
    createdAt: Date.now() - 31 * 86400000,
  },
]

/* ── Categories ───────────────────────────────────────────── */

const CATEGORIES: Category[] = [
  // Dar Zitoun
  { id: 'cat-dz-formules',  restaurantId: 'dar-zitoun', name: { fr: 'Formules',      en: 'Set Menus',   ar: 'طواقم' },           order: 1 },
  { id: 'cat-dz-tajines',   restaurantId: 'dar-zitoun', name: { fr: 'Tajines',        en: 'Tagines',     ar: 'طواجن' },           order: 2 },
  { id: 'cat-dz-specials',  restaurantId: 'dar-zitoun', name: { fr: 'Spécialités',    en: 'Specialties', ar: 'أطباق مميزة' },     order: 3 },
  { id: 'cat-dz-street',    restaurantId: 'dar-zitoun', name: { fr: 'Street Food',    en: 'Street Food', ar: 'أكل الشارع' },      order: 4 },
  { id: 'cat-dz-drinks',    restaurantId: 'dar-zitoun', name: { fr: 'Boissons',       en: 'Drinks',      ar: 'مشروبات' },         order: 5 },
  { id: 'cat-dz-desserts',  restaurantId: 'dar-zitoun', name: { fr: 'Desserts',       en: 'Desserts',    ar: 'حلويات' },          order: 6 },
  // Café Atlas
  { id: 'cat-ca-petitdej',  restaurantId: 'cafe-atlas', name: { fr: 'Petit-déjeuner', ar: 'فطور' },                              order: 1 },
  { id: 'cat-ca-drinks',    restaurantId: 'cafe-atlas', name: { fr: 'Boissons',        ar: 'مشروبات' },                          order: 2 },
]

/* ── Dishes ───────────────────────────────────────────────── */

const DISHES: Dish[] = [
  // ── Dar Zitoun: Formules ──
  {
    id: 'ftour',
    restaurantId: 'dar-zitoun',
    categoryId: 'cat-dz-formules',
    name:        { fr: 'Petit-déjeuner marocain', en: 'Moroccan Breakfast',   ar: 'فطور مغربي' },
    description: { fr: 'Khobz, msemen, amlou, miel, olives, thé à la menthe.', en: 'Khobz, msemen, amlou, honey, olives, mint tea.', ar: 'خبز، مسمن، أملو، عسل، زيتون، أتاي.' },
    price: 55, image: '/dishes/ftour-marocain.png', available: true, popular: true,
  },
  {
    id: 'msemen',
    restaurantId: 'dar-zitoun',
    categoryId: 'cat-dz-formules',
    name:        { fr: 'Msemen miel & beurre', en: 'Msemen with Honey & Butter', ar: 'مسمن بالعسل والزبدة' },
    description: { fr: 'Crêpes feuilletées servies chaudes.', en: 'Flaky pancakes served warm.', ar: 'فطائر مورقة تقدم ساخنة.' },
    price: 22, image: '/dishes/msemen.png', available: true,
  },
  // ── Dar Zitoun: Tajines ──
  {
    id: 'tajine-poulet',
    restaurantId: 'dar-zitoun',
    categoryId: 'cat-dz-tajines',
    name:        { fr: 'Tajine poulet citron', en: 'Chicken & Lemon Tagine',  ar: 'طاجين دجاج بالليمون' },
    description: { fr: 'Poulet mijoté aux citrons confits et olives.', en: 'Chicken slow-cooked with preserved lemons and olives.', ar: 'دجاج مطهي ببطء بالليمون المحفوظ والزيتون.' },
    price: 65, image: '/dishes/tajine-poulet.png', available: true, popular: true,
  },
  // ── Dar Zitoun: Spécialités ──
  {
    id: 'couscous',
    restaurantId: 'dar-zitoun',
    categoryId: 'cat-dz-specials',
    name:        { fr: 'Couscous aux sept légumes', en: 'Seven-Vegetable Couscous', ar: 'كسكس بسبعة خضروات' },
    description: { fr: 'Semoule, agneau tendre, sept légumes de saison.', en: 'Semolina, tender lamb, seven seasonal vegetables.', ar: 'سميد، خروف طري، سبعة خضروات موسمية.' },
    price: 75, image: '/dishes/couscous.png', available: true, popular: true,
  },
  // ── Dar Zitoun: Street Food ──
  {
    id: 'burger',
    restaurantId: 'dar-zitoun',
    categoryId: 'cat-dz-street',
    name:        { fr: 'Burger maison', en: 'Homemade Burger', ar: 'برغر بيتي' },
    description: { fr: 'Bœuf 180g, cheddar, sauce maison, frites.', en: '180g beef, cheddar, house sauce, fries.', ar: '180 غ لحم بقري، شيدر، صلصة خاصة، بطاطس.' },
    price: 70, image: '/dishes/burger.png', available: true,
  },
  {
    id: 'pizza',
    restaurantId: 'dar-zitoun',
    categoryId: 'cat-dz-street',
    name:        { fr: 'Pizza margherita', en: 'Margherita Pizza', ar: 'بيتزا مرغريتا' },
    description: { fr: 'Pâte maturée 48h, tomate, mozzarella, basilic.', en: '48h-matured dough, tomato, mozzarella, basil.', ar: 'عجينة ناضجة 48 ساعة، طماطم، موتزاريلا، ريحان.' },
    price: 60, image: '/dishes/pizza.png', available: true,
  },
  {
    id: 'salade',
    restaurantId: 'dar-zitoun',
    categoryId: 'cat-dz-street',
    name:        { fr: 'Salade marocaine', en: 'Moroccan Salad', ar: 'سلطة مغربية' },
    description: { fr: 'Tomates, concombre, oignon rouge, herbes, citron.', en: 'Tomatoes, cucumber, red onion, herbs, lemon.', ar: 'طماطم، خيار، بصل أحمر، أعشاب، ليمون.' },
    price: 35, image: '/dishes/salade.png', available: true,
  },
  // ── Dar Zitoun: Boissons ──
  {
    id: 'the',
    restaurantId: 'dar-zitoun',
    categoryId: 'cat-dz-drinks',
    name:        { fr: 'Thé à la menthe', en: 'Mint Tea', ar: 'أتاي بالنعناع' },
    description: { fr: 'Thé vert gunpowder, menthe fraîche, servi à la marocaine.', en: 'Gunpowder green tea with fresh mint.', ar: 'شاي أخضر بالنعناع الطازج.' },
    price: 15, image: '/dishes/the-menthe.png', available: true,
  },
  {
    id: 'cafe',
    restaurantId: 'dar-zitoun',
    categoryId: 'cat-dz-drinks',
    name:        { fr: 'Cappuccino', en: 'Cappuccino', ar: 'كابوتشينو' },
    description: { fr: 'Double espresso et lait micro-moussé.', en: 'Double espresso with micro-frothed milk.', ar: 'إسبريسو مضاعف مع حليب مرغو.' },
    price: 18, image: '/dishes/cafe.png', available: true,
  },
  {
    id: 'jus-orange',
    restaurantId: 'dar-zitoun',
    categoryId: 'cat-dz-drinks',
    name:        { fr: "Jus d'orange pressé", en: 'Fresh Orange Juice', ar: 'عصير برتقال طازج' },
    description: { fr: 'Oranges de Berkane pressées minute.', en: 'Freshly squeezed Berkane oranges.', ar: 'برتقال بركان معصور في الحين.' },
    price: 15, image: '/dishes/jus-orange.png', available: true,
  },
  // ── Dar Zitoun: Desserts ──
  {
    id: 'cheesecake',
    restaurantId: 'dar-zitoun',
    categoryId: 'cat-dz-desserts',
    name:        { fr: 'Cheesecake fruits rouges', en: 'Red Fruit Cheesecake', ar: 'تشيزكيك بالفواكه الحمراء' },
    description: { fr: 'Cheesecake façon New York, coulis fruits rouges.', en: 'New York style cheesecake with red fruit coulis.', ar: 'تشيزكيك على الطريقة النيويوركية مع كوليس الفواكه الحمراء.' },
    price: 40, image: '/dishes/cheesecake.png', available: true,
  },
  // ── Café Atlas ──
  {
    id: 'ca-ftour',
    restaurantId: 'cafe-atlas',
    categoryId: 'cat-ca-petitdej',
    name:        { fr: 'Formule petit-déjeuner', ar: 'فطور' },
    description: { fr: 'Café, jus, pain beurre confiture.', ar: 'قهوة، عصير، خبز بالزبدة والمربى.' },
    price: 45, image: '/dishes/ftour-marocain.png', available: true, popular: true,
  },
  {
    id: 'ca-msemen',
    restaurantId: 'cafe-atlas',
    categoryId: 'cat-ca-petitdej',
    name:        { fr: 'Msemen miel', ar: 'مسمن بالعسل' },
    description: { fr: 'Crêpes feuilletées au miel.', ar: 'فطائر مورقة بالعسل.' },
    price: 20, image: '/dishes/msemen.png', available: true,
  },
  {
    id: 'ca-cafe',
    restaurantId: 'cafe-atlas',
    categoryId: 'cat-ca-drinks',
    name:        { fr: 'Café au lait', ar: 'قهوة بالحليب' },
    description: { fr: 'Café chaud avec du lait.', ar: 'قهوة ساخنة مع الحليب.' },
    price: 15, image: '/dishes/cafe.png', available: true,
  },
  {
    id: 'ca-jus',
    restaurantId: 'cafe-atlas',
    categoryId: 'cat-ca-drinks',
    name:        { fr: "Jus d'orange", ar: 'عصير برتقال' },
    description: { fr: 'Pressé minute.', ar: 'معصور في الحين.' },
    price: 12, image: '/dishes/jus-orange.png', available: true,
  },
]

/* ── Tables ───────────────────────────────────────────────── */

function makeTables(restaurantId: string, count: number, zones: string[]): TableInfo[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `table-${restaurantId}-${i + 1}`,
    restaurantId,
    number: i + 1,
    seats: i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
    zone: zones[Math.floor(i / Math.ceil(count / zones.length))] ?? zones[0],
  }))
}

const TABLES: TableInfo[] = [
  ...makeTables('dar-zitoun', 20, ['Salle', 'Terrasse', 'Patio']),
  ...makeTables('cafe-atlas',  8, ['Intérieur', 'Terrasse']),
]

/* ── Orders seed ──────────────────────────────────────────── */

function makeOrder(
  n: number,
  restaurantId: string,
  table: number,
  minutesAgo: number,
  status: 'active' | 'paid',
  items: [string, number][],
): Order {
  const dishMap = Object.fromEntries(DISHES.map((d) => [d.id, d]))
  const cartItems: CartItem[] = items.map(([dishId, qty], i) => ({
    key: `${dishId}-${i}`,
    dishId,
    name: dishMap[dishId]?.name?.fr ?? dishId,
    unitPrice: dishMap[dishId]?.price ?? 0,
    quantity: qty,
  }))
  const now = Date.now()
  return {
    id: `seed-${n}`,
    number: n,
    restaurantId,
    tableNumber: table,
    lang: 'fr',
    items: cartItems,
    total: cartItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    status,
    createdAt: now - minutesAgo * 60_000,
    ...(status === 'paid' ? { paidAt: now - (minutesAgo - 5) * 60_000 } : {}),
  }
}

const ORDERS: Order[] = [
  makeOrder(101, 'dar-zitoun', 3,  240, 'paid',   [['ftour', 2], ['the', 2]]),
  makeOrder(102, 'dar-zitoun', 7,  180, 'paid',   [['tajine-poulet', 2], ['salade', 1]]),
  makeOrder(103, 'dar-zitoun', 1,  120, 'paid',   [['couscous', 3], ['jus-orange', 3]]),
  makeOrder(104, 'dar-zitoun', 9,   60, 'paid',   [['burger', 2], ['cafe', 2]]),
  makeOrder(105, 'dar-zitoun', 4,   20, 'active', [['tajine-poulet', 1], ['salade', 1], ['the', 1]]),
  makeOrder(106, 'dar-zitoun', 12,  10, 'active', [['burger', 2], ['pizza', 1], ['jus-orange', 2]]),
  makeOrder(107, 'dar-zitoun', 2,    5, 'active', [['couscous', 2], ['cheesecake', 2]]),
  makeOrder(201, 'cafe-atlas',  1,  90, 'paid',   [['ca-ftour', 2], ['ca-cafe', 2]]),
  makeOrder(202, 'cafe-atlas',  3,  30, 'active', [['ca-msemen', 3], ['ca-jus', 2]]),
]

/* ── createSeedState ──────────────────────────────────────── */

export function createSeedState(): AppState {
  return {
    restaurants: RESTAURANTS,
    categories: CATEGORIES,
    dishes: DISHES,
    tables: TABLES,
    orders: ORDERS,
    nextOrderNumber: 300,
  }
}

/* ── helpers exportés ─────────────────────────────────────── */

export function t(text: Record<string, string>, lang: string): string {
  return text[lang] ?? text['fr'] ?? Object.values(text)[0] ?? ''
}
