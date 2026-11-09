/*
 * 404-sivu: näyttää haetun osoitteen komentorivillä ja ehdottaa samankaltaisia sivuja
 * osoitteen sanojen perusteella (sama hakuindeksi kuin komentopaletissa).
 */
(function () {
  'use strict';

  var path = decodeURIComponent(location.pathname || '/');

  document.querySelectorAll('[data-404-path]').forEach(function (el) {
    el.textContent = path;
  });

  function fold(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  // Osoitteen sanat: yli 2 merkin pituiset, ei pelkkiä numeroita, ei yleisiä sivupolun osia
  var skip = { kategoria: 1, avainsana: 1, sarja: 1, resepti: 1, reseptit: 1, blogi: 1, index: 1, html: 1 };
  var terms = [];
  fold(path).split(/[^a-z0-9]+/).forEach(function (t) {
    if (t.length > 2 && !/^\d+$/.test(t) && !skip[t] && terms.indexOf(t) < 0) terms.push(t);
  });

  var q = terms.join(' ');
  var searchLink = document.querySelector('[data-404-search]');
  if (searchLink && q) {
    searchLink.setAttribute('href', searchLink.getAttribute('href') + '?q=' + encodeURIComponent(q));
    searchLink.lastChild.textContent = ' grep -r "' + q + '"';
  }

  var box = document.querySelector('[data-404-suggest]');
  var list = document.querySelector('[data-404-list]');
  var palette = document.getElementById('palette');
  if (!box || !list || !palette || !terms.length) return;

  var term = box.querySelector('[data-404-term]');
  if (term) term.textContent = terms[0];

  fetch(palette.getAttribute('data-index'), { headers: { Accept: 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (items) {
      var scored = [];
      items.forEach(function (it) {
        var slug = fold(it.u);
        var title = fold(it.t);
        var tags = fold((it.g || []).join(' '));
        var score = 0;
        terms.forEach(function (t) {
          if (slug.indexOf(t) > -1) score += 3;
          if (title.indexOf(t) > -1) score += 2;
          if (tags.indexOf(t) > -1) score += 1;
        });
        if (score > 0) scored.push({ it: it, score: score });
      });
      scored.sort(function (a, b) { return b.score - a.score; });
      scored.slice(0, 5).forEach(function (s) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = s.it.u;
        a.className = 'flex flex-wrap items-baseline justify-between gap-x-4 py-2.5 text-text hover:text-mauve';
        var t = document.createElement('span');
        t.textContent = s.it.t;
        var m = document.createElement('span');
        m.className = 'font-mono text-xs text-meta';
        m.textContent = s.it.y;
        a.appendChild(t);
        a.appendChild(m);
        li.appendChild(a);
        list.appendChild(li);
      });
      if (list.children.length) box.hidden = false;
    })
    .catch(function () {});
})();
