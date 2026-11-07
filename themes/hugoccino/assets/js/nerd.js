/*
 * Nörttiominaisuudet: komentopaletti (/ tai Ctrl/Cmd+K), oikotiet, koodin kopiointi, lukuetenemä
 * ja valikon sulkeminen. Ei riippuvuuksia.
 */
(function () {
  'use strict';

  var palette = document.getElementById('palette');
  var help = document.getElementById('shortcuts');
  var input = palette ? palette.querySelector('[data-input]') : null;
  var listEl = palette ? palette.querySelector('[data-results]') : null;

  // ---------- Haku ----------

  var items = null;
  var loading = null;
  var current = [];
  var selected = 0;

  function fold(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function loadIndex() {
    if (items) return Promise.resolve(items);
    if (loading) return loading;
    var url = palette.getAttribute('data-index');
    loading = fetch(url, { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (data) {
        items = data.map(function (it) {
          return {
            t: it.t, u: it.u, d: it.d || '', g: it.g || [], y: it.y,
            ft: fold(it.t), fd: fold(it.d), fg: fold((it.g || []).join(' '))
          };
        });
        return items;
      })
      .catch(function () { items = []; return items; });
    return loading;
  }

  function commands() {
    var list = [];
    var seen = {};
    document.querySelectorAll('[data-palette-link]').forEach(function (a) {
      var href = a.getAttribute('href');
      var name = a.textContent.replace(/\s+/g, ' ').replace(/^\/\s*/, '').trim();
      if (!name || seen[href]) return;
      seen[href] = true;
      list.push({ title: name, meta: 'sivu ' + href, href: href, search: fold(name) });
    });
    list.push({ title: 'Vaihda teema', meta: 'näppäin t', run: toggleTheme, search: 'vaihda teema tumma vaalea' });
    list.push({ title: 'Näppäinoikotiet', meta: 'näppäin ?', run: openHelp, search: 'nappainoikotiet ohje ?' });
    var rss = document.querySelector('a[aria-label="RSS-syöte"]');
    if (rss) list.push({ title: 'RSS-syöte', meta: rss.getAttribute('href'), href: rss.getAttribute('href'), search: 'rss syote feed' });
    return list;
  }

  function matchAll(terms, fields) {
    var score = 0;
    for (var i = 0; i < terms.length; i++) {
      var term = terms[i];
      var s = 0;
      if (fields.t.indexOf(term) !== -1) s += fields.t.indexOf(term) === 0 ? 5 : 3;
      if (fields.g && fields.g.indexOf(term) !== -1) s += 2;
      if (fields.d && fields.d.indexOf(term) !== -1) s += 1;
      if (!s) return 0;
      score += s;
    }
    return score;
  }

  function compute(raw) {
    var q = raw.trim();
    var mode = 'search';
    if (q.charAt(0) === '>') { mode = 'cmd'; q = q.slice(1).trim(); }
    else if (q.charAt(0) === '#') { mode = 'tag'; q = q.slice(1).trim(); }
    var terms = fold(q).split(/\s+/).filter(Boolean);

    if (mode === 'cmd') {
      return commands().filter(function (c) {
        return terms.every(function (t) { return c.search.indexOf(t) !== -1; });
      }).slice(0, 20);
    }

    var pool = items || [];
    var out = [];
    if (mode === 'tag') {
      var tagged = pool.filter(function (it) {
        return terms.length === 0 ? it.g.length : terms.every(function (t) { return it.fg.indexOf(t) !== -1; });
      }).slice(0, 15);
      return tagged.map(function (it) {
        return { title: it.t, meta: it.y + ' · #' + it.g.slice(0, 3).join(' #'), href: it.u };
      });
    }
    if (!terms.length) {
      return pool.slice(0, 8).map(function (it) {
        return { title: it.t, meta: it.y, href: it.u };
      });
    }
    pool.forEach(function (it, idx) {
      var score = matchAll(terms, { t: it.ft, g: it.fg, d: it.fd });
      if (score) out.push({ it: it, score: score, idx: idx });
    });
    out.sort(function (a, b) { return b.score - a.score || a.idx - b.idx; });
    return out.slice(0, 15).map(function (o) {
      return { title: o.it.t, meta: o.it.y + (o.it.d ? ' · ' + o.it.d : ''), href: o.it.u };
    });
  }

  function render() {
    listEl.textContent = '';
    if (!current.length) {
      var empty = document.createElement('li');
      empty.className = 'palette-empty';
      empty.textContent = items === null ? 'Ladataan…' : 'Ei tuloksia';
      listEl.appendChild(empty);
      return;
    }
    current.forEach(function (c, i) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.id = 'palette-opt-' + i;
      li.className = 'palette-item';
      li.setAttribute('aria-selected', i === selected ? 'true' : 'false');
      var t = document.createElement('div');
      t.className = 'palette-title';
      t.textContent = c.title;
      var m = document.createElement('div');
      m.className = 'palette-meta';
      m.textContent = c.meta || '';
      li.appendChild(t);
      li.appendChild(m);
      li.addEventListener('mousemove', function () { select(i, false); });
      li.addEventListener('click', function (e) { activate(i, e.ctrlKey || e.metaKey); });
      listEl.appendChild(li);
    });
  }

  function select(i, scroll) {
    if (!current.length) return;
    selected = (i + current.length) % current.length;
    listEl.querySelectorAll('.palette-item').forEach(function (el, idx) {
      el.setAttribute('aria-selected', idx === selected ? 'true' : 'false');
    });
    input.setAttribute('aria-activedescendant', 'palette-opt-' + selected);
    if (scroll) {
      var el = listEl.querySelector('#palette-opt-' + selected);
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }

  function update() {
    current = compute(input.value);
    selected = 0;
    render();
  }

  function activate(i, newTab) {
    var c = current[i];
    if (!c) return;
    if (c.run) {
      palette.close();
      c.run();
      return;
    }
    if (newTab) { window.open(c.href, '_blank', 'noopener'); return; }
    window.location.href = c.href;
  }

  function openPalette(preset) {
    if (!palette) return;
    if (help && help.open) help.close();
    if (!palette.open) palette.showModal();
    input.value = preset || '';
    update();
    input.focus();
    loadIndex().then(update);
  }

  function openHelp() {
    if (!help) return;
    if (palette && palette.open) palette.close();
    if (!help.open) help.showModal();
  }

  function toggleTheme() {
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.click();
  }

  if (palette && input && listEl) {
    input.addEventListener('input', update);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); select(selected + 1, true); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); select(selected - 1, true); }
      else if (e.key === 'Enter') { e.preventDefault(); activate(selected, e.ctrlKey || e.metaKey); }
    });
    [palette, help].forEach(function (dlg) {
      if (!dlg) return;
      dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    });
    document.querySelectorAll('[data-search-open]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        openPalette('');
      });
    });
    document.querySelectorAll('[data-shortcuts-open]').forEach(function (el) {
      el.addEventListener('click', openHelp);
    });
    if (document.querySelector('[data-search-autoopen]')) openPalette('');
  }

  // ---------- Oikotiet ----------

  var chord = false;
  var chordTimer = null;
  var GO = { h: '/', b: '/blogi', r: '/reseptit', v: '/vieraskirja', l: '/linkit', t: '/tietoa', n: '/nyt' };

  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented) return;
    var el = e.target;
    var typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && palette) {
      e.preventDefault();
      openPalette('');
      return;
    }
    if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
    if (document.querySelector('dialog[open]')) return;

    if (chord) {
      chord = false;
      clearTimeout(chordTimer);
      var path = GO[e.key.toLowerCase()];
      if (path) { e.preventDefault(); window.location.href = path; }
      return;
    }

    if (e.key === '/' && palette) { e.preventDefault(); openPalette(''); }
    else if (e.key === '?') { e.preventDefault(); openHelp(); }
    else if (e.key === 't') { toggleTheme(); }
    else if (e.key === 'g') {
      chord = true;
      chordTimer = setTimeout(function () { chord = false; }, 1000);
    }
  });

  // ---------- Koodilohkojen kopiointi ----------

  document.querySelectorAll('.sisalto .highlight').forEach(function (box) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = 'kopioi';
    btn.setAttribute('aria-label', 'Kopioi koodi leikepöydälle');
    btn.addEventListener('click', function () {
      var code = box.querySelector('code');
      if (!code || !navigator.clipboard) return;
      var clone = code.cloneNode(true);
      clone.querySelectorAll('.ln, .lnt').forEach(function (n) { n.remove(); });
      navigator.clipboard.writeText(clone.textContent.replace(/\n$/, '')).then(function () {
        btn.textContent = 'kopioitu!';
        setTimeout(function () { btn.textContent = 'kopioi'; }, 1500);
      }, function () {
        btn.textContent = 'virhe';
        setTimeout(function () { btn.textContent = 'kopioi'; }, 1500);
      });
    });
    box.appendChild(btn);
  });

  // ---------- Lukuetenemä ----------

  var bar = document.getElementById('reading-progress');
  var article = document.querySelector('[data-reading]');
  if (bar && article) {
    bar.hidden = false;
    var update2 = function () {
      var r = article.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      bar.style.transform = 'scaleX(' + p + ')';
    };
    window.addEventListener('scroll', update2, { passive: true });
    window.addEventListener('resize', update2);
    update2();
  }

  // ---------- "lisää"-valikko ----------

  var menus = document.querySelectorAll('details[data-menu]');
  if (menus.length) {
    document.addEventListener('click', function (e) {
      menus.forEach(function (m) { if (!m.contains(e.target)) m.open = false; });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') menus.forEach(function (m) { m.open = false; });
    });
    // Haku avautuu paletissa, joten valikko suljetaan sitä klikatessa
    menus.forEach(function (m) {
      m.querySelectorAll('[data-search-open]').forEach(function (a) {
        a.addEventListener('click', function () { m.open = false; });
      });
    });
  }

  // ---------- Pääsiäismuna konsolissa ----------

  if (window.console && console.log) {
    console.log('%c> hei, nörtti. Kurkkaa lähdekoodi: https://github.com/MarkoKaartinen/MarkoKaartinen.net  (paina ? oikotieohjeille)', 'font-family: monospace; color: #cba6f7');
  }
})();
