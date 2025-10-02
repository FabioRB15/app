/**
 * Custom hooks for performance optimization
 */
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

/**
 * Debounce hook for API calls and search
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Throttle hook for performance-sensitive operations
 */
export const useThrottle = (callback, delay) => {
  const throttleRef = useRef(false);
  const timeoutRef = useRef(null);

  const throttledCallback = useCallback(
    (...args) => {
      if (!throttleRef.current) {
        callback(...args);
        throttleRef.current = true;

        timeoutRef.current = setTimeout(() => {
          throttleRef.current = false;
        }, delay);
      }
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
};

/**
 * Intersection Observer hook for lazy loading
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    const target = targetRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [options, hasIntersected]);

  return { targetRef, isIntersecting, hasIntersected };
};

/**
 * Image lazy loading hook
 */
export const useLazyImage = (src, placeholder = null) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { targetRef, hasIntersected } = useIntersectionObserver();

  useEffect(() => {
    if (hasIntersected && src) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      
      img.onerror = () => {
        setIsError(true);
      };
      
      img.src = src;
    }
  }, [hasIntersected, src]);

  return {
    targetRef,
    imageSrc,
    isLoaded,
    isError,
    hasIntersected
  };
};

/**
 * Local storage hook with memoization
 */
export const useLocalStorage = (key, initialValue) => {
  // Memoize the initial value retrieval
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * API cache hook with TTL
 */
export const useApiCache = (key, ttl = 5 * 60 * 1000) => { // 5 minutes default TTL
  const [cache, setCache] = useLocalStorage(`api_cache_${key}`, null);

  const getCachedData = useCallback(() => {
    if (!cache) return null;
    
    const isExpired = Date.now() - cache.timestamp > ttl;
    if (isExpired) {
      setCache(null);
      return null;
    }
    
    return cache.data;
  }, [cache, ttl, setCache]);

  const setCachedData = useCallback((data) => {
    setCache({
      data,
      timestamp: Date.now()
    });
  }, [setCache]);

  const clearCache = useCallback(() => {
    setCache(null);
  }, [setCache]);

  return {
    getCachedData,
    setCachedData,
    clearCache,
    hasCachedData: cache !== null && Date.now() - cache.timestamp <= ttl
  };
};

/**
 * Performance measurement hook
 */
export const usePerformanceMeasure = (name) => {
  const startTime = useRef(null);

  const start = useCallback(() => {
    startTime.current = performance.now();
    performance.mark(`${name}-start`);
  }, [name]);

  const end = useCallback(() => {
    if (startTime.current) {
      const endTime = performance.now();
      const duration = endTime - startTime.current;
      
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      console.log(`Performance [${name}]: ${duration.toFixed(2)}ms`);
      return duration;
    }
    return 0;
  }, [name]);

  return { start, end };
};