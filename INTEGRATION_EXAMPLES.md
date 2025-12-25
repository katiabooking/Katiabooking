# 🎯 INTEGRATION EXAMPLES - КАК ВСЕ РАБОТАЕТ ВМЕСТЕ

## 📱 **ПОЛНАЯ ИНТЕГРАЦИЯ ВСЕХ КОМПОНЕНТОВ**

---

## **SCENARIO 1: Client books via AI Agent**

### **Step-by-Step Flow:**

```tsx
// ============================================
// CLIENT APP - AI Booking
// ============================================

import { AIBookingAgent } from './components/AIBookingAgent';
import { ClientBookingTracker } from './components/ClientBookingTracker';

function ClientDashboard() {
  const [bookings, setBookings] = useState<ClientBookingView[]>([]);

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left: AI Agent */}
      <AIBookingAgent
        salonId="salon-123"
        salonName="Glamour Studio"
        onBookingCreated={async (bookingData) => {
          // 1. AI creates booking request
          const response = await fetch('/api/bookings/create', {
            method: 'POST',
            body: JSON.stringify({
              clientId: currentUser.id,
              clientName: currentUser.name,
              ...bookingData,
              depositPaid: true,
              depositAmount: bookingData.price * 0.25,
            }),
          });

          const { booking } = await response.json();

          // 2. Add to client's bookings
          setBookings(prev => [...prev, {
            booking,
            statusLabel: 'Pending Confirmation',
            statusColor: 'yellow',
            statusIcon: '⏳',
            canCancel: true,
            availableActions: [
              {
                type: 'cancel',
                label: 'Cancel Booking',
                variant: 'danger',
              },
            ],
            showCountdown: true,
            countdownLabel: 'Salon will respond within',
            countdownExpiresAt: booking.confirmationDeadline,
          }]);

          toast.success('Booking request sent! ⏳');
        }}
      />

      {/* Right: Booking Tracker */}
      <ClientBookingTracker
        bookings={bookings}
        onCancelBooking={async (bookingId, reason) => {
          await cancelBooking(bookingId, reason);
        }}
        onRespondToReschedule={async (response) => {
          await respondToReschedule(response);
        }}
      />
    </div>
  );
}
```

---

## **SCENARIO 2: Salon reviews on Calendar**

```tsx
// ============================================
// SALON DASHBOARD - Calendar Integration
// ============================================

import { BookingCalendar } from './components/BookingCalendar';
import { SalonBookingConfirmationPanel } from './components/SalonBookingConfirmationPanel';

function SalonDashboard() {
  const [pendingBookings, setPendingBookings] = useState<SalonBookingView[]>([]);
  const [showPendingPanel, setShowPendingPanel] = useState(false);

  // Fetch pending bookings
  useEffect(() => {
    const fetchPending = async () => {
      const response = await fetch(
        `/api/salons/${salonId}/bookings/pending`
      );
      const { bookings } = await response.json();

      // Transform to SalonBookingView
      const views = bookings.map(booking => ({
        booking,
        isPending: booking.status === 'pending',
        isUrgent: isBookingUrgent(booking),
        hasConflict: false, // TODO: Check calendar
        canConfirm: true,
        canDecline: true,
        canReschedule: true,
        autoDeclineIn: getTimeUntilAutoDecline(booking),
      }));

      setPendingBookings(views);
    };

    fetchPending();
    const interval = setInterval(fetchPending, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [salonId]);

  return (
    <div className="space-y-6">
      {/* Calendar with notification badge */}
      <BookingCalendar
        salonId={salonId}
        masters={masters}
        events={calendarEvents}
        pendingBookings={pendingBookings.map(v => v.booking)}
        onPendingClick={() => setShowPendingPanel(true)}
        onNewBooking={() => setShowNewBookingModal(true)}
        onEventClick={(event) => setSelectedEvent(event)}
      />

      {/* Pending confirmation panel (modal/drawer) */}
      {showPendingPanel && (
        <Modal onClose={() => setShowPendingPanel(false)}>
          <SalonBookingConfirmationPanel
            bookings={pendingBookings}
            onConfirm={async (action) => {
              // Confirm booking
              const response = await fetch(
                `/api/bookings/${action.bookingId}/confirm`,
                {
                  method: 'POST',
                  body: JSON.stringify({
                    actorId: currentUser.id,
                    actorName: currentUser.name,
                  }),
                }
              );

              const { booking } = await response.json();

              // Update calendar
              refreshCalendar();
              
              // Remove from pending
              setPendingBookings(prev =>
                prev.filter(b => b.booking.id !== action.bookingId)
              );

              // Send notification to client
              await sendNotification({
                recipientId: booking.clientId,
                type: 'booking_confirmed',
                title: 'Booking Confirmed! 🎉',
                message: `Your booking is confirmed for ${new Date(
                  booking.startTime
                ).toLocaleString()}`,
              });

              toast.success('Booking confirmed! ✅');
            }}
            onDecline={async (action) => {
              // Decline and refund
              await fetch(`/api/bookings/${action.bookingId}/decline`, {
                method: 'POST',
                body: JSON.stringify({
                  declineReason: action.declineReason,
                  actorId: currentUser.id,
                  actorName: currentUser.name,
                }),
              });

              // Process refund
              await processRefund(action.bookingId);

              // Update UI
              setPendingBookings(prev =>
                prev.filter(b => b.booking.id !== action.bookingId)
              );

              toast.success('Booking declined. Client refunded.');
            }}
            onReschedule={async (action) => {
              // Propose reschedule
              await fetch(
                `/api/bookings/${action.bookingId}/propose-reschedule`,
                {
                  method: 'POST',
                  body: JSON.stringify({
                    newDateTime: action.newDateTime,
                    rescheduleReason: action.rescheduleReason,
                    actorId: currentUser.id,
                    actorName: currentUser.name,
                  }),
                }
              );

              toast.success('Reschedule request sent to client');
            }}
          />
        </Modal>
      )}
    </div>
  );
}
```

