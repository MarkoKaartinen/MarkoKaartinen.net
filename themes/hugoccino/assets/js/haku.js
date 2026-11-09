/*
 * Edistynyt haku: Pagefind hakee artikkelien ja sivujen koko tekstistä. Indeksi tehdään koonnin jälkeen
 * (npm run build), ja se ladataan selaimeen palasina vasta kun sitä tarvitaan.
 * Osoite säilyy muodossa /haku?q=sana&vuosi=2020&kategoria=Apple, joten haun voi jakaa linkkinä.
 */
(function () {
  'use strict';

  var root = document.getElementById('haku');
  if (!root) return;

  var input = root.querySelector('[data-q]');
  var filtersEl = root.querySelector('[data-filters]');
  var statusEl = root.querySelector('[data-status]');
  var listEl = root.querySelector('[data-results]');
  var moreBtn = root.querySelector('[data-more]');
  var PAGE = 10;

  var pf = null;
  var selects = {};
  var current = null;
  var shown = 0;
  var token = 0;
  var timer = null;

  var LABELS = { vuosi: 'vuosi', kategoria: 'kategoria', tyyppi: 'tyyppi' };

  function setStatus(text) { statusEl.textContent = text || ''; }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function readUrl() {
    var p = new URLSearchParams(location.search);
    input.value = p.get('q') || '';
    return { vuosi: p.get('vuosi') || '', kategoria: p.get('kategoria') || '', tyyppi: p.get('tyyppi') || '' };
  }

  function writeUrl() {
    var p = new URLSearchParams();
    if (input.value.trim()) p.set('q', input.value.trim());
    Object.keys(selects).forEach(function (k) { if (selects[k].value) p.set(k, selects[k].value); });
    var qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  function activeFilters() {
    var f = {};
    Object.keys(selects).forEach(function (k) { if (selects[k].value) f[k] = selects[k].value; });
    return f;
  }

  function buildFilters(all, initial) {
    ['tyyppi', 'vuosi', 'kategoria'].forEach(function (key) {
      var values = all[key];
      if (!values) return;
      var names = Object.keys(values);
      if (key === 'vuosi') names.sort(function (a, b) { return b - a; });
      else names.sort(function (a, b) { return values[b] - values[a] || a.localeCompare(b, 'fi'); });
      var sel = el('select', 'rounded border border-surface1 bg-mantle px-2 py-1 text-subtext0 outline-none focus:border-mauve');
      sel.setAttribute('aria-label', LABELS[key]);
      var any = el('option', null, LABELS[key] + ': kaikki');
      any.value = '';
      sel.appendChild(any);
      names.forEach(function (n) {
        var o = el('option', null, n + ' (' + values[n] + ')');
        o.value = n;
        sel.appendChild(o);
      });
      sel.value = initial[key] && values[initial[key]] ? initial[key] : '';
      sel.addEventListener('change', run);
      selects[key] = sel;
      filtersEl.appendChild(sel);
    });
    filtersEl.hidden = !Object.keys(selects).length;
  }

  function renderResult(data) {
    var li = el('li', 'py-3');
    var title = el('a', 'text-text hover:text-mauve');
    title.href = data.url;
    title.textContent = (data.meta && data.meta.title) || data.url;
    li.appendChild(title);

    var meta = [];
    if (data.meta && data.meta.pvm) meta.push(data.meta.pvm);
    var cat = data.filters && data.filters.kategoria;
    if (cat) meta.push([].concat(cat).filter(function (c) { return c !== 'Blogi'; }).join(', '));
    meta = meta.filter(Boolean);
    if (meta.length) li.appendChild(el('p', 'mt-0.5 font-mono text-xs text-meta', meta.join(' · ')));

    // Pagefind palauttaa katkelman, jossa osumat on merkitty <mark>-elementeillä
    var ex = el('p', 'haku-katkelma mt-1 text-sm leading-relaxed text-subtext0');
    ex.innerHTML = data.excerpt;
    li.appendChild(ex);
    return li;
  }

  // Lukitus estää saman erän lataamisen kahdesti (nopea kaksoisklikkaus), mutta uusi haku saa aina ladata omansa
  var loadingFor = -1;

  function showMore() {
    if (!current || loadingFor === token) return;
    var my = token;
    loadingFor = my;
    moreBtn.disabled = true;
    var batch = current.results.slice(shown, shown + PAGE);
    Promise.all(batch.map(function (r) { return r.data(); })).then(function (items) {
      if (my !== token) return;
      items.forEach(function (d) { listEl.appendChild(renderResult(d)); });
      shown += batch.length;
      moreBtn.hidden = shown >= current.results.length;
    }).then(function () {
      if (loadingFor === my) { loadingFor = -1; moreBtn.disabled = false; }
    }, function () {
      if (loadingFor === my) { loadingFor = -1; moreBtn.disabled = false; }
    });
  }

  function run() {
    var q = input.value.trim();
    var filters = activeFilters();
    writeUrl();
    var my = ++token;
    listEl.textContent = '';
    moreBtn.hidden = true;
    shown = 0;
    current = null;

    if (!q && !Object.keys(filters).length) {
      setStatus('Kirjoita hakusana. Haku käy läpi artikkelien ja sivujen koko tekstin.');
      return;
    }
    setStatus('Haetaan…');
    pf.search(q || null, { filters: filters }).then(function (res) {
      if (my !== token) return;
      current = res;
      var n = res.results.length;
      setStatus(n === 0 ? 'Ei osumia.' : n + (n === 1 ? ' osuma' : ' osumaa'));
      showMore();
    });
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(run, 200);
  }

  setStatus('Ladataan hakua…');
  import(root.getAttribute('data-pagefind')).then(function (mod) {
    pf = mod;
    return pf.init().then(function () { return pf.filters(); });
  }).then(function (all) {
    var initial = readUrl();
    buildFilters(all, initial);
    input.addEventListener('input', schedule);
    moreBtn.addEventListener('click', showMore);
    run();
  }).catch(function () {
    setStatus('Edistynyt haku ei ole käytettävissä tässä ympäristössä. Pikahaku (/) toimii silti.');
    input.disabled = true;
  });
})();
