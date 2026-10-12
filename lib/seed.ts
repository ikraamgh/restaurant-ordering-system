import type { AppState, Category, Dish, Order, OrderStatus } from './types'

/** Résout un MLText ou une string simple dans la langue donnée */
export function t(text: Record<string, string> | string | undefined | null, lang = 'fr'): string {
  if (!text) return ''
  if (typeof text === 'string') return text
  return text[lang] ?? text['fr'] ?? Object.values(text)[0] ?? ''
}

export const MOMENTS: { id: import('./types').Moment; label: string; hours: string }[] = [
  { id: 'breakfast', label: 'Petit-déjeuner', hours: '7h – 11h30' },
  { id: 'lunch',     label: 'Déjeuner',       hours: '12h – 15h30' },
  { id: 'dinner',    label: 'Dîner',           hours: '19h – 23h' },
  { id: 'drinks',    label: 'Boissons',        hours: 'Toute la journée' },
  { id: 'desserts',  label: 'Desserts',        hours: 'Toute la journée' },
]

export const TAG_LABELS = {
  vegetarian: 'Végétarien',
  spicy: 'Épicé',
  meat: 'Viande',
  fish: 'Poisson',
  dessert: 'Dessert',
} as const

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:   'En attente',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  ready:     'Prête',
  served:    'Terminée',
  cancelled: 'Annulée',
  paid:      'Payée',
}

