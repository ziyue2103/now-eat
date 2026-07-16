export interface Dish {
  name: string;
  price: number;
  isSignature: boolean;
  image?: string;
  emoji?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  category: RestaurantCategory;
  priceLevel: PriceLevel;
  distance: number;
  dishes: Dish[];
  rating: number;
  reason: string;
  address: string;
  lat?: number;
  lng?: number;
  avg_price?: number;
}

export type RestaurantCategory =
  | '火锅'
  | '烧烤'
  | '快餐'
  | '面食'
  | '日料'
  | '韩料'
  | '西餐'
  | '甜品'
  | '川菜'
  | '粤菜'
  | '小吃'
  | '东南亚菜';

export type PriceLevel = 1 | 2 | 3;

export interface FilterOptions {
  category: RestaurantCategory | '全部';
  priceLevel: PriceLevel | 0;
  maxDistance: number;
}

export interface PickResult {
  restaurant: Restaurant;
  dish: Dish;
  timestamp: number;
}

// GPS 定位相关
export interface GeoLocation {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

export type LocationStatus = 'loading' | 'granted' | 'denied' | 'unavailable' | 'error';

export interface LocationState {
  status: LocationStatus;
  location: GeoLocation | null;
  city: string;
  address: string;
  error: string | null;
}

export const CATEGORIES: (RestaurantCategory | '全部')[] = [
  '全部',
  '火锅',
  '烧烤',
  '快餐',
  '面食',
  '日料',
  '韩料',
  '西餐',
  '甜品',
  '川菜',
  '粤菜',
  '小吃',
  '东南亚菜',
];

export const PRICE_LABELS: Record<PriceLevel | 0, string> = {
  0: '不限',
  1: '实惠 💰',
  2: '适中 💰💰',
  3: '小奢侈 💰💰💰',
};

export const DISTANCE_OPTIONS = [
  { label: '500m', value: 500 },
  { label: '1km', value: 1000 },
  { label: '3km', value: 3000 },
  { label: '不限', value: Infinity },
];

export const QUOTES = [
  '人生的终极难题：今天吃什么？🤔',
  '打开外卖刷了半小时，还是不知道吃啥...',
  '纠结是一种病，我来帮你治 💊',
  '选择恐惧症晚期患者急救中心 🚑',
  '把决定权交给命运吧！',
  '吃饭不纠结，人生少一半烦恼 ✨',
  '今天也是被「吃什么」支配的一天',
  '胃在呼唤，大脑在纠结...',
  '世界上最远的距离，是我和我的晚餐之间隔着一个「选什么」',
  '不纠结了，让缘分帮你选！',
  '哲学家三问：早上吃啥？中午吃啥？晚上吃啥？',
  '让随机拯救你的选择困难 🎲',
];
