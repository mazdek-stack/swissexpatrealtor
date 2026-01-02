// Dynamic Booking Widget
// Fetches availability from booking.mazdek.ch API

(function() {
  const API_BASE = 'https://booking.mazdek.ch/api/availability/public';

  // Format date for display
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Format time for display (24h to 12h)
  function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }

  // Create booking URL
  function createBookingUrl(date, time) {
    return `https://booking.mazdek.ch/?date=${date}&time=${time}`;
  }

  // Update all booking widgets on the page
  async function updateBookingWidgets() {
    try {
      // Fetch available dates
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error('Failed to fetch availability');

      const data = await response.json();
      const availableDates = data.availableDates;

      if (!availableDates || availableDates.length === 0) {
        return;
      }

      // Get the first available date
      const firstDate = availableDates[0];

      // Fetch slots for that date
      const slotsResponse = await fetch(`${API_BASE}?date=${firstDate}`);
      if (!slotsResponse.ok) throw new Error('Failed to fetch slots');

      const slotsData = await slotsResponse.json();
      const slots = slotsData.slots || [];

      // If no slots on first day, try next days
      let currentDate = firstDate;
      let currentSlots = slots;
      let dateIndex = 0;

      while (currentSlots.length === 0 && dateIndex < availableDates.length - 1) {
        dateIndex++;
        currentDate = availableDates[dateIndex];
        const nextResponse = await fetch(`${API_BASE}?date=${currentDate}`);
        if (nextResponse.ok) {
          const nextData = await nextResponse.json();
          currentSlots = nextData.slots || [];
        }
      }

      if (currentSlots.length === 0) {
        return;
      }

      // Get first 3 slots
      const displaySlots = currentSlots.slice(0, 3);

      // Update hero booking widgets (.booking-widget)
      const heroWidgets = document.querySelectorAll('.booking-widget');
      heroWidgets.forEach(widget => {
        updateHeroWidget(widget, currentDate, displaySlots);
      });

      // Update contact section booking (.contact-apple__card with times)
      const contactCards = document.querySelectorAll('.contact-apple__times');
      contactCards.forEach(timesContainer => {
        updateContactWidget(timesContainer, currentDate, displaySlots);
      });

    } catch (error) {
      console.error('Booking widget error:', error);
      // Keep static content on error
    }
  }

  // Update hero booking widget
  function updateHeroWidget(widget, date, slots) {
    // Update date
    const dateElement = widget.querySelector('.booking-widget__selected-date');
    if (dateElement) {
      dateElement.textContent = formatDate(date);
    }

    // Update time slots
    const timesContainer = widget.querySelector('.booking-widget__times');
    if (timesContainer && slots.length > 0) {
      timesContainer.innerHTML = slots.map(slot =>
        `<a href="${createBookingUrl(date, slot)}" class="booking-time-slot">${formatTime(slot)}</a>`
      ).join('');
    }

    // Update "see more" link
    const moreLink = widget.querySelector('.booking-widget__more');
    if (moreLink) {
      moreLink.href = `https://booking.mazdek.ch/?date=${date}`;
    }
  }

  // Update contact section booking widget
  function updateContactWidget(timesContainer, date, slots) {
    // Find parent card
    const card = timesContainer.closest('.contact-apple__card');
    if (!card) return;

    // Update date
    const dateElement = card.querySelector('.contact-apple__date');
    if (dateElement) {
      dateElement.textContent = formatDate(date);
    }

    // Update time slots
    if (slots.length > 0) {
      timesContainer.innerHTML = slots.map(slot =>
        `<a href="${createBookingUrl(date, slot)}" class="contact-apple__time-btn">${formatTime(slot)}</a>`
      ).join('');
    }

    // Update "see more" link
    const moreLink = card.querySelector('.contact-apple__link');
    if (moreLink) {
      moreLink.href = `https://booking.mazdek.ch/?date=${date}`;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateBookingWidgets);
  } else {
    updateBookingWidgets();
  }
})();
