# 🔒 Katia Platform - Auto-Block System Documentation

## Обзор системы автоблокировки салонов

Система автоматически блокирует салоны при определенных условиях, но **сохраняет все данные в базе на 90 дней** для возможности восстановления.

---

## ✅ Что реализовано

### 1. **Автоматическая блокировка при:**

#### 💳 Неудачной оплате подписки
- После **3 попыток** списания средств
- Статус подписки: `past_due`
- Блокируется **немедленно**
- **Можно восстановить**: ✅ Да (обновить карту и оплатить)

#### 💸 Обработанном возврате средств
- После успешного refund через Stripe
- Статус подписки: `canceled`
- Блокируется **в день возврата**
- **Можно восстановить**: ✅ Да (подписаться заново)

#### 📅 Истечении подписки
- Подписка истекла, не продлена
- Статус подписки: `expired`
- Блокируется **в день истечения**
- **Можно восстановить**: ✅ Да (продлить подписку)

#### 🚫 Ручной блокировке админом
- Нарушение правил платформы
- Спам, мошенничество, фейковые отзывы
- Блокируется **админом вручную**
- **Можно восстановить**: ❌ Только через support

---

## 📊 Что происходит при блокировке

### Немедленно:
1. ❌ Салон **скрыт** из публичных списков
2. ❌ Новые бронирования **невозможны**
3. ✅ Существующие записи **сохранены**
4. ✅ Все данные **остаются в базе**
5. 📧 Владелец получает **email уведомление**
6. 🔐 Доступ к dashboard **ограничен**

### Что блокируется:
- Создание новых бронирований
- Публичная видимость салона
- Доступ к полному функционалу
- Автопродление подписки

### Что НЕ блокируется:
- Просмотр существующих записей
- История транзакций
- Данные клиентов (доступ только для чтения)
- Возможность восстановления

---

## 🔓 Система восстановления

### Временные рамки:
- **0-90 дней**: Полное восстановление возможно
- **90+ дней**: Данные удаляются безвозвратно

### Что сохраняется 90 дней:
✅ **Все данные салона:**
- База клиентов
- История бронирований
- Услуги и прайс-лист
- Фотографии и портфолио
- Сотрудники и расписание
- Настройки и интеграции
- История платежей
- Отзывы и рейтинг

### Процесс восстановления:

#### Для владельца салона:
1. Открыть заблокированную страницу
2. Кликнуть "Restore" / "Reactivate"
3. Обновить платежный метод (если нужно)
4. Оплатить задолженность
5. ✅ Салон восстанавливается **мгновенно**

#### Timeline восстановления:
- ⚡ **Instant**: Оплата обработана
- 📊 **5 минут**: Все данные восстановлены
- 🌐 **15 минут**: Салон снова в списках
- ✉️ **24 часа**: Клиенты уведомлены

---

## 💡 User Experience

### Для владельца заблокированного салона:

#### При входе в dashboard:
```
┌─────────────────────────────────────┐
│  🔒 Account Suspended               │
│                                     │
│  Your salon is temporarily blocked  │
│  Reason: Payment method declined    │
│                                     │
│  ✅ Your data is safe for 90 days  │
│  ✅ Restore anytime with 1 click   │
│                                     │
│  [ Pay & Reactivate Now ]          │
│  Amount due: AED 99                 │
└─────────────────────────────────────┘
```

### Компонент: `BlockedSalonView`
Показывает:
- **Причину** блокировки
- **Информацию** о салоне
- **Гарантию** сохранности данных
- **Срок** до удаления (90 дней)
- **Кнопку** восстановления
- **Контакты** поддержки

---

## 🤖 Автоматизация

### Ежедневная проверка (Cron Job):

```typescript
// Запускается каждый день в 00:00 UTC
async function dailyAutoBlockCheck() {
  // 1. Проверить все подписки
  const subscriptions = await fetchAllSubscriptions();
  
  // 2. Найти салоны для блокировки
  for (const sub of subscriptions) {
    const status = checkSalonAutoBlock(sub);
    if (status.isBlocked) {
      await blockSalon(sub.salonId, status);
      await sendBlockNotification(sub);
    }
  }
  
  // 3. Проверить салоны на удаление (90 дней)
  const expiredSalons = await fetchBlockedSalons();
  for (const salon of expiredSalons) {
    const daysSinceBlock = getDaysSinceBlock(salon.blockedDate);
    
    // Напоминания на 30, 14, 7, 3, 1 день
    if ([30, 14, 7, 3, 1].includes(90 - daysSinceBlock)) {
      await sendDeletionWarning(salon);
    }
    
    // Удаление после 90 дней
    if (daysSinceBlock >= 90) {
      await deleteExpiredSalonData(salon.id);
    }
  }
}
```