const DISHES: Dish[] = [
  {
    id: 'ftour', name: 'Petit-déjeuner marocain', moments: ['breakfast'], category: 'Formules', price: 55,
    description: 'Le grand classique : khobz maison, msemen, amlou, miel, olives, fromage frais, œuf et thé à la menthe.',
    ingredients: ['Khobz', 'Msemen', 'Amlou', 'Miel', 'Olives', 'Fromage frais', 'Œuf', 'Thé à la menthe'],
    allergens: ['Gluten', 'Fruits à coque', 'Œufs', 'Lait'], spiceLevel: 0, portion: '1 personne',
    image: '/dishes/ftour-marocain.png', tags: ['vegetarian'], removable: ['Olives', 'Fromage frais'],
    extras: [{ id: 'jus', label: "Jus d'orange", price: 12 }], available: true, popular: true,
  },
  {
    id: 'msemen', name: 'Msemen miel & beurre', moments: ['breakfast'], category: 'Viennoiseries', price: 22,
    description: 'Crêpes feuilletées marocaines servies chaudes avec miel de thym et beurre fermier.',
    ingredients: ['Semoule', 'Farine', 'Beurre', 'Miel de thym'], allergens: ['Gluten', 'Lait'],
    spiceLevel: 0, portion: '2 pièces', image: '/dishes/msemen.png', tags: ['vegetarian'], removable: ['Beurre'],
    extras: [{ id: 'fromage', label: 'Fromage', price: 8 }, { id: 'amlou', label: 'Amlou', price: 10 }], available: true,
  },
  {
    id: 'pancakes', name: 'Pancakes fruits rouges', moments: ['breakfast'], category: 'Sucré', price: 38,
    description: "Trois pancakes moelleux, fruits rouges frais et sirop d'érable.",
    ingredients: ['Farine', 'Œufs', 'Lait', 'Fruits rouges', "Sirop d'érable"],
    allergens: ['Gluten', 'Œufs', 'Lait'], spiceLevel: 0, portion: '3 pièces',
    image: '/dishes/pancakes.png', tags: ['vegetarian'], removable: ['Sirop'],
    extras: [{ id: 'chantilly', label: 'Chantilly', price: 6 }], available: true,
  },
  {
    id: 'omelette', name: 'Omelette aux herbes', moments: ['breakfast'], category: 'Salé', price: 32,
    description: 'Omelette baveuse, fromage fondu et herbes fraîches, toast grillé et tomates cerises.',
    ingredients: ['Œufs', 'Fromage', 'Ciboulette', 'Persil', 'Pain', 'Tomates cerises'],
    allergens: ['Œufs', 'Lait', 'Gluten'], spiceLevel: 0, portion: '3 œufs',
    image: '/dishes/omelette.png', tags: ['vegetarian'], removable: ['Fromage', 'Tomates'],
    extras: [{ id: 'dinde', label: 'Dinde fumée', price: 10 }], available: true,
  },
  {
    id: 'tajine-poulet', name: 'Tajine poulet citron', moments: ['lunch', 'dinner'], category: 'Tajines', price: 65,
    description: 'Poulet fermier mijoté lentement aux citrons confits et olives violettes, servi avec khobz chaud.',
    ingredients: ['Poulet', 'Oignons', 'Olives', 'Citron confit', "Huile d'olive", 'Gingembre', 'Safran', 'Coriandre'],
    allergens: [], spiceLevel: 1, portion: '350 g', image: '/dishes/tajine-poulet.png', tags: ['meat'],
    removable: ['Oignons', 'Olives', 'Coriandre'],
    extras: [{ id: 'frites', label: 'Frites maison', price: 15 }, { id: 'fromage', label: 'Ajouter fromage', price: 10 }],
    available: true, popular: true,
  },
  {
    id: 'couscous', name: 'Couscous aux sept légumes', moments: ['lunch'], category: 'Spécialités', price: 75,
    description: 'Semoule roulée à la main, agneau tendre, sept légumes de saison et tfaya caramélisée.',
    ingredients: ['Semoule', 'Agneau', 'Carottes', 'Courgettes', 'Navets', 'Potiron', 'Pois chiches', 'Tfaya'],
    allergens: ['Gluten'], spiceLevel: 1, portion: '400 g', image: '/dishes/couscous.png', tags: ['meat'],
    removable: ['Tfaya', 'Pois chiches'], extras: [{ id: 'lben', label: 'Lben', price: 8 }], available: true, popular: true,
  },
  {
    id: 'burger', name: 'Burger maison', moments: ['lunch', 'dinner'], category: 'Street food', price: 70,
    description: 'Bœuf haché 180 g, cheddar affiné, oignons caramélisés, sauce maison, pain brioché. Frites incluses.',
    ingredients: ['Bœuf', 'Cheddar', 'Oignons', 'Salade', 'Tomate', 'Pain brioché', 'Sauce maison'],
    allergens: ['Gluten', 'Lait', 'Moutarde', 'Sésame'], spiceLevel: 0, portion: '180 g + frites',
    image: '/dishes/burger.png', tags: ['meat'], removable: ['Oignons', 'Tomate', 'Salade', 'Sauce'],
    extras: [{ id: 'fromage', label: 'Double fromage', price: 10 }, { id: 'bacon', label: 'Bacon de bœuf', price: 12 }],
    available: true, popular: true,
  },
  {
    id: 'pizza', name: 'Pizza margherita', moments: ['lunch', 'dinner'], category: 'Street food', price: 60,
    description: 'Pâte maturée 48h, sauce tomate San Marzano, mozzarella fior di latte et basilic frais.',
    ingredients: ['Pâte', 'Tomate', 'Mozzarella', 'Basilic', "Huile d'olive"],
    allergens: ['Gluten', 'Lait'], spiceLevel: 0, portion: '30 cm',
    image: '/dishes/pizza.png', tags: ['vegetarian'], removable: ['Basilic'],
    extras: [{ id: 'fromage', label: 'Extra mozzarella', price: 10 }, { id: 'piment', label: 'Huile pimentée', price: 4 }],
    available: true,
  },
  {
    id: 'salade', name: 'Salade marocaine', moments: ['lunch', 'dinner'], category: 'Entrées', price: 35,
    description: "Tomates, concombre, oignon rouge et herbes fraîches, citron et huile d'olive vierge.",
    ingredients: ['Tomates', 'Concombre', 'Oignon rouge', 'Persil', 'Coriandre', 'Citron', "Huile d'olive"],
    allergens: [], spiceLevel: 0, portion: '250 g', image: '/dishes/salade.png', tags: ['vegetarian'],
    removable: ['Oignon rouge', 'Coriandre'], extras: [{ id: 'feta', label: 'Feta', price: 10 }], available: true,
  },
  {
    id: 'pates', name: 'Tagliatelles aux champignons', moments: ['dinner'], category: 'Pâtes', price: 68,
    description: 'Pâtes fraîches, crème légère, champignons de saison et parmesan affiné 24 mois.',
    ingredients: ['Tagliatelles', 'Champignons', 'Crème', 'Parmesan', 'Ail', 'Persil'],
    allergens: ['Gluten', 'Œufs', 'Lait'], spiceLevel: 0, portion: '320 g',
    image: '/dishes/pates.png', tags: ['vegetarian'], removable: ['Ail', 'Persil'],
    extras: [{ id: 'poulet', label: 'Poulet grillé', price: 15 }], available: true,
  },
  {
    id: 'poisson', name: 'Dorade grillée à la chermoula', moments: ['dinner'], category: 'Poissons', price: 95,
    description: 'Dorade entière marinée à la chermoula, légumes rôtis et citron grillé.',
    ingredients: ['Dorade', 'Chermoula', 'Citron', 'Poivrons', 'Pommes de terre', 'Ail'],
    allergens: ['Poisson'], spiceLevel: 2, portion: '450 g', image: '/dishes/poisson.png',
    tags: ['fish', 'spicy'], removable: ['Ail'], extras: [{ id: 'riz', label: 'Riz safrané', price: 12 }], available: true,
  },
  {
    id: 'the', name: 'Thé à la menthe', moments: ['drinks', 'breakfast'], category: 'Boissons chaudes', price: 15,
    description: 'Thé vert gunpowder, menthe fraîche, servi à la marocaine dans sa théière.',
    ingredients: ['Thé vert', 'Menthe fraîche', 'Sucre'], allergens: [], spiceLevel: 0, portion: 'Théière',
    image: '/dishes/the-menthe.png', tags: ['vegetarian'], removable: ['Sucre'],
    extras: [{ id: 'chiba', label: 'Chiba (absinthe)', price: 3 }], available: true,
  },
  {
    id: 'cafe', name: 'Cappuccino', moments: ['drinks', 'breakfast'], category: 'Boissons chaudes', price: 18,
    description: 'Double espresso et lait micro-moussé.',
    ingredients: ['Café', 'Lait'], allergens: ['Lait'], spiceLevel: 0, portion: '20 cl',
    image: '/dishes/cafe.png', tags: ['vegetarian'], removable: [],
    extras: [{ id: 'vegetal', label: 'Lait végétal', price: 5 }], available: true,
  },
  {
    id: 'jus-orange', name: "Jus d'orange pressé", moments: ['drinks', 'breakfast'], category: 'Jus frais', price: 15,
    description: 'Oranges de Berkane pressées minute.',
    ingredients: ['Oranges'], allergens: [], spiceLevel: 0, portion: '33 cl',
    image: '/dishes/jus-orange.png', tags: ['vegetarian'], removable: [],
    extras: [{ id: 'gingembre', label: 'Shot de gingembre', price: 5 }], available: true,
  },
  {
    id: 'cheesecake', name: 'Cheesecake fruits rouges', moments: ['desserts'], category: 'Desserts', price: 40,
    description: 'Cheesecake façon New York, biscuit croquant et coulis de fruits rouges.',
    ingredients: ['Fromage frais', 'Biscuit', 'Œufs', 'Sucre', 'Fruits rouges'],
    allergens: ['Gluten', 'Lait', 'Œufs'], spiceLevel: 0, portion: '1 part',
    image: '/dishes/cheesecake.png', tags: ['dessert', 'vegetarian'], removable: ['Coulis'],
    extras: [{ id: 'glace', label: 'Boule de glace', price: 10 }], available: true,
  },
]

