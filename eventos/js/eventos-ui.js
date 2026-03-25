// ══════════════════════════════════════════════════════════════════════════════
// TEOKAYE EVENTOS - UI MODAL
// ══════════════════════════════════════════════════════════════════════════════

const EventosUI = {
  modal: null,
  currentStep: 1,
  totalSteps: 4,
  authMode: 'login', // 'login' or 'register'
  numBoletos: 1,
  tipoPago: null,
  eventSlug: null,
  existingReservation: null,
  showProfile: false,

  // SVG Icons
  icons: {
    close: '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>',
    minus: '<svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
    warning: '<svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
    card: '<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>',
    spinner: '<svg class="spinner" viewBox="0 0 24 24"><path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/></svg>'
  },

  // Initialize
  async init(eventSlug) {
    this.eventSlug = eventSlug;
    EventosAuth.init();

    // Load event data
    try {
      await EventosReserva.loadEvento(eventSlug);
    } catch (error) {
      console.error('Error loading event:', error);
    }

    // Create modal container
    this.createModal();

    // Update spots display on page
    this.updatePageSpots();

    // Check for existing reservation if logged in
    if (EventosAuth.isLoggedIn()) {
      await this.checkExistingReservation();
    }
  },

  // Check if user has existing reservation
  async checkExistingReservation() {
    try {
      this.existingReservation = await EventosReserva.checkUserReservation();
      if (this.existingReservation) {
        this.updatePageForExistingReservation();
      }
    } catch (error) {
      console.error('Error checking reservation:', error);
    }
  },

  // Update page to show existing reservation state
  updatePageForExistingReservation() {
    if (!this.existingReservation) return;

    const user = EventosAuth.getUser();
    const res = this.existingReservation;
    const boletosStr = res.num_boletos === 1 ? '1 lugar' : `${res.num_boletos} lugares`;

    // Update hero CTA
    const heroCta = document.querySelector('.hero-cta-wrap');
    if (heroCta) {
      heroCta.innerHTML = `
        <div class="reserved-state" style="background: rgba(46, 125, 82, 0.15); border: 1px solid rgba(46, 125, 82, 0.3); border-radius: 12px; padding: 16px; text-align: center;">
          <p style="color: #2E7D52; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#2E7D52"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            Ya tienes ${boletosStr} reservado${res.num_boletos > 1 ? 's' : ''}
          </p>
          <p style="font-size: 13px; color: rgba(230,224,214,0.7);">Reservado como ${user.nombre}</p>
          <button onclick="EventosUI.openProfile()" style="margin-top: 12px; background: transparent; border: 1px solid rgba(46, 125, 82, 0.5); color: #2E7D52; padding: 10px 20px; border-radius: 8px; font-family: inherit; font-size: 14px; font-weight: 500; cursor: pointer;">
            Ver mi reserva
          </button>
        </div>
      `;
    }

    // Update sticky bar
    const sbBtn = document.querySelector('.sb-btn');
    if (sbBtn) {
      sbBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="var(--sand)"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Reservado`;
      sbBtn.onclick = () => EventosUI.openProfile();
    }

    // Update bottom CTA
    const bottomBtn = document.querySelector('.btn-bottom');
    if (bottomBtn) {
      bottomBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="var(--sand)"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Ya tienes tu lugar reservado`;
      bottomBtn.onclick = () => EventosUI.openProfile();
    }
  },

  // Open profile view
  openProfile() {
    this.showProfile = true;
    this.modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    this.renderProfileView();
  },

  // Create modal HTML
  createModal() {
    const modalHTML = `
      <div class="modal-overlay" id="eventos-modal">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">Reservar lugar</h2>
            <button class="modal-close" onclick="EventosUI.close()">
              ${this.icons.close}
            </button>
          </div>
          <div class="modal-steps">
            <div class="step-dot active" data-step="1"></div>
            <div class="step-dot" data-step="2"></div>
            <div class="step-dot" data-step="3"></div>
            <div class="step-dot" data-step="4"></div>
          </div>
          <div class="modal-body" id="modal-body">
            <!-- Content will be rendered here -->
          </div>
          <div class="modal-footer" id="modal-footer">
            <!-- Buttons will be rendered here -->
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('eventos-modal');

    // Close on overlay click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('open')) {
        this.close();
      }
    });
  },

  // Open modal
  async open() {
    this.showProfile = false;

    // Check for existing reservation if logged in
    if (EventosAuth.isLoggedIn()) {
      await this.checkExistingReservation();

      // If user has existing reservation, show profile instead
      if (this.existingReservation) {
        this.openProfile();
        return;
      }
    }

    this.currentStep = EventosAuth.isLoggedIn() ? 2 : 1;
    this.numBoletos = 1;
    this.tipoPago = null;
    this.renderStep();
    this.modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  // Close modal
  close() {
    this.modal.classList.remove('open');
    document.body.style.overflow = '';
    this.showProfile = false;

    // Reset header and steps visibility
    const header = document.querySelector('.modal-title');
    const stepsContainer = document.querySelector('.modal-steps');
    if (header) header.textContent = 'Reservar lugar';
    if (stepsContainer) stepsContainer.style.display = '';
  },

  // Render current step
  renderStep() {
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    // Update step dots
    document.querySelectorAll('.step-dot').forEach((dot, i) => {
      const step = i + 1;
      dot.classList.remove('active', 'completed');
      if (step === this.currentStep) {
        dot.classList.add('active');
      } else if (step < this.currentStep) {
        dot.classList.add('completed');
      }
    });

    // Render step content
    switch (this.currentStep) {
      case 1:
        this.renderAuthStep(body, footer);
        break;
      case 2:
        this.renderTicketsStep(body, footer);
        break;
      case 3:
        this.renderPaymentStep(body, footer);
        break;
      case 4:
        this.renderSuccessStep(body, footer);
        break;
    }
  },

  // Step 1: Authentication
  renderAuthStep(body, footer) {
    const isLogin = this.authMode === 'login';

    body.innerHTML = `
      <div class="step-content active">
        <div class="auth-toggle">
          <button class="auth-toggle-btn ${isLogin ? 'active' : ''}" onclick="EventosUI.setAuthMode('login')">
            Iniciar sesión
          </button>
          <button class="auth-toggle-btn ${!isLogin ? 'active' : ''}" onclick="EventosUI.setAuthMode('register')">
            Crear cuenta
          </button>
        </div>

        <div class="modal-error hidden" id="auth-error">
          ${this.icons.warning}
          <span id="auth-error-text"></span>
        </div>

        ${!isLogin ? `
          <div class="modal-form-group">
            <label class="modal-label" for="auth-name">Nombre completo</label>
            <input class="modal-input" type="text" id="auth-name" placeholder="Tu nombre" autocomplete="name">
          </div>
        ` : ''}

        <div class="modal-form-group">
          <label class="modal-label" for="auth-phone">WhatsApp</label>
          <input class="modal-input" type="tel" id="auth-phone" placeholder="222 123 4567" autocomplete="tel" maxlength="12">
        </div>

        <div class="modal-form-group">
          <label class="modal-label">${isLogin ? 'PIN' : 'Crea un PIN de 4 dígitos'}</label>
          <div class="pin-input-wrap">
            <input class="pin-digit" type="tel" maxlength="1" id="pin-1" inputmode="numeric">
            <input class="pin-digit" type="tel" maxlength="1" id="pin-2" inputmode="numeric">
            <input class="pin-digit" type="tel" maxlength="1" id="pin-3" inputmode="numeric">
            <input class="pin-digit" type="tel" maxlength="1" id="pin-4" inputmode="numeric">
          </div>
        </div>
      </div>
    `;

    footer.innerHTML = `
      <button class="modal-btn modal-btn-primary" id="auth-btn" onclick="EventosUI.handleAuth()">
        ${isLogin ? 'Continuar' : 'Crear cuenta'}
        ${this.icons.arrow}
      </button>
    `;

    // Setup PIN inputs
    this.setupPinInputs();
  },

  // Setup PIN input behavior
  setupPinInputs() {
    const pins = [1, 2, 3, 4].map(i => document.getElementById(`pin-${i}`));

    pins.forEach((pin, i) => {
      pin.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '');
        e.target.value = val;

        if (val && i < 3) {
          pins[i + 1].focus();
        }
      });

      pin.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && i > 0) {
          pins[i - 1].focus();
        }
      });

      pin.addEventListener('paste', (e) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        paste.split('').slice(0, 4).forEach((char, idx) => {
          if (pins[idx]) pins[idx].value = char;
        });
        if (paste.length >= 4) pins[3].focus();
      });
    });
  },

  // Set auth mode
  setAuthMode(mode) {
    this.authMode = mode;
    this.renderStep();
  },

  // Handle authentication
  async handleAuth() {
    const btn = document.getElementById('auth-btn');
    const errorDiv = document.getElementById('auth-error');
    const errorText = document.getElementById('auth-error-text');

    // Get values
    const phone = document.getElementById('auth-phone')?.value || '';
    const pin = [1, 2, 3, 4].map(i => document.getElementById(`pin-${i}`).value).join('');
    const name = document.getElementById('auth-name')?.value || '';

    // Reset error
    errorDiv.classList.add('hidden');

    // Validate PIN
    if (pin.length !== 4) {
      errorText.textContent = 'Por favor ingresa un PIN de 4 dígitos.';
      errorDiv.classList.remove('hidden');
      return;
    }

    // Show loading
    btn.disabled = true;
    btn.innerHTML = `${this.icons.spinner} Procesando...`;

    try {
      if (this.authMode === 'login') {
        await EventosAuth.login(phone, parseInt(pin));
      } else {
        await EventosAuth.register(name, phone, parseInt(pin));
      }

      // Success - go to step 2
      this.currentStep = 2;
      this.renderStep();

    } catch (error) {
      errorText.textContent = error.message;
      errorDiv.classList.remove('hidden');
      btn.disabled = false;
      btn.innerHTML = `${this.authMode === 'login' ? 'Continuar' : 'Crear cuenta'} ${this.icons.arrow}`;
    }
  },

  // Step 2: Ticket selection
  renderTicketsStep(body, footer) {
    const user = EventosAuth.getUser();
    const spots = EventosReserva.getAvailableSpots();
    const isCover = EventosReserva.isCoverEvent();
    const price = isCover ? EventosReserva.getCoverPrice() : EventosReserva.getDepositPrice();
    const total = price * this.numBoletos;
    const maxBoletos = Math.min(5, spots);

    body.innerHTML = `
      <div class="step-content active">
        <div class="user-info-bar">
          <div class="user-info">
            <div class="user-avatar">${EventosAuth.getInitials()}</div>
            <div>
              <div class="user-name">${user.nombre}</div>
              <div class="user-phone">${EventosConfig.formatPhone(user.telefono)}</div>
            </div>
          </div>
          <button class="user-logout" onclick="EventosUI.logout()">Salir</button>
        </div>

        <div class="ticket-selector">
          <button class="ticket-btn" onclick="EventosUI.changeTickets(-1)" ${this.numBoletos <= 1 ? 'disabled' : ''}>
            ${this.icons.minus}
          </button>
          <span class="ticket-count">${this.numBoletos}</span>
          <button class="ticket-btn" onclick="EventosUI.changeTickets(1)" ${this.numBoletos >= maxBoletos ? 'disabled' : ''}>
            ${this.icons.plus}
          </button>
        </div>

        <div class="ticket-summary">
          <div class="summary-row">
            <span>${this.numBoletos} ${this.numBoletos === 1 ? 'lugar' : 'lugares'}</span>
            <span>$${price} c/u</span>
          </div>
          ${isCover ? `
            <div class="summary-row">
              <span><strong>Total a pagar</strong></span>
              <span><strong>$${total} MXN</strong></span>
            </div>
          ` : `
            <div class="summary-row">
              <span><strong>Depósito</strong></span>
              <span><strong>$${total} MXN</strong></span>
            </div>
          `}
        </div>

        ${spots <= 5 ? `
          <div class="spots-warning">
            ${this.icons.warning}
            <span>Solo quedan <strong>${spots}</strong> lugares disponibles</span>
          </div>
        ` : ''}
      </div>
    `;

    footer.innerHTML = `
      <button class="modal-btn modal-btn-primary" onclick="EventosUI.goToStep(3)">
        Continuar
        ${this.icons.arrow}
      </button>
    `;
  },

  // Change number of tickets
  changeTickets(delta) {
    const spots = EventosReserva.getAvailableSpots();
    const maxBoletos = Math.min(5, spots);
    this.numBoletos = Math.max(1, Math.min(maxBoletos, this.numBoletos + delta));
    this.renderStep();
  },

  // Logout
  logout() {
    EventosAuth.logout();
    this.currentStep = 1;
    this.authMode = 'login';
    this.renderStep();
  },

  // Step 3: Payment options
  renderPaymentStep(body, footer) {
    const isCover = EventosReserva.isCoverEvent();
    const coverPrice = EventosReserva.getCoverPrice();
    const totalCover = coverPrice * this.numBoletos;
    const total50 = 50 * this.numBoletos;
    const total100 = 100 * this.numBoletos;

    if (isCover) {
      // Cover event - only full payment
      this.tipoPago = 'completo';

      body.innerHTML = `
        <div class="step-content active">
          <div class="ticket-summary" style="margin-bottom: 20px;">
            <div class="summary-row">
              <span>${this.numBoletos} ${this.numBoletos === 1 ? 'lugar' : 'lugares'} · Cover</span>
              <span>$${coverPrice} c/u</span>
            </div>
            <div class="summary-row">
              <span><strong>Total a pagar</strong></span>
              <span><strong>$${totalCover} MXN</strong></span>
            </div>
          </div>

          <p style="font-size: 14px; color: var(--muted); text-align: center; line-height: 1.6;">
            Al hacer clic en "Pagar ahora" serás redirigido a Mercado Pago para completar tu pago.
          </p>
        </div>
      `;

      footer.innerHTML = `
        <button class="modal-btn modal-btn-primary" onclick="EventosUI.processPayment()">
          ${this.icons.card}
          Pagar $${totalCover} MXN
        </button>
      `;

    } else {
      // Coop voluntaria - 3 payment options
      body.innerHTML = `
        <div class="step-content active">
          <p style="font-size: 14px; color: var(--muted); margin-bottom: 16px;">
            Elige cómo quieres reservar tu${this.numBoletos > 1 ? 's' : ''} lugar${this.numBoletos > 1 ? 'es' : ''}:
          </p>

          <div class="payment-options">
            <div class="payment-option recommended ${this.tipoPago === 'deposito_50' ? 'selected' : ''}" onclick="EventosUI.selectPayment('deposito_50')">
              <div class="payment-radio"></div>
              <div class="payment-details">
                <div class="payment-title">Depósito $50</div>
                <div class="payment-desc">Lugar garantizado + bebida del menú de $50</div>
              </div>
              <div class="payment-price">$${total50}</div>
            </div>

            <div class="payment-option ${this.tipoPago === 'deposito_100' ? 'selected' : ''}" onclick="EventosUI.selectPayment('deposito_100')">
              <div class="payment-radio"></div>
              <div class="payment-details">
                <div class="payment-title">Depósito $100</div>
                <div class="payment-desc">Lugar garantizado + bebida del menú de $100</div>
              </div>
              <div class="payment-price">$${total100}</div>
            </div>

            <div class="payment-option ${this.tipoPago === 'sin_pago' ? 'selected' : ''}" onclick="EventosUI.selectPayment('sin_pago')">
              <div class="payment-radio"></div>
              <div class="payment-details">
                <div class="payment-title">Sin pago</div>
                <div class="payment-desc">Lugar sujeto a disponibilidad el día del evento</div>
              </div>
              <div class="payment-price">$0</div>
            </div>
          </div>
        </div>
      `;

      const canContinue = this.tipoPago !== null;
      let btnText = 'Selecciona una opción';
      let btnIcon = this.icons.arrow;

      if (this.tipoPago === 'deposito_50') {
        btnText = `Pagar $${total50} MXN`;
        btnIcon = this.icons.card;
      } else if (this.tipoPago === 'deposito_100') {
        btnText = `Pagar $${total100} MXN`;
        btnIcon = this.icons.card;
      } else if (this.tipoPago === 'sin_pago') {
        btnText = 'Reservar sin pago';
        btnIcon = this.icons.whatsapp;
      }

      footer.innerHTML = `
        <button class="modal-btn modal-btn-primary" onclick="EventosUI.processPayment()" ${!canContinue ? 'disabled' : ''}>
          ${btnIcon}
          ${btnText}
        </button>
      `;
    }
  },

  // Select payment option
  selectPayment(tipo) {
    this.tipoPago = tipo;
    this.renderStep();
  },

  // Get appropriate MP link based on payment type
  getMPLinkForPayment() {
    if (this.tipoPago === 'deposito_50') {
      return EventosReserva.getMercadoPagoLink50();
    } else if (this.tipoPago === 'deposito_100') {
      return EventosReserva.getMercadoPagoLink100();
    } else if (this.tipoPago === 'completo') {
      return EventosReserva.getMercadoPagoLink();
    }
    return null;
  },

  // Process payment / create reservation
  async processPayment() {
    const btn = document.querySelector('.modal-footer .modal-btn-primary');
    btn.disabled = true;
    btn.innerHTML = `${this.icons.spinner} Procesando...`;

    try {
      // Create reservation
      await EventosReserva.createReservation(this.numBoletos, this.tipoPago);

      // Update page spots
      this.updatePageSpots();

      // Go to success step
      this.currentStep = 4;
      this.renderStep();

      // If paid option, redirect to Mercado Pago
      if (this.tipoPago !== 'sin_pago') {
        const mpLink = this.getMPLinkForPayment();
        if (mpLink) {
          setTimeout(() => {
            window.location.href = mpLink;
          }, 2000);
        }
      }

    } catch (error) {
      alert(error.message);
      btn.disabled = false;
      this.renderStep();
    }
  },

  // Step 4: Success
  renderSuccessStep(body, footer) {
    const isPaid = this.tipoPago !== 'sin_pago';
    const mpLink = this.getMPLinkForPayment();
    const user = EventosAuth.getUser();
    const evento = EventosReserva.currentEvento;

    // Build WhatsApp confirmation message
    const boletosStr = this.numBoletos === 1 ? '1 lugar' : `${this.numBoletos} lugares`;
    const waMessage = `Hola, soy ${user.nombre}. Acabo de reservar ${boletosStr} para ${evento.artista}. Mi número es ${EventosConfig.formatPhone(user.telefono)}.`;

    body.innerHTML = `
      <div class="step-content active">
        <div class="success-state">
          <div class="success-icon">
            ${this.icons.check}
          </div>
          <h3 class="success-title">
            ${isPaid ? '¡Casi listo!' : '¡Un paso más!'}
          </h3>
          <p class="success-text">
            ${isPaid ? 'Tu pago está pendiente.' : 'Tu reserva está registrada.'}
            <br><br>
            <strong>Envíanos un WhatsApp para confirmar tu lugar:</strong>
          </p>
        </div>
      </div>
    `;

    footer.innerHTML = `
      <a href="${EventosConfig.whatsappUrl(waMessage)}" target="_blank" class="modal-btn modal-btn-whatsapp" style="font-size: 17px; padding: 18px;">
        ${this.icons.whatsapp}
        Confirmar por WhatsApp
      </a>
      ${isPaid && mpLink ? `
        <a href="${mpLink}" class="modal-btn modal-btn-primary" style="margin-top: 10px;">
          ${this.icons.card}
          Pagar en Mercado Pago
        </a>
      ` : ''}
      <p style="font-size: 12px; color: var(--muted); text-align: center; margin-top: 16px; line-height: 1.5;">
        Al enviarnos WhatsApp confirmas tu asistencia y te mandamos los detalles del evento.
      </p>
    `;
  },

  // Go to specific step
  goToStep(step) {
    this.currentStep = step;
    this.renderStep();
  },

  // Update spots display on the page
  updatePageSpots() {
    const spots = EventosReserva.getAvailableSpots();
    const total = EventosReserva.currentEvento?.capacidad_total || 30;
    const pct = Math.max(5, Math.round((spots / total) * 100));

    // Update all spots displays
    ['hero-spots', 'bar-spots', 'bottom-spots', 'sb-spots'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = spots;
    });

    // Update progress bar
    const fill = document.getElementById('spots-fill');
    if (fill) fill.style.width = pct + '%';
  },

  // Render profile view
  renderProfileView() {
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');
    const header = document.querySelector('.modal-title');
    const stepsContainer = document.querySelector('.modal-steps');

    if (header) header.textContent = 'Mi reserva';
    if (stepsContainer) stepsContainer.style.display = 'none';

    const user = EventosAuth.getUser();
    const res = this.existingReservation;
    const evento = EventosReserva.currentEvento;

    if (!res || !evento) {
      body.innerHTML = `<p style="text-align: center; color: var(--muted);">No tienes reservaciones para este evento.</p>`;
      footer.innerHTML = `
        <button class="modal-btn modal-btn-secondary" onclick="EventosUI.close()">Cerrar</button>
      `;
      return;
    }

    const fecha = new Date(evento.fecha + 'T00:00:00');
    const fechaStr = fecha.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    const boletosStr = res.num_boletos === 1 ? '1 lugar' : `${res.num_boletos} lugares`;

    // Get payment status text
    let estadoText = '';
    let estadoClass = '';
    if (res.estado === 'confirmada') {
      estadoText = 'Confirmada';
      estadoClass = 'confirmed';
    } else if (res.estado === 'pendiente_pago') {
      estadoText = 'Pendiente de pago';
      estadoClass = 'pending';
    } else if (res.estado === 'pendiente') {
      estadoText = 'Pendiente confirmación';
      estadoClass = 'pending';
    } else if (res.estado === 'cancelada') {
      estadoText = 'Cancelada';
      estadoClass = 'cancelled';
    }

    // Get payment type text
    let tipoText = '';
    if (res.tipo_pago === 'deposito_50') {
      tipoText = 'Depósito $50 (bebida menú $50)';
    } else if (res.tipo_pago === 'deposito_100') {
      tipoText = 'Depósito $100 (bebida menú $100)';
    } else if (res.tipo_pago === 'sin_pago') {
      tipoText = 'Sin pago (sujeto a disponibilidad)';
    } else if (res.tipo_pago === 'completo') {
      tipoText = 'Pago completo';
    } else {
      tipoText = 'Depósito';
    }

    body.innerHTML = `
      <div class="profile-view">
        <div class="user-info-bar" style="margin-bottom: 20px;">
          <div class="user-info">
            <div class="user-avatar">${EventosAuth.getInitials()}</div>
            <div>
              <div class="user-name">${user.nombre}</div>
              <div class="user-phone">${EventosConfig.formatPhone(user.telefono)}</div>
            </div>
          </div>
          <button class="user-logout" onclick="EventosUI.handleProfileLogout()">Salir</button>
        </div>

        <div class="reservation-card" style="background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <div>
              <h4 style="font-family: 'DM Serif Display', serif; font-size: 20px; color: var(--deep); margin-bottom: 4px;">${evento.artista}</h4>
              <p style="font-size: 14px; color: var(--muted);">${fechaStr}</p>
            </div>
            <span class="reservation-status status-${estadoClass}" style="
              font-size: 11px;
              font-weight: 600;
              padding: 4px 10px;
              border-radius: 99px;
              background: ${estadoClass === 'confirmed' ? 'rgba(46,125,82,0.15)' : estadoClass === 'pending' ? 'rgba(184,130,107,0.2)' : 'rgba(155,41,38,0.15)'};
              color: ${estadoClass === 'confirmed' ? '#2E7D52' : estadoClass === 'pending' ? 'var(--terra)' : '#9B2926'};
            ">${estadoText}</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--muted);">Lugares</span>
              <span style="color: var(--carbon); font-weight: 500;">${boletosStr}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--muted);">Tipo</span>
              <span style="color: var(--carbon); font-weight: 500;">${tipoText}</span>
            </div>
            ${res.monto > 0 ? `
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--muted);">Monto</span>
                <span style="color: var(--carbon); font-weight: 500;">$${res.monto} MXN</span>
              </div>
            ` : ''}
          </div>
        </div>

        ${res.estado === 'pendiente_pago' ? `
          <div style="margin-top: 16px; padding: 14px; background: rgba(184,130,107,0.1); border-radius: 10px; border: 1px solid rgba(184,130,107,0.2);">
            <p style="font-size: 13px; color: var(--terra); margin-bottom: 10px;">
              <strong>Pago pendiente.</strong> Completa tu pago para garantizar tu lugar.
            </p>
            <a href="${this.getMPLinkForPayment() || '#'}" class="modal-btn modal-btn-primary" style="font-size: 14px; padding: 12px;">
              ${this.icons.card}
              Pagar ahora
            </a>
          </div>
        ` : ''}

        ${res.estado !== 'cancelada' ? `
          <button onclick="EventosUI.confirmCancel()" style="
            width: 100%;
            margin-top: 20px;
            background: transparent;
            border: 1px solid rgba(155,41,38,0.3);
            color: #9B2926;
            padding: 12px;
            border-radius: 8px;
            font-family: inherit;
            font-size: 14px;
            cursor: pointer;
          ">
            Cancelar reserva
          </button>
        ` : ''}
      </div>
    `;

    footer.innerHTML = `
      <button class="modal-btn modal-btn-secondary" onclick="EventosUI.close()" style="flex: 1;">
        Cerrar
      </button>
    `;
  },

  // Confirm cancellation
  confirmCancel() {
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    body.innerHTML = `
      <div style="text-align: center; padding: 20px 0;">
        <div style="width: 60px; height: 60px; margin: 0 auto 20px; background: rgba(155,41,38,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          ${this.icons.warning}
        </div>
        <h3 style="font-family: 'DM Serif Display', serif; font-size: 22px; color: var(--deep); margin-bottom: 12px;">¿Cancelar reserva?</h3>
        <p style="font-size: 14px; color: var(--muted); line-height: 1.6;">
          Esta acción no se puede deshacer. Si pagaste un depósito, contacta a Teokaye para solicitar tu reembolso.
        </p>
      </div>
    `;

    footer.innerHTML = `
      <button class="modal-btn modal-btn-secondary" onclick="EventosUI.renderProfileView()" style="flex: 1;">
        Volver
      </button>
      <button class="modal-btn" onclick="EventosUI.cancelReservation()" style="flex: 1; background: #9B2926; color: white;">
        Sí, cancelar
      </button>
    `;
  },

  // Cancel reservation
  async cancelReservation() {
    const footer = document.getElementById('modal-footer');
    footer.innerHTML = `
      <button class="modal-btn modal-btn-primary" disabled style="flex: 1;">
        ${this.icons.spinner} Cancelando...
      </button>
    `;

    try {
      console.log('Attempting to cancel reservation:', this.existingReservation);
      const numBoletos = this.existingReservation.num_boletos;
      await EventosReserva.cancelReservation(this.existingReservation.id, numBoletos);
      this.existingReservation = null;
      this.updatePageSpots();

      // Show success and reload page to reset state
      const body = document.getElementById('modal-body');
      body.innerHTML = `
        <div style="text-align: center; padding: 20px 0;">
          <div style="width: 60px; height: 60px; margin: 0 auto 20px; background: rgba(46,125,82,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            ${this.icons.check}
          </div>
          <h3 style="font-family: 'DM Serif Display', serif; font-size: 22px; color: var(--deep); margin-bottom: 12px;">Reserva cancelada</h3>
          <p style="font-size: 14px; color: var(--muted); line-height: 1.6;">
            Tu reserva ha sido cancelada. Esperamos verte pronto en Teokaye.
          </p>
        </div>
      `;

      footer.innerHTML = `
        <button class="modal-btn modal-btn-primary" onclick="location.reload()" style="flex: 1;">
          Cerrar
        </button>
      `;

    } catch (error) {
      alert(error.message);
      this.renderProfileView();
    }
  },

  // Handle logout from profile view
  handleProfileLogout() {
    EventosAuth.logout();
    this.existingReservation = null;
    this.showProfile = false;
    location.reload();
  }
};

// Make available globally
window.EventosUI = EventosUI;
