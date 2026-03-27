// ══════════════════════════════════════════════════════════════════════════════
// TEOKAYE FOUNDERS - QR CODE GENERATOR
// Requires: qrcode.min.js from CDN
// ══════════════════════════════════════════════════════════════════════════════

const FoundersQR = {
  // Generate QR code in a container
  async generate(containerId, url, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const size = options.size || 200;
    const darkColor = options.darkColor || '#1E1B18';
    const lightColor = options.lightColor || '#FFFCF8';

    // Clear previous QR
    container.innerHTML = '';

    // Check if QRCode library is loaded
    if (typeof QRCode === 'undefined') {
      console.error('QRCode library not loaded');
      container.innerHTML = '<p style="color:#999;font-size:12px;">Error cargando QR</p>';
      return;
    }

    // Generate QR
    new QRCode(container, {
      text: url,
      width: size,
      height: size,
      colorDark: darkColor,
      colorLight: lightColor,
      correctLevel: QRCode.CorrectLevel.M
    });
  },

  // Generate QR for a founder's profile
  generateProfileQR(containerId, founder, options = {}) {
    const url = FoundersConfig.getProfileUrl(founder);
    return this.generate(containerId, url, options);
  }
};

// Make available globally
window.FoundersQR = FoundersQR;