/* ── Seed orders ────────────────────────────────── */

function seedOrders(now: number): Order[] {
  const base = (d: Dish, quantity: number) => ({
    key: `${d.id}-seed`, dishId: d.id, name: d.name, unitPrice: d.price, quantity,
    removed: [], extras: [], spice: 'normal' as const, note: '',
  })
  const byId = (id: string) => DISHES.find((d) => d.id === id)!
  const make = (
    n: number, table: number, minutesAgo: number, status: OrderStatus,
    items: [string, number][], rating?: number,
  ): Order => {
    const lines = items.map(([id, q]) => base(byId(id), q))
    return {
      id: `seed-${n}`, number: n, table, items: lines,
      total: lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0),
      status, payment: 'counter',
      createdAt: now - minutesAgo * 60_000,
      updatedAt: now - minutesAgo * 60_000,
      rating,
      restaurantId: 'dar-zitoun',
    }
  }
  return [
    make(140, 3,  320, 'paid',      [['ftour', 2], ['jus-orange', 2]], 5),
    make(141, 7,  290, 'paid',      [['msemen', 3], ['the', 1]], 4),
    make(142, 1,  210, 'paid',      [['tajine-poulet', 2], ['salade', 1]], 5),
    make(143, 9,  180, 'paid',      [['burger', 2], ['jus-orange', 2]], 4),
    make(144, 4,  150, 'paid',      [['couscous', 3], ['the', 2]], 5),
    make(145, 12, 120, 'paid',      [['pizza', 2], ['cheesecake', 2]], 3),
    make(146, 6,   95, 'paid',      [['tajine-poulet', 1], ['burger', 1], ['cafe', 2]], 5),
    make(147, 2,   60, 'served',    [['couscous', 2], ['tajine-poulet', 2]]),
    make(148, 5,   22, 'ready',     [['burger', 2], ['pizza', 1]]),
    make(149, 8,   14, 'preparing', [['tajine-poulet', 2], ['salade', 2]]),
    make(150, 10,   8, 'confirmed', [['couscous', 1], ['jus-orange', 1]]),
    make(151, 14,   3, 'pending',   [['poisson', 2], ['the', 1]]),
  ]
}

