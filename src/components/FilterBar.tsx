import { useState } from 'react';
import type { FilterOptions } from '../types';
import { CATEGORIES, PRICE_LABELS, DISTANCE_OPTIONS } from '../types';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
  onReset: () => void;
  filteredCount: number;
}

export default function FilterBar({ filters, onFilterChange, onReset, filteredCount }: FilterBarProps) {
  const [open, setOpen] = useState(false);

  const activeCount =
    (filters.category !== '全部' ? 1 : 0) +
    (filters.priceLevel > 0 ? 1 : 0) +
    (filters.maxDistance < Infinity ? 1 : 0);

  return (
    <div className="filter-bar">
      <button className="filter-toggle" onClick={() => setOpen(!open)}>
        <span>
          🔍 筛选条件
          {activeCount > 0 && <span className="filter-count-badge">{activeCount}</span>}
        </span>
        <span className={`filter-arrow ${open ? 'open' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="filter-body">
          <div className="filter-row">
            <label className="filter-label">类型</label>
            <div className="filter-chips">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`chip ${filters.category === cat ? 'chip-active' : ''}`}
                  onClick={() => onFilterChange('category', cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-row">
            <label className="filter-label">价位</label>
            <div className="filter-chips">
              {(Object.entries(PRICE_LABELS) as [string, string][]).map(([key, label]) => (
                <button
                  key={key}
                  className={`chip ${filters.priceLevel === Number(key) ? 'chip-active' : ''}`}
                  onClick={() => onFilterChange('priceLevel', Number(key) as FilterOptions['priceLevel'])}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-row">
            <label className="filter-label">距离</label>
            <div className="filter-chips">
              {DISTANCE_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  className={`chip ${filters.maxDistance === opt.value ? 'chip-active' : ''}`}
                  onClick={() => onFilterChange('maxDistance', opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-footer">
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              共 <strong style={{ color: 'var(--brand-500)' }}>{filteredCount}</strong> 家可选
            </span>
            <button className="btn-reset" onClick={onReset}>重置</button>
          </div>
        </div>
      )}
    </div>
  );
}
