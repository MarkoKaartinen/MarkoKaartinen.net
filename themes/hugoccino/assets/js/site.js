(function () {
  'use strict';

  // Teeman vaihto
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var root = document.documentElement;
      var current = root.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // Kävijälaskuri: haetaan luku API:sta, jos osoite on asetettu
  document.querySelectorAll('[data-visitors]').forEach(function (el) {
    var api = el.getAttribute('data-api');
    if (!api) return;
    fetch(api, { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (data) {
        var n = String(parseInt(data.visits, 10));
        if (!/^\d+$/.test(n)) return;
        var digits = el.querySelector('[data-visitors-digits]');
        var text = el.querySelector('[data-visitors-text]');
        if (text) text.textContent = n;
        if (digits) {
          digits.textContent = '';
          n.split('').forEach(function (d) {
            var s = document.createElement('span');
            s.className = 'digit';
            s.textContent = d;
            digits.appendChild(s);
          });
        }
        el.title = 'Kävijöitä yhteensä';
      })
      .catch(function () { /* jätetään placeholder */ });
  });
})();
