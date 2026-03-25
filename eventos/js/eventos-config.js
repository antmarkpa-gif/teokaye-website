// ══════════════════════════════════════════════════════════════════════════════
// TEOKAYE EVENTOS - CONFIGURACIÓN
// ══════════════════════════════════════════════════════════════════════════════

const EventosConfig = {
  // Supabase
  SUPABASE_URL: 'https://xfllewbfqxsnkltybqiw.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmbGxld2JmcXhzbmtsdHlicWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MzgyMTYsImV4cCI6MjA4OTUxNDIxNn0.8DgRYmM7_pBQ3shLk0hRiAUf4FE8DSYCXgPbVJkThG4',

  // WhatsApp
  WHATSAPP_NUMBER: '522213628681',

  // Storage keys
  STORAGE_USER_KEY: 'teokaye_user',
  STORAGE_SESSION_KEY: 'teokaye_session',

  // Helpers
  async supabaseFetch(endpoint, options = {}) {
    const url = `${this.SUPABASE_URL}/rest/v1/${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': this.SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${this.SUPABASE_ANON_KEY}`,
      ...options.headers
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `Error ${response.status}`);
    }

    // Handle empty responses (e.g., POST with Prefer: return=minimal)
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  },

  // GET helper
  async get(table, params = '') {
    return this.supabaseFetch(`${table}?${params}`, { method: 'GET' });
  },

  // POST helper
  async post(table, data) {
    return this.supabaseFetch(table, {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify(data)
    });
  },

  // PATCH helper
  async patch(table, params, data) {
    return this.supabaseFetch(`${table}?${params}`, {
      method: 'PATCH',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify(data)
    });
  },

  // WhatsApp URL generator
  whatsappUrl(message) {
    return `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  },

  // Format phone for display
  formatPhone(phone) {
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 10) {
      return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
    }
    return phone;
  },

  // Clean phone to just digits
  cleanPhone(phone) {
    return phone.replace(/\D/g, '');
  }
};

// Make available globally
window.EventosConfig = EventosConfig;
