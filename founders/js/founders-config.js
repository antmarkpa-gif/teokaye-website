// ══════════════════════════════════════════════════════════════════════════════
// TEOKAYE FOUNDERS - CONFIGURACIÓN
// ══════════════════════════════════════════════════════════════════════════════

const FoundersConfig = {
  // Supabase
  SUPABASE_URL: 'https://xfllewbfqxsnkltybqiw.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmbGxld2JmcXhzbmtsdHlicWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MzgyMTYsImV4cCI6MjA4OTUxNDIxNn0.8DgRYmM7_pBQ3shLk0hRiAUf4FE8DSYCXgPbVJkThG4',

  // Base URL for profiles
  BASE_URL: 'https://teokaye.mx/founders',

  // Storage keys
  STORAGE_USER_KEY: 'founders_uuid',

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

  // DELETE helper
  async delete(table, params) {
    return this.supabaseFetch(`${table}?${params}`, {
      method: 'DELETE'
    });
  },

  // Get founder by ID
  async getFounderById(id) {
    const data = await this.get('founders_meetup', `id=eq.${id}&select=*`);
    return data && data.length > 0 ? data[0] : null;
  },

  // Get founder by slug
  async getFounderBySlug(slug) {
    const data = await this.get('founders_meetup', `slug=eq.${slug}&select=*`);
    return data && data.length > 0 ? data[0] : null;
  },

  // Get founder's projects
  async getFounderProjects(founderId) {
    const data = await this.get('founders_proyectos', `founder_id=eq.${founderId}&select=*&order=orden.asc`);
    return data || [];
  },

  // Get current user from localStorage
  getCurrentUserId() {
    return localStorage.getItem(this.STORAGE_USER_KEY);
  },

  // Set current user ID
  setCurrentUserId(id) {
    localStorage.setItem(this.STORAGE_USER_KEY, id);
  },

  // Clear current user
  clearCurrentUser() {
    localStorage.removeItem(this.STORAGE_USER_KEY);
  },

  // Format phone for display
  formatPhone(phone) {
    if (!phone) return '';
    const clean = phone.replace(/\D/g, '');
    // Remove 52 prefix if present
    const digits = clean.startsWith('52') && clean.length > 10 ? clean.slice(2) : clean;
    if (digits.length === 10) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    return phone;
  },

  // Format phone for WhatsApp (returns full number with country code)
  formatPhoneWhatsApp(phone) {
    if (!phone) return '';
    const clean = phone.replace(/\D/g, '');
    // If already has 52 prefix and is 12 digits, use as-is
    if (clean.startsWith('52') && clean.length === 12) {
      return clean;
    }
    // If 10 digits, add 52 prefix
    if (clean.length === 10) {
      return `52${clean}`;
    }
    // Otherwise return cleaned number
    return clean;
  },

  // Get profile URL
  getProfileUrl(founder) {
    const slug = founder.slug || founder.id;
    return `${this.BASE_URL}/perfil/?s=${slug}`;
  },

  // Etapa labels
  etapaLabels: {
    'idea': 'Idea',
    'construccion': 'En construccion',
    'ingresos': 'Generando ingresos',
    'escalando': 'Escalando'
  },

  getEtapaLabel(etapa) {
    return this.etapaLabels[etapa] || etapa;
  }
};

// Make available globally
window.FoundersConfig = FoundersConfig;
