import type { LocationState } from '../types';

interface LocationBarProps {
  location: LocationState;
  onRetry: () => void;
}

export default function LocationBar({ location, onRetry }: LocationBarProps) {
  const { status, city, address, error } = location;

  const statusDot = (() => {
    switch (status) {
      case 'loading': return 'loading';
      case 'granted': return 'active';
      default: return 'error';
    }
  })();

  const statusText = (() => {
    switch (status) {
      case 'loading': return '正在定位...';
      case 'granted': return address ? `${city} · ${address}` : city;
      case 'denied': return '定位被拒绝，使用默认位置';
      case 'unavailable': return '定位不可用';
      case 'error': return error || '定位失败';
    }
  })();

  return (
    <div className="location-bar">
      <span className={`location-dot ${statusDot}`} />
      <span className="location-text">{statusText}</span>
      {status !== 'loading' && status !== 'granted' && (
        <button className="location-retry" onClick={onRetry}>
          重试
        </button>
      )}
    </div>
  );
}
