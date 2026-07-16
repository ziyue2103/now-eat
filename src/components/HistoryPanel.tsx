import type { PickResult } from '../types';
import { useState } from 'react';

interface HistoryPanelProps {
  history: PickResult[];
}

export default function HistoryPanel({ history }: HistoryPanelProps) {
  const [expanded, setExpanded] = useState(false);

  if (history.length === 0) return null;

  const recent = history.slice(0, 5);

  return (
    <div className="history-panel">
      <button className="history-toggle" onClick={() => setExpanded(!expanded)}>
        <span>📜 选择记录 ({history.length})</span>
        <span className={`history-arrow ${expanded ? 'arrow-up' : ''}`}>▼</span>
      </button>

      {expanded && (
        <div className="history-list">
          {recent.map((item, i) => (
            <div key={item.timestamp} className={`history-item ${i === 0 ? 'history-latest' : ''}`}>
              <span className="history-index">#{history.length - i}</span>
              <div className="history-content">
                <span className="history-restaurant">{item.restaurant.name}</span>
                <span className="history-dish">{item.dish.name}</span>
              </div>
              <span className="history-price">¥{item.dish.price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
