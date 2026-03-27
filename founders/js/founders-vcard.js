// ══════════════════════════════════════════════════════════════════════════════
// TEOKAYE FOUNDERS - VCARD GENERATOR
// ══════════════════════════════════════════════════════════════════════════════

const FoundersVCard = {
  // Generate vCard string
  generate(founder, projects = []) {
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${this.escape(founder.nombre)}`,
      `N:;${this.escape(founder.nombre)};;;`
    ];

    // Phone (if public)
    if (founder.telefono_publico && founder.telefono) {
      const phone = founder.telefono.replace(/\D/g, '');
      lines.push(`TEL;TYPE=CELL:+52${phone}`);
    }

    // Email
    if (founder.email) {
      lines.push(`EMAIL:${founder.email}`);
    }

    // Organization (first project)
    if (projects.length > 0) {
      lines.push(`ORG:${this.escape(projects[0].nombre)}`);
      if (projects[0].descripcion) {
        lines.push(`TITLE:${this.escape(projects[0].descripcion.substring(0, 100))}`);
      }
    }

    // URL (profile)
    const profileUrl = FoundersConfig.getProfileUrl(founder);
    lines.push(`URL:${profileUrl}`);

    // LinkedIn
    if (founder.linkedin) {
      lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${founder.linkedin}`);
    }

    // Location
    if (founder.ciudad) {
      lines.push(`ADR;TYPE=HOME:;;${this.escape(founder.ciudad)};;;Mexico`);
    }

    // Note with all projects
    if (projects.length > 0) {
      const projectsNote = projects.map(p => `${p.nombre}: ${p.descripcion || ''}`).join(' | ');
      lines.push(`NOTE:Proyectos: ${this.escape(projectsNote)}`);
    }

    lines.push('END:VCARD');

    return lines.join('\r\n');
  },

  // Escape special characters
  escape(str) {
    if (!str) return '';
    return str
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  },

  // Download vCard
  download(founder, projects = []) {
    const vcard = this.generate(founder, projects);
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${founder.nombre.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

// Make available globally
window.FoundersVCard = FoundersVCard;
