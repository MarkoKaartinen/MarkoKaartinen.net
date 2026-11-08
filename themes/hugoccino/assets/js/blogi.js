/*
 * Blogin arkisto: suodatin. Teksti hakee otsikosta, #sana avainsanoista ja @sana kategorioista
 * (alku riittää, esim. #pel löytää pelit ja pelaaminen). Toimii sivun omalla sisällöllä.
 */
(function () {
  'use strict';

  var box = document.getElementById('blogi-suodatin');
  var years = Array.prototype.slice.call(document.querySelectorAll('details.blogi-vuosi'));
  if (!box || !years.length) return;
  box.hidden = false;

  function fold(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  // Osoite #y2015 avaa vuoden
  function openYear() {
    var id = location.hash.replace(/^#/, '');
    var d = id && document.getElementById(id);
    if (d && d.tagName === 'DETAILS') d.open = true;
  }
  openYear();
  window.addEventListener('hashchange', openYear);

  var input = box.querySelector('[data-q]');
  var countEl = box.querySelector('[data-count]');
  var empty = document.getElementById('blogi-tyhja');

  var rows = [];
  years.forEach(function (d) {
    d.querySelectorAll('li').forEach(function (li) {
      var title = li.querySelector('a');
      rows.push({
        li: li,
        year: d,
        text: fold(title ? title.textContent : li.textContent),
        tags: fold(li.getAttribute('data-g')),
        cats: fold(li.getAttribute('data-c'))
      });
    });
  });
  var total = rows.length;
  var opened = years.map(function (d) { return d.open; });
  var filtering = false;

  function apply() {
    var words = [], tags = [], cats = [];
    fold(input.value).split(/\s+/).filter(Boolean).forEach(function (t) {
      if (t.charAt(0) === '#') { if (t.length > 1) tags.push('|' + t.slice(1)); }
      else if (t.charAt(0) === '@') { if (t.length > 1) cats.push('|' + t.slice(1)); }
      else words.push(t);
    });
    var now = words.length + tags.length + cats.length > 0;

    if (now && !filtering) opened = years.map(function (d) { return d.open; });

    var shown = 0;
    var perYear = new Map();
    rows.forEach(function (r) {
      var ok = words.every(function (t) { return r.text.indexOf(t) !== -1 || r.tags.indexOf(t) !== -1; }) &&
        tags.every(function (t) { return r.tags.indexOf(t) !== -1; }) &&
        cats.every(function (t) { return r.cats.indexOf(t) !== -1; });
      r.li.hidden = !ok;
      if (ok) {
        shown++;
        perYear.set(r.year, (perYear.get(r.year) || 0) + 1);
      }
    });

    years.forEach(function (d, i) {
      var n = perYear.get(d) || 0;
      var label = d.querySelector('[data-ycount]');
      if (now) {
        d.hidden = n === 0;
        d.open = n > 0;
        label.textContent = '(' + n + '/' + label.getAttribute('data-total') + ')';
      } else {
        d.hidden = false;
        label.textContent = '(' + label.getAttribute('data-total') + ')';
        if (filtering) d.open = opened[i];
      }
    });
    filtering = now;
    countEl.textContent = now ? shown + '/' + total : '';
    if (empty) empty.hidden = !(now && shown === 0);
  }

  input.addEventListener('input', apply);
})();
