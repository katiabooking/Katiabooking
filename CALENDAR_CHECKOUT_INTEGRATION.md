# 📅💳 CALENDAR + CHECKOUT INTEGRATION

## 🎯 **КАК ВСЕ РАБОТАЕТ ВМЕСТЕ:**

---

## 🔄 **ПОЛНЫЙ FLOW:**

```
┌─────────────────────────────────────────────┐
│ SALON DASHBOARD - Calendar View             │
├─────────────────────────────────────────────┤
│                                             │
│ 📅 March 20, 2024                           │
│                                             │
│ TIME │ Anna  │ Bob   │ Elena               │
│ ─────┼───────┼───────┼─────────            │
│ 10:00│ Sarah │       │ Mike                │
│      │ 💰    │       │ ✅                  │ ← Payment status badges
│      │       │       │                     │
│ 11:00│       │ John  │                     │
│      │       │ ⏳    │                     │
│      │       │       │                     │
│ 14:00│ Emma  │       │                     │
│      │ ✅    │       │                     │
└─────────────────────────────────────────────┘

Legend:
💰 = Deposit paid (remaining balance)
✅ = Fully paid
⏳ = No payment yet
❌ = Unpaid (overdue)
```

---

## 💡 **CLICK ON BOOKING → CHECKOUT:**

### **Master clicks on Sarah's 10:00 AM booking:**

```tsx
// Calendar Component
<div 
  onClick={() => handleBookingClick(booking)}
  className="booking-card"
>
  <div className="client-name">Sarah J.</div>
  <div className="service">Haircut</div>
  <div className="payment-badge">
    {getPaymentBadge(booking)}
  </div>
</div>

// Handler
const handleBookingClick = (booking) => {
  setSelectedBooking(booking);
  setShowCheckout(true);
};

// Show checkout modal
{showCheckout && (
  <SmartCheckoutModal
    isOpen={showCheckout}
    onClose={() => setShowCheckout(false)}
    bookingId={selectedBooking.id}
    clientId={selectedBooking.clientId}
    clientName={selectedBooking.clientName}
    services={selectedBooking.services}
    onPaymentComplete={handlePaymentComplete}
  />
)}
```

---

## 📊 **PAYMENT BADGES ON CALENDAR:**

```tsx
function getPaymentBadge(booking: Booking) {
  // Fetch payment status (cached)
  const paymentInfo = usePaymentInfo(booking.id);

  if (!paymentInfo) {
    return <Badge variant="gray">⏳ No payment</Badge>;
  }

  if (paymentInfo.fullPaymentPaid) {
    return <Badge variant="green">✅ Paid</Badge>;
  }

  if (paymentInfo.depositPaid) {
    return (
      <Badge variant="orange">
        💰 {formatPrice(paymentInfo.remainingAmount)} due
      </Badge>
    );
  }

  return <Badge variant="red">❌ Unpaid</Badge>;
}

// Usage on calendar
<CalendarEvent booking={booking}>
  <div className="event-content">
    <div className="client-name">{booking.clientName}</div>
    <div className="service">{booking.serviceName}</div>
    <div className="payment-status">
      {getPaymentBadge(booking)}
    </div>
  </div>
</CalendarEvent>
```

---

## 🎨 **VISUAL DESIGN:**

### **Calendar Event Card with Payment Badge:**

```
┌──────────────────────────┐
│ Sarah J.          💰     │ ← Badge
│ Haircut                  │
│ AED 150 due              │
│ ─────────────────────    │
│ 10:00 - 11:00 AM         │
└──────────────────────────┘
   ↓ Click
   
┌─────────────────────────────────────────────┐
│ 💳 Checkout                    Order #123   │
├─────────────────────────────────────────────┤
│                                             │
│ ✅ DEPOSIT PAID                             │
│ ┌─────────────────────────────────────────┐│
│ │ Amount: AED 50.00                       ││
│ │ Method: Card (Stripe)                   ││
│ │ Paid: Mar 20, 10:15 AM                  ││
│ └─────────────────────────────────────────┘│
│                                             │
│ ⏳ PAYMENT PENDING                          │
│ ┌─────────────────────────────────────────┐│
│ │ Already paid: AED 50.00                 ││
│ │ Remaining: AED 150.00                   ││
│ └─────────────────────────────────────────┘│
│                                             │
│ SERVICES                                    │
│ • Haircut              AED 200.00           │
│                                             │
│ Payment Method: [Card] Cash  Link           │
│                                             │
│ Total To Pay            AED 150.00          │
│                                             │
│ [Cancel]  [💳 Charge AED 150.00]           │
└─────────────────────────────────────────────┘
```

---

## 🔄 **REAL-TIME UPDATES:**

### **After payment is processed:**