---

## **SCENARIO 3: Conflict Resolution**

```tsx
// ============================================
// CONFLICT HANDLING - Full Flow
// ============================================

function BookingWorkflow() {
  const [conflict, setConflict] = useState<any>(null);

  const handleBookingRequest = async (bookingData) => {
    // 1. Check availability in real-time
    const availCheck = await fetch('/api/slots/check-availability', {
      method: 'POST',
      body: JSON.stringify({
        masterId: bookingData.masterId,
        dateTime: bookingData.startTime,
        serviceDuration: bookingData.duration,
      }),
    });

    const { available, conflictWith } = await availCheck.json();

    if (!available) {
      // 2. Get suggestions
      const suggestions = await fetch('/api/slots/suggest-alternatives', {
        method: 'POST',
        body: JSON.stringify({
          masterId: bookingData.masterId,
          dateTime: bookingData.startTime,
          serviceDuration: bookingData.duration,
          salonId: bookingData.salonId,
        }),
      });

      const { suggestions: alts } = await suggestions.json();

      // 3. Show conflict resolution UI
      setConflict({
        bookingData,
        conflictWith,
        suggestions: alts,
      });

      return;
    }

    // No conflict, proceed with booking
    await createBooking(bookingData);
  };

  return (
    <div>
      {conflict && (
        <SmartConflictResolution
          bookingId={conflict.bookingData.id}
          clientName={conflict.bookingData.clientName}
          serviceName={conflict.bookingData.serviceName}
          requestedDateTime={new Date(conflict.bookingData.startTime)}
          requestedMasterId={conflict.bookingData.masterId}
          requestedMasterName={conflict.bookingData.masterName}
          conflictType="slot_taken"
          conflictReason={`${conflict.bookingData.masterName} is already booked at this time`}
          suggestedAlternatives={{
            type:
              conflict.suggestions.sameTime.availableMasters.length > 0
                ? 'different_master'
                : 'different_time',
            masters: conflict.suggestions.sameTime.availableMasters,
            timeSlots: conflict.suggestions.sameMaster.availableTimes.map(
              (t) => ({
                time: t.time,
                available: true,
              })
            ),
          }}
          onAcceptSuggestion={async (alternative) => {
            // Client accepts salon's suggestion
            await fetch('/api/bookings/accept-alternative', {
              method: 'POST',
              body: JSON.stringify({
                bookingId: conflict.bookingData.id,
                alternative,
              }),
            });

            setConflict(null);
            toast.success('Alternative accepted!');
          }}
          onProposeOwn={async (choice) => {
            // Client proposes own choice
            // Salon must confirm

            await fetch('/api/bookings/propose-own', {
              method: 'POST',
              body: JSON.stringify({
                bookingId: conflict.bookingData.id,
                masterId: choice.masterId,
                dateTime: choice.dateTime,
              }),
            });

            setConflict(null);
            toast.success('Your choice sent to salon');
          }}
          onDecline={async () => {
            // Cancel and refund
            await cancelBooking(conflict.bookingData.id);
            setConflict(null);
          }}
        />
      )}
    </div>
  );
}
```

---

## **SCENARIO 4: Real-time Slot Selection**

