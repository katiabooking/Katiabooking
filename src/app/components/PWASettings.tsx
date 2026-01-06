import { useState, useEffect } from 'react';
import { Bell, BellOff, Download, Trash2, Smartphone, Wifi } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { toast } from 'sonner';
import {
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  clearAllCaches,
  getCacheSize,
  formatBytes,
  isStandalone,
  getPlatform,
  promptInstall
} from '../../utils/pwaUtils';
import React from 'react';

export function PWASettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [cacheSize, setCacheSize] = useState<string>('Вычисление...');
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    setIsInstalled(isStandalone());
    setPlatform(getPlatform());
    checkNotificationPermission();
    updateCacheSize();
    getServiceWorkerRegistration();
  }, []);

  const getServiceWorkerRegistration = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      setSwRegistration(registration || null);
    }
  };

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  };

  const updateCacheSize = async () => {
    const size = await getCacheSize();
    setCacheSize(formatBytes(size));
  };

  const handleNotificationsToggle = async (enabled: boolean) => {
    if (!swRegistration) {
      toast.error('Service Worker не зарегистрирован');
      return;
    }

    if (enabled) {
      const permission = await requestNotificationPermission();
      
      if (permission === 'granted') {
        const subscription = await subscribeToPushNotifications(swRegistration);
        if (subscription) {
          setNotificationsEnabled(true);
          toast.success('Уведомления включены');
        } else {
          toast.error('Не удалось подписаться на уведомления');
        }
      } else {
        toast.error('Разрешение на уведомления отклонено');
      }
    } else {
      const unsubscribed = await unsubscribeFromPushNotifications(swRegistration);
      if (unsubscribed) {
        setNotificationsEnabled(false);
        toast.success('Уведомления отключены');
      }
    }
  };

  const handleClearCache = async () => {
    if (confirm('Очистить все сохраненные данные? Приложение будет работать медленнее до повторной загрузки.')) {
      await clearAllCaches();
      await updateCacheSize();
      toast.success('Кеш очищен');
    }
  };

  const handleInstallApp = async () => {
    const installed = await promptInstall();
    if (installed) {
      toast.success('Приложение установлено');
      setIsInstalled(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* PWA Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-purple-600" />
            Статус приложения
          </CardTitle>
          <CardDescription>
            Информация о прогрессивном веб-приложении
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Установлено</p>
              <p className="text-sm text-gray-500">
                {isInstalled ? 'Приложение установлено' : 'Запущено в браузере'}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isInstalled 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {isInstalled ? 'Установлено' : 'Не установлено'}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Платформа</p>
              <p className="text-sm text-gray-500">
                {platform === 'ios' && 'iOS / iPadOS'}
                {platform === 'android' && 'Android'}
                {platform === 'desktop' && 'Desktop'}
              </p>
            </div>
          </div>

          {!isInstalled && (
            <Button 
              onClick={handleInstallApp}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Установить приложение
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {notificationsEnabled ? (
              <Bell className="w-5 h-5 text-purple-600" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-400" />
            )}
            Push-уведомления
          </CardTitle>
          <CardDescription>
            Получайте уведомления о новых бронированиях
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Включить уведомления</p>
              <p className="text-sm text-gray-500">
                Работает даже когда сайт закрыт
              </p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationsToggle}
            />
          </div>

          {platform === 'ios' && !isStandalone && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Для полноценных уведомлений на iOS установите приложение на домашний экран
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cache Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-purple-600" />
            Offline режим
          </CardTitle>
          <CardDescription>
            Управление кешированными данными
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Размер кеша</p>
              <p className="text-sm text-gray-500">
                Сохраненные данные для offline работы
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-purple-600">{cacheSize}</p>
            </div>
          </div>

          <Button
            onClick={handleClearCache}
            variant="outline"
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Очистить кеш
          </Button>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 Offline режим позволяет работать с календарем и клиентами даже без интернета. 
              Все изменения синхронизируются при восстановлении подключения.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Возможности PWA</CardTitle>
          <CardDescription>
            Что доступно в прогрессивном веб-приложении
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <div>
                <p className="font-medium">Быстрая загрузка</p>
                <p className="text-sm text-gray-500">Приложение загружается мгновенно</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <div>
                <p className="font-medium">Работа offline</p>
                <p className="text-sm text-gray-500">Доступ к функциям без интернета</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <div>
                <p className="font-medium">Push-уведомления</p>
                <p className="text-sm text-gray-500">Уведомления о важных событиях</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <div>
                <p className="font-medium">Установка на устройство</p>
                <p className="text-sm text-gray-500">Работает как нативное приложение</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <div>
                <p className="font-medium">Автообновление</p>
                <p className="text-sm text-gray-500">Всегда последняя версия</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
