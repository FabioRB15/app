/**
 * Service Worker update notifications
 */
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { X, RefreshCw, Wifi, WifiOff } from 'lucide-react';

const ServiceWorkerNotifications = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleUpdateAvailable = () => setUpdateAvailable(true);
    const handleOfflineReady = () => setOfflineReady(true);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

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

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  const dismissUpdate = () => {
    setUpdateAvailable(false);
  };

  const dismissOfflineReady = () => {
    setOfflineReady(false);
  };

  return (
    <>
      {/* Update Available Notification */}
      {updateAvailable && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-from-right">
          <Card className="w-80 shadow-lg border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900">
                    Nova versão disponível
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Uma nova versão do Mystic Host está disponível. Recarregue para atualizar.
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <Button
                      onClick={handleUpdate}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Atualizar
                    </Button>
                    <Button
                      onClick={dismissUpdate}
                      size="sm"
                      variant="outline"
                      className="border-blue-200"
                    >
                      Depois
                    </Button>
                  </div>
                </div>
                <button
                  onClick={dismissUpdate}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Offline Ready Notification */}
      {offlineReady && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-from-right">
          <Card className="w-80 shadow-lg border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Wifi className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-green-900">
                    App pronto para uso offline
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    O Mystic Host agora funciona offline. Seus dados são salvos localmente.
                  </p>
                  <Button
                    onClick={dismissOfflineReady}
                    size="sm"
                    className="mt-3 bg-green-600 hover:bg-green-700"
                  >
                    Entendi
                  </Button>
                </div>
                <button
                  onClick={dismissOfflineReady}
                  className="text-green-400 hover:text-green-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Network Status Indicator */}
      <div className="fixed bottom-4 left-4 z-40">
        {!isOnline && (
          <Card className="shadow-lg border-red-200 bg-red-50">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <WifiOff className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-900">
                  Modo offline
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default ServiceWorkerNotifications;