/**
 * Service Worker registration and management utilities
 */

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

/**
 * Register the service worker
 */
export function registerSW() {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL || '', window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl);
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service worker.'
          );
        });
      } else {
        registerValidSW(swUrl);
      }
    });
  }
}

/**
 * Register valid service worker
 */
function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      console.log('SW registered: ', registration);
      
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log(
                'New content is available and will be used when all tabs for this page are closed.'
              );
              showUpdateAvailableNotification();
            } else {
              console.log('Content is cached for offline use.');
              showOfflineModeNotification();
            }
          }
        });
      });
    })
    .catch(error => {
      console.error('SW registration failed: ', error);
    });
}

/**
 * Check if service worker is valid
 */
function checkValidServiceWorker(swUrl) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
      showOfflineModeNotification();
    });
}

/**
 * Unregister service worker
 */
export function unregisterSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}

/**
 * Update service worker
 */
export function updateSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.update();
    });
  }
}

/**
 * Skip waiting for new service worker
 */
export function skipWaiting() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    });
  }
}

/**
 * Clear all caches
 */
export function clearAllCaches() {
  return new Promise((resolve) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({ type: 'CLEAR_CACHE' });
        resolve();
      });
    } else {
      resolve();
    }
  });
}

/**
 * Get cache size
 */
export function getCacheSize() {
  return new Promise((resolve) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.size);
        };
        
        registration.active?.postMessage(
          { type: 'GET_CACHE_SIZE' }, 
          [messageChannel.port2]
        );
      });
    } else {
      resolve(0);
    }
  });
}

/**
 * Cache API response manually
 */
export function cacheApiResponse(url, data) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.active?.postMessage({
        type: 'CACHE_API_RESPONSE',
        payload: { url, data }
      });
    });
  }
}

/**
 * Show update available notification
 */
function showUpdateAvailableNotification() {
  // Create a custom event for the app to handle
  const event = new CustomEvent('swUpdateAvailable');
  window.dispatchEvent(event);
  
  // Also show a simple notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Nova versão disponível', {
      body: 'Uma nova versão do Mystic Host está disponível. Recarregue a página para atualizar.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'update-available'
    });
  }
}

/**
 * Show offline mode notification
 */
function showOfflineModeNotification() {
  const event = new CustomEvent('swOfflineReady');
  window.dispatchEvent(event);
  
  console.log('App is ready to work offline.');
}

/**
 * Check if app is online
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Add online/offline event listeners
 */
export function addNetworkListeners(onOnline, onOffline) {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

/**
 * Hook for service worker state
 */
export function useServiceWorker() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [isOnlineStatus, setIsOnlineStatus] = useState(navigator.onLine);

  useEffect(() => {
    const handleUpdateAvailable = () => setIsUpdateAvailable(true);
    const handleOfflineReady = () => setIsOfflineReady(true);
    const handleOnline = () => setIsOnlineStatus(true);
    const handleOffline = () => setIsOnlineStatus(false);

    window.addEventListener('swUpdateAvailable', handleUpdateAvailable);
    window.addEventListener('swOfflineReady', handleOfflineReady);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('swUpdateAvailable', handleUpdateAvailable);
      window.removeEventListener('swOfflineReady', handleOfflineReady);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const acceptUpdate = () => {
    skipWaiting();
    window.location.reload();
  };

  const dismissUpdate = () => {
    setIsUpdateAvailable(false);
  };

  return {
    isUpdateAvailable,
    isOfflineReady,
    isOnline: isOnlineStatus,
    acceptUpdate,
    dismissUpdate,
    clearCaches: clearAllCaches,
    getCacheSize
  };
}