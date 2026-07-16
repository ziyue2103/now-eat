import { useState, useCallback, useRef, useEffect } from 'react';
import { useRandomPicker } from './hooks/useRandomPicker';
import { useDarkMode } from './hooks/useDarkMode';
import { useGeolocation } from './hooks/useGeolocation';
import { fetchNearbyRestaurants, reverseGeocode } from './services/mapService';
import Header from './components/Header';
import LocationBar from './components/LocationBar';
import FilterBar from './components/FilterBar';
import SpinButton from './components/SpinButton';
import ResultCard from './components/ResultCard';
import HistoryPanel from './components/HistoryPanel';
import Footer from './components/Footer';
import Confetti from './components/Confetti';
import LoadingSkeleton from './components/LoadingSkeleton';
import './App.css';

export default function App() {
  const {
    restaurants,
    setRestaurants,
    filters,
    result,
    history,
    pick,
    updateFilter,
    resetFilters,
    filteredCount,
  } = useRandomPicker();

  const { dark, toggle: toggleDark } = useDarkMode();
  const geo = useGeolocation({ enableHighAccuracy: true, timeout: 15000 });

  const [combo, setCombo] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const lastResultTime = useRef(0);
  const fetchLock = useRef(false);

  // GPS 定位成功后，调用地图 API 获取周边餐厅
  useEffect(() => {
    if (geo.status !== 'granted' || !geo.location || fetchLock.current) return;

    const { lat, lng } = geo.location;
    fetchLock.current = true;
    setDataLoading(true);

    Promise.all([
      fetchNearbyRestaurants(lat, lng, 1000),
      reverseGeocode(lat, lng),
    ])
      .then(([rests, addrInfo]) => {
        if (rests.length > 0) {
          setRestaurants(rests);
        }
        // 更新城市/地址信息（通过修改 geo 状态无法做到，这里只打印）
        if (addrInfo.city !== '未知') {
          console.log(`📍 ${addrInfo.city} · ${addrInfo.address}`);
        }
      })
      .catch((err) => {
        console.warn('地图 API 调用失败:', err);
      })
      .finally(() => {
        setDataLoading(false);
      });
  }, [geo.status, geo.location, setRestaurants]);

  // GPS 被拒绝或不可用时，回退模拟数据
  useEffect(() => {
    if (geo.status === 'denied' || geo.status === 'unavailable' || geo.status === 'error') {
      import('./data/real-restaurants').then((mod) => {
        setRestaurants(mod.realRestaurants);
      });
    }
  }, [geo.status, setRestaurants]);

  const handlePick = useCallback(() => {
    const pickResult = pick();
    if (!pickResult) return null;

    const now = Date.now();
    if (now - lastResultTime.current < 3000) {
      setCombo((prev) => prev + 1);
    } else {
      setCombo(1);
    }
    lastResultTime.current = now;

    if (combo + 1 >= 3) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }

    return pickResult;
  }, [pick, combo]);

  const handleRetryLocation = useCallback(() => {
    fetchLock.current = false;
    geo.retry();
  }, [geo]);

  return (
    <div className="app">
      <Confetti active={showConfetti} combo={combo} />
      <div className="container">
        <Header combo={combo} dark={dark} onToggleDark={toggleDark} />
        <LocationBar location={geo} onRetry={handleRetryLocation} />

        {dataLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <FilterBar
              filters={filters}
              onFilterChange={updateFilter}
              onReset={resetFilters}
              filteredCount={filteredCount}
            />
            <SpinButton
              onPick={handlePick}
              disabled={filteredCount === 0}
              restaurants={restaurants}
            />
            <ResultCard result={result} combo={combo} />
            <HistoryPanel history={history} />
          </>
        )}

        <Footer />
      </div>
    </div>
  );
}
