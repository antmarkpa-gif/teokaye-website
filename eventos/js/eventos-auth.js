// ══════════════════════════════════════════════════════════════════════════════
// TEOKAYE EVENTOS - AUTENTICACIÓN
// ══════════════════════════════════════════════════════════════════════════════

const EventosAuth = {
  currentUser: null,

  // Initialize - check for existing session
  init() {
    const stored = localStorage.getItem(EventosConfig.STORAGE_USER_KEY);
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
      } catch (e) {
        localStorage.removeItem(EventosConfig.STORAGE_USER_KEY);
      }
    }
    return this.currentUser;
  },

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  },

  // Get current user
  getUser() {
    return this.currentUser;
  },

  // Register new user
  async register(nombre, telefono, pin) {
    const cleanPhone = EventosConfig.cleanPhone(telefono);

    // Validate
    if (!nombre || nombre.trim().length < 2) {
      throw new Error('Por favor ingresa tu nombre completo.');
    }
    if (cleanPhone.length !== 10) {
      throw new Error('El teléfono debe tener 10 dígitos.');
    }
    if (pin < 1000 || pin > 9999) {
      throw new Error('El PIN debe ser de 4 dígitos.');
    }

    // Check if phone already exists
    const existing = await EventosConfig.get('usuarios_eventos', `telefono=eq.${cleanPhone}&select=id`);
    if (existing && existing.length > 0) {
      throw new Error('Este teléfono ya tiene una cuenta. Inicia sesión.');
    }

    // Create user
    const result = await EventosConfig.post('usuarios_eventos', {
      nombre: nombre.trim(),
      telefono: cleanPhone,
      pin: pin
    });

    if (!result || result.length === 0) {
      throw new Error('Error al crear la cuenta. Intenta de nuevo.');
    }

    const user = result[0];
    this.currentUser = {
      id: user.id,
      nombre: user.nombre,
      telefono: user.telefono
    };

    // Save to localStorage
    localStorage.setItem(EventosConfig.STORAGE_USER_KEY, JSON.stringify(this.currentUser));

    return this.currentUser;
  },

  // Login existing user
  async login(telefono, pin) {
    const cleanPhone = EventosConfig.cleanPhone(telefono);

    if (cleanPhone.length !== 10) {
      throw new Error('El teléfono debe tener 10 dígitos.');
    }
    if (pin < 1000 || pin > 9999) {
      throw new Error('El PIN debe ser de 4 dígitos.');
    }

    // Find user
    const users = await EventosConfig.get(
      'usuarios_eventos',
      `telefono=eq.${cleanPhone}&pin=eq.${pin}&select=id,nombre,telefono`
    );

    if (!users || users.length === 0) {
      throw new Error('Teléfono o PIN incorrectos.');
    }

    const user = users[0];
    this.currentUser = {
      id: user.id,
      nombre: user.nombre,
      telefono: user.telefono
    };

    // Save to localStorage
    localStorage.setItem(EventosConfig.STORAGE_USER_KEY, JSON.stringify(this.currentUser));

    return this.currentUser;
  },

  // Logout
  logout() {
    this.currentUser = null;
    localStorage.removeItem(EventosConfig.STORAGE_USER_KEY);
  },

  // Get user initials for avatar
  getInitials() {
    if (!this.currentUser || !this.currentUser.nombre) return '?';
    const parts = this.currentUser.nombre.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  EventosAuth.init();
});

// Make available globally
window.EventosAuth = EventosAuth;