```typescript
// 1. Record payment
await recordPayment({
  bookingId: booking.id,
  amount: 150,
  method: 'cash',
  type: 'full_payment',
});

// 2. Update calendar event badge
const updatedPaymentInfo = await fetchPaymentInfo(booking.id);

// 3. Calendar automatically updates
// Badge changes from:
💰 AED 150 due
    ↓
✅ Paid

// 4. Event card color changes
// From: orange border (partial)
//   To: green border (fully paid)
```

---

## 📱 **MASTER DASHBOARD VIEW:**

```
┌─────────────────────────────────────────────┐
│ Today's Bookings (10)            Mar 20     │
├─────────────────────────────────────────────┤
│                                             │
│ ✅ Paid (4)        💰 Partial (3)          │
│ ⏳ Unpaid (2)      ❌ Overdue (1)          │
│                                             │
│ ──────────────────────────────────────────  │
│                                             │
│ 🕐 10:00 - Sarah J. - Haircut               │
│    💰 AED 150 due [Checkout →]              │
│                                             │
│ 🕐 11:00 - Mike T. - Color                  │
│    ✅ Fully paid                            │
│                                             │
│ 🕑 14:00 - Emma D. - Manicure               │
│    ⏳ No payment [Checkout →]               │
│                                             │
│ 🕔 17:00 - John K. - Haircut                │
│    ❌ Overdue AED 200 [Checkout →]          │
└─────────────────────────────────────────────┘
```

---

## 🎯 **QUICK ACTIONS:**

### **On Calendar:**

```tsx
// Right-click menu or swipe actions
<ContextMenu>
  <ContextMenuItem onClick={() => openCheckout(booking)}>
    💳 Checkout
  </ContextMenuItem>
  <ContextMenuItem onClick={() => viewPaymentHistory(booking)}>
    📊 Payment History
  </ContextMenuItem>
  <ContextMenuItem onClick={() => sendPaymentReminder(booking)}>
    📧 Send Payment Reminder
  </ContextMenuItem>
  <ContextMenuItem onClick={() => rescheduleBooking(booking)}>
    📅 Reschedule
  </ContextMenuItem>
</ContextMenu>
```

---

## 📊 **ANALYTICS INTEGRATION:**

### **Daily Summary Widget:**

```
┌─────────────────────────────────────────────┐
│ 💰 Today's Revenue           Mar 20, 2024   │
├─────────────────────────────────────────────┤
│                                             │
│ Total Revenue:        AED 2,450.00          │
│ Collected:            AED 1,800.00 (73%)    │
│ Pending:              AED   650.00 (27%)    │
│                                             │
│ ─────────────────────────────────────────   │
│                                             │
│ By Method:                                  │
│ 💳 Card:     AED 1,200.00 (67%)             │
│ 💵 Cash:     AED   600.00 (33%)             │
│ 🔗 Link:     AED     0.00 (0%)              │
│                                             │
│ ─────────────────────────────────────────   │
│                                             │
│ Unpaid Bookings (3):                        │
│ • Sarah J. - AED 150 [Checkout →]           │
│ • Emma D.  - AED 200 [Checkout →]           │
│ • John K.  - AED 300 [Checkout →]           │
│                                             │
│ [View Full Report]                          │
└─────────────────────────────────────────────┘
```

---

## 🔔 **PAYMENT REMINDERS:**

### **Automatic reminders for unpaid bookings:**

```typescript
// After service completion
setTimeout(() => {
  if (!isFullyPaid(booking)) {
    // Show reminder badge on calendar
    showPaymentReminderBadge(booking);
    
    // Send notification
    sendNotification({
      to: master,
      title: '💰 Payment Reminder',
      message: `${booking.clientName}'s payment is pending (AED ${remainingAmount})`,
      action: 'Open Checkout',
      actionUrl: `/checkout/${booking.id}`,
    });
  }
}, 5 * 60 * 1000); // 5 minutes after appointment end
```

---

## 🎨 **COLOR CODING:**

```css
/* Calendar event colors based on payment status */

.event-fully-paid {
  border-left: 4px solid #10b981; /* Green */
  background: #f0fdf4;
}

.event-deposit-paid {
  border-left: 4px solid #f59e0b; /* Orange */
  background: #fffbeb;
}

.event-no-payment {
  border-left: 4px solid #6b7280; /* Gray */
  background: #f9fafb;
}

.event-overdue {
  border-left: 4px solid #ef4444; /* Red */
  background: #fef2f2;
  animation: pulse 2s infinite;
}

/* Payment badges */
.badge-paid {
  background: #10b981;
  color: white;
}

.badge-partial {
  background: #f59e0b;
  color: white;
}

