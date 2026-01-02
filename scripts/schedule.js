// Schedule Page Calendar and Time Slots
(function () {
  const ready = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  };

  ready(() => {
    const calendarDays = document.getElementById('calendarDays');
    if (calendarDays) {
      const currentMonthEl = document.getElementById('currentMonth');
      const prevMonthBtn = document.getElementById('prevMonth');
      const nextMonthBtn = document.getElementById('nextMonth');
      const selectedDateTitle = document.getElementById('selectedDateTitle');
      const timeSlotsContainer = document.getElementById('timeSlots');
      const bookingModal = document.getElementById('bookingModal');
      const selectedTimeInfo = document.getElementById('selectedTimeInfo');
      const bookingForm = document.getElementById('bookingForm');

      let currentDate = new Date();
      let selectedDate = null;

      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const availableTimeSlots = [
        '9:00 am', '9:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am',
        '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm'
      ];

      const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        currentMonthEl.textContent = `${months[month]} ${year}`;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        const totalDays = lastDay.getDate();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        calendarDays.innerHTML = '';

        // Empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
          const emptyDay = document.createElement('button');
          emptyDay.className = 'calendar-day empty';
          emptyDay.disabled = true;
          calendarDays.appendChild(emptyDay);
        }

        // Days of the month
        for (let day = 1; day <= totalDays; day++) {
          const dayDate = new Date(year, month, day);
          const dayBtn = document.createElement('button');
          dayBtn.className = 'calendar-day';
          dayBtn.textContent = day;

          // Disable past dates and weekends
          const dayOfWeek = dayDate.getDay();
          const isPast = dayDate < today;
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          if (isPast || isWeekend) {
            dayBtn.classList.add('disabled');
            dayBtn.disabled = true;
          } else {
            dayBtn.addEventListener('click', () => selectDate(dayDate, dayBtn));
          }

          // Mark today
          if (dayDate.getTime() === today.getTime()) {
            dayBtn.classList.add('today');
          }

          // Mark selected
          if (selectedDate && dayDate.getTime() === selectedDate.getTime()) {
            dayBtn.classList.add('selected');
          }

          calendarDays.appendChild(dayBtn);
        }
      };

      const selectDate = (date, btn) => {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(el => {
          el.classList.remove('selected');
        });

        // Add selection to clicked day
        btn.classList.add('selected');
        selectedDate = date;

        // Update title
        const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        selectedDateTitle.textContent = formattedDate;

        // Render time slots
        renderTimeSlots(formattedDate);
      };

      const renderTimeSlots = (dateString) => {
        timeSlotsContainer.innerHTML = '';

        availableTimeSlots.forEach(time => {
          const btn = document.createElement('button');
          btn.className = 'time-slot-btn';
          btn.textContent = time;
          btn.addEventListener('click', () => openModal(time, dateString));
          timeSlotsContainer.appendChild(btn);
        });
      };

      const openModal = (time, date) => {
        if (!bookingModal) return;
        bookingModal.classList.add('active');
        document.body.classList.add('modal-open');
        if (selectedTimeInfo) {
          selectedTimeInfo.textContent = `${date} at ${time}`;
        }
      };

      const closeModal = () => {
        if (!bookingModal) return;
        bookingModal.classList.remove('active');
        document.body.classList.remove('modal-open');
      };

      // Modal close handlers
      const modalOverlay = bookingModal?.querySelector('.booking-modal__overlay');
      const modalClose = bookingModal?.querySelector('.booking-modal__close');

      modalOverlay?.addEventListener('click', closeModal);
      modalClose?.addEventListener('click', closeModal);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookingModal?.classList.contains('active')) {
          closeModal();
        }
      });

      // Form submission
      bookingForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(bookingForm);
        const data = Object.fromEntries(formData.entries());
        console.log('Booking submitted:', data);
        alert('Thank you! Your consultation request has been submitted. We will contact you shortly.');
        closeModal();
        bookingForm.reset();
      });

      // Navigation buttons
      prevMonthBtn?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
      });

      nextMonthBtn?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
      });

      // Parse URL parameters
      const parseUrlParams = () => {
        const params = new URLSearchParams(window.location.search);
        const dateParam = params.get('date');
        const timeParam = params.get('time');

        if (dateParam) {
          const [year, month, day] = dateParam.split('-').map(Number);
          const paramDate = new Date(year, month - 1, day);

          if (!isNaN(paramDate.getTime())) {
            // Set current view to the param date's month
            currentDate = new Date(year, month - 1, 1);
            selectedDate = paramDate;

            // Render calendar first
            renderCalendar();

            // Format date for display
            const formattedDate = `${months[paramDate.getMonth()]} ${paramDate.getDate()}, ${paramDate.getFullYear()}`;
            selectedDateTitle.textContent = formattedDate;

            // Render time slots
            renderTimeSlots(formattedDate);

            // If time param exists, open modal
            if (timeParam) {
              // Convert 24h format to 12h format
              const [hours, minutes] = timeParam.split(':').map(Number);
              const period = hours >= 12 ? 'pm' : 'am';
              const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
              const displayTime = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;

              // Delay to ensure DOM is ready
              setTimeout(() => {
                openModal(displayTime, formattedDate);
              }, 300);
            }
            return true;
          }
        }
        return false;
      };

      // Initial render
      if (!parseUrlParams()) {
        renderCalendar();
      }
    }
  });
})();