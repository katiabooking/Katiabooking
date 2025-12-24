# 🧪 Testing Guide - Refund & Auto-Block System

## Быстрый старт для тестирования

### 1. Система возврата средств (Refunds)

#### В Client Dashboard (Owner):
```
1. Откройте: /#/owner?demo=true
2. Перейдите в таб "Billing"
3. Убедитесь что видите badge "🛡️ 7-Day Money-Back Guarantee"
4. Кликните "Request Refund" (оранжевая кнопка)
5. Заполните форму:
   - Reason: "Testing refund system"
   - Email: owner@demo.com (должен совпадать!)
   - ✓ Agree to terms
6. Нажмите "Continue to Verification"
7. Нажмите "Send Verification Email"
8. Проверьте консоль - увидите лог запроса
```

**Ожидаемое поведение:**
- ✅ Расчет дней автоматически (показывает сколько осталось)
- ✅ Email validation (должен совпадать с owner email)
- ✅ Модал закрывается после отправки
- ✅ Alert с подтверждением

#### В Super Admin Dashboard:
```
1. Откройте: /#/superadmin?demo=true
2. В левом меню кликните "Refund Requests" (badge "2")
3. Увидите список всех запросов
4. Фильтры:
   - Status: Pending / Approved / Rejected
   - Search по email или названию салона
5. Кликните "Approve" или "Reject" на любом запросе
```

**Ожидаемое поведение:**
- ✅ Статистика вверху обновляется
- ✅ Запросы группируются по статусам
- ✅ Показывает дни с момента платежа
- ✅ Highlight для outside 7-day policy

#### В Salon Details (Super Admin):
```
1. Откройте: /#/superadmin?demo=true
2. Кликните на любой plan (Basic/Standard/Business)
3. Кликните "View Details" на любом салоне
4. В модальном окне найдите кнопку "Request Refund"
5. Кликните и проверьте модал
```

---

### 2. Система периодов подписки (Billing Periods)

#### В Super Admin - Plans:
```
1. Откройте: /#/superadmin?demo=true
2. Кликните "Subscription Plans" в меню (badge "1299")
3. Прокрутите вниз до "Billing Period Breakdown"
```

**Что проверить:**
- ✅ Три карточки: Monthly (📅), Semi-Annual (📆), Annual (🗓️)
- ✅ Подсчет салонов по каждому периоду
- ✅ Total для каждого периода
- ✅ Revenue breakdown внизу

#### Фильтр по периодам:
```
1. На странице Plans кликните на любой plan
2. Вверху найдите фильтр "Period:"
3. Переключайте между:
   - All
   - 1 Month (📅)
   - 6 Months (📆)
   - 1 Year (🗓️)
4. Проверьте что список салонов фильтруется
```

**Ожидаемое поведение:**
- ✅ Список обновляется мгновенно
- ✅ Показываются только салоны выбранного периода
- ✅ Badge в каждой карточке салона показывает период

#### В карточке салона:
```
1. Просмотрите любой салон
2. Найдите поле "Billing Period"
3. Проверьте цветовое кодирование:
   - Blue: Monthly
   - Purple: 6 Months
   - Orange gradient: Annual
```

---

### 3. Система Auto-Block (Blocked Salons)

#### Demo всех сценариев:
```
1. Откройте: /#/blocked-demo
2. Вверху выберите сценарий:
   - 💳 Payment Failed
   - 💸 Refund Processed
   - 📅 Subscription Expired
   - 🚫 Manual Block
3. Для каждого проверьте:
   - Правильный icon и цвет
   - Описание причины блокировки
   - Информация о салоне
   - "Data is safe" notice
   - "What happens now" section
   - Кнопка восстановления (если доступна)
```

