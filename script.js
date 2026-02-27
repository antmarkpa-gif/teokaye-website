/**
 * TEOKAYE - Ultra Premium Experience
 * Cinematic GSAP Animations
 */

(function() {
    'use strict';

    // Selectors
    const $ = (s, p = document) => p.querySelector(s);
    const $$ = (s, p = document) => [...p.querySelectorAll(s)];

    // State
    let isLoaded = false;
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    // Initialize
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initLoader();
        initCursor();
        initNavigation();
        initMenu();
        initSmoothScroll();
        initProgressBar();
        initMapInteraction();
    }

    // ========================================
    // LOADER WITH COUNTER
    // ========================================
    function initLoader() {
        const loader = $('.loader');
        const bar = $('.loader__bar');
        const counter = $('.loader__counter-num');

        if (!loader) return;

        const startTime = Date.now();
        const minTime = 2500;
        let progress = 0;

        // Animate counter and bar
        function updateProgress() {
            if (progress < 100) {
                const increment = Math.random() * 15;
                progress = Math.min(100, progress + increment);

                if (counter) counter.textContent = Math.floor(progress);
                if (bar) bar.style.transform = `scaleX(${progress / 100})`;

                const delay = progress < 80 ? Math.random() * 100 + 50 : 30;
                setTimeout(updateProgress, delay);
            }
        }

        setTimeout(updateProgress, 800);

        window.addEventListener('load', () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, minTime - elapsed);

            setTimeout(() => {
                progress = 100;
                if (counter) counter.textContent = '100';
                if (bar) bar.style.transform = 'scaleX(1)';

                setTimeout(() => {
                    loader.classList.add('is-done');
                    setTimeout(() => {
                        loader.classList.add('is-hidden');
                        isLoaded = true;
                        initAnimations();
                    }, 1000);
                }, 300);
            }, remaining);
        });

        // Fallback
        setTimeout(() => {
            if (!isLoaded) {
                loader.classList.add('is-done');
                setTimeout(() => {
                    loader.classList.add('is-hidden');
                    isLoaded = true;
                    initAnimations();
                }, 1000);
            }
        }, 6000);
    }

    // ========================================
    // PROGRESS BAR
    // ========================================
    function initProgressBar() {
        const progressFill = $('.progress-bar__fill');
        if (!progressFill) return;

        function updateProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressFill.style.width = progress + '%';
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // ========================================
    // CUSTOM CURSOR
    // ========================================
    function initCursor() {
        const cursor = $('.cursor');
        const dot = $('.cursor__dot');
        const circle = $('.cursor__circle');

        if (!cursor || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor follow
        function updateCursor() {
            cursorX += (mouseX - cursorX) * 0.12;
            cursorY += (mouseY - cursorY) * 0.12;

            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
            circle.style.left = cursorX + 'px';
            circle.style.top = cursorY + 'px';

            requestAnimationFrame(updateCursor);
        }
        updateCursor();

        // Hover states
        const hoverElements = $$('a, button, .galeria__item, .exp, .filosofia__item');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // ========================================
    // NAVIGATION
    // ========================================
    function initNavigation() {
        const header = $('.header');
        if (!header) return;

        let lastScroll = 0;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    header.classList.toggle('is-scrolled', scrollY > 80);
                    lastScroll = scrollY;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ========================================
    // MOBILE MENU
    // ========================================
    function initMenu() {
        const toggle = $('.nav__toggle');
        const menuLinks = $$('.menu__link');

        if (!toggle) return;

        toggle.addEventListener('click', () => {
            document.body.classList.toggle('menu-open');
            document.body.style.overflow = document.body.classList.contains('menu-open') ? 'hidden' : '';
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            });
        });
    }

    // ========================================
    // SMOOTH SCROLL
    // ========================================
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                const target = $(href);
                if (target) {
                    e.preventDefault();
                    const offset = 80;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }

    // ========================================
    // MAP INTERACTION
    // ========================================
    function initMapInteraction() {
        const mapWrap = $('.contacto__map-wrap');
        if (!mapWrap) return;

        mapWrap.addEventListener('click', () => {
            const overlay = $('.contacto__map-overlay');
            if (overlay) overlay.style.display = 'none';
        });
    }

    // ========================================
    // GSAP ANIMATIONS
    // ========================================
    function initAnimations() {
        if (typeof gsap === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        // Set defaults
        gsap.defaults({ ease: 'power3.out', duration: 1 });

        // Run all animations
        animateHero();
        animateOrigen();
        animateExperiencias();
        animateFilosofia();
        animateEventos();
        animateGaleria();
        animateTestimonios();
        animateContacto();
        animateFooter();
        animateDividers();
    }

    function animateHero() {
        const tl = gsap.timeline({ delay: 0.3 });

        // Frame corners
        tl.from('.hero__frame-corner', {
            scale: 0,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });

        // Badge with lines
        tl.from('.hero__badge', {
            y: 30,
            opacity: 0,
            duration: 0.8
        }, '-=0.4');

        tl.from('.hero__badge-line', {
            scaleX: 0,
            duration: 0.6,
            stagger: 0.1
        }, '-=0.4');

        // Title words - epic stagger
        tl.from('.hero__title-word', {
            y: 120,
            opacity: 0,
            rotationX: -90,
            duration: 1.4,
            stagger: 0.06,
            ease: 'power4.out'
        }, '-=0.3');

        // Tagline items with icons
        tl.from('.hero__tagline-item', {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08
        }, '-=0.6');

        tl.from('.hero__tagline-sep', {
            scale: 0,
            duration: 0.4,
            stagger: 0.1
        }, '-=0.5');

        // Footer elements
        tl.from('.hero__scroll', {
            y: 40,
            opacity: 0,
            duration: 0.8
        }, '-=0.4');

        tl.from('.hero__motto', {
            x: 30,
            opacity: 0,
            duration: 0.8
        }, '-=0.6');

        // Marquee
        tl.from('.hero__marquee', {
            opacity: 0,
            duration: 1.5
        }, '-=0.8');

        // Decorative elements
        tl.from('.hero__deco', {
            scale: 0,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: 'elastic.out(1, 0.5)'
        }, '-=1');

        // Parallax on decorative elements
        gsap.to('.hero__deco--1', {
            y: -100,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });

        gsap.to('.hero__deco--2', {
            y: -150,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5
            }
        });
    }

    function animateOrigen() {
        // Section label
        gsap.from('.origen .section-label', {
            scrollTrigger: {
                trigger: '.origen',
                start: 'top 80%'
            },
            x: -30,
            opacity: 0,
            duration: 0.8
        });

        gsap.from('.origen .section-label__line', {
            scrollTrigger: {
                trigger: '.origen',
                start: 'top 80%'
            },
            scaleX: 0,
            duration: 0.6,
            delay: 0.3
        });

        // Title lines
        gsap.from('.origen__title .section-title__line', {
            scrollTrigger: {
                trigger: '.origen__title',
                start: 'top 85%'
            },
            y: 60,
            opacity: 0,
            duration: 1,
            stagger: 0.15
        });

        // Images with parallax
        gsap.from('.origen__img-wrap--1', {
            scrollTrigger: {
                trigger: '.origen__visual',
                start: 'top 80%'
            },
            x: -60,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out'
        });

        gsap.from('.origen__img-wrap--2', {
            scrollTrigger: {
                trigger: '.origen__visual',
                start: 'top 70%'
            },
            x: 60,
            y: 60,
            opacity: 0,
            duration: 1.2,
            delay: 0.2,
            ease: 'power4.out'
        });

        // Image parallax on scroll
        gsap.to('.origen__img--1', {
            y: -30,
            scrollTrigger: {
                trigger: '.origen__visual',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });

        gsap.to('.origen__img--2', {
            y: -50,
            scrollTrigger: {
                trigger: '.origen__visual',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5
            }
        });

        // Caption
        gsap.from('.origen__img-caption', {
            scrollTrigger: {
                trigger: '.origen__visual',
                start: 'top 60%'
            },
            x: -30,
            opacity: 0,
            duration: 0.8,
            delay: 0.5
        });

        // Content
        gsap.from('.origen__lead', {
            scrollTrigger: {
                trigger: '.origen__content',
                start: 'top 80%'
            },
            y: 50,
            opacity: 0,
            duration: 1
        });

        gsap.from('.origen__text p', {
            scrollTrigger: {
                trigger: '.origen__text',
                start: 'top 80%'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15
        });

        // Quote
        gsap.from('.origen__quote', {
            scrollTrigger: {
                trigger: '.origen__quote',
                start: 'top 85%'
            },
            x: -40,
            opacity: 0,
            duration: 1
        });

        gsap.from('.origen__quote-mark', {
            scrollTrigger: {
                trigger: '.origen__quote',
                start: 'top 85%'
            },
            scale: 0,
            opacity: 0,
            duration: 0.6,
            delay: 0.3,
            ease: 'back.out(1.7)'
        });
    }

    function animateExperiencias() {
        // Section label
        gsap.from('.experiencias .section-label', {
            scrollTrigger: {
                trigger: '.experiencias',
                start: 'top 80%'
            },
            x: -30,
            opacity: 0,
            duration: 0.8
        });

        // Titles
        gsap.from('.experiencias__title-wrap .section-title', {
            scrollTrigger: {
                trigger: '.experiencias__header',
                start: 'top 80%'
            },
            y: 60,
            opacity: 0,
            duration: 1,
            stagger: 0.1
        });

        gsap.from('.experiencias__intro', {
            scrollTrigger: {
                trigger: '.experiencias__header',
                start: 'top 75%'
            },
            y: 30,
            opacity: 0,
            duration: 0.8
        });

        // Cards with stagger
        $$('.exp').forEach((exp, i) => {
            const direction = i % 2 === 0 ? -80 : 80;

            gsap.from(exp, {
                scrollTrigger: {
                    trigger: exp,
                    start: 'top 85%'
                },
                x: direction,
                opacity: 0,
                duration: 1.2,
                ease: 'power4.out'
            });

            // Number animation
            gsap.from(exp.querySelector('.exp__number'), {
                scrollTrigger: {
                    trigger: exp,
                    start: 'top 80%'
                },
                scale: 0.5,
                opacity: 0,
                duration: 0.8,
                delay: 0.3,
                ease: 'back.out(1.7)'
            });

            // Icon animation
            gsap.from(exp.querySelector('.exp__icon'), {
                scrollTrigger: {
                    trigger: exp,
                    start: 'top 75%'
                },
                scale: 0,
                rotation: -180,
                opacity: 0,
                duration: 0.8,
                delay: 0.4,
                ease: 'back.out(1.7)'
            });
        });
    }

    function animateFilosofia() {
        // Section label
        gsap.from('.filosofia .section-label', {
            scrollTrigger: {
                trigger: '.filosofia',
                start: 'top 80%'
            },
            y: 30,
            opacity: 0,
            duration: 0.8
        });

        // Title
        gsap.from('.filosofia__title', {
            scrollTrigger: {
                trigger: '.filosofia__header',
                start: 'top 80%'
            },
            y: 50,
            opacity: 0,
            duration: 1
        });

        // Items with stagger
        gsap.from('.filosofia__item', {
            scrollTrigger: {
                trigger: '.filosofia__grid',
                start: 'top 80%'
            },
            y: 80,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power4.out'
        });

        // SVG icon draw animation
        $$('.filosofia__icon svg').forEach(svg => {
            const paths = svg.querySelectorAll('path, circle');
            paths.forEach(path => {
                const length = path.getTotalLength ? path.getTotalLength() : 100;
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
            });

            gsap.to(svg.querySelectorAll('path, circle'), {
                scrollTrigger: {
                    trigger: svg,
                    start: 'top 80%'
                },
                strokeDashoffset: 0,
                duration: 1.8,
                stagger: 0.15,
                ease: 'power2.inOut'
            });
        });

        // Number counters
        $$('.filosofia__item-num').forEach(num => {
            gsap.from(num, {
                scrollTrigger: {
                    trigger: num,
                    start: 'top 85%'
                },
                scale: 0,
                opacity: 0,
                duration: 0.6,
                ease: 'back.out(1.7)'
            });
        });
    }

    function animateEventos() {
        const eventos = document.querySelectorAll('.evento');
        const eventosGrid = document.querySelector('.eventos__grid');

        if (!eventosGrid || eventos.length === 0) return;

        // Ensure all evento cards are visible by default
        eventos.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });

        // Section label animation
        ScrollTrigger.create({
            trigger: '.eventos',
            start: 'top 85%',
            onEnter: () => {
                gsap.fromTo('.eventos .section-label',
                    { x: -20, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
                );
            },
            once: true
        });

        // Title animation
        ScrollTrigger.create({
            trigger: '.eventos__header',
            start: 'top 85%',
            onEnter: () => {
                gsap.fromTo('.eventos__title .section-title__line',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power2.out' }
                );
            },
            once: true
        });

        // Event cards animation
        ScrollTrigger.create({
            trigger: eventosGrid,
            start: 'top 85%',
            onEnter: () => {
                gsap.fromTo(eventos,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' }
                );
            },
            once: true
        });

        // CTA animation
        ScrollTrigger.create({
            trigger: '.eventos__footer',
            start: 'top 90%',
            onEnter: () => {
                gsap.fromTo('.eventos__cta',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
                );
            },
            once: true
        });
    }

    function animateGaleria() {
        // Section label
        gsap.from('.galeria .section-label', {
            scrollTrigger: {
                trigger: '.galeria',
                start: 'top 80%'
            },
            x: -30,
            opacity: 0,
            duration: 0.8
        });

        // Title
        gsap.from('.galeria .section-title', {
            scrollTrigger: {
                trigger: '.galeria__header',
                start: 'top 80%'
            },
            y: 50,
            opacity: 0,
            duration: 1
        });

        gsap.from('.galeria__subtitle', {
            scrollTrigger: {
                trigger: '.galeria__header',
                start: 'top 75%'
            },
            y: 30,
            opacity: 0,
            duration: 0.8
        });

        // Grid items with random stagger
        gsap.from('.galeria__item', {
            scrollTrigger: {
                trigger: '.galeria__grid',
                start: 'top 80%'
            },
            scale: 0.85,
            opacity: 0,
            duration: 0.9,
            stagger: {
                amount: 0.8,
                from: 'random'
            },
            ease: 'power4.out'
        });

        // CTA
        gsap.from('.galeria__cta', {
            scrollTrigger: {
                trigger: '.galeria__footer',
                start: 'top 90%'
            },
            y: 40,
            opacity: 0,
            duration: 0.8
        });
    }

    function animateTestimonios() {
        const testimonios = document.querySelectorAll('.testimonio');
        const testimoniosGrid = document.querySelector('.testimonios__grid');

        if (!testimoniosGrid || testimonios.length === 0) return;

        // Ensure all testimonio cards are visible by default
        testimonios.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });

        // Header animation
        ScrollTrigger.create({
            trigger: '.testimonios',
            start: 'top 85%',
            onEnter: () => {
                gsap.fromTo('.testimonios__label',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }
                );
                gsap.fromTo('.testimonios__rating',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7, delay: 0.15, ease: 'power2.out' }
                );
            },
            once: true
        });

        // Stars animation
        ScrollTrigger.create({
            trigger: '.testimonios__rating',
            start: 'top 90%',
            onEnter: () => {
                gsap.fromTo('.testimonios__stars svg',
                    { scale: 0.5, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(1.5)' }
                );
            },
            once: true
        });

        // Testimonial cards animation
        ScrollTrigger.create({
            trigger: testimoniosGrid,
            start: 'top 85%',
            onEnter: () => {
                gsap.fromTo(testimonios,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' }
                );
            },
            once: true
        });
    }

    function animateContacto() {
        // Map card
        gsap.from('.contacto__map-card', {
            scrollTrigger: {
                trigger: '.contacto__map-section',
                start: 'top 70%'
            },
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        });

        // Section label
        gsap.from('.contacto .section-label', {
            scrollTrigger: {
                trigger: '.contacto__container',
                start: 'top 80%'
            },
            x: -30,
            opacity: 0,
            duration: 0.8
        });

        // Title
        gsap.from('.contacto__title span', {
            scrollTrigger: {
                trigger: '.contacto__header',
                start: 'top 80%'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.15
        });

        gsap.from('.contacto__title em', {
            scrollTrigger: {
                trigger: '.contacto__header',
                start: 'top 75%'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: 0.2
        });

        // Cards
        gsap.from('.contacto__card', {
            scrollTrigger: {
                trigger: '.contacto__grid',
                start: 'top 80%'
            },
            y: 50,
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power4.out'
        });

        // Card icons
        gsap.from('.contacto__card-icon', {
            scrollTrigger: {
                trigger: '.contacto__grid',
                start: 'top 75%'
            },
            scale: 0,
            rotation: -45,
            opacity: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'back.out(1.7)',
            delay: 0.2
        });

        // WhatsApp button
        gsap.from('.contacto__wa', {
            scrollTrigger: {
                trigger: '.contacto__cta-wrap',
                start: 'top 90%'
            },
            y: 30,
            scale: 0.95,
            opacity: 0,
            duration: 0.7,
            ease: 'back.out(1.4)'
        });
    }

    function animateFooter() {
        // Top decoration
        gsap.from('.footer__top-line', {
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 95%'
            },
            scaleX: 0,
            duration: 1,
            stagger: 0.1
        });

        gsap.from('.footer__top-diamond', {
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 95%'
            },
            scale: 0,
            rotation: 180,
            duration: 0.6,
            delay: 0.3,
            ease: 'back.out(1.7)'
        });

        // Brand section
        gsap.from('.footer__brand-section', {
            scrollTrigger: {
                trigger: '.footer__main',
                start: 'top 90%'
            },
            y: 40,
            opacity: 0,
            duration: 0.9
        });

        // Logo
        gsap.from('.footer__logo', {
            scrollTrigger: {
                trigger: '.footer__main',
                start: 'top 85%'
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.7,
            ease: 'back.out(1.5)'
        });

        // Columns
        gsap.from('.footer__col', {
            scrollTrigger: {
                trigger: '.footer__links-section',
                start: 'top 90%'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        });

        // Social links
        const footerSocial = document.querySelector('.footer__brand-social');
        if (footerSocial) {
            gsap.from('.footer__brand-social a', {
                scrollTrigger: {
                    trigger: '.footer__brand-social',
                    start: 'top 90%'
                },
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power3.out'
            });
        }

        // Back to top
        gsap.from('.footer__back-top', {
            scrollTrigger: {
                trigger: '.footer__bottom',
                start: 'top 95%'
            },
            y: 20,
            opacity: 0,
            duration: 0.6
        });
    }

    function animateDividers() {
        $$('.divider').forEach(divider => {
            gsap.from(divider.querySelectorAll('.divider__line'), {
                scrollTrigger: {
                    trigger: divider,
                    start: 'top 90%'
                },
                scaleX: 0,
                duration: 0.8,
                stagger: 0.1
            });

            const text = divider.querySelector('.divider__text');
            const icon = divider.querySelector('.divider__icon');

            if (text) {
                gsap.from(text, {
                    scrollTrigger: {
                        trigger: divider,
                        start: 'top 90%'
                    },
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.6,
                    delay: 0.3
                });
            }

            if (icon) {
                gsap.from(icon, {
                    scrollTrigger: {
                        trigger: divider,
                        start: 'top 90%'
                    },
                    rotation: 180,
                    opacity: 0,
                    duration: 0.8,
                    delay: 0.3,
                    ease: 'back.out(1.7)'
                });
            }
        });
    }

})();