.badge-unpaid {
  background: #ef4444;
  color: white;
}
```

---

## 📱 **MOBILE OPTIMIZATION:**

```
┌────────────────────────┐
│ 📅 Today - Mar 20      │
├────────────────────────┤
│                        │
│ 🕐 10:00 AM            │
│ ┌────────────────────┐ │
│ │ Sarah J.           │ │
│ │ Haircut            │ │
│ │ 💰 AED 150 due     │ │ ← Tap to checkout
│ └────────────────────┘ │
│                        │
│ 🕐 11:00 AM            │
│ ┌────────────────────┐ │
│ │ Mike T.            │ │
│ │ Color              │ │
│ │ ✅ Paid            │ │
│ └────────────────────┘ │
│                        │
│ [+ New Booking]        │
└────────────────────────┘

Tap event → Bottom sheet checkout:

┌────────────────────────┐
│ 💳 Checkout            │ ↕ Swipe to expand
├────────────────────────┤
│ ✅ Deposit: AED 50     │
│ ⏳ Remaining: AED 150  │
│ ────────────────────── │
│ [💳 Charge AED 150]   │
└────────────────────────┘
```

---

## 🎯 **USAGE EXAMPLES:**

### **Example 1: Morning Shift Start**

```
1. Master opens calendar at 9:00 AM
2. Sees today's bookings with payment badges:
   • 10:00 - Sarah (💰 AED 150 due)
   • 11:00 - Mike (✅ Paid)
   • 14:00 - Emma (⏳ No payment)

3. Knows immediately:
   ✓ Mike is paid - no action needed
   ⚠️ Sarah needs AED 150
   ⚠️ Emma needs full payment
```

### **Example 2: Quick Checkout**

```
1. Sarah arrives at 10:00
2. Master clicks on booking
3. Checkout opens automatically
4. Shows: ✅ Deposit AED 50, ⏳ Remaining AED 150
5. Sarah pays AED 150 cash
6. Master records payment
7. Badge updates: 💰 → ✅
8. Done in 30 seconds! ⚡
```

### **Example 3: End of Day Report**

```
1. Master clicks "Today's Summary"
2. Sees:
   Total revenue: AED 2,450
   Collected: AED 1,800
   Pending: AED 650

3. Unpaid bookings list:
   • Sarah - AED 150
   • Emma - AED 200
   • John - AED 300

4. Can click [Checkout →] on each
5. Collect remaining payments
6. End of day reconciliation ✅
```

---

## 🔄 **INTEGRATION CODE:**

```tsx
// Complete integration example
import { BookingCalendar } from './components/BookingCalendar';
import { SmartCheckoutModal } from './components/SmartCheckoutModal';
import { usePaymentInfo } from './hooks/usePaymentInfo';

function SalonDashboard() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setShowCheckout(true);
  };

  const handlePaymentComplete = async (payment) => {
    // Record payment
    await recordPayment({
      bookingId: selectedBooking.id,
      amount: payment.amount,
      method: payment.method,
      type: payment.amount === selectedBooking.totalAmount 
        ? 'full_payment' 
        : 'partial_payment',
    });

    // Refresh calendar
    refreshCalendar();

    // Close modal
    setShowCheckout(false);
    
    toast.success('Payment recorded! ✅');
  };

  return (
    <div>
      <BookingCalendar
        events={events.map(event => ({
          ...event,
          paymentBadge: <PaymentBadge bookingId={event.id} />,
        }))}
        onEventClick={handleBookingClick}
      />

      {showCheckout && (
        <SmartCheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          bookingId={selectedBooking.id}
          clientId={selectedBooking.clientId}
          clientName={selectedBooking.clientName}
          services={selectedBooking.services}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}

// Payment Badge Component
function PaymentBadge({ bookingId }: { bookingId: string }) {
  const { data: paymentInfo, isLoading } = usePaymentInfo(bookingId);

  if (isLoading) return <Badge variant="gray">...</Badge>;
  if (!paymentInfo) return <Badge variant="gray">⏳ No payment</Badge>;

  if (paymentInfo.fullPaymentPaid) {
    return <Badge variant="green">✅ Paid</Badge>;
  }

  if (paymentInfo.depositPaid) {
    return (
      <Badge variant="orange">
        💰 {formatPrice(paymentInfo.remainingAmount)} due
      </Badge>
    );
  }

  return <Badge variant="red">❌ Unpaid</Badge>;
}

// Custom hook for payment info
function usePaymentInfo(bookingId: string) {
  return useQuery({
    queryKey: ['payment-info', bookingId],
    queryFn: () => fetchPaymentInfo(bookingId),
    staleTime: 30000, // Cache for 30 seconds
  });
}
```

---

**🎉 ГОТОВО!**

**Полная интеграция:**
- ✅ Calendar с payment badges
- ✅ Click → Smart Checkout
- ✅ Auto-load payment info
- ✅ Real-time updates
- ✅ Color coding
- ✅ Analytics integration
- ✅ Mobile optimized

**Perfect для:**
- 🏢 Большие салоны
- ⚡ Быстрый checkout
- 📊 Revenue tracking
- 👥 Multiple masters
- 💳 Any payment method

**READY TO USE! 🚀💳**
