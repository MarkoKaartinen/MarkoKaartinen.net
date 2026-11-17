// Joulutunnelma koko sivustolla: lumisade ja jouluvalot (ketju roikkuu yläpalkista).
// Käytössä marraskuun alusta helmikuun loppuun sekä /joulukalenteri-sivulla. Käyttäjä valitsee itse, mitä haluaa:
// valinnat tallentuvat selaimeen (joulu-lumi, joulu-valot). Oletukset: lumi päällä marras-helmikuussa, valot päällä joulukuun alusta loppiaiseen (6.1.).
// Sivu voi antaa omat oletukset (/joulukalenteri: molemmat päällä, ellei käyttäjä ole valinnut toisin): data-joulu-always data-joulu-snow="on" data-joulu-lights="on".
// Testaus muulloin kuin joulukaudella: lisää osoitteeseen ?joulu (pois: ?joulu=pois).
(function () {
  'use strict';

  var always = document.querySelector('[data-joulu-always]');
  var forced = false;
  try {
    var m0 = /[?&]joulu(?:=([^&]*))?(?:&|$)/.exec(location.search);
    if (m0 && m0[1] === 'pois') sessionStorage.removeItem('joulu-testi');
    else if (m0) sessionStorage.setItem('joulu-testi', '1');
    forced = sessionStorage.getItem('joulu-testi') === '1';
  } catch (e) { forced = /[?&]joulu(?!=pois)/.test(location.search); }

  var fin = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Helsinki' }));
  var month = fin.getMonth() + 1;
  var snowSeason = month === 11 || month === 12 || month === 1 || month === 2; // lumi marraskuun alusta helmikuun loppuun
  var lightsSeason = month === 12 || (month === 1 && fin.getDate() <= 6); // valot joulukuun alusta loppiaiseen
  var season = snowSeason;
  if (!season && !forced && !always) return;

  var KEYS = { snow: 'joulu-lumi', lights: 'joulu-valot' };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function stored(kind) {
    try { return localStorage.getItem(KEYS[kind]); } catch (e) { return null; }
  }
  function store(kind, on) {
    try { localStorage.setItem(KEYS[kind], on ? 'on' : 'off'); } catch (e) {}
  }
  // Valinta, muuten sivun oma oletus, muuten yleinen oletus
  function initial(kind) {
    var v = stored(kind);
    if (v === 'on' || v === 'off') return v === 'on';
    var page = always && always.getAttribute('data-joulu-' + kind);
    if (page === 'on' || page === 'off') return page === 'on';
    return kind === 'snow' ? snowSeason : lightsSeason;
  }
  var state = { snow: initial('snow'), lights: initial('lights') };

  function el(tag, cls) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }

  // ---------- Lumisade ----------

  var snowEl = null;
  var pileEl = null;
  var lapioEl = null;
  var pileTimer = 0;
  var shoveling = false;
  var PILE_MAX_DESKTOP = 120; // lumikasan korkeus kokonaan kasvaneena (px), leveällä näytöllä
  var PILE_MAX_MOBILE = 90; // ja kapealla (alle 640 px)
  function pileMax() { return document.documentElement.clientWidth < 640 ? PILE_MAX_MOBILE : PILE_MAX_DESKTOP; }
  var PILE_MS = 4 * 60 * 1000; // aika, jossa kasa kasvaa täyteen
  var KEY_START = 'joulu-lumi-alku'; // istunnon aikana, jotta kasa jatkaa kasvamistaan sivulta toiselle
  var KEY_SEED = 'joulu-lumi-siemen'; // kasan muoto pysyy samana sivulta toiselle
  var SHOVEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.56 4.56a1.5 1.5 0 0 1 0 2.122l-.47.47a3 3 0 0 1-4.212-.03 3 3 0 0 1 0-4.243l.44-.44a1.5 1.5 0 0 1 2.121 0z"/><path d="M3 22a1 1 0 0 1-1-1v-3.586a1 1 0 0 1 .293-.707l3.355-3.355a1.205 1.205 0 0 1 1.704 0l3.296 3.296a1.205 1.205 0 0 1 0 1.704l-3.355 3.355a1 1 0 0 1-.707.293z"/><path d="m9 15 7.879-7.878"/></svg>';

  // Lumiaura (suuntana oikealle): kuormalava, ohjaamo, kaksi pyörää, terä edessä ja vilkkuva merkkivalo
  var PLOW = '<svg viewBox="0 0 64 32" aria-hidden="true" focusable="false">' +
    '<rect x="3" y="12" width="31" height="12" rx="2" fill="var(--ctp-peach)"/>' +
    '<path d="M34 24V10a2 2 0 0 1 2-2h7l5 6h3a2 2 0 0 1 2 2v8z" fill="var(--ctp-yellow)"/>' +
    '<path d="M38 11h5l3 3.5H38z" fill="var(--ctp-sky)"/>' +
    '<rect class="joulu-beacon" x="38" y="4.5" width="5" height="3.5" rx="1" fill="var(--ctp-red)"/>' +
    '<path d="M53 8.5 63 5v20l-10-1z" fill="var(--ctp-sapphire)"/>' +
    '<circle cx="13" cy="25" r="4.5" fill="var(--ctp-crust)"/><circle cx="43" cy="25" r="4.5" fill="var(--ctp-crust)"/>' +
    '<circle cx="13" cy="25" r="1.6" fill="var(--ctp-overlay1)"/><circle cx="43" cy="25" r="1.6" fill="var(--ctp-overlay1)"/></svg>';

  function stored2(key, make) {
    try {
      var v = sessionStorage.getItem(key);
      if (!v) { v = String(make()); sessionStorage.setItem(key, v); }
      return parseInt(v, 10);
    } catch (e) { return make(); }
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  // Pehmeästi aaltoileva kinos: kolme siniaaltoa, joiden vaiheet arvotaan siemenestä (kaksi kerrosta, takimmainen himmeämpi)
  function drift(rnd, base, amp) {
    var p = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28];
    var f = [0.0045 + rnd() * 0.002, 0.012 + rnd() * 0.004, 0.03 + rnd() * 0.01];
    function yAt(x) {
      return base + amp * (0.55 * Math.sin(x * f[0] + p[0]) + 0.3 * Math.sin(x * f[1] + p[1]) + 0.15 * Math.sin(x * f[2] + p[2]));
    }
    var d = 'M0 100';
    for (var x = 0; x <= 1200; x += 20) d += ' L' + x + ' ' + yAt(x).toFixed(1);
    return { d: d + ' L1200 100Z', yAt: yAt };
  }
  var pileFront = null; // etummaisen kerroksen muoto, jonka avulla lapio asetetaan kerrosten väliin
  function layer(cls, path, opacity) {
    return '<svg class="' + cls + '" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<path d="' + path + '" fill="var(--pile)"' + (opacity ? ' fill-opacity="' + opacity + '"' : '') + '/></svg>';
  }
  // Kaksi kerrosta: takimmainen himmeämpi ja etummainen; lapio asetetaan niiden väliin
  function pileLayers(seed) {
    var rnd = mulberry32(seed);
    var back = drift(rnd, 22, 12);
    pileFront = drift(rnd, 38, 16);
    return { back: layer('joulu-back', back.d, '0.5'), front: layer('joulu-front', pileFront.d, '') };
  }
  var LAPIO_LEFT = 44; // lapion etäisyys vasemmasta reunasta (px)
  var LAPIO_SIZE = 52;
  var LAPIO_HIDDEN = 12; // kuinka monta pikseliä lapion alaosasta jää etummaisen lumikerroksen taakse
  function updatePile(start) {
    var h = Math.round(pileMax() * Math.min(1, (Date.now() - start) / PILE_MS));
    pileEl.style.height = h + 'px';
    if (h > 0) pileEl.removeAttribute('data-empty'); else pileEl.setAttribute('data-empty', '');
    // Lapion alaosa jää etummaisen lumikerroksen alle: lasketaan kinoksen korkeus lapion kohdalla
    var w = Math.max(1, document.documentElement.clientWidth);
    var snowTop = pileFront ? pileFront.yAt((LAPIO_LEFT + LAPIO_SIZE / 2) / w * 1200) : 40;
    var snowH = h * (1 - snowTop / 100);
    lapioEl.style.bottom = Math.round(snowH - LAPIO_HIDDEN) + 'px';
    lapioEl.hidden = h < 14; // lapio ilmestyy, kun hanki on tarpeeksi korkea
    renderShovelButtons();
  }
  function clearPileStorage() {
    try { sessionStorage.removeItem(KEY_START); sessionStorage.removeItem(KEY_SEED); } catch (e) {}
  }
  var plowTool = null;
  var plowAnims = [];
  // Keskeyttää käynnissä olevan kolauksen (aura ja sen animaatiot pois)
  function stopPlow() {
    plowAnims.forEach(function (a) { a.onfinish = null; try { a.cancel(); } catch (e) {} });
    plowAnims = [];
    if (plowTool) { plowTool.remove(); plowTool = null; }
    shoveling = false;
  }
  function removePile() {
    stopPlow();
    if (pileEl) { pileEl.remove(); pileEl = null; }
    if (lapioEl) { lapioEl.remove(); lapioEl = null; }
    clearInterval(pileTimer);
    clearPileStorage();
    renderShovelButtons();
  }
  function addPile() {
    var start = stored2(KEY_START, function () { return Date.now(); });
    var seed = stored2(KEY_SEED, function () { return Math.floor(Math.random() * 1e9); });
    var layers = pileLayers(seed);
    pileEl = el('div', 'joulu-pile');
    pileEl.setAttribute('aria-hidden', 'true');
    // Lapio seisoo hangessa kerrosten välissä, ja sitä napauttamalla kolataan
    lapioEl = el('button', 'joulu-lapio');
    lapioEl.type = 'button';
    lapioEl.setAttribute('aria-label', 'Kolaa lumet pois');
    lapioEl.title = 'Kolaa lumet pois';
    lapioEl.innerHTML = SHOVEL;
    pileEl.innerHTML = layers.back;
    pileEl.appendChild(lapioEl);
    pileEl.insertAdjacentHTML('beforeend', layers.front);
    updatePile(start);
    document.body.appendChild(pileEl);
    clearInterval(pileTimer);
    pileTimer = setInterval(function () { updatePile(start); }, 3000);
  }

  // Kolaus: lumiaura ajaa vasemmalta oikealle ja lumi katoaa sen terän edestä, sitten kasa alkaa kasvaa uudelleen
  function shovel() {
    if (!pileEl || shoveling) return;
    var pile = pileEl;
    if (reduced || typeof pile.animate !== 'function') { removePile(); addPile(); return; }
    shoveling = true;
    clearInterval(pileTimer);
    if (lapioEl) lapioEl.hidden = true;
    var tool = el('div', 'joulu-plow');
    tool.setAttribute('aria-hidden', 'true');
    tool.innerHTML = PLOW;
    // Auran koko seuraa kasan korkeutta: matalan kinoksen edessä pieni aura, täyden kasan edessä iso (suhde 2:1)
    var ph = Math.max(28, Math.round(parseFloat(pile.style.height) * 0.6));
    var pw = ph * 2;
    tool.style.width = pw + 'px';
    tool.style.height = ph + 'px';
    document.body.appendChild(tool);
    plowTool = tool;
    // Aura kiihtyy paikaltaan ja ajaa ruudun yli kokonaan pois; lumi katoaa terän edestä (terä = auran oikea reuna)
    var w = document.documentElement.clientWidth;
    var opts = { duration: 5200, easing: 'cubic-bezier(0.4, 0, 0.9, 0.85)', fill: 'forwards' };
    var toolAnim = tool.animate([{ transform: 'translateX(-' + pw + 'px)' }, { transform: 'translateX(' + w + 'px)' }], opts);
    var anim = pile.animate([{ clipPath: 'inset(0 0 0 0px)' }, { clipPath: 'inset(0 0 0 ' + (w + pw) + 'px)' }], opts);
    plowAnims = [toolAnim, anim];
    anim.onfinish = function () {
      removePile();
      if (state.snow && !reduced) addPile();
    };
    renderShovelButtons();
  }
  function renderShovelButtons() {
    document.querySelectorAll('[data-joulu-shovel]').forEach(function (b) {
      b.disabled = !pileEl || shoveling || pileEl.hasAttribute('data-empty');
    });
  }

  function renderSnow() {
    var on = state.snow && !reduced;
    if (!on) {
      if (snowEl) { snowEl.remove(); snowEl = null; }
      removePile(); // lumi sulaa, kun sen sammuttaa
      return;
    }
    if (snowEl) return;
    snowEl = el('div', 'joulu-snow');
    snowEl.setAttribute('aria-hidden', 'true');
    var n = Math.min(40, Math.max(18, Math.round(document.documentElement.clientWidth / 24)));
    for (var i = 0; i < n; i++) {
      var f = el('i', 'joulu-flake');
      var size = 2 + (i * 7) % 3;
      var drift = ((i * 37) % 61) - 30;
      f.style.cssText = 'left:' + ((i * 53) % 100) + '%;width:' + size + 'px;height:' + size + 'px;opacity:' + (0.2 + ((i * 11) % 5) / 14) +
        ';--dx:' + drift + 'px;animation-duration:' + (12 + (i % 9) * 2) + 's;animation-delay:-' + ((i * 3) % 19) + 's';
      snowEl.appendChild(f);
    }
    document.body.appendChild(snowEl);
    addPile(); // lumi kasaantuu hitaasti ikkunan alareunaan
  }

  // ---------- Jouluvalot ----------

  var garland = null;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var BULBS = ['red', 'green', 'yellow', 'blue', 'mauve', 'peach'];
  function layGarland() {
    if (!garland) return;
    var header = document.querySelector('header');
    var w = document.documentElement.clientWidth;
    var swags = Math.max(3, Math.round(w / 200));
    var sw = w / swags;
    var sag = w < 640 ? 14 : 22; // ketjun painuma
    garland.style.top = (header ? header.offsetHeight : 0) + 'px';
    garland.style.height = (sag + 20) + 'px';
    garland.textContent = '';

    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('width', w);
    svg.setAttribute('height', sag + 2);
    svg.setAttribute('class', 'joulu-wire');
    var d = 'M0 0';
    for (var s = 0; s < swags; s++) d += ' Q' + (s * sw + sw / 2) + ' ' + (2 * sag) + ' ' + ((s + 1) * sw) + ' 0';
    var path = document.createElementNS(SVGNS, 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
    garland.appendChild(svg);

    var per = 4; // lamppua per kaari
    var idx = 0;
    for (var k = 0; k < swags; k++) {
      for (var j = 1; j <= per; j++) {
        var t = j / (per + 1);
        var b = el('i', 'joulu-bulb');
        b.style.left = (k * sw + t * sw) + 'px';
        b.style.top = (4 * sag * t * (1 - t)) + 'px';
        b.style.setProperty('--c', 'var(--ctp-' + BULBS[idx % BULBS.length] + ')');
        b.style.animationDelay = ((idx % 4) * 0.45) + 's';
        garland.appendChild(b);
        idx++;
      }
    }
  }
  function renderLights() {
    if (!state.lights) {
      if (garland) { garland.remove(); garland = null; }
      return;
    }
    if (!garland) {
      garland = el('div', 'joulu-garland');
      garland.setAttribute('aria-hidden', 'true');
      document.body.appendChild(garland);
    }
    layGarland();
  }
  var raf = 0;
  window.addEventListener('resize', function () {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(layGarland);
  });

  // ---------- Kytkimet ----------

  function renderToggles() {
    document.querySelectorAll('[data-joulu-toggle]').forEach(function (b) {
      var kind = b.getAttribute('data-joulu-toggle');
      var blocked = kind === 'snow' && reduced; // lumi on liikettä, joten se ei toimi, jos käyttäjä haluaa vähemmän liikettä
      var on = state[kind] && !blocked;
      b.setAttribute('aria-checked', String(on));
      b.setAttribute('aria-pressed', String(on));
      b.disabled = blocked;
      b.title = blocked ? 'Lumi on pois, koska käyttöjärjestelmäsi asetus vähentää liikettä' : '';
      var s = b.querySelector('[data-joulu-state]');
      if (s) {
        s.textContent = on ? 'on' : 'off';
        s.className = 'joulu-state ' + (on ? 'text-green' : 'text-overlay1');
      }
    });
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('.joulu-lapio') || e.target.closest('[data-joulu-shovel]')) { shovel(); return; }
    var b = e.target.closest('[data-joulu-toggle]');
    if (!b || b.disabled) return;
    var kind = b.getAttribute('data-joulu-toggle');
    state[kind] = !state[kind];
    store(kind, state[kind]);
    render();
  });

  function render() {
    renderSnow();
    renderLights();
    renderToggles();
  }

  // Yläpalkin joulu-valikko näkyy vain joulukaudella
  document.querySelectorAll('[data-joulu-menu]').forEach(function (m) {
    m.classList.remove('hidden');
    m.classList.add('flex', 'items-stretch');
  });
  render();
})();
