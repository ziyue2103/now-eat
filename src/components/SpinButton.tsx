import { useState, useEffect, useRef, useCallback } from 'react';
import type { Restaurant, Dish } from '../types';
import { randomPick } from '../utils/random';

interface SpinButtonProps {
  onPick: () => { restaurant: Restaurant; dish: Dish } | null;
  disabled: boolean;
  restaurants: Restaurant[];
}

const SPIN_DURATION = 3000;
const INITIAL_INTERVAL = 60;
const MAX_INTERVAL = 280;

export default function SpinButton({ onPick, disabled, restaurants }: SpinButtonProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [displayDish, setDisplayDish] = useState('');
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'slowing' | 'done'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef(0);

  const tick = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const progress = Math.min(elapsed / SPIN_DURATION, 1);
    const currentInterval = INITIAL_INTERVAL + (MAX_INTERVAL - INITIAL_INTERVAL) * Math.pow(progress, 2.5);

    // 滚动展示
    const pool = restaurants.length > 0 ? restaurants : [];
    if (pool.length > 0) {
      const r = randomPick(pool);
      if (r) {
        setDisplayName(r.name);
        setDisplayDish(randomPick(r.dishes)?.name || '');
      }
    }

    if (progress >= 0.65 && phase === 'spinning') setPhase('slowing');

    if (progress >= 1) {
      const result = onPick();
      if (result) {
        setDisplayName(result.restaurant.name);
        setDisplayDish(result.dish.name);
      }
      setPhase('done');
      setIsSpinning(false);
    } else {
      timerRef.current = setTimeout(tick, currentInterval);
    }
  }, [phase, onPick, restaurants]);

  useEffect(() => {
    if (!isSpinning && phase === 'done') {
      const t = setTimeout(() => setPhase('idle'), 600);
      return () => clearTimeout(t);
    }
  }, [isSpinning, phase]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = () => {
    if (disabled) return;

    if (isSpinning) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      const result = onPick();
      if (result) {
        setDisplayName(result.restaurant.name);
        setDisplayDish(result.dish.name);
      }
      setPhase('done');
      setIsSpinning(false);
    } else {
      setPhase('spinning');
      setIsSpinning(true);
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(tick, INITIAL_INTERVAL);
    }
  };

  return (
    <div className="spin-area">
      <div className={`slot-machine ${isSpinning ? 'slot-spinning' : ''} ${phase === 'slowing' ? 'slot-slowing' : ''}`}>
        <div className="slot-window">
          <div className="slot-content">
            <span className={`slot-restaurant ${phase === 'done' ? 'slot-done' : ''}`}>
              {displayName || '???'}
            </span>
            <span className="slot-divider">·</span>
            <span className={`slot-dish ${phase === 'done' ? 'slot-done' : ''}`}>
              {displayDish || '???'}
            </span>
          </div>
        </div>
        <div className="slot-lights">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className={`slot-light ${isSpinning ? 'light-blink' : ''} ${phase === 'done' ? 'light-done' : ''}`}
            />
          ))}
        </div>
      </div>

      <button
        className={`btn-main ${isSpinning ? 'btn-spinning' : ''} ${phase === 'done' ? 'btn-done' : ''}`}
        onClick={handleClick}
        disabled={disabled}
      >
        <span className="btn-main-icon">{isSpinning ? '🛑' : '🎲'}</span>
        <span className="btn-main-text">
          {isSpinning ? (phase === 'slowing' ? '点击停止！' : '点我揭晓！') : '现在吃啥'}
        </span>
      </button>

      {disabled && <p className="no-result-hint">没有符合条件的商家，请调整筛选条件哦～</p>}
    </div>
  );
}
