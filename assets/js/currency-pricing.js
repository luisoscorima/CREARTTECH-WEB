/**
 * Conversión de precios PEN ↔ USD (referencial).
 * Precio maestro en soles; actualizar PEN_TO_USD_RATE periódicamente.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'crearttech_currency';
  /** Tipo de cambio referencial PEN → USD (1 USD = X PEN). Actualizar según mercado. */
  var PEN_TO_USD_RATE = 3.75;

  function detectDefaultCurrency() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'PEN' || saved === 'USD') return saved;
    } catch (e) { /* localStorage no disponible */ }

    var lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (lang === 'es-pe' || lang.endsWith('-pe')) return 'PEN';

    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz === 'America/Lima') return 'PEN';
    } catch (e) { /* ignore */ }

    return 'USD';
  }

  function toUsd(pen) {
    return Math.ceil(pen / PEN_TO_USD_RATE);
  }

  function formatValue(amount, currency) {
    if (currency === 'PEN') {
      var penValue = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
      return { symbol: 'S/', value: penValue };
    }
    return { symbol: '$', value: toUsd(amount) };
  }

  function updatePriceElements(currency) {
    document.querySelectorAll('.js-price[data-price-pen]').forEach(function (el) {
      var pen = parseFloat(el.getAttribute('data-price-pen'), 10);
      if (isNaN(pen)) return;

      var formatted = formatValue(pen, currency);
      var periodEl = el.querySelector('.js-price-period');
      var periodHtml = periodEl ? periodEl.outerHTML : '';
      var prefix = el.getAttribute('data-price-prefix') || '';
      var inline = el.classList.contains('js-price--inline');

      if (inline) {
        el.textContent = (prefix ? prefix + ' ' : '') + formatted.symbol + ' ' + formatted.value;
        return;
      }

      el.innerHTML =
        (prefix ? prefix + ' ' : '') +
        '<sup class="js-price-symbol">' + formatted.symbol + '</sup>' +
        '<span class="js-price-value">' + formatted.value + '</span>' +
        periodHtml;
    });
  }

  function setActiveButton(currency) {
    document.querySelectorAll('.pricing-currency-btn').forEach(function (btn) {
      var isActive = btn.getAttribute('data-currency') === currency;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function applyCurrency(currency) {
    updatePriceElements(currency);
    setActiveButton(currency);
    document.documentElement.setAttribute('data-pricing-currency', currency);

    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch (e) { /* ignore */ }
  }

  function init() {
    var bar = document.querySelector('.pricing-currency-bar');
    if (!bar) return;

    var currency = detectDefaultCurrency();
    applyCurrency(currency);

    bar.addEventListener('click', function (event) {
      var btn = event.target.closest('.pricing-currency-btn');
      if (!btn) return;
      var next = btn.getAttribute('data-currency');
      if (next === 'PEN' || next === 'USD') applyCurrency(next);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
