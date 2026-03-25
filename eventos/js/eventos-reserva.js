// ══════════════════════════════════════════════════════════════════════════════
// TEOKAYE EVENTOS - RESERVAS
// ══════════════════════════════════════════════════════════════════════════════

const EventosReserva = {
  currentEvento: null,

  // Load event data from database
  async loadEvento(slug) {
    const eventos = await EventosConfig.get(
      'eventos',
      `slug=eq.${slug}&activo=eq.true&select=*`
    );

    if (!eventos || eventos.length === 0) {
      throw new Error('Evento no encontrado.');
    }

    this.currentEvento = eventos[0];
    return this.currentEvento;
  },

  // Get available spots
  getAvailableSpots() {
    return this.currentEvento ? this.currentEvento.lugares_disponibles : 0;
  },

  // Get event type
  getEventType() {
    return this.currentEvento ? this.currentEvento.tipo : null;
  },

  // Check if event has cover price
  isCoverEvent() {
    return this.currentEvento && this.currentEvento.tipo === 'cover';
  },

  // Get cover price
  getCoverPrice() {
    return this.currentEvento ? this.currentEvento.precio_cover : 0;
  },

  // Get deposit price
  getDepositPrice() {
    return this.currentEvento ? this.currentEvento.precio_deposito : 50;
  },

  // Get Mercado Pago link
  getMercadoPagoLink() {
    return this.currentEvento ? this.currentEvento.mercadopago_link : null;
  },

  // Calculate total
  calculateTotal(numBoletos, tipoPago) {
    if (!this.currentEvento) return 0;

    if (tipoPago === 'completo' && this.currentEvento.tipo === 'cover') {
      return this.currentEvento.precio_cover * numBoletos;
    } else if (tipoPago === 'deposito') {
      return this.currentEvento.precio_deposito * numBoletos;
    }

    return 0;
  },

  // Create reservation
  async createReservation(numBoletos, tipoPago) {
    const user = EventosAuth.getUser();
    if (!user) {
      throw new Error('Debes iniciar sesión primero.');
    }

    if (!this.currentEvento) {
      throw new Error('No hay evento seleccionado.');
    }

    // Check availability
    if (numBoletos > this.currentEvento.lugares_disponibles) {
      throw new Error(`Solo quedan ${this.currentEvento.lugares_disponibles} lugares disponibles.`);
    }

    // Create reservation
    const reserva = await EventosConfig.post('reservas_eventos', {
      usuario_id: user.id,
      evento_id: this.currentEvento.id,
      evento: this.currentEvento.artista,
      fecha_evento: this.currentEvento.fecha,
      nombre: user.nombre,
      telefono: user.telefono,
      num_boletos: numBoletos,
      monto: this.calculateTotal(numBoletos, tipoPago),
      tipo_pago: tipoPago,
      estado: tipoPago === 'sin_pago' ? 'pendiente' : 'pendiente_pago'
    });

    // Decrement available spots
    await EventosConfig.patch(
      'eventos',
      `id=eq.${this.currentEvento.id}`,
      { lugares_disponibles: this.currentEvento.lugares_disponibles - numBoletos }
    );

    // Update local state
    this.currentEvento.lugares_disponibles -= numBoletos;

    return reserva;
  },

  // Generate WhatsApp message for sin_pago reservation
  getWhatsAppMessage(numBoletos) {
    if (!this.currentEvento) return '';
    const user = EventosAuth.getUser();

    const fecha = new Date(this.currentEvento.fecha + 'T00:00:00');
    const fechaStr = fecha.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    const boletosStr = numBoletos === 1 ? '1 lugar' : `${numBoletos} lugares`;

    return `Hola, soy ${user.nombre}. Quiero reservar ${boletosStr} para ${this.currentEvento.artista} el ${fechaStr}. Mi número es ${EventosConfig.formatPhone(user.telefono)}.`;
  },

  // Generate WhatsApp message after payment
  getConfirmationMessage(numBoletos) {
    if (!this.currentEvento) return '';
    const user = EventosAuth.getUser();

    const fecha = new Date(this.currentEvento.fecha + 'T00:00:00');
    const fechaStr = fecha.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    const boletosStr = numBoletos === 1 ? '1 lugar' : `${numBoletos} lugares`;

    return `Hola, acabo de pagar mi reserva para ${this.currentEvento.artista} (${boletosStr}) el ${fechaStr}. Mi nombre es ${user.nombre}.`;
  }
};

// Make available globally
window.EventosReserva = EventosReserva;
