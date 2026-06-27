/**
* Template Name: Selecao
* Template URL: https://bootstrapmade.com/selecao-bootstrap-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onScroll(fn) {
    scrollHandlers.push(fn);
  }

  var scrollHandlers = [];
  var scrollTicking = false;

  function runScrollHandlers() {
    scrollTicking = false;
    for (var i = 0; i < scrollHandlers.length; i++) {
      scrollHandlers[i]();
    }
  }

  function scheduleScrollHandlers() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(runScrollHandlers);
  }

  window.addEventListener('scroll', scheduleScrollHandlers, { passive: true });
  window.addEventListener('resize', scheduleScrollHandlers, { passive: true });

  /**
   * Fondo animado (orbs) + barra de progreso de scroll (tema NexusTech)
   */
  if (!prefersReducedMotion && !document.getElementById('site-bg-animation')) {
    const bg = document.createElement('div');
    bg.id = 'site-bg-animation';
    bg.setAttribute('aria-hidden', 'true');
    ['orb1', 'orb2', 'orb3'].forEach(function(cls) {
      const orb = document.createElement('div');
      orb.className = 'site-bg-orb ' + cls;
      bg.appendChild(orb);
    });
    document.body.insertBefore(bg, document.body.firstChild);
  }
  if (!document.getElementById('scroll-progress')) {
    const sp = document.createElement('div');
    sp.id = 'scroll-progress';
    document.body.appendChild(sp);
  }
  function updateScrollProgress() {
    const sp = document.getElementById('scroll-progress');
    if (!sp) return;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    sp.style.width = Math.min(100, Math.max(0, pct)) + '%';
  }
  onScroll(updateScrollProgress);
  window.addEventListener('load', updateScrollProgress);

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader) return;
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  onScroll(toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active') && mobileNavToggleBtn) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns (sub-<ul> hijo directo del li.dropdown; más robusto que nextElementSibling)
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const li = this.closest('li.dropdown');
      if (!li) return;
      /* Primer <ul> descendiente = submenú directo de este li (evita :scope por compatibilidad) */
      const submenu = li.querySelector('ul');
      const link = this.closest('a');
      if (!submenu) return;
      if (link) link.classList.toggle('active');
      submenu.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  // Inject WhatsApp floating button (visible on all pages)
  const whatsappHref = 'https://api.whatsapp.com/send?phone=51928581354&text=Hola,%20Quisiera%20consultar%20sobre%20uno%20de%20sus%20servicios';
  let whatsappFloat = document.querySelector('.whatsapp-float');
  if (!whatsappFloat) {
    whatsappFloat = document.createElement('a');
    whatsappFloat.href = whatsappHref;
    whatsappFloat.target = '_blank';
    whatsappFloat.rel = 'noopener';
  whatsappFloat.className = 'whatsapp-float d-flex align-items-center justify-content-center';
  whatsappFloat.setAttribute('title', 'Escríbenos por WhatsApp');
  whatsappFloat.setAttribute('aria-label', 'Escríbenos por WhatsApp');
    whatsappFloat.innerHTML = '<i class="bi bi-whatsapp"></i>';
    document.body.appendChild(whatsappFloat);
  }

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    if (whatsappFloat) {
      window.scrollY > 100 ? whatsappFloat.classList.add('active') : whatsappFloat.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  onScroll(toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (prefersReducedMotion || typeof AOS === 'undefined') return;
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox (solo si hay enlaces en la página)
   */
  if (typeof GLightbox !== 'undefined' && document.querySelector('.glightbox')) {
    GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Portafolio: filtros sin Isotope (CSS Grid + mostrar/ocultar ítems)
   */
  document.querySelectorAll('.portfolio-filter-root').forEach(function(root) {
    var grid = root.querySelector('.portfolio-grid');
    if (!grid) {
      return;
    }
    var items = grid.querySelectorAll('.portfolio-item');

    root.querySelectorAll('.portfolio-filters li').forEach(function(li) {
      li.addEventListener('click', function() {
        var filterSel = li.getAttribute('data-filter');
        var active = root.querySelector('.portfolio-filters .filter-active');
        if (active) {
          active.classList.remove('filter-active');
        }
        li.classList.add('filter-active');

        items.forEach(function(el) {
          el.hidden = Boolean(filterSel && filterSel !== '*' && !el.matches(filterSel));
        });

        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });
  });

  /**
   * Init isotope layout and filters (legacy; solo si la librería está cargada)
   */
  if (typeof Isotope !== 'undefined' && typeof imagesLoaded !== 'undefined') {
    document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
      let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

      let initIsotope;
      const isoContainer = isotopeItem.querySelector('.isotope-container');
      if (!isoContainer) {
        return;
      }
      imagesLoaded(isoContainer, function() {
        var isoOpts = {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort,
          percentPosition: true
        };
        if (layout === 'masonry') {
          isoOpts.masonry = {
            columnWidth: '.isotope-item'
          };
        }
        initIsotope = new Isotope(isoContainer, isoOpts);
        var layoutIso = function() {
          if (initIsotope) {
            initIsotope.layout();
          }
        };
        window.addEventListener('resize', layoutIso);
        setTimeout(layoutIso, 100);
      });

      isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
        filters.addEventListener('click', function() {
          if (!initIsotope) {
            return;
          }
          isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
          this.classList.add('filter-active');
          initIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          if (typeof aosInit === 'function') {
            aosInit();
          }
        }, false);
      });

    });
  }

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  onScroll(navmenuScrollspy);

})();
