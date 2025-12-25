# 🎁 PROFESSIONAL GIFT CARD SYSTEM ARCHITECTURE

## 📋 OVERVIEW

Полная enterprise-level система подарочных сертификатов для платформы Katia с:
- ✅ **Stripe оплатой**
- ✅ **Уникальными кодами** (защита от повторного использования)
- ✅ **Dashboard настройками** (Owner/Admin контроль)
- ✅ **Аналитикой** использования
- ✅ **Email доставкой** с PDF сертификатами

---

## 🏗️ АРХИТЕКТУРА

### 1. DATA MODEL

#### GiftCard (Основная сущность)
```typescript
interface GiftCard {
  id: string;
  code: string; // "KATIA-A7X9-2K4M-3P5Q" - Уникальный код
  salonId: string;
  salonName: string;
  
  // Financial
  amount: number; // Начальная сумма (AED 100)
  currency: string; // "AED"
  remainingBalance: number; // Текущий остаток (AED 60)
  
  // Purchase Info
  purchasedBy: {
    name: string;
    email: string;
    userId?: string; // Если зарегистрирован
  };
  purchaseDate: Date;
  paymentIntentId: string; // Stripe Payment Intent ID
  stripeChargeId?: string; // Stripe Charge ID
  
  // Recipient Info
  recipientName: string;
  recipientEmail: string;
  personalMessage?: string;
  deliveryMethod: 'email' | 'print';
  
  // Status
  status: 'active' | 'partially_used' | 'fully_used' | 'expired' | 'cancelled';
  
  // Usage History
  usageHistory: GiftCardUsage[];
  
  // Expiry
  expiryDate?: Date | null; // null = never expires
  
  // Settings (from salon)
  allowPartialUse: boolean;
  allowMultipleServices: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date;
}
```

#### GiftCardUsage (История использования)
```typescript
interface GiftCardUsage {
  id: string;
  date: Date;
  bookingId: string;
  customerId: string;
  customerName: string;
  amountUsed: number; // AED 40
  remainingAfter: number; // AED 60
  serviceName: string;
  serviceId: string;
}
```

#### GiftCardSettings (Настройки салона)
```typescript
interface GiftCardSettings {
  salonId: string;
  
  // Features
  enabled: boolean;
  allowCustomAmounts: boolean;
  
  // Preset amounts
  presetAmounts: number[]; // [100, 200, 300, 500, 1000]
  minAmount: number; // 50
  maxAmount: number; // 5000
  
  // Usage rules
  expiryMonths: number | null; // 12 или null (never expires)
  allowPartialUse: boolean; // true
  allowMultipleServices: boolean; // true
  requireMinimumPurchase: boolean; // false
  minimumPurchaseAmount?: number; // 100
  
  // Design & Messaging
  customMessage?: string;
  termsAndConditions?: string;
  emailTemplate?: string;
  
  // Notifications
  sendToRecipient: boolean;
  sendToPurchaser: boolean;
  notifyOnUse: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔄 USER FLOWS

### FLOW 1: ПОКУПКА ПОДАРОЧНОГО СЕРТИФИКАТА

```
┌─────────────────────────────────────────────────────────────────┐
│                     CUSTOMER JOURNEY                            │
└─────────────────────────────────────────────────────────────────┘

1. 👤 Клиент открывает профиль салона
   └─> Видит вкладку "🎁 Gift Cards"
   
2. 📱 Кликает на вкладку
   └─> Открывается BuyGiftCardModal
   
3. 💰 Выбирает сумму
   ├─> Preset: AED 100, 200, 300, 500, 1000
   └─> Custom: Любая сумма (min: 50, max: 5000)
   
4. 👤 Заполняет свои данные
   ├─> Имя
   ├─> Email
   └─> Телефон
   
5. 🎁 Данные получателя (опционально)
   ├─> Имя получателя
   ├─> Email получателя
   ├─> Личное сообщение
   └─> ☑ Отправить сейчас
   
