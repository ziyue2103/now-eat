import type { Restaurant, RestaurantCategory } from '../types';

const TMAP_KEY = import.meta.env.VITE_TMAP_KEY || '';

interface TmapPOI {
  id: string;
  title: string;
  address: string;
  category: string;
  location: { lat: number; lng: number };
  _distance: number;
  avg_price: number;
  star_level: number;
  tel: string;
}

// 分类映射
const CAT_MAP: Record<string, RestaurantCategory> = {
  '火锅': '火锅', '烧烤': '烧烤',
  '小吃快餐': '快餐', '面馆': '面食', '小吃': '小吃',
  '日本料理': '日料', '韩国料理': '韩料',
  '西餐': '西餐', '意大利菜': '西餐', '德国菜': '西餐', '牛排': '西餐',
  '川菜': '川菜', '粤菜': '粤菜',
};

const DISH_POOLS: Record<string, { name: string; price: number; isSignature: boolean; emoji: string }[]> = {
  '火锅': [{ name: '招牌毛肚', price: 48, isSignature: true, emoji: '🫕' }, { name: '手工虾滑', price: 38, isSignature: true, emoji: '🦐' }, { name: '精品肥牛', price: 58, isSignature: false, emoji: '🥩' }, { name: '酥肉', price: 28, isSignature: false, emoji: '🍖' }],
  '烧烤': [{ name: '羊肉串', price: 6, isSignature: true, emoji: '🍢' }, { name: '烤生蚝', price: 12, isSignature: true, emoji: '🦪' }, { name: '烤鸡翅', price: 10, isSignature: false, emoji: '🍗' }, { name: '烤茄子', price: 15, isSignature: false, emoji: '🍆' }],
  '快餐': [{ name: '招牌套餐', price: 35, isSignature: true, emoji: '🍔' }, { name: '炸鸡汉堡', price: 28, isSignature: false, emoji: '🍗' }, { name: '薯条', price: 12, isSignature: false, emoji: '🍟' }, { name: '可乐', price: 8, isSignature: false, emoji: '🥤' }],
  '面食': [{ name: '招牌牛肉面', price: 28, isSignature: true, emoji: '🍜' }, { name: '炸酱面', price: 22, isSignature: false, emoji: '🍝' }, { name: '小笼包', price: 18, isSignature: false, emoji: '🥟' }, { name: '酸梅汤', price: 8, isSignature: false, emoji: '🧃' }],
  '日料': [{ name: '三文鱼刺身', price: 48, isSignature: true, emoji: '🍣' }, { name: '鳗鱼寿司', price: 28, isSignature: false, emoji: '🍣' }, { name: '天妇罗', price: 35, isSignature: false, emoji: '🍤' }, { name: '抹茶大福', price: 15, isSignature: false, emoji: '🍡' }],
  '韩料': [{ name: '烤五花肉', price: 58, isSignature: true, emoji: '🥩' }, { name: '石锅拌饭', price: 32, isSignature: false, emoji: '🍚' }, { name: '韩式炸鸡', price: 45, isSignature: true, emoji: '🍗' }, { name: '泡菜汤', price: 22, isSignature: false, emoji: '🥘' }],
  '西餐': [{ name: '经典汉堡', price: 58, isSignature: true, emoji: '🍔' }, { name: '肉酱意面', price: 42, isSignature: false, emoji: '🍝' }, { name: '凯撒沙拉', price: 35, isSignature: false, emoji: '🥗' }, { name: '提拉米苏', price: 28, isSignature: false, emoji: '🍰' }],
  '川菜': [{ name: '水煮鱼', price: 68, isSignature: true, emoji: '🐟' }, { name: '宫保鸡丁', price: 32, isSignature: false, emoji: '🥜' }, { name: '麻婆豆腐', price: 22, isSignature: true, emoji: '🫘' }, { name: '担担面', price: 18, isSignature: false, emoji: '🍜' }],
  '粤菜': [{ name: '虾饺皇', price: 32, isSignature: true, emoji: '🦐' }, { name: '烧鹅', price: 68, isSignature: true, emoji: '🦆' }, { name: '肠粉', price: 18, isSignature: false, emoji: '🫔' }, { name: '杨枝甘露', price: 22, isSignature: false, emoji: '🥭' }],
  '小吃': [{ name: '招牌拌面', price: 15, isSignature: true, emoji: '🍜' }, { name: '蒸饺', price: 12, isSignature: false, emoji: '🥟' }, { name: '卤肉饭', price: 22, isSignature: false, emoji: '🍚' }, { name: '豆花', price: 8, isSignature: false, emoji: '🍮' }],
  '东南亚菜': [{ name: '冬阴功汤', price: 48, isSignature: true, emoji: '🍲' }, { name: '绿咖喱鸡', price: 42, isSignature: false, emoji: '🍛' }, { name: '芒果糯米饭', price: 25, isSignature: true, emoji: '🥭' }, { name: '泰式炒河粉', price: 32, isSignature: false, emoji: '🍜' }],
  '甜品': [{ name: '杨枝甘露', price: 28, isSignature: true, emoji: '🥭' }, { name: '榴莲班戟', price: 22, isSignature: true, emoji: '🍰' }, { name: '芝麻糊', price: 16, isSignature: false, emoji: '🥣' }, { name: '芒果白雪', price: 25, isSignature: false, emoji: '🍧' }],
};

