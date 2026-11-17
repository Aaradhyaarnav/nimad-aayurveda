/**
 * Everything the client may change lives in this one file.
 * Add a product: copy an entry in PRODUCTS. Set `status: 'soon'` for a placeholder slot.
 */

export const BRAND = {
  name: 'The Nimad Aayurveda',
  short: 'The Nimad',
  tagline: 'प्रकृति शरणम् गच्छामि',
  taglineEn: 'I take refuge in Nature',
  whatsapp: '918435475430', // country code + number, no "+"
  phoneDisplay: '+91 84354 75430',
  email: 'thenimadaayurveda@gmail.com',
  address: 'Bakaner, District Dhar, Madhya Pradesh 454446',
  instagram: 'https://www.instagram.com/thenimadaayurveda.in/',
  founderInstagram: 'https://www.instagram.com/ajayy_19sen/',
  deliveryNote: 'Delivery charges are confirmed on WhatsApp',
}

export type ProductId = 'shatghritam' | 'oil' | 'facewash' | 'soap' | 'shampoo' | 'soon-1' | 'soon-2'

export interface Product {
  id: ProductId
  status: 'live' | 'soon'
  name: string
  hindi: string
  kicker: string
  price?: number
  size?: string
  model?: string // GLB in /public/models
  render?: string // transparent studio still
  photo?: string
  tint: string // card/background tint
  accent: string
  hook: string
  hookHindi?: string
  story: string
  why: string[]
  forWhom: string[]
  howTo: string[]
  ingredients: { name: string; note?: string; pct?: string }[]
  fine?: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'shatghritam',
    status: 'live',
    name: 'Shatghritam',
    hindi: 'शतघृतम्',
    kicker: 'Shat Dhauta Ghrita Moisturizer',
    price: 400,
    model: '/models/shatghritam.glb',
    render: '/img/renders/shatghritam.webp',
    photo: '/img/products/shatghritam-jar.webp',
    tint: '#efe4c4',
    accent: '#c9a24b',
    hook: 'Desi ghee, washed a hundred times.',
    hookHindi: '100 बार धुले देसी घी की शुद्धता',
    story:
      'Shat Dhauta Ghrita is an old Ayurvedic method. Pure A2 Gir cow ghee is washed in cold water one hundred times by hand. It loses its heaviness and turns light, silky and non-greasy, so the skin drinks it in. Ayurveda counts it among the best snehana dravya for skin.',
    why: [
      'Washed 100 times, so it never feels sticky',
      'Deep, lasting moisture for dry skin',
      'Softens rough, tight and winter-cracked skin',
      'Lips, hands, feet, face: one jar',
    ],
    forWhom: ['Dry and normal skin', 'Winter dryness and cracked skin', 'Your night routine'],
    howTo: ['Cleanse and pat dry', 'Take a little, massage gently', '1 to 2 times a day, best before bed'],
    ingredients: [
      { name: 'A2 Gir Cow Ghee', note: 'washed 100× in cold water' },
      { name: '10,000 rotations', note: 'with mantra chanting' },
    ],
    fine: 'Patch test before first use. For any skin condition, consult a doctor. Temperature sensitive: store cool.',
  },
  {
    id: 'oil',
    status: 'live',
    name: 'Neerbhringadi Tel',
    hindi: 'नीरभृंगादी तेल',
    kicker: 'Handmade Ayurvedic hair oil',
    price: 349,
    size: '100 ml',
    model: '/models/oil.glb',
    render: '/img/renders/oil.webp',
    photo: '/img/products/neerbhringadi-tel.webp',
    tint: '#f3e1c2',
    accent: '#c27a32',
    hook: 'Ten herbs. One slow, warm massage.',
    hookHindi: 'हल्का गर्म करें, 5–7 मिनट मालिश करें',
    story:
      'Cooked in small batches in Bakaner from herbs Nimad grows best: bhringraj and nirgundi, amla fruit and leaf, neem, kadipatta, kalonji, kala til, aloe vera and methi dana.',
    why: ['Ten traditional herbs', 'Made by hand in Bakaner', 'For hair-fall-prone, dry and stressed scalps', 'No mineral-oil shortcuts'],
    forWhom: ['Hair fall and thinning', 'Dry, frizzy hair', 'Weekly scalp ritual'],
    howTo: ['Warm the oil lightly', 'Massage gently for 5 to 7 minutes', 'Then wash with shampoo'],
    ingredients: [
      { name: 'Bhringraj' }, { name: 'Nirgundi' }, { name: 'Amla' }, { name: 'Amla Patta' }, { name: 'Neem' },
      { name: 'Kadipatta' }, { name: 'Kalonji' }, { name: 'Kala Til' }, { name: 'Aloe Vera' }, { name: 'Methi Dana' },
    ],
  },
  {
    id: 'facewash',
    status: 'live',
    name: 'Herbal Facewash',
    hindi: 'हर्बल फेसवॉश',
    kicker: 'Feel the Sacred Cool',
    price: 399,
    size: '100 ml',
    model: '/models/facewash.glb',
    render: '/img/renders/facewash.webp',
    photo: '/img/products/facewash-marble.webp',
    tint: '#e6ebdb',
    accent: '#7d8f5a',
    hook: '42% aloe. 12% rose water. Cool as a ghat at dawn.',
    story:
      'An everyday cleanser built on aloe vera gel and rose water, with neem, chandan, cucumber, green tea and haldi, plus a breath of menthol for the cool finish. Suitable for all skin types.',
    why: ['Deep clean without the stripped feeling', 'Helps balance oil', 'Menthol cool finish', 'Suitable for all skin types'],
    forWhom: ['Oily and combination skin', 'Hot, humid days', 'Morning and night'],
    howTo: ['Apply on a wet face', 'Massage gently', 'Rinse'],
    ingredients: [
      { name: 'Aloe Vera Gel', pct: '42%' }, { name: 'Rose Water', pct: '12%' }, { name: 'Neem Extract', pct: '8%' },
      { name: 'Chandan Extract', pct: '6%' }, { name: 'Rose Petals', pct: '5%' }, { name: 'Cucumber', pct: '5%' },
      { name: 'Green Tea', pct: '4.5%' }, { name: 'Haldi', pct: '3%' }, { name: 'Menthol', pct: '0.5%' },
    ],
    fine: 'Full INCI: Aloe Vera Gel 42%, Rose Water 12%, Cocamidopropyl Betaine 8%, Neem Extract 8%, Chandan Extract 6%, Rose Petals Extract 5%, Cucumber Extract 5%, Green Tea Extract 4.5%, Haldi Extract 3%, Glycerin 3%, Phenoxyethanol 0.8%, Carbomer 0.7%, Menthol Crystals 0.5%, Citric Acid 0.5%. Mfd. by GNC Foods and Pharma, Shahabad, Haryana. Mfg. Lic. 1544 ISM (H). Patch test first. For external use only.',
  },
  {
    id: 'soap',
    status: 'live',
    name: 'Ubtan Soap',
    hindi: 'उबटन साबुन',
    kicker: 'The Nimad Essentials',
    price: 100,
    model: '/models/soap.glb',
    render: '/img/renders/soap.webp',
    photo: '/img/products/ubtan-soap.webp',
    tint: '#ece0c8',
    accent: '#8a6420',
    hook: 'Dadi-Nani ka ubtan, ab sabun ke roop mein.',
    hookHindi: 'रूप जो तक जाए',
    story:
      'Before soap, there was ubtan: besan, multani mitti and chandan, mixed fresh in a katori. This bar keeps that ritual, with goat milk for softness and neem powder for daily cleansing.',
    why: ['Traditional ubtan base', 'Gentle exfoliation', 'Calming sandalwood scent', 'Good for oily skin'],
    forWhom: ['Daily bath', 'Oily and normal skin', 'Anyone who misses ubtan'],
    howTo: ['Lather on wet skin', 'Massage in small circles', 'Rinse'],
    ingredients: [
      { name: 'Goat Milk', note: 'softness' }, { name: 'Multani Mitti', note: 'deep cleansing' },
      { name: 'Chandan', note: 'cooling and fragrance' }, { name: 'Besan', note: 'light exfoliation' },
      { name: 'Neem Powder', note: 'daily cleansing' }, { name: 'Sandalwood Oil', note: 'fragrance' },
    ],
  },
  {
    id: 'shampoo',
    status: 'soon',
    name: 'Herbal Shampoo',
    hindi: 'हर्बल शैम्पू',
    kicker: 'Being perfected in Bakaner',
    tint: '#f1e6e2',
    accent: '#b3121f',
    hook: 'Neerbhringadi Tel needs a partner. It is almost ready.',
    story: '', why: [], forWhom: [], howTo: [], ingredients: [],
  },
  {
    id: 'soon-1', status: 'soon', name: 'Something new', hindi: 'जल्द आ रहा है', kicker: 'From the Nimad kitchen',
    tint: '#f3ece0', accent: '#b3121f', hook: 'Another old recipe is on the way.', story: '', why: [], forWhom: [], howTo: [], ingredients: [],
  },
  {
    id: 'soon-2', status: 'soon', name: 'Something new', hindi: 'जल्द आ रहा है', kicker: 'From the Nimad kitchen',
    tint: '#f3ece0', accent: '#b3121f', hook: 'Tell us what you want next.', story: '', why: [], forWhom: [], howTo: [], ingredients: [],
  },
]

export const LIVE = PRODUCTS.filter((p) => p.status === 'live')
export const byId = (id: ProductId) => PRODUCTS.find((p) => p.id === id)!

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

export function waLink(text: string) {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`
}