**Тестирование восстановления:**
```
1. Выберите "Payment Failed" или "Refund Processed"
2. Кликните кнопку "Pay & Reactivate Now"
3. В модале проверьте:
   - Сумма к оплате
   - Что будет восстановлено
   - Кнопка "Pay & Reactivate Now"
4. Кликните "Pay" и подождите анимацию
5. Проверьте alert о редиректе
```

#### Access from Dashboard Selector:
```
1. Откройте: /#/dashboard
2. Найдите карточку "Blocked Salon View" (🔒)
3. Кликните "Explore"
4. Должен открыться /#/blocked-demo
```

---

## 🎯 Тест-кейсы для ручного тестирования

### Refund System:

#### Test Case 1: Eligible Refund (Within 7 Days)
```
✅ GIVEN: Subscription started 3 days ago
✅ WHEN: User clicks "Request Refund"
✅ THEN: Shows "You have 4 days left to request a full refund"
✅ AND: Refund button is visible and enabled
```

#### Test Case 2: Ineligible Refund (After 7 Days)
```
❌ GIVEN: Subscription started 10 days ago
❌ WHEN: User opens Billing tab
❌ THEN: No refund button visible
❌ AND: No money-back guarantee badge
```

#### Test Case 3: Email Verification Failed
```
❌ GIVEN: User enters wrong email (different from owner)
❌ WHEN: User clicks "Continue to Verification"
❌ THEN: Error message shown
❌ AND: Cannot proceed to next step
```

#### Test Case 4: Admin Approval
```
✅ GIVEN: Refund request in "pending_approval" status
✅ WHEN: Admin clicks "Approve"
✅ THEN: Status changes to "approved"
✅ AND: Stripe Refund ID generated
✅ AND: Success message shown
```

### Billing Periods:

#### Test Case 5: Filter by Monthly
```
✅ GIVEN: Mixed salons (monthly, 6-month, annual)
✅ WHEN: Filter set to "1 Month"
✅ THEN: Only monthly salons shown
✅ AND: Count matches stats card
```

#### Test Case 6: Period Badge Display
```
✅ GIVEN: Salon with annual billing
✅ WHEN: Viewing salon details
✅ THEN: Badge shows "🗓️ 1 Year"
✅ AND: Badge has orange gradient background
```

### Auto-Block System:

#### Test Case 7: Payment Failed Block
```
✅ GIVEN: Salon blocked due to payment failure
✅ WHEN: Owner opens dashboard
✅ THEN: Blocked view shown with red theme
✅ AND: Amount due displayed
✅ AND: "Update Payment" button available
```

#### Test Case 8: Refund Processed Block
```
✅ GIVEN: Refund successfully processed
✅ WHEN: System auto-blocks salon
✅ THEN: Blocked view shown with orange theme
✅ AND: "Subscribe Again" button available
✅ AND: Data safe notice visible
```

#### Test Case 9: Manual Block
```
❌ GIVEN: Admin manually blocked salon
❌ WHEN: Owner tries to reactivate
❌ THEN: "Contact Support" button only
❌ AND: No payment button available
```

#### Test Case 10: Data Safety Notice
```
✅ GIVEN: Any blocked salon
✅ WHEN: Viewing blocked page
✅ THEN: "Your data is safe for 90 days" visible
✅ AND: List of saved data shown
✅ AND: Restoration timeline displayed
```

---

## 🔍 Console Logs для проверки

### При запросе возврата (Client):
```javascript
✅ Refund request submitted from client dashboard:
{
  salonId: 1,
  salonName: "Glamour Beauty Studio",
  ownerEmail: "owner@demo.com",
  amount: 187,
  paymentDate: "2024-12-17",
  paymentMethod: "Visa •••• 4242",
  reason: "...",
  confirmationEmail: "owner@demo.com",
  daysFromPayment: 7
}
```

### При одобрении возврата (Admin):
```javascript
✅ Refund approved! Stripe refund initiated.
Stripe Refund ID: re_xxxxxxxxx
```