/* ── Catégories Super Admin (MLText) ───────────── */

const SEED_CATEGORIES: Category[] = [
  { id: 'cat-dz-formules',  restaurantId: 'dar-zitoun', name: { fr: 'Formules',    en: 'Set Menus',   ar: 'طواقم' },    order: 1 },
  { id: 'cat-dz-tajines',   restaurantId: 'dar-zitoun', name: { fr: 'Tajines',     en: 'Tagines',     ar: 'طواجن' },    order: 2 },
  { id: 'cat-dz-specials',  restaurantId: 'dar-zitoun', name: { fr: 'Spécialités', en: 'Specialties', ar: 'أطباق' },    order: 3 },
  { id: 'cat-dz-street',    restaurantId: 'dar-zitoun', name: { fr: 'Street Food', en: 'Street Food', ar: 'أكل الشارع' }, order: 4 },
  { id: 'cat-dz-drinks',    restaurantId: 'dar-zitoun', name: { fr: 'Boissons',    en: 'Drinks',      ar: 'مشروبات' },  order: 5 },
  { id: 'cat-dz-desserts',  restaurantId: 'dar-zitoun', name: { fr: 'Desserts',    en: 'Desserts',    ar: 'حلويات' },   order: 6 },
]

/* ── createSeedState ────────────────────────────── */

export function createSeedState(now = Date.now()): AppState {
  return {
    restaurants: [
      { id: 'dar-zitoun', name: 'Dar Zitoun', slug: 'dar-zitoun', city: 'Marrakech', address: '12 Derb Dabachi, Médina, Marrakech', description: 'Restaurant traditionnel marocain au cœur de la Médina. Cuisine authentique, décor raffiné et ambiance chaleureuse.', logo: '', status: 'active', plan: 'growth', createdAt: now - 180 * 86400000, scanOrders: 847, languages: ['fr', 'en', 'ar'] },
      { id: 'cafe-atlas', name: 'Café Atlas', slug: 'cafe-atlas', city: 'Casablanca', address: 'Boulevard Hassan II, Casablanca', description: 'Café moderne avec vue sur le boulevard. Petit-déjeuner, brunchs et boissons de qualité.', logo: '', status: 'active', plan: 'starter', createdAt: now - 92 * 86400000, scanOrders: 312, languages: ['fr', 'ar'] },
      { id: 'le-patio', name: 'Le Patio', slug: 'le-patio', city: 'Rabat', address: 'Rue Mohammed V, Agdal, Rabat', description: 'Restaurant méditerranéen avec terrasse intérieure. Cuisine fusion et cocktails maison.', logo: '', status: 'suspended', plan: 'starter', createdAt: now - 31 * 86400000, scanOrders: 58, languages: ['fr'] },
    ],
    activeRestaurantId: 'dar-zitoun',
    dishes: DISHES,
    tables: Array.from({ length: 20 }, (_, i) => ({
      number: i + 1,
      seats: i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
      zone: i < 8 ? 'Salle' : i < 15 ? 'Terrasse' : 'Patio',
    })),
    orders: seedOrders(now),
    billRequests: [{ id: 'bill-seed', table: 2, createdAt: now - 4 * 60_000, resolved: false }],
    staff: [
      { id: 's1', name: 'Yassine El Amrani', role: 'admin',   active: true },
      { id: 's2', name: 'Salma Bennani',     role: 'serveur', active: true },
      { id: 's3', name: 'Omar Tazi',         role: 'serveur', active: true },
      { id: 's4', name: 'Fatima Zahra',      role: 'cuisine', active: true },
      { id: 's5', name: 'Karim Idrissi',     role: 'cuisine', active: false },
    ],
    nextOrderNumber: 152,
    categories: SEED_CATEGORIES,
  }
}
