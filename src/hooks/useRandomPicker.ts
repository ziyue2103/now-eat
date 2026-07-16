import { useState, useCallback } from 'react';
import type { FilterOptions, PickResult, Restaurant } from '../types';
import { randomPick } from '../utils/random';

const defaultFilters: FilterOptions = {
  category: '全部',
  priceLevel: 0,
  maxDistance: Infinity,
};

export function useRandomPicker() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [result, setResult] = useState<PickResult | null>(null);
  const [history, setHistory] = useState<PickResult[]>([]);

  const filteredRestaurants = useCallback((): Restaurant[] => {
    return restaurants.filter((r) => {
      if (filters.category !== '全部' && r.category !== filters.category) return false;
      if (filters.priceLevel > 0 && r.priceLevel !== filters.priceLevel) return false;
      if (filters.maxDistance < Infinity && r.distance > filters.maxDistance) return false;
      return true;
    });
  }, [filters, restaurants]);

  const pick = useCallback(() => {
    const pool = filteredRestaurants();
    if (pool.length === 0) return null;

    const restaurant = randomPick(pool);
    if (!restaurant) return null;

    const dish = randomPick(restaurant.dishes);
    if (!dish) return null;

    const pickResult: PickResult = {
      restaurant,
      dish,
      timestamp: Date.now(),
    };

    setResult(pickResult);
    setHistory((prev) => [pickResult, ...prev].slice(0, 20));
    return pickResult;
  }, [filteredRestaurants]);

  const updateFilter = useCallback(
    <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return {
    restaurants,
    setRestaurants,
    filters,
    result,
    history,
    pick,
    updateFilter,
    resetFilters,
    filteredCount: filteredRestaurants().length,
  };
}