6. 💳 Оплата через Stripe
   ├─> Stripe Payment Intent создаётся
   ├─> Клиент вводит карту
   └─> Оплата подтверждается
   
7. ✅ Генерация сертификата
   ├─> Создаётся уникальный код: "KATIA-A7X9-2K4M-3P5Q"
   ├─> Сохраняется в базе данных
   ├─> Отправляется Email с PDF
   └─> Показывается Success экран
   
8. 📧 Email доставка
   ├─> Покупателю: Квитанция + Код
   └─> Получателю: Красивый PDF + Инструкции
```

### FLOW 2: ИСПОЛЬЗОВАНИЕ СЕРТИФИКАТА

```
┌─────────────────────────────────────────────────────────────────┐
│                  REDEMPTION JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

1. 👤 Клиент бронирует услугу
   └─> Доходит до страницы оплаты
   
2. 🎁 Видит опцию "Have a gift card?"
   └─> Кликает на неё
   
3. 🔢 Вводит код
   └─> "KATIA-A7X9-2K4M-3P5Q"
   
4. ⚙️ Система валидирует код
   ├─> Проверяет формат
   ├─> Ищет в базе данных
   ├─> Проверяет статус
   ├─> Проверяет срок действия
   └─> Проверяет остаток
   
5. ✅ Код валиден
   ├─> Показывает остаток: "AED 100 available"
   ├─> Клиент выбирает сумму к применению
   └─> Применяется к booking

6. 💰 Расчёт оплаты
   ├─> Booking total: AED 150
   ├─> Gift card: -AED 100
   └─> To pay: AED 50
   
7. ✅ Завершение бронирования
   ├─> Gift card balance обновляется
   ├─> UsageHistory записывается
   ├─> Email уведомление отправляется
   └─> Booking подтверждается
```

### FLOW 3: OWNER УПРАВЛЕНИЕ

```
┌─────────────────────────────────────────────────────────────────┐
│                    OWNER DASHBOARD                              │
└─────────────────────────────────────────────────────────────────┘

1. 🏢 Owner открывает Dashboard
   └─> Вкладка "Gift Cards"
   
2. ⚙️ Настройки сертификатов
   ├─> ☑ Enable gift cards
   ├─> Preset amounts: [100, 200, 500]
   ├─> Min: AED 50, Max: AED 5000
   ├─> ☑ Allow custom amounts
   ├─> Expiry: 12 months (или Never)
   ├─> ☑ Allow partial use
   ├─> ☑ Allow multiple services
   ├─> Custom message для Email
   └─> Terms & Conditions
   
3. 📊 Аналитика
   ├─> Total sold: 127 cards
   ├─> Total revenue: AED 45,200
   ├─> Redeemed: 89 (70%)
   ├─> Active: 35 (AED 12,400)
   ├─> Expired: 3 (AED 800)
   ├─> Popular amounts: 200 (43%), 100 (32%)
   ├─> Chart: Sales over time
   └─> Top purchasers list
   
4. 📋 Список всех сертификатов
   ├─> Filter: Status, Date, Amount
   ├─> Search: By code, email
   ├─> Export: CSV, Excel
   └─> Actions: View, Cancel, Refund
   
5. 🔍 Детали сертификата
   ├─> Code: KATIA-A7X9-2K4M
   ├─> Amount: AED 200
   ├─> Balance: AED 80
   ├─> Purchased: Jan 15, 2024
   ├─> Purchaser: John Doe
   ├─> Recipient: Jane Smith
   ├─> Status: Partially Used
   ├─> Usage History:
   │   ├─> Mar 2: Haircut -AED 60
   │   └─> Mar 10: Manicure -AED 60
   └─> Actions:
       ├─> 🔄 Adjust balance
       ├─> 📧 Resend email
       ├─> ❌ Cancel card
       └─> 💸 Issue refund
