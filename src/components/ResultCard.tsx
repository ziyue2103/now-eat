import type { PickResult } from '../types';
import { useState } from 'react';

interface ResultCardProps {
  result: PickResult | null;
  combo: number;
}

// 评分条形图
function RatingBar({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  const percent = Math.round((rating / 5) * 100);

  return (
    <div className="rating-detail">
      <div className="rating-score">
        <span className="rating-number">{rating.toFixed(1)}</span>
        <span className="rating-unit">/5</span>
      </div>
      <div className="rating-bar-wrap">
        <div className="rating-bar-track">
          <div className="rating-bar-fill" style={{ width: `${percent}%` }} />
        </div>
        <div className="rating-stars-sm">
          {'★'.repeat(fullStars)}
          {hasHalf && '⯨'}
          {'☆'.repeat(emptyStars)}
        </div>
      </div>
    </div>
  );
}

// 菜品 emoji 卡片
function DishCard({ dish }: { dish: PickResult['dish'] }) {
  const bgColors = [
    'linear-gradient(135deg, #fff5eb, #ffe8d5)',
    'linear-gradient(135deg, #fef3c7, #fde68a)',
    'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    'linear-gradient(135deg, #ede9fe, #ddd6fe)',
  ];
  const bg = bgColors[Math.abs(dish.name.length) % bgColors.length];

  return (
    <div className="dish-card" style={{ background: bg }}>
      <div className="dish-card-emoji">{dish.emoji || '🍽️'}</div>
      <div className="dish-card-body">
        <div className="dish-card-top">
          <span className="dish-card-name">{dish.name}</span>
          {dish.isSignature && <span className="signature-badge">招牌</span>}
        </div>
        <span className="dish-card-price">¥{dish.price}</span>
      </div>
    </div>
  );
}

// 静态地图
function StaticMap({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  const key = 'W7TBZ-JXICU-XWCVO-2SCOB-A3BGO-6WB65';
  const center = `${lat},${lng}`;
  const url = `https://apis.map.qq.com/ws/staticmap/v2/?center=${center}&zoom=15&size=600*200&markers=size:large|color:0xff6b35|${center}&key=${key}`;

  return (
    <div className="map-container">
      <img
        className="map-image"
        src={url}
        alt={`${name}位置`}
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <div className="map-overlay">
        <span className="map-pin">📍</span>
      </div>
    </div>
  );
}

export default function ResultCard({ result, combo }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const { restaurant, dish } = result;

  const handleShare = async () => {
    const text = `🍜 今天吃「${restaurant.name}」的「${dish.name}」！${dish.price}元 · ${restaurant.reason}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: '现在吃啥', text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasCoords = restaurant.lat != null && restaurant.lng != null;

  return (
    <div className="result-card animate-pop" key={result.timestamp}>
      {/* 地图 */}
      {hasCoords && (
        <StaticMap lat={restaurant.lat!} lng={restaurant.lng!} name={restaurant.name} />
      )}

      <div className="result-header">
        <span className="result-badge">
          {combo >= 5 ? '🔥 命运主宰者' : combo >= 3 ? '⚡ 选择达人' : '🎯 命运的选择'}
        </span>
      </div>

      <div className="result-body">
        <h2 className="result-restaurant">{restaurant.name}</h2>

        <div className="result-meta">
          <span className="result-category">{restaurant.category}</span>
          <span className="result-distance">📍 {restaurant.distance}m</span>
          {restaurant.avg_price && (
            <span className="result-avg-price">人均 ¥{restaurant.avg_price}</span>
          )}
        </div>

        {/* 评分条 */}
        <RatingBar rating={restaurant.rating} />

        {/* 菜品卡片 */}
        <div className="result-section-label">🎯 为你推荐</div>
        <DishCard dish={dish} />

        {/* 推荐理由 */}
        <div className="result-reason">
          <span className="reason-icon">💡</span>
          <p>{restaurant.reason}</p>
        </div>

        {/* 地址 */}
        <div className="result-address">
          📍 {restaurant.address}
        </div>
      </div>

      <div className="result-actions">
        <button className="btn-share" onClick={handleShare}>
          {copied ? '✅ 已复制' : '📋 分享'}
        </button>
      </div>
    </div>
  );
}