const REASONS: Record<string, string[]> = {
  '火锅': ['天冷就要吃火锅！', '红油翻滚，人生沸腾', '没有什么是一顿火锅解决不了的'],
  '烧烤': ['烟火气最抚人心', '滋滋冒油，香味扑鼻', '夜宵之王，无可替代'],
  '快餐': ['快速解决战斗', '经典味道永不出错', '方便快捷，不用等'],
  '面食': ['一碗热面暖胃暖心', '碳水才是快乐源泉', '简单却满足的幸福感'],
  '日料': ['精致料理，治愈人心', '一口穿越到东京', '新鲜食材，原味享受'],
  '韩料': ['韩剧同款美食', '泡菜配烤肉，绝了', '甜辣交织的味觉之旅'],
  '西餐': ['仪式感满满的一餐', '换换口味也不错', '优雅地填饱肚子'],
  '川菜': ['麻辣鲜香，下饭神器', '无辣不欢的快乐', '川味正宗，巴适得板'],
  '粤菜': ['清淡鲜美，养生首选', '食在广州，味在粤菜', '一盅两件的惬意'],
  '小吃': ['街头巷尾的美味', '经济实惠又好吃', '小吃也有大味道'],
  '东南亚菜': ['酸辣开胃，一秒入夏', '异国风情，味蕾旅行', '热带风味的治愈力量'],
  '甜品': ['生活有点苦，需要一点甜', '甜品是第二个胃', '甜蜜治愈一切不开心'],
};

function mapCategory(catStr: string): RestaurantCategory {
  for (const [key, val] of Object.entries(CAT_MAP)) {
    if (catStr.includes(key)) return val;
  }
  return '快餐';
}

function getRandomDishes(cat: RestaurantCategory) {
  return DISH_POOLS[cat] || DISH_POOLS['快餐'];
}

function getRandomReason(cat: RestaurantCategory): string {
  const reasons = REASONS[cat] || ['值得一试'];
  return reasons[Math.floor(Math.random() * reasons.length)];
}

/**
 * JSONP 调用腾讯地图 API（绕过 CORS）
 * 腾讯地图 WebService API 支持 output=jsonp，返回 QQmap&&QQmap(data) 格式
 */
function jsonpRequest<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const callbackName = `__tmap_cb_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const script = document.createElement('script');
    let timeoutId: ReturnType<typeof setTimeout>;

    const cleanup = () => {
      delete (window as any)[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
      clearTimeout(timeoutId);
    };

    (window as any)[callbackName] = (data: T) => {
      cleanup();
      resolve(data);
    };

    timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('JSONP request timeout'));
    }, 12000);

    const sep = url.includes('?') ? '&' : '?';
    script.src = `${url}${sep}output=jsonp&callback=${callbackName}`;
    script.onerror = () => {
      cleanup();
      reject(new Error('JSONP request failed'));
    };

    document.head.appendChild(script);
  });
}

/**
 * 搜索周边餐厅（通过 JSONP 绕过 CORS）
 */
export async function fetchNearbyRestaurants(
  lat: number,
  lng: number,
  radius = 1000
): Promise<Restaurant[]> {
  if (!TMAP_KEY) {
    console.warn('TMAP_KEY not configured, using empty result');
    return [];
  }

  const keywords = [
    '火锅', '烧烤', '快餐', '面馆', '日料',
    '韩国料理', '西餐', '川菜', '粤菜', '小吃',
  ];

  const allResults: Restaurant[] = [];
  const seenIds = new Set<string>();

  for (const kw of keywords) {
    try {
      const baseUrl = 'https://apis.map.qq.com/ws/place/v1/search';
      const params = new URLSearchParams({
        keyword: kw,
        boundary: `nearby(${lat},${lng},${radius})`,
        page_size: '5',
        key: TMAP_KEY,
        orderby: '_distance',
      });

      const data = await jsonpRequest<{ status: number; data?: TmapPOI[] }>(
        `${baseUrl}?${params.toString()}`
      );

      if (data.status !== 0 || !data.data) continue;

      for (const poi of data.data) {
        if (seenIds.has(poi.id)) continue;
        seenIds.add(poi.id);

        const cat = mapCategory(poi.category);
        const price = poi.avg_price > 0 ? poi.avg_price : [30, 50, 80, 120][Math.floor(Math.random() * 4)];
        const priceLevel = price < 40 ? 1 : price < 100 ? 2 : 3;
        const rating = poi.star_level || 4.0;

        allResults.push({
          id: poi.id,
          name: poi.title,
          category: cat,
          priceLevel: priceLevel as 1 | 2 | 3,
          distance: Math.round(poi._distance),
          dishes: getRandomDishes(cat),
          rating,
          reason: getRandomReason(cat),
          address: poi.address,
          lat: poi.location.lat,
          lng: poi.location.lng,
          avg_price: price,
        });
      }
    } catch (err) {
      console.warn(`Search failed for "${kw}":`, err);
    }
  }

  return allResults;
}

/**
 * 逆地址解析（JSONP）
 */
export async function reverseGeocode(lat: number, lng: number): Promise<{ city: string; address: string }> {
  if (!TMAP_KEY) return { city: '未知', address: '' };

  try {
    const baseUrl = 'https://apis.map.qq.com/ws/geocoder/v1/';
    const params = new URLSearchParams({
      location: `${lat},${lng}`,
      key: TMAP_KEY,
    });

    const data = await jsonpRequest<{ status: number; result?: { address: string; ad_info?: { city: string }; address_component?: { city: string } } }>(
      `${baseUrl}?${params.toString()}`
    );

    if (data.status === 0 && data.result) {
      const adInfo = data.result.ad_info as { city?: string } | undefined;
      const addrComponent = data.result.address_component as { city?: string } | undefined;
      return {
        city: adInfo?.city || addrComponent?.city || '未知',
        address: data.result.address || '',
      };
    }
  } catch (err) {
    console.warn('Reverse geocode failed:', err);
  }

  return { city: '未知', address: '' };
}