```

---

## 🔐 КОД ГЕНЕРАЦИЯ И ВАЛИДАЦИЯ

### Генерация уникального кода

```typescript
function generateGiftCardCode(): string {
  const segments = 3;
  const segmentLength = 4;
  // Убираем похожие символы: I, O, 0, 1
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  
  const code = Array.from({ length: segments }, () => {
    return Array.from({ length: segmentLength }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  }).join('-');
  
  return `KATIA-${code}`; // KATIA-A7X9-2K4M-3P5Q
}
```

**Формат кода:**
- Префикс: `KATIA-` (брендинг)
- 3 сегмента по 4 символа
- Разделитель: `-`
- Только заглавные буквы и цифры (без похожих символов)
- Пример: `KATIA-A7X9-2K4M-3P5Q`

**Почему такой формат?**
- ✅ Легко читать
- ✅ Легко вводить
- ✅ Сложно угадать
- ✅ Нет похожих символов (меньше ошибок)
- ✅ Брендинг (KATIA-)

### Валидация кода

```typescript
async function validateGiftCard(code: string): Promise<GiftCardValidationResponse> {
  // 1. Проверка формата
  if (!isValidGiftCardCode(code)) {
    return { valid: false, error: 'Invalid gift card format' };
  }
  
  // 2. Поиск в базе
  const giftCard = await kvStore.get(`giftcard:${code}`);
  if (!giftCard) {
    return { valid: false, error: 'Gift card not found' };
  }
  
  // 3. Проверка статуса
  if (giftCard.status === 'cancelled') {
    return { valid: false, error: 'Gift card has been cancelled' };
  }
  
  if (giftCard.status === 'fully_used') {
    return { valid: false, error: 'Gift card has been fully used' };
  }
  
  // 4. Проверка срока действия
  if (isGiftCardExpired(giftCard)) {
    await kvStore.set(`giftcard:${code}`, { ...giftCard, status: 'expired' });
    return { valid: false, error: 'Gift card has expired' };
  }
  
  // 5. Проверка остатка
  if (giftCard.remainingBalance <= 0) {
    return { valid: false, error: 'Gift card has no remaining balance' };
  }
  
  // ✅ Код валиден
  return {
    valid: true,
    giftCard,
    remainingBalance: giftCard.remainingBalance
  };
}
```

---

## 🗄️ DATABASE SCHEMA (KV Store)

### Keys структура

```typescript
// Gift Cards
`giftcard:${code}` -> GiftCard
  Пример: "giftcard:KATIA-A7X9-2K4M-3P5Q"
  
// Gift Cards by Salon
`salon:${salonId}:giftcards` -> string[] // List of codes
  Пример: "salon:salon-123:giftcards"
  
// Gift Card Settings
`salon:${salonId}:giftcard:settings` -> GiftCardSettings
  Пример: "salon:salon-123:giftcard:settings"
  
// Gift Cards by Customer (purchaser)
`customer:${email}:giftcards:purchased` -> string[] // List of codes
  Пример: "customer:john@email.com:giftcards:purchased"
  
// Gift Cards by Recipient
`customer:${email}:giftcards:received` -> string[] // List of codes
  Пример: "customer:jane@email.com:giftcards:received"
  
// Analytics Cache
`salon:${salonId}:giftcard:analytics:${period}` -> GiftCardAnalytics
  Пример: "salon:salon-123:giftcard:analytics:month"
```

---

## 🚀 BACKEND ROUTES

### 1. **POST /make-server-3e5c72fb/gift-cards/purchase**
Создание и оплата подарочного сертификата

**Request:**
```json
{
  "salonId": "salon-123",
  "amount": 200,
  "currency": "AED",
  "purchaserName": "John Doe",
  "purchaserEmail": "john@email.com",
  "recipientName": "Jane Smith",
  "recipientEmail": "jane@email.com",
  "personalMessage": "Happy Birthday!",
  "deliveryMethod": "email",
  "paymentMethodId": "pm_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "giftCard": {
    "id": "gc_123",
    "code": "KATIA-A7X9-2K4M-3P5Q",
    "amount": 200,
    "remainingBalance": 200,
    "status": "active"
  },
  "paymentIntent": {
    "id": "pi_1234567890",
    "status": "succeeded"
  }
}
```

### 2. **POST /make-server-3e5c72fb/gift-cards/validate**
Проверка кода перед использованием

**Request:**
```json
{
  "code": "KATIA-A7X9-2K4M-3P5Q"
}
```

**Response:**
```json
{
  "valid": true,
  "giftCard": {
    "code": "KATIA-A7X9-2K4M-3P5Q",
    "remainingBalance": 200,
    "expiryDate": null,
    "allowPartialUse": true,
    "salonName": "Glamour Studio"
  }
}
```

### 3. **POST /make-server-3e5c72fb/gift-cards/redeem**
Использование сертификата

**Request:**
```json
{
  "code": "KATIA-A7X9-2K4M-3P5Q",
  "bookingId": "booking-789",
  "amountToUse": 150,
  "serviceId": "service-456",
  "serviceName": "Haircut & Color",
  "customerId": "customer-321",
  "customerName": "Jane Smith"
}
```

**Response:**
```json
{
  "success": true,
  "amountApplied": 150,
  "remainingBalance": 50,
  "giftCard": {
    "code": "KATIA-A7X9-2K4M-3P5Q",
    "status": "partially_used",
    "remainingBalance": 50
  }
}
```

### 4. **GET /make-server-3e5c72fb/gift-cards/salon/:salonId/settings**
Получить настройки салона

**Response:**
```json
{
  "enabled": true,
  "allowCustomAmounts": true,
  "presetAmounts": [100, 200, 300, 500, 1000],
  "minAmount": 50,
  "maxAmount": 5000,
  "expiryMonths": null,
  "allowPartialUse": true,
  "allowMultipleServices": true
}
```

### 5. **PUT /make-server-3e5c72fb/gift-cards/salon/:salonId/settings**
Обновить настройки (Owner/Admin only)

### 6. **GET /make-server-3e5c72fb/gift-cards/salon/:salonId/analytics**
Получить аналитику

**Query params:** `?period=month`

**Response:**
```json
{
  "totalSold": 127,
  "totalRevenue": 45200,
  "totalRedeemed": 89,
  "redemptionRate": 0.70,
  "popularAmounts": [
    { "amount": 200, "count": 55 },
    { "amount": 100, "count": 41 }
  ],
  "salesByDate": [...]
}
```

### 7. **GET /make-server-3e5c72fb/gift-cards/salon/:salonId**
Список всех сертификатов салона (Owner/Admin only)

### 8. **GET /make-server-3e5c72fb/gift-cards/:code**
Детали конкретного сертификата

### 9. **POST /make-server-3e5c72fb/gift-cards/:code/cancel**
Отменить сертификат (Owner/Admin only)

### 10. **POST /make-server-3e5c72fb/gift-cards/:code/resend**
Повторно отправить Email

---

## 📧 EMAIL TEMPLATES

### Email для покупателя (Purchaser Receipt)

```html
Subject: ✅ Gift Card Purchase Confirmation - Katia