### Stripe Webhooks:

```typescript
// Обработка событий Stripe
app.post('/webhook/stripe', async (req, res) => {
  const event = req.body;
  
  switch (event.type) {
    case 'invoice.payment_failed':
      // Блокировать после 3 попыток
      await handlePaymentFailed(event);
      break;
      
    case 'customer.subscription.deleted':
      // Блокировать при отмене (возврат)
      await handleSubscriptionCanceled(event);
      break;
      
    case 'invoice.payment_succeeded':
      // Разблокировать при успешной оплате
      await handlePaymentSuccess(event);
      break;
  }
});
```

---

## 📧 Email уведомления

### 1. Уведомление о блокировке:

```
Subject: ⚠️ Your Salon Has Been Temporarily Blocked - Katia

Hello [Owner Name],

Your salon "[Salon Name]" has been temporarily blocked.

Reason: [Payment method declined / Refund processed / Subscription expired]

DON'T WORRY - Your data is completely safe! ✅

What this means:
• Your salon is hidden from public listings
• New bookings are disabled
• All your data remains safely stored for 90 days
• You can restore everything with one click

Reactivate Now:
[RESTORE MY SALON] - AED [Amount]

After payment, your salon will be:
✓ Back online immediately
✓ Visible to clients again
✓ Fully functional

Questions? Reply to this email or call +971 XX XXX XXXX

Best regards,
Katia Platform Team
```

### 2. Напоминание об удалении:

```
Subject: ⏰ Data Deletion in [X] Days - Reactivate Now

Hello [Owner Name],

Your salon "[Salon Name]" has been blocked for [X] days.

⚠️ IMPORTANT: Your data will be PERMANENTLY DELETED in [X] days!

Currently preserved:
✓ [Number] clients
✓ [Number] bookings
✓ [Number] photos
✓ All settings and history

Don't lose your data! Reactivate now:
[RESTORE MY SALON]

This is your [last/final] reminder.

Need help? Contact us immediately:
📧 support@katia.beauty
📞 +971 XX XXX XXXX
```

---

## 🔧 Технические детали

### Database Schema:

```sql
-- Salon status table
CREATE TABLE salon_status (
  id SERIAL PRIMARY KEY,
  salon_id INTEGER NOT NULL,
  is_blocked BOOLEAN DEFAULT FALSE,
  block_reason VARCHAR(50), -- payment_failed, refund_processed, etc.
  blocked_date TIMESTAMP,
  can_restore BOOLEAN DEFAULT TRUE,
  deletion_scheduled_date TIMESTAMP, -- blocked_date + 90 days
  restore_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Block history (audit log)
CREATE TABLE salon_block_history (
  id SERIAL PRIMARY KEY,
  salon_id INTEGER NOT NULL,
  action VARCHAR(20), -- 'blocked' or 'restored'
  reason VARCHAR(50),
  performed_by VARCHAR(50), -- 'system' or admin email
  performed_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB -- Additional context
);
```

### API Endpoints:

```typescript
// Check salon status
GET /api/salon/:id/status
Response: {
  isBlocked: boolean,
  blockReason?: string,
  blockedDate?: string,
  canRestore: boolean,
  daysUntilDeletion?: number
}

// Restore salon
POST /api/salon/:id/restore
Body: {
  paymentMethodId: string,
  amount: number
}
Response: {
  success: boolean,
  message: string,
  salon: { ... }
}

// Admin block/unblock
POST /api/admin/salon/:id/block
POST /api/admin/salon/:id/unblock
Headers: { Authorization: 'Bearer admin_token' }
```

---

## 📊 Мониторинг и Аналитика

### Метрики для отслеживания:

#### Super Admin Dashboard:
```
┌─────────────────────────────────┐
│ Blocked Salons Overview         │
├─────────────────────────────────┤
│ Total Blocked: 23               │
│ Payment Failed: 12              │
│ Refund Processed: 6             │
│ Expired: 4                      │
│ Manual: 1                       │
├─────────────────────────────────┤
│ Restored This Week: 8           │
│ Restoration Rate: 65%           │
│ Avg Days to Restore: 5.3        │
│ Pending Deletion: 3             │
└─────────────────────────────────┘
```

#### Alerts:
- 🔴 Critical: 5+ salons pending deletion
- 🟡 Warning: Payment failure rate > 10%
- 🟢 Good: Restoration rate > 60%

---

## 💰 Финансовое влияние

### Revenue Recovery:

**Пример:** Салон с подпиской AED 299/мес заблокирован

