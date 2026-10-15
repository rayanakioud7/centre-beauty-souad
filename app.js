/**
 * CENTRE BEAUTY SOUAD - CASABLANCA
 * Frontend Logic & Interactivity
 * Phone / WhatsApp: 06.60.64.74.61 (+212660647461)
 */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = '212660647461';

  // ==========================================
  // 1. HEADER & MOBILE DRAWER NAVIGATION
  // ==========================================
  const siteHeader = document.getElementById('siteHeader');
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // ==========================================
  // 2. INTERACTIVE BEFORE / AFTER SLIDER
  // ==========================================
  const sliderContainer = document.getElementById('hairSliderContainer');
  const beforeWrapper = document.getElementById('hairBeforeWrapper');
  const sliderDivider = document.getElementById('hairSliderDivider');

  if (sliderContainer && beforeWrapper && sliderDivider) {
    let isSliding = false;

    function setSliderPercent(percentage) {
      const clamped = Math.max(0, Math.min(100, percentage));
      beforeWrapper.style.width = `${clamped}%`;
      sliderDivider.style.left = `${clamped}%`;
      sliderContainer.setAttribute('aria-valuenow', String(Math.round(clamped)));
    }

    function updateSlider(clientX) {
      const rect = sliderContainer.getBoundingClientRect();
      if (!rect.width) return;
      let offsetX = clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;
      setSliderPercent((offsetX / rect.width) * 100);
    }

    // Mouse events
    sliderContainer.addEventListener('mousedown', (e) => {
      isSliding = true;
      updateSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isSliding) return;
      updateSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isSliding = false;
    });

    // Touch events for mobile
    sliderContainer.addEventListener('touchstart', (e) => {
      isSliding = true;
      if (e.touches.length > 0) updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isSliding) return;
      if (e.touches.length > 0) updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isSliding = false;
    });

    // Keyboard support (accessibility)
    sliderContainer.addEventListener('keydown', (e) => {
      const current = parseFloat(beforeWrapper.style.width) || 50;
      const step = 5;
      let next;
      switch (e.key) {
        case 'ArrowLeft': case 'ArrowDown': next = current - step; break;
        case 'ArrowRight': case 'ArrowUp': next = current + step; break;
        case 'Home': next = 0; break;
        case 'End': next = 100; break;
        default: return;
      }
      e.preventDefault();
      setSliderPercent(next);
    });

    // Initialize position + ARIA state
    setSliderPercent(parseFloat(beforeWrapper.style.width) || 50);
  }

  // ==========================================
  // 3. CATALOG FILTERING & SEARCH
  // ==========================================
  const searchInput = document.getElementById('serviceSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterPills = document.querySelectorAll('.filter-pill');
  const serviceCards = document.querySelectorAll('.service-item-card');
  const noResultsState = document.getElementById('noResultsState');
  const resetSearchBtn = document.getElementById('resetSearchBtn');

  let currentCategory = 'all';
  let currentSearchQuery = '';

  function filterServices() {
    let visibleCount = 0;
    const query = currentSearchQuery.trim().toLowerCase();

    serviceCards.forEach(card => {
      const cardCategory = card.dataset.category || '';
      const cardName = card.dataset.name || '';
      const cardText = card.textContent.toLowerCase();

      const matchesCategory = (currentCategory === 'all') || cardCategory.includes(currentCategory);
      const matchesSearch = query === '' || cardName.includes(query) || cardText.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsState) {
      if (visibleCount === 0) {
        noResultsState.classList.remove('hidden');
      } else {
        noResultsState.classList.add('hidden');
      }
    }
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.dataset.filter;
      filterServices();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      if (currentSearchQuery.length > 0) {
        clearSearchBtn.classList.add('show');
      } else {
        clearSearchBtn.classList.remove('show');
      }
      filterServices();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchQuery = '';
      clearSearchBtn.classList.remove('show');
      filterServices();
      searchInput.focus();
    });
  }

  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearchQuery = '';
      if (clearSearchBtn) clearSearchBtn.classList.remove('show');
      currentCategory = 'all';
      filterPills.forEach(p => p.classList.remove('active'));
      const firstPill = document.querySelector('.filter-pill[data-filter="all"]');
      if (firstPill) firstPill.classList.add('active');
      filterServices();
    });
  }

  // ==========================================
  // 4. INTERACTIVE DEVIS & PACK CALCULATOR
  // ==========================================
  const calcCheckboxes = document.querySelectorAll('.calc-item-checkbox');
  const calcTotalAmount = document.getElementById('calcTotalAmount');
  const calcSelectedCount = document.getElementById('calcSelectedCount');
  const calcResetBtn = document.getElementById('calcResetBtn');
  const calcBookWhatsAppBtn = document.getElementById('calcBookWhatsAppBtn');

  function updateCalculator() {
    let total = 0;
    let count = 0;
    const selectedItems = [];

    calcCheckboxes.forEach(cb => {
      const card = cb.closest('.calc-checkbox-card');
      if (cb.checked) {
        card.classList.add('selected');
        const price = parseInt(cb.dataset.price, 10) || 0;
        const name = cb.dataset.name || '';
        total += price;
        count++;
        selectedItems.push(`${name} (${price} DH)`);
      } else {
        card.classList.remove('selected');
      }
    });

    if (calcTotalAmount) {
      calcTotalAmount.innerHTML = `${total} <small>DH</small>`;
    }
    if (calcSelectedCount) {
      calcSelectedCount.textContent = `${count} prestation(s) sélectionnée(s)`;
    }

    if (calcBookWhatsAppBtn) {
      if (count > 0) {
        calcBookWhatsAppBtn.removeAttribute('disabled');
        // Build custom WhatsApp URL for the chosen pack
        const itemsList = selectedItems.map(item => `• ${item}`).join('\n');
        const message = `Bonjour Centre Beauty Souad,\n\nJe souhaite composer mon pack personnalisé et prendre rendez-vous pour les prestations suivantes :\n${itemsList}\n\n💰 Total estimé : ${total} DH\n\nPouvez-vous me confirmer vos disponibilités prochaines ? Merci !`;
        calcBookWhatsAppBtn.onclick = () => {
          const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
          window.open(url, '_blank');
        };
      } else {
        calcBookWhatsAppBtn.setAttribute('disabled', 'true');
        calcBookWhatsAppBtn.onclick = null;
      }
    }
  }

  calcCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateCalculator);
  });

  if (calcResetBtn) {
    calcResetBtn.addEventListener('click', () => {
      calcCheckboxes.forEach(cb => {
        cb.checked = false;
      });
      updateCalculator();
      showToast('Sélection réinitialisée');
    });
  }

  // ==========================================
  // 5. BOOKING MODAL & WHATSAPP GENERATOR
  // ==========================================
  const modalOverlay = document.getElementById('bookingModalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const bookingForm = document.getElementById('bookingForm');
  const bookService = document.getElementById('bookService');
  const clientName = document.getElementById('clientName');
  const clientPhone = document.getElementById('clientPhone');
  const bookDate = document.getElementById('bookDate');
  const bookTime = document.getElementById('bookTime');
  const bookNotes = document.getElementById('bookNotes');
  const whatsappMessagePreview = document.getElementById('whatsappMessagePreview');
  const openBookingBtns = document.querySelectorAll('.open-booking-btn');

  // Set min date to today
  if (bookDate) {
    const today = new Date().toISOString().split('T')[0];
    bookDate.min = today;
    // Default to tomorrow or today
    bookDate.value = today;
  }

  function updateWhatsAppPreview() {
    if (!whatsappMessagePreview) return;
    const service = bookService ? bookService.value : 'Consultation';
    const name = clientName && clientName.value.trim() ? clientName.value.trim() : '[Votre Nom]';
    const phone = clientPhone && clientPhone.value.trim() ? clientPhone.value.trim() : '';
    const date = bookDate && bookDate.value ? bookDate.value : '[Date]';
    const time = bookTime ? bookTime.value : 'Matinée';
    const notes = bookNotes && bookNotes.value.trim() ? `\nNotes : ${bookNotes.value.trim()}` : '';

    const phoneStr = phone ? `\nTéléphone : ${phone}` : '';

    const preview = `Bonjour Centre Beauty Souad 🌸,\n\nJe souhaite réserver un rendez-vous :\n• Prestation : ${service}\n• Date souhaitée : ${date}\n• Créneau : ${time}\n• Nom de la cliente : ${name}${phoneStr}${notes}\n\nMerci de bien vouloir me confirmer la réservation !`;
    whatsappMessagePreview.textContent = preview;
    return preview;
  }

  function normalizeLabel(value) {
    return (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function selectServiceOption(service) {
    if (!bookService || !service) return;

    // Remove any previously injected custom options so the list never grows.
    Array.from(bookService.options).forEach(opt => {
      if (opt.dataset.custom === 'true') opt.remove();
    });

    const target = normalizeLabel(service);
    let index = Array.from(bookService.options).findIndex(o => o.value === service);

    if (index === -1) {
      index = Array.from(bookService.options).findIndex(o => {
        const value = normalizeLabel(o.value);
        return value === target || value.includes(target) || target.includes(value);
      });
    }

    if (index === -1) {
      const opt = new Option(service, service, true, true);
      opt.dataset.custom = 'true';
      bookService.add(opt);
      index = bookService.options.length - 1;
    }

    bookService.selectedIndex = index;
  }

  function openBookingModal(preselectedService = null) {
    if (modalOverlay) {
      if (preselectedService) selectServiceOption(preselectedService);
      updateWhatsAppPreview();
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (clientName) clientName.focus();
    }
  }

  function closeBookingModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.dataset.service;
      openBookingModal(service);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeBookingModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeBookingModal();
    });
  }

  // Close modal / drawer with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (modalOverlay && modalOverlay.classList.contains('active')) closeBookingModal();
    if (mobileDrawer && mobileDrawer.classList.contains('open')) closeDrawer();
  });

  // Update preview on inputs
  [bookService, clientName, clientPhone, bookDate, bookTime, bookNotes].forEach(element => {
    if (element) {
      element.addEventListener('input', updateWhatsAppPreview);
      element.addEventListener('change', updateWhatsAppPreview);
    }
  });

  // Handle Booking Form Submit
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = updateWhatsAppPreview();
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      
      showToast('Ouverture de WhatsApp...');
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        closeBookingModal();
      }, 300);
    });
  }

  // ==========================================
  // 6. FAQ ACCORDION
  // ==========================================
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other items
      document.querySelectorAll('.accordion-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherTrigger = other.querySelector('.accordion-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isExpanded) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ==========================================
  // 7. TOAST NOTIFICATION HELPER
  // ==========================================
  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-sparkles text-gold"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Initial calculation run
  updateCalculator();
  updateWhatsAppPreview();
});