Hi John,

Thank you for purchasing a gift card from Glamour Studio!

Gift Card Details:
• Code: KATIA-A7X9-2K4M-3P5Q
• Amount: AED 200
• Valid until: Never expires
• Purchased: January 15, 2024

Recipient:
• Name: Jane Smith
• Email: jane@email.com
• Message: "Happy Birthday!"

✅ The gift card has been sent to jane@email.com

How to use:
1. Visit Glamour Studio on Katia app
2. Book any service
3. Enter the gift card code at checkout

Questions? Reply to this email or contact support.

Best regards,
The Katia Team
```

### Email для получателя (Recipient Gift Card)

```html
Subject: 🎁 You've received a gift card! - Katia

Hi Jane,

You've received a gift card from John Doe!

Personal Message:
"Happy Birthday! Enjoy a relaxing spa day on me! 💜"

Gift Card Details:
• From: Glamour Studio
• Amount: AED 200
• Code: KATIA-A7X9-2K4M-3P5Q
• Valid until: Never expires

[BEAUTIFUL PDF ATTACHMENT WITH GIFT CARD DESIGN]

How to redeem:
1. Download the Katia app or visit katia.com
2. Browse Glamour Studio services
3. Book your appointment
4. Enter code: KATIA-A7X9-2K4M-3P5Q at checkout

