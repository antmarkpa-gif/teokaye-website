# Teokaye - Página Web Oficial

> El sagrado arte de compartir

Página web de Teokaye, café de especialidad, galería de arte contemporáneo y foro cultural en San Pedro Cholula, Puebla, México.

**Teokaye** significa compartir en las lenguas de los pueblos Na'ayeri (Cora) y Wixárika (Huichol) de Nayarit.

## Vista Previa

Una experiencia web **Editorial Terracota** que fusiona el rigor de una revista de arquitectura mexicana con la calidez de un hogar.

## Estructura del Proyecto

```
pagina-teokaye/
├── index.html      # Página principal
├── styles.css      # Estilos CSS
├── script.js       # JavaScript + GSAP
└── README.md       # Documentación
```

## Secciones

1. **Hero Fullscreen** - Gradientes con logo, título masivo, CTA
2. **Nuestro Origen** - Manifiesto split-screen con parallax
3. **Tres Experiencias** - Cards expandidas (Cafetería, Galería, Foro)
4. **Nuestra Filosofía** - Valores con íconos SVG animados
5. **Galería Visual** - Grid masonry
6. **Ubicación & Contacto** - Mapa fullwidth + información completa
7. **Footer** - Enlaces, redes sociales, branding premium

## Características

### Diseño Visual
- Paleta de colores: Arena (#E6E0D6), Carbón (#1E1B18), Terracota (#B8826B), Tierra (#461D14)
- Tipografías: Cormorant (editorial), Source Sans 3 (body)
- Íconos SVG personalizados minimalistas
- Mobile-first responsive
- Cursor personalizado terracota

### Funcionalidades
- Loading screen animado con contador
- Barra de progreso de scroll
- WhatsApp floating button con pulso
- Navbar con backdrop-blur al scroll
- Smooth scroll entre secciones

### Animaciones (GSAP 3)
- Hero: Parallax + word-by-word reveal
- Scroll parallax en imágenes
- SVG draw animations en íconos
- Stagger fade-in en cards y galería
- Hover effects con cubic-bezier

### SEO Optimizado
- Meta tags completos con acentos
- Open Graph + Twitter Cards
- Schema.org: CafeOrCoffeeShop, ArtGallery
- Geo tags para búsquedas locales

### Accesibilidad
- Estructura semántica HTML5
- ARIA labels donde corresponde
- Focus visible para navegación por teclado
- Soporte para `prefers-reduced-motion`

## Instalación

### Servidor Local

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js
npx serve

# Con PHP
php -S localhost:8000
```

Abre `http://localhost:8000` en tu navegador.

### Directo en Navegador

Abre `index.html` directamente. Las animaciones funcionan gracias al CDN de GSAP.

## Deployment

### Vercel (Recomendado)

```bash
npm i -g vercel
vercel
```

### Netlify

1. Arrastra la carpeta a [Netlify Drop](https://app.netlify.com/drop)
2. O conecta tu repositorio de GitHub

### GitHub Pages

1. Sube el proyecto a GitHub
2. Ve a Settings > Pages
3. Selecciona rama `main` y carpeta `/ (root)`

### Hosting Tradicional

Sube todos los archivos a `public_html` vía FTP/cPanel.

## Personalización

### Imágenes

Reemplaza los placeholders de gradiente con imágenes reales:

**Hero:**
```html
<!-- Reemplazar con video o imagen -->
<video autoplay muted loop playsinline>
    <source src="hero.mp4" type="video/mp4">
</video>
```

**Experience Cards:**
```css
.exp[data-exp="cafe"] .exp__img {
    background-image: url('images/cafeteria.jpg');
}
```

**Galería:**
```css
.galeria__item:nth-child(1) .galeria__img {
    background-image: url('images/galeria-1.jpg');
}
```

### Colores

Modifica las variables CSS en `:root`:

```css
:root {
    --sand: #E6E0D6;
    --charcoal: #1E1B18;
    --terracotta: #B8826B;
    --earth: #461D14;
}
```

### Tipografía

Para usar Tan Jamboren (logo):

```css
@font-face {
    font-family: 'Tan Jamboren';
    src: url('fonts/TanJamboren.woff2') format('woff2');
    font-display: swap;
}

:root {
    --font-display: 'Tan Jamboren', Georgia, serif;
}
```

### Google Maps

Actualiza el iframe en `index.html` con coordenadas exactas de Teokaye.

### Enlaces

Actualiza en `index.html`:
- `menu.teokaye.mx` - Menú de cafetería
- `shurabe.com` - Galería de arte
- `foro.teokaye.mx` - Calendario de eventos
- `@teokaye.mx` - Redes sociales

## Optimización

### Imágenes WebP

```bash
# Con cwebp
cwebp -q 80 imagen.jpg -o imagen.webp
```

### Minificación

```bash
# CSS
npx cssnano styles.css styles.min.css

# JS
npx terser script.js -o script.min.js
```

### Preload Fonts

```html
<link rel="preload" href="fonts/TanJamboren.woff2" as="font" type="font/woff2" crossorigin>
```

## Soporte de Navegadores

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Android Chrome 90+

## Íconos SVG Incluidos

Los íconos son SVG inline personalizados:

| Ícono | Uso | Descripción |
|-------|-----|-------------|
| Taza + vapor | Cafetería | Taza con líneas de vapor |
| Marco + arte | Galería | Marco con línea abstracta |
| Micrófono | Foro | Micrófono estilizado |
| Cruz expandida | Hospitalidad | Símbolo de bienvenida |
| Círculos concéntricos | Cultura | Círculos anidados |
| Ondas | Encuentro | Ondas de conexión |
| Pin | Ubicación | Pin de mapa |
| Teléfono | Contacto | Auricular |
| Reloj | Horarios | Reloj con manecillas |
| WhatsApp | Social | Logo de WhatsApp |
| Instagram | Social | Logo minimalista |
| Facebook | Social | Logo minimalista |
| TikTok | Social | Logo minimalista |

## Tecnologías

- HTML5 semántico
- CSS3 con Custom Properties
- JavaScript ES6+
- GSAP 3.12.5 (CDN)
- ScrollTrigger plugin
- Google Fonts (Cormorant, Source Sans 3)

## Licencia

Todos los derechos reservados. Teokaye 2026.

---

Desarrollado con amor y mucho café en Cholula, Puebla.