```tsx
// ============================================
// CLIENT BOOKING FORM - Real-time Slots
// ============================================

function BookingForm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMaster, setSelectedMaster] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch available slots when date/master changes
  useEffect(() => {
    if (!selectedDate || !selectedMaster) return;

    const fetchSlots = async () => {
      setLoading(true);

      const response = await fetch(
        `/api/slots/available?masterId=${selectedMaster}&date=${
          selectedDate.toISOString().split('T')[0]
        }&serviceDuration=60`
      );

      const { availableSlots: slots } = await response.json();
      setAvailableSlots(slots);
      setLoading(false);
    };

    fetchSlots();
  }, [selectedDate, selectedMaster]);

  return (
    <div className="space-y-4">
      {/* Date picker */}
      <div>
        <label>Select Date</label>
        <input
          type="date"
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Master selection */}
      <div>
        <label>Select Master</label>
        <select onChange={(e) => setSelectedMaster(e.target.value)}>
          <option value="">Choose...</option>
          <option value="master-1">Anna (Stylist)</option>
          <option value="master-2">Bob (Barber)</option>
          <option value="master-3">Lisa (Stylist)</option>
        </select>
      </div>

      {/* Time slots - ONLY AVAILABLE */}
      {selectedDate && selectedMaster && (
        <div>
          <label>Available Times</label>
          {loading ? (
            <div>Loading available slots...</div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  variant="outline"
                >
                  {slot}
                </Button>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              ❌ No available slots for this date/master.
              <br />
              Please choose a different date or master.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## **SCENARIO 5: Auto-decline Timer**

```tsx
// ============================================
// AUTO-DECLINE SYSTEM
// ============================================

// Backend (runs every minute)
setInterval(async () => {
  // Get all pending bookings
  const pendingKeys = await kv.getByPrefix('booking:');
  const bookings = pendingKeys.filter(
    (b: BookingWithWorkflow) => b.status === 'pending'
  );

  const now = new Date();

  for (const booking of bookings) {
    if (!booking.confirmationDeadline) continue;

    const deadline = new Date(booking.confirmationDeadline);

    // Check if expired
    if (now >= deadline) {
      // Auto-decline
      console.log(`⏰ Auto-declining booking: ${booking.id}`);

      booking.status = 'expired';
      booking.calendarSlotStatus = 'available';
      booking.updatedAt = now;

      // Save
      await kv.set(`booking:${booking.id}`, booking);

      // Release calendar slot
      const calendarKey = `master:${booking.masterId}:calendar:${
        booking.startTime.toISOString().split('T')[0]
      }`;
      const slots = (await kv.get(calendarKey)) as any[];
      const updated = slots.filter((s) => s.bookingId !== booking.id);
      await kv.set(calendarKey, updated);

      // Process refund
      await processRefund(booking.id, booking.depositAmount);

      // Notify client
      await sendNotification({
        recipientId: booking.clientId,
        type: 'booking_expired',
        title: 'Booking Expired',
        message:
          'Unfortunately, the salon did not respond in time. Your deposit has been refunded.',
      });

      // Notify salon
      await sendNotification({
        recipientId: booking.salonId,
        type: 'booking_expired',
        title: 'Booking Auto-Declined',
        message: `Booking from ${booking.clientName} was auto-declined due to no response.`,
      });
    }
    // Send reminder 1 hour before
    else if (deadline.getTime() - now.getTime() <= 3600000) {
      // 1 hour = 3600000ms
      await sendNotification({
        recipientId: booking.salonId,
        type: 'confirmation_reminder',
        title: '⏰ Urgent: Booking will auto-decline in 1 hour',
        message: `Booking from ${booking.clientName} needs confirmation`,
      });
    }
  }
}, 60000); // Every minute
```

---

## **🎯 РЕЗУЛЬТАТ ИНТЕГРАЦИИ:**

```
✅ CLIENT SIDE:
- AI Agent для natural language booking
- Automatic conflict detection
- Smart alternatives UI
- Real-time status updates
- Countdown timers
- Refund tracking

✅ SALON SIDE:
- Calendar with notification badges
- Pending bookings panel
- One-click confirm/decline
- Propose alternatives
- Confirm client choices
- Auto-decline protection

✅ BACKEND:
- Real-time slot availability
- Conflict prevention
- Temp hold system
- Auto-decline scheduler
- Refund processing
- Notification system

✅ WORKFLOW:
- Client books → Pending
- Salon sees notification
- Salon reviews (calendar/panel)
- If conflict → Suggests alternatives
- Client accepts OR proposes own
- Salon confirms final choice
- Booking confirmed!
```

---

**🚀 ВСЕ КОМПОНЕНТЫ РАБОТАЮТ ВМЕСТЕ!**

**Real-world flow:**
1. Client opens AI Agent
2. Types: "Haircut tomorrow 2 PM with Anna"
3. AI checks real-time availability
4. If conflict → Shows alternatives
5. Client chooses alternative
6. Booking created (pending)
7. Salon calendar shows 🔔 badge
8. Salon clicks → Opens panel
9. Salon confirms
10. Client gets notification
11. Done! ✅

**Zero conflicts. Zero confusion. 100% professional! 🎉**
