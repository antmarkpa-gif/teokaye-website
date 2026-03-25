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
  open() {
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
    const depositPrice = EventosReserva.getDepositPrice();
    const totalCover = coverPrice * this.numBoletos;
    const totalDeposit = depositPrice * this.numBoletos;

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
      // Coop voluntaria - deposit or no payment
      body.innerHTML = `
        <div class="step-content active">
          <p style="font-size: 14px; color: var(--muted); margin-bottom: 16px;">
            Elige cómo quieres reservar tu${this.numBoletos > 1 ? 's' : ''} lugar${this.numBoletos > 1 ? 'es' : ''}:
          </p>

          <div class="payment-options">
            <div class="payment-option recommended ${this.tipoPago === 'deposito' ? 'selected' : ''}" onclick="EventosUI.selectPayment('deposito')">
              <div class="payment-radio"></div>
              <div class="payment-details">
                <div class="payment-title">Pagar depósito</div>
                <div class="payment-desc">Lugar garantizado + primera bebida incluida</div>
              </div>
              <div class="payment-price">$${totalDeposit}</div>
            </div>

            <div class="payment-option ${this.tipoPago === 'sin_pago' ? 'selected' : ''}" onclick="EventosUI.selectPayment('sin_pago')">
              <div class="payment-radio"></div>
              <div class="payment-details">
                <div class="payment-title">Reservar sin pago</div>
                <div class="payment-desc">Lugar sujeto a disponibilidad el día del evento</div>
              </div>
              <div class="payment-price">$0</div>
            </div>
          </div>
        </div>
      `;

      const canContinue = this.tipoPago !== null;

      footer.innerHTML = `
        <button class="modal-btn modal-btn-primary" onclick="EventosUI.processPayment()" ${!canContinue ? 'disabled' : ''}>
          ${this.tipoPago === 'deposito' ? this.icons.card : this.icons.whatsapp}
          ${this.tipoPago === 'deposito' ? `Pagar $${totalDeposit} MXN` :
            this.tipoPago === 'sin_pago' ? 'Reservar por WhatsApp' : 'Selecciona una opción'}
        </button>
      `;
    }
  },

  // Select payment option
  selectPayment(tipo) {
    this.tipoPago = tipo;
    this.renderStep();
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
        const mpLink = EventosReserva.getMercadoPagoLink();
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
    const mpLink = EventosReserva.getMercadoPagoLink();
    const user = EventosAuth.getUser();

    body.innerHTML = `
      <div class="step-content active">
        <div class="success-state">
          <div class="success-icon">
            ${this.icons.check}
          </div>
          <h3 class="success-title">
            ${isPaid ? '¡Redirigiendo al pago!' : '¡Reserva confirmada!'}
          </h3>
          <p class="success-text">
            ${isPaid ?
              'Te estamos llevando a Mercado Pago para completar tu pago.' :
              'Tu lugar está reservado.'}
            <br><br>
            <strong>Te enviaremos un WhatsApp</strong> al ${EventosConfig.formatPhone(user.telefono)} con los detalles del evento y cómo llegar.
            ${!isPaid ? '<br><br><span style="font-size: 12px; opacity: 0.7;">Nota: Tu lugar no está garantizado hasta confirmar asistencia el día del evento.</span>' : ''}
          </p>
        </div>
      </div>
    `;

    footer.innerHTML = `
      ${isPaid && mpLink ? `
        <a href="${mpLink}" class="modal-btn modal-btn-primary">
          ${this.icons.card}
          Ir a Mercado Pago
        </a>
      ` : ''}
      <button class="modal-btn ${isPaid ? 'modal-btn-secondary' : 'modal-btn-primary'}" onclick="EventosUI.close()">
        ${isPaid ? 'Cerrar' : 'Listo'}
      </button>
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
  }
};

// Make available globally
window.EventosUI = EventosUI;