View Gift Card → [BUTTON]

Enjoy your gift!
The Katia Team
```

---

## 📱 FRONTEND COMPONENTS

### Созданные файлы:

1. ✅ `/src/app/types/giftCard.ts` - Типы данных
2. `/src/app/components/BuyGiftCardModal.tsx` - Покупка (уже есть, улучшить)
3. `/src/app/components/GiftCardSettingsPanel.tsx` - Настройки для Dashboard
4. `/src/app/components/GiftCardAnalytics.tsx` - Аналитика
5. `/src/app/components/RedeemGiftCardModal.tsx` - Использование (уже есть)
6. `/src/app/components/GiftCardCard.tsx` - Отображение сертификата

### Backend файлы:

7. `/supabase/functions/server/giftCardRoutes.ts` - API routes
8. `/supabase/functions/server/giftCardService.ts` - Business logic
9. `/supabase/functions/server/emailService.ts` - Email отправка

---

## 🎨 UX/UI РЕКОМЕНДАЦИИ

### 1. BuyGiftCardModal

```
┌──────────────────────────────────────────────────────────────┐
│  🎁 Buy Gift Card                                      [×]   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Step: ● Details → ○ Payment → ○ Complete                   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Select Amount *                                    │    │
│  │                                                      │    │
│  │  [AED 100] [AED 200] [AED 300] [AED 500] [AED 1000] │    │
│  │                                                      │    │
│  │  [     Or enter custom amount: _______     ]        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  👤 Your Information                                │    │
│  │  Name: [John Doe____________]                       │    │
│  │  Email: [john@email.com_____]                       │    │
│  │  Phone: [+971 50 123 4567___]                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🎁 Recipient (Optional)                            │    │
│  │  Name: [Jane Smith__________]                       │    │
│  │  Email: [jane@email.com_____]                       │    │
│  │  Message: [Happy Birthday! 🎂]                      │    │
│  │  ☑ Send immediately                                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────── PREVIEW ────────────────┐    │
│  │  ╔════════════════════════════════════════════╗     │    │
│  │  ║  🎁                     AED 200  KATIA    ║     │    │
│  │  ║  Gift Card                                ║     │    │
│  │  ║                                           ║     │    │
│  │  ║  "Happy Birthday! Enjoy! 🎂"             ║     │    │
│  │  ║                                           ║     │    │
│  │  ║  From: John → To: Jane                    ║     │    │
│  │  ╚════════════════════════════════════════════╝     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  [Cancel]             [Proceed to Payment →]                │
└──────────────────────────────────────────────────────────────┘
```

### 2. Использование при бронировании

```
┌──────────────────────────────────────────────────────────────┐
│  💰 Payment Summary                                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Haircut & Color                             AED 150        │
│  Duration: 90 min                                           │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🎁 Have a gift card?                               │    │
│  │                                                      │    │
│  │  Enter code: [KATIA-____-____-____]  [Apply]        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ────────────────────────────────────────────────────────   │
│  Subtotal:                                   AED 150        │
│  Gift Card (KATIA-A7X9-...):               - AED 100        │
│  ────────────────────────────────────────────────────────   │
│  💳 Total to pay:                            AED 50         │
│                                                              │
│  🎁 Remaining gift card balance: AED 0                      │
│                                                              │
│  [Complete Booking]                                          │
└──────────────────────────────────────────────────────────────┘
```

### 3. Dashboard Аналитика

```
┌──────────────────────────────────────────────────────────────┐
│  🎁 Gift Cards Analytics                                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌──────────┐ │
│  │ 127       │  │ AED 45.2K │  │   70%     │  │  AED 12K │ │
│  │ Cards Sold│  │ Revenue   │  │ Redeemed  │  │  Active  │ │
│  └───────────┘  └───────────┘  └───────────┘  └──────────┘ │
│                                                              │
│  📈 Sales Over Time                                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │       ▂▅█▅▂  ▅█▅          █▅                        │   │
│  │  █▅▂ █     ██   █  ▅█▅  ▅█ █  ▅█                    │   │
│  │ ▅  ██                  ██     ██  ▅                  │   │
│  │                                                       │   │
│  │ Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  📊 Popular Amounts                                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AED 200  ████████████████████████ 55 (43%)         │   │
│  │  AED 100  ████████████████ 41 (32%)                 │   │
│  │  AED 500  ███████ 18 (14%)                          │   │
│  │  AED 300  ████ 10 (8%)                              │   │
│  │  Other    █ 3 (2%)                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  [Export CSV] [View All Gift Cards →]                       │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔒 SECURITY & FRAUD PREVENTION