### При блокировке салона (System):
```javascript
🔒 AUTO-BLOCK: Salon 123
{
  reason: "payment_failed",
  date: "2024-12-24T10:30:00Z",
  canRestore: true,
  daysUntilDeletion: 90
}
```

---

## 🐛 Known Issues & Workarounds

### Issue 1: Email validation too strict
**Symptom:** Email with uppercase not matching
**Workaround:** System uses `.toLowerCase()` for comparison
**Status:** ✅ Fixed

### Issue 2: Refund modal props mismatch
**Symptom:** Old props being used
**Workaround:** Updated to new API in SalonDashboard
**Status:** ✅ Fixed

### Issue 3: Missing billingPeriod field
**Symptom:** Some salons don't have billing period
**Workaround:** Default to 'monthly' if missing
**Status:** ⚠️ TODO

---

## 📊 Performance Benchmarks

### Expected Performance:

| Action | Target Time | Acceptable |
|--------|------------|------------|
| Open Refund Modal | <100ms | <200ms |
| Submit Refund Request | <500ms | <1s |
| Admin Approve/Reject | <300ms | <500ms |
| Filter Billing Periods | <50ms | <100ms |
| Load Blocked View | <200ms | <400ms |
| Restore Salon (UI) | <1s | <2s |

### Network Requests:

| Endpoint | Expected | Notes |
|----------|----------|-------|
| POST /refund | <2s | Includes email sending |
| GET /salons?filter=period | <500ms | Should use index |
| POST /salon/restore | <3s | Payment processing |
| GET /salon/status | <200ms | Cache for 5min |

---

## ✅ Checklist перед релизом

### Frontend:
- [ ] ✅ Refund modal работает в client dashboard
- [ ] ✅ Refund management работает в super admin
- [ ] ✅ Billing period filters работают
- [ ] ✅ Blocked salon view корректен для всех сценариев
- [ ] ✅ Все icons загружаются
- [ ] ✅ Responsive design на мобильных
- [ ] ✅ Loading states присутствуют
- [ ] ✅ Error handling везде

### Backend:
- [ ] 🔧 Email verification endpoint
- [ ] 🔧 Stripe refund integration
- [ ] 🔧 Auto-block cron job
- [ ] 🔧 Webhook handlers (Stripe)
- [ ] 🔧 Data retention (90 days)
- [ ] 🔧 Audit logging

### Documentation:
- [ ] ✅ REFUND_SECURITY_SYSTEM.md
- [ ] ✅ REFUND_USER_GUIDE.md
- [ ] ✅ AUTO_BLOCK_SYSTEM.md
- [ ] ✅ TESTING_GUIDE.md (этот файл!)

### Testing:
- [ ] ✅ Manual testing completed
- [ ] 🔧 Unit tests (backend)
- [ ] 🔧 Integration tests
- [ ] 🔧 E2E tests
- [ ] 🔧 Load testing

---

## 🚀 Quick Links

### Demo Pages:
- Dashboard Selector: `/#/dashboard`
- Owner Dashboard: `/#/owner?demo=true`
- Super Admin: `/#/superadmin?demo=true`
- Refund Management: `/#/superadmin` → "Refund Requests"
- Blocked Demo: `/#/blocked-demo`

### Documentation:
- Refund Security: `/REFUND_SECURITY_SYSTEM.md`
- Refund User Guide: `/REFUND_USER_GUIDE.md`
- Auto-Block System: `/AUTO_BLOCK_SYSTEM.md`

### Code Files:
- `RefundRequestModal.tsx` - Client refund form
- `AdminRefundManagement.tsx` - Admin panel
- `BlockedSalonView.tsx` - Blocked state UI
- `salonAutoBlock.ts` - Auto-block logic
- `SuperAdminDashboardPlans.tsx` - Billing periods

---

**Happy Testing! 🎉**

Если найдете баги, создайте issue с:
- Steps to reproduce
- Expected vs Actual behavior
- Screenshots/Console logs
- Browser/Device info
