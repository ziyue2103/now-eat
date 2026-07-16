import { useState, useEffect, useCallback, useRef } from 'react';
import type { GeoLocation, LocationState } from '../types';

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const { enableHighAccuracy = true, timeout = 10000, maximumAge = 300000 } = options;

  const [state, setState] = useState<LocationState>({
    status: 'loading',
    location: null,
    city: '',
    address: '',
    error: null,
  });

  const watchIdRef = useRef<number | null>(null);

  const updateLocation = useCallback((position: GeolocationPosition) => {
    const loc: GeoLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
    };

    setState((prev) => ({
      ...prev,
      status: 'granted' as const,
      location: loc,
      error: null,
    }));
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let status: LocationState['status'] = 'error';
    let message = error.message;

    switch (error.code) {
      case error.PERMISSION_DENIED:
        status = 'denied';
        message = '位置权限被拒绝，请允许浏览器获取位置信息';
        break;
      case error.POSITION_UNAVAILABLE:
        status = 'unavailable';
        message = '无法获取位置信息，请检查设备定位设置';
        break;
      case error.TIMEOUT:
        message = '获取位置超时，请重试';
        break;
    }

    setState((prev) => ({
      ...prev,
      status,
      error: message,
    }));
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        status: 'unavailable',
        error: '您的浏览器不支持地理定位',
      }));
      return;
    }

    setState((prev) => ({ ...prev, status: 'loading', error: null }));

    // 先获取一次
    navigator.geolocation.getCurrentPosition(updateLocation, handleError, {
      enableHighAccuracy,
      timeout,
      maximumAge,
    });

    // 然后持续监听
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    watchIdRef.current = navigator.geolocation.watchPosition(
      updateLocation,
      handleError,
      { enableHighAccuracy, timeout, maximumAge }
    );
  }, [enableHighAccuracy, timeout, maximumAge, updateLocation, handleError]);

  useEffect(() => {
    requestLocation();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [requestLocation]);

  const retry = useCallback(() => {
    requestLocation();
  }, [requestLocation]);

  return { ...state, retry };
}
