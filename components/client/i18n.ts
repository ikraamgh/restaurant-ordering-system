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
      breakfast: 'Petit-d├®jeuner',
      lunch: 'D├®jeuner',
      dinner: 'D├«ner',
      drinks: 'Boissons',
      desserts: 'Desserts',
    },
    tags: { vegetarian: 'V├®g├®tarien', spicy: '├ëpic├®', meat: 'Viande', fish: 'Poisson', dessert: 'Dessert' },
    search: 'Rechercher un plat...',
    all: 'Tout',
    favorites: 'Favoris',
    add: 'Ajouter',
    addToCart: 'Ajouter au panier',
    ingredients: 'Ingr├®dients',
    allergens: 'Allerg├¿nes',
    noAllergens: 'Aucun allerg├¿ne majeur',
    spice: 'Piquant',
    portion: 'Portion',
    customize: 'Personnaliser',
    without: 'Retirer',
    extras: 'Suppl├®ments',
    spicePref: { mild: 'Peu ├®pic├®', normal: 'Normal', hot: 'Tr├¿s ├®pic├®' },
    note: 'Note pour la cuisine',
    notePlaceholder: 'Allergie, cuisson, demande particuli├¿re...',
    cart: 'Ma commande',
    emptyCart: 'Votre panier est vide',
    total: 'Total',
    order: 'Commander',
    payment: 'Paiement',
    payCounter: '├Ç la caisse',
    payTable: '├Ç table',
    myOrders: 'Mes commandes',
    requestBill: "Demander l'addition",
    billRequested: 'Addition demand├®e',
    noResults: 'Aucun plat ne correspond ├á votre recherche.',
    unavailable: 'Indisponible',
    viewCart: 'Voir le panier',
    items: 'articles',
    rate: 'Comment ├®tait votre exp├®rience ?',
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
    welcome: '┘àÏ▒Ï¡Ï¿Ïº┘ï Ï¿┘â┘à ┘ü┘è Ï»ÏºÏ▒ Ïº┘äÏ▓┘èÏ¬┘ê┘å',
    table: 'ÏÀÏº┘ê┘äÏ®',
    question: '┘àÏºÏ░Ïº Ï¬┘êÏ»┘ê┘å Ïú┘å Ï¬ÏÀ┘äÏ¿┘êÏºÏƒ',
    moments: { breakfast: 'Ïº┘ä┘üÏÀ┘êÏ▒', lunch: 'Ïº┘äÏ║Ï»ÏºÏí', dinner: 'Ïº┘äÏ╣Ï┤ÏºÏí', drinks: 'Ïº┘ä┘àÏ┤Ï▒┘êÏ¿ÏºÏ¬', desserts: 'Ïº┘äÏ¡┘ä┘ê┘èÏºÏ¬' },
    tags: { vegetarian: '┘åÏ¿ÏºÏ¬┘è', spicy: 'Ï¡ÏºÏ▒', meat: '┘äÏ¡┘ê┘à', fish: 'Ï│┘à┘â', dessert: 'Ï¡┘ä┘ê┘ë' },
    search: 'ÏºÏ¿Ï¡Ï½ Ï╣┘å ÏÀÏ¿┘é...',
    all: 'Ïº┘ä┘â┘ä',
    favorites: 'Ïº┘ä┘à┘üÏÂ┘äÏ®',
    add: 'ÏúÏÂ┘ü',
    addToCart: 'ÏúÏÂ┘ü ÏÑ┘ä┘ë Ïº┘äÏÀ┘äÏ¿',
    ingredients: 'Ïº┘ä┘à┘â┘ê┘åÏºÏ¬',
    allergens: '┘àÏ│Ï¿Ï¿ÏºÏ¬ Ïº┘äÏ¡Ï│ÏºÏ│┘èÏ®',
    noAllergens: '┘äÏº Ï¬┘êÏ¼Ï» ┘àÏ│Ï¿Ï¿ÏºÏ¬ Ï¡Ï│ÏºÏ│┘èÏ® Ï▒Ïª┘èÏ│┘èÏ®',
    spice: 'Ïº┘äÏ¡Ï▒ÏºÏ▒Ï®',
    portion: 'Ïº┘äÏ¡ÏÁÏ®',
    customize: 'Ï¬Ï«ÏÁ┘èÏÁ',
    without: 'Ï¿Ï»┘ê┘å',
    extras: 'ÏÑÏÂÏº┘üÏºÏ¬',
    spicePref: { mild: '┘é┘ä┘è┘ä Ïº┘äÏ¡Ï▒ÏºÏ▒Ï®', normal: 'Ï╣ÏºÏ»┘è', hot: 'Ï¡ÏºÏ▒ Ï¼Ï»Ïº┘ï' },
    note: '┘à┘äÏºÏ¡Ï©Ï® ┘ä┘ä┘àÏÀÏ¿Ï«',
    notePlaceholder: 'Ï¡Ï│ÏºÏ│┘èÏ®Ïî ÏÀÏ▒┘è┘éÏ® Ïº┘äÏÀ┘ç┘èÏî ÏÀ┘äÏ¿ Ï«ÏºÏÁ...',
    cart: 'ÏÀ┘äÏ¿┘è',
    emptyCart: 'Ï│┘äÏ¬┘â ┘üÏºÏ▒Ï║Ï®',
    total: 'Ïº┘ä┘àÏ¼┘à┘êÏ╣',
    order: 'ÏºÏÀ┘äÏ¿ Ïº┘äÏó┘å',
    payment: 'Ïº┘äÏ»┘üÏ╣',
    payCounter: '┘ü┘è Ïº┘äÏÁ┘åÏ»┘ê┘é',
    payTable: 'Ï╣┘ä┘ë Ïº┘äÏÀÏº┘ê┘äÏ®',
    myOrders: 'ÏÀ┘äÏ¿ÏºÏ¬┘è',
    requestBill: 'ÏºÏÀ┘äÏ¿ Ïº┘äÏ¡Ï│ÏºÏ¿',
    billRequested: 'Ï¬┘à ÏÀ┘äÏ¿ Ïº┘äÏ¡Ï│ÏºÏ¿',
    noResults: '┘äÏº ┘è┘êÏ¼Ï» ÏÀÏ¿┘é ┘àÏÀÏºÏ¿┘é ┘äÏ¿Ï¡Ï½┘â.',
    unavailable: 'Ï║┘èÏ▒ ┘àÏ¬┘ê┘üÏ▒',
    viewCart: 'Ï╣Ï▒ÏÂ Ïº┘äÏ│┘äÏ®',
    items: 'Ï╣┘åÏºÏÁÏ▒',
    rate: '┘â┘è┘ü ┘âÏº┘åÏ¬ Ï¬Ï¼Ï▒Ï¿Ï¬┘âÏƒ',
    thanks: 'Ï┤┘âÏ▒Ïº┘ï Ï╣┘ä┘ë Ï¬┘é┘è┘è┘à┘â!',
    send: 'ÏÑÏ▒Ï│Ïº┘ä',
    popular: 'Ïº┘äÏú┘âÏ½Ï▒ ÏÀ┘äÏ¿Ïº┘ï',
    changeMoment: 'Ï¬Ï║┘è┘èÏ▒',
  },
}