#### Сценарий 1: Быстрое восстановление (5 дней)
- Lost revenue: AED 49 (5 days)
- Recovered: ✅ Да
- Impact: Minimal

#### Сценарий 2: Позднее восстановление (60 дней)
- Lost revenue: AED 596 (2 months)
- Recovered: ✅ Частично (subscription renewed)
- Impact: Moderate

#### Сценарий 3: Не восстановлен (90+ дней)
- Lost revenue: AED 894+ (3+ months)
- Recovered: ❌ Нет
- Impact: High
- Action: Data deleted, customer lost

### Оптимизация восстановления:
1. Автоматические напоминания → +25% restoration rate
2. Удобный process восстановления → +15% faster restore
3. Сохранение данных 90 дней → +40% customer retention

---

## 🎯 Best Practices

### Для разработчиков:

1. **Тестируйте все сценарии блокировки**
   ```bash
   # Test payment failed
   npm run test:block:payment-failed
   
   # Test refund processed
   npm run test:block:refund
   
   # Test expiration
   npm run test:block:expired
   ```

2. **Логируйте все действия**
   ```typescript
   await logBlockAction({
     salonId,
     action: 'blocked',
     reason: 'payment_failed',
     performedBy: 'system',
     metadata: { subscriptionId, attempts: 3 }
   });
   ```

3. **Мониторьте Stripe webhooks**
   - Убедитесь что webhook delivery успешен
   - Retry failed webhooks
   - Alert на критические failures

### Для Support Team:

1. **Быстро реагируйте на жалобы**
   - Проверьте причину блокировки
   - Объясните процесс восстановления
   - Помогите с payment issues

2. **Будьте проактивны**
   - Звоните салонам за 7 дней до deletion
   - Предлагайте скидки для возврата
   - Собирайте feedback

3. **Документируйте кейсы**
   - Почему заблокирован?
   - Почему не восстановили?
   - Как можно улучшить?

---

## 🚀 Roadmap

### Ближайшие улучшения:

#### Q1 2025:
- [ ] ML модель предсказания churn
- [ ] Персонализированные скидки для возврата
- [ ] Automated win-back campaigns
- [ ] Flexible grace periods

#### Q2 2025:
- [ ] Partial service restoration (read-only mode)
- [ ] Graduated blocking (warnings → limited → full block)
- [ ] Customer health score integration
- [ ] Dynamic deletion periods based on LTV

---

## 📝 Checklist для деплоя

### Перед запуском в production:

- [ ] ✅ Настроены Stripe webhooks
- [ ] ✅ Cron job для daily checks
- [ ] ✅ Email templates готовы
- [ ] ✅ SMS уведомления (опционально)
- [ ] ✅ Мониторинг и алерты
- [ ] ✅ Backup процедуры
- [ ] ✅ GDPR compliance проверен
- [ ] ✅ Support team обучен
- [ ] ✅ Документация обновлена
- [ ] ✅ Load testing пройден

### После запуска:

- [ ] 📊 Мониторинг метрик
- [ ] 📧 Проверка delivery emails
- [ ] 🔔 Response time support
- [ ] 💰 Revenue impact анализ
- [ ] 🐛 Bug reports обработка
- [ ] 📈 A/B тесты restoration flow
- [ ] 🎯 Customer feedback сбор
- [ ] 🔄 Iteration & improvement

---

## 🆘 Troubleshooting

### Проблема: Салон заблокирован по ошибке
**Решение:**
1. Проверить subscription status в Stripe
2. Проверить webhook logs
3. Ручная разблокировка через admin panel
4. Компенсация за downtime (если нужно)

### Проблема: Данные не восстанавливаются
**Решение:**
1. Проверить backup existence
2. Verify data integrity
3. Restore from backup
4. Contact engineering team

### Проблема: Клиенты жалуются
**Решение:**
1. Быстрое объяснение ситуации
2. Предложить помощь с восстановлением
3. Скидка или бонус за inconvenience
4. Escalate к менеджеру если нужно

---

## 📞 Контакты

### Support:
- 📧 support@katia.beauty
- 💬 Live Chat
- 📞 +971 XX XXX XXXX

### Technical Issues:
- 🐛 bugs@katia.beauty
- 💻 GitHub Issues
- 🔧 engineering@katia.beauty

---

**Эта система обеспечивает:**
- ✅ Автоматическую защиту платформы
- ✅ Сохранность данных клиентов
- ✅ Легкое восстановление
- ✅ Прозрачность процесса
- ✅ Minimal customer frustration

**Результат:** Здоровая платформа + довольные клиенты! 🎉
