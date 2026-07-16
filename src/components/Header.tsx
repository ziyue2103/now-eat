import { QUOTES } from '../types';
import { randomPick } from '../utils/random';
import { useState, useEffect } from 'react';

interface HeaderProps {
  combo: number;
  dark: boolean;
  onToggleDark: () => void;
}

export default function Header({ combo, dark, onToggleDark }: HeaderProps) {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const q = randomPick(QUOTES);
    if (q) setQuote(q);
  }, []);

  return (
    <header className="header">
      <button
        className="theme-toggle"
        onClick={onToggleDark}
        title={dark ? '切换浅色模式' : '切换深色模式'}
        aria-label="切换主题"
      >
        {dark ? '☀️' : '🌙'}
      </button>

      <div className="header-icon">🍜</div>
      <h1 className="header-title">现在吃啥</h1>
      <p className="header-subtitle">终结你的选择困难症</p>

      {combo >= 3 ? (
        <p className="header-combo">🔥 连击 x{combo}！选择之魂在燃烧！</p>
      ) : (
        <p className="header-quote">{quote}</p>
      )}
    </header>
  );
}