### 1. Защита от угадывания кодов
- ✅ 4.7 триллионов комбинаций
- ✅ Rate limiting на validate endpoint
- ✅ Логирование всех попыток валидации

### 2. Защита от повторного использования
- ✅ Проверка remainingBalance
- ✅ Атомарные транзакции при погашении
- ✅ UsageHistory для аудита

### 3. Stripe безопасность
- ✅ Payment Intent с confirmation
- ✅ 3D Secure поддержка
- ✅ Webhook verification

### 4. Email верификация
- ✅ Проверка формата email
- ✅ Rate limiting на отправку
- ✅ Unsubscribe link

---

## 📊 METRICS & MONITORING

### Key Performance Indicators (KPIs)

1. **Redemption Rate** - % использованных сертификатов
2. **Average Time to Redeem** - Среднее время до использования
3. **Popular Amounts** - Какие суммы покупают чаще
4. **Expiry Rate** - % истекших сертификатов
5. **Partial Use Rate** - % частично использованных
6. **Top Purchasing Hours** - Когда покупают
7. **Top Redemption Days** - Когда используют

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Core (Сейчас)
- [x] Создать типы данных (`/src/app/types/giftCard.ts`)
- [x] Добавить вкладку Gift Cards на странице салона
- [x] Подключить BuyGiftCardModal
- [ ] Улучшить BuyGiftCardModal с Stripe оплатой
- [ ] Создать backend routes
- [ ] Интеграция с KV Store

### Phase 2: Redemption
- [ ] Создать RedeemGiftCardModal
- [ ] Интегрировать в BookingFlow
- [ ] Backend logic для использования
- [ ] UsageHistory tracking

### Phase 3: Dashboard
- [ ] GiftCardSettingsPanel компонент
- [ ] Настройки в Dashboard
- [ ] GiftCardAnalytics компонент
- [ ] Список сертификатов

### Phase 4: Email & PDF
- [ ] Email templates
- [ ] PDF generation
- [ ] Email отправка через Supabase
- [ ] Resend functionality

### Phase 5: Advanced Features
- [ ] Scheduled delivery (отправить в определённую дату)
- [ ] Custom designs для сертификатов
- [ ] Bulk purchase (покупка нескольких)
- [ ] Corporate gifting (для бизнесов)
- [ ] Gifting campaigns (seasonal promotions)

---

## 🚀 NEXT STEPS

**ЧТО ДЕЛАТЬ ДАЛЬШЕ:**

1. ✅ **Улучшить BuyGiftCardModal** (добавить полную Stripe интеграцию)
2. ✅ **Создать backend routes** для создания, валидации, использования
3. ✅ **Создать GiftCardSettingsPanel** для Dashboard
4. ✅ **Создать GiftCardAnalytics** компонент
5. ✅ **Интегрировать RedeemGiftCardModal** в booking flow

**Начнём с #1 - улучшение BuyGiftCardModal?**

Я могу:
- Добавить полную Stripe Payment Intent интеграцию
- Улучшить генерацию кодов
- Добавить сохранение в KV Store
- Создать backend route для purchase

**Готов? 🚀**
