// Joulukalenteri: luukut, reaktiot ja joulutervehdykset haetaan API:sta (osoite data-api-attribuutissa).
// Palvelin päättää, mikä luukku on auki, eikä lukitun luukun sisältö ole sivulla ennen aikaansa.
// Selaimeen tallennetaan vain avatut luukut, nimimerkki ja satunnainen vierailijatunnus (reaktioita varten).
// Käyttäjän tekstit asetetaan aina textContentilla. Luukun teksti (body_html) on API:n siivoamaa markdownia,
// ja se siivotaan selaimessa vielä sallittujen tagien listalla (renderMarkdown).
(function () {
  'use strict';
  var root = document.getElementById('joulukalenteri');
  if (!root) return;
  var $ = function (s) { return root.querySelector(s); };
  var dialog = document.querySelector('[data-dialog]');
  var dialogBody = dialog.querySelector('[data-dialog-body]');
  var dialogTitle = dialog.querySelector('[data-dialog-title]');
  var YEAR = parseInt(root.getAttribute('data-year'), 10);
  var API = root.getAttribute('data-api').replace(/\/+$/, '');
  var REACTIONS = [
    { key: 'tahti', icon: '⭐', name: 'tähti' },
    { key: 'kuusi', icon: '🎄', name: 'kuusi' },
    { key: 'lahja', icon: '🎁', name: 'lahja' },
    { key: 'lumihiutale', icon: '❄️', name: 'lumihiutale' },
    { key: 'lumiukko', icon: '☃️', name: 'lumiukko' },
    { key: 'piparkakku', icon: '🍪', name: 'piparkakku' }
  ];
  var KEY_OPENED = 'joulukalenteri-' + YEAR + '-avatut';
  var KEY_NICK = 'joulukalenteri-nimimerkki'; // sama kaikille vuosille, ettei nimeä tarvitse kirjoittaa uudelleen
  var KEY_VISITOR = 'joulukalenteri-vieras';

  var grid = $('[data-grid]');
  var out = $('[data-out]');
  var nightsEl = $('[data-nights]');
  var progressEl = $('[data-progress]');
  var preEl = $('[data-pre]');
  var preCount = $('[data-pre-count]');
  var preBar = $('[data-pre-bar]');
  var mainEl = $('[data-main]');
  var loadingEl = $('[data-loading]');
  var errorEl = $('[data-error]');

  var today = 0; // API: 0 = ennen joulukuuta, 1..24 = päivä, 25 = joulun jälkeen
  var doors = {}; // päivä -> { day, position, openable }
  var opened = load(KEY_OPENED, []);
  var current = null; // dialogissa näkyvä luukku (API:n vastaus)
  var idleTimer = 0;
  var preTimer = 0;
  var opening = false;

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function promptSpans() {
    return '<span class="text-prompt">~/joulukalenteri</span> <span class="text-green">$</span> ';
  }
  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  // Vierailijatunnus: satunnainen uuid, jota käytetään vain reaktioiden tunnistamiseen (palvelin tallentaa siitä vain hashin)
  function visitorId() {
    var v = null;
    try { v = localStorage.getItem(KEY_VISITOR); } catch (e) {}
    if (!v) {
      v = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 3 | 8)).toString(16);
      });
      try { localStorage.setItem(KEY_VISITOR, v); } catch (e) {}
    }
    return v;
  }

  // Pyyntö API:in. Palauttaa { res, data } myös virhetilanteissa (data on {} jos vastaus ei ole JSONia).
  function request(path, opts) {
    opts = opts || {};
    var headers = { Accept: 'application/json', 'X-Visitor-Id': visitorId() };
    if (opts.body) headers['Content-Type'] = 'application/json';
    return fetch(API + path, {
      method: opts.method || 'GET',
      headers: headers,
      credentials: 'omit',
      cache: opts.method === 'POST' ? 'no-store' : 'default',
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) { return { res: res, data: data || {} }; });
    });
  }

  // ---------- Näkymä ----------

  // Joulukuussa Suomessa aina talviaika (UTC+2)
  function msToAdvent() { return Date.UTC(YEAR, 11, 1, 0, 0) - 2 * 3600 * 1000 - Date.now(); }
  function nightsToChristmas() {
    if (today === 0) {
      var fin = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Helsinki' }));
      return Math.round((Date.UTC(YEAR, 11, 24) - Date.UTC(fin.getFullYear(), fin.getMonth(), fin.getDate())) / 86400000);
    }
    return 24 - today;
  }
  function renderNights() {
    var n = nightsToChristmas();
    var text;
    if (n > 1) text = n + ' yötä jouluun';
    else if (n === 1) text = '1 yö jouluun';
    else if (n === 0) text = 'Tänään on jouluaatto';
    else text = 'Hyvää joulua!';
    nightsEl.textContent = text;
    nightsEl.hidden = false;
  }
  // Lasku 1.12. asti: aika (pv hh:mm:ss) ja edistymispalkki marraskuun alusta joulukuun alkuun
  function renderPre() {
    var left = Math.max(0, msToAdvent());
    var s = Math.floor(left / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600); s -= h * 3600;
    var m = Math.floor(s / 60); s -= m * 60;
    preCount.textContent = d + 'd ' + pad(h) + 'h ' + pad(m) + 'm ' + pad(s) + 's';
    var start = Date.UTC(YEAR, 10, 1, 0, 0) - 2 * 3600 * 1000;
    var end = Date.UTC(YEAR, 11, 1, 0, 0) - 2 * 3600 * 1000;
    var pct = Math.max(0, Math.min(100, Math.floor((Date.now() - start) / (end - start) * 100)));
    var filled = Math.round(pct / 100 * 24);
    preBar.textContent = '';
    preBar.appendChild(document.createTextNode('['));
    preBar.appendChild(el('span', 'text-green', new Array(filled + 1).join('#')));
    preBar.appendChild(el('span', 'text-overlay0', new Array(24 - filled + 1).join('.')));
    preBar.appendChild(document.createTextNode(']'));
    preBar.appendChild(el('span', 'ml-2 text-subtext1', pct + ' %'));
  }

  function stateOf(day) {
    if (opened.indexOf(day) === -1) return 'closed';
    if (day === today) return 'today';
    return day === 24 ? 'aatto' : 'open'; // avattu jouluaaton luukku on aina karkkitankotyylinen
  }

  function buildGrid(list) {
    grid.textContent = '';
    list.forEach(function (d) {
      var b = el('button', 'kal-door');
      b.type = 'button';
      b.setAttribute('data-day', d.day);
      b.appendChild(el('span', 'kal-n', pad(d.day)));
      b.appendChild(el('span', 'kal-s'));
      grid.appendChild(b);
    });
  }
  function updateGrid() {
    Array.prototype.forEach.call(grid.children, function (b) {
      var day = parseInt(b.getAttribute('data-day'), 10);
      var state = stateOf(day);
      b.setAttribute('data-state', state);
      b.setAttribute('aria-label', 'Luukku ' + day + (state === 'closed' ? ', avaamaton' : ', avattu'));
      b.lastChild.textContent = state === 'closed' ? 'false' : 'true';
    });
    renderProgress();
  }
  // Edistyminen: k/24 [###.....]
  function renderProgress() {
    var bar = '';
    var count = 0;
    for (var i = 1; i <= 24; i++) {
      if (opened.indexOf(i) !== -1) { bar += '#'; count++; } else bar += '.';
    }
    progressEl.textContent = '';
    progressEl.appendChild(el('span', 'text-green', count + '/24'));
    var meter = el('span', 'ml-2 whitespace-nowrap');
    meter.appendChild(document.createTextNode('['));
    meter.appendChild(el('span', 'text-green', bar.replace(/\./g, '')));
    meter.appendChild(el('span', 'text-overlay0', bar.replace(/#/g, '')));
    meter.appendChild(document.createTextNode(']'));
    progressEl.appendChild(meter);
  }

  // Pysyvä kehoterivi ruudukon alla: odotustilassa vilkkuva kursori, komennon jälkeen komento ja vastaus
  function printIdle() {
    clearTimeout(idleTimer);
    out.innerHTML = promptSpans() + '<span class="cursor" aria-hidden="true"></span>';
  }
  function printCommand(cmd, result, cls, keep) {
    clearTimeout(idleTimer);
    out.textContent = '';
    var line = el('span');
    line.innerHTML = promptSpans();
    line.appendChild(document.createTextNode(cmd));
    out.appendChild(line);
    out.appendChild(document.createElement('br'));
    out.appendChild(el('span', cls, result));
    if (!keep) idleTimer = setTimeout(printIdle, 5000);
  }

  function renderView() {
    loadingEl.hidden = true;
    errorEl.hidden = true;
    renderNights();
    clearInterval(preTimer);
    if (today === 0) {
      preEl.hidden = false;
      mainEl.hidden = true;
      progressEl.hidden = true;
      renderPre();
      preTimer = setInterval(renderPre, 1000);
    } else {
      preEl.hidden = true;
      mainEl.hidden = false;
      progressEl.hidden = false;
      updateGrid();
      printIdle();
    }
  }

  function loadCalendar() {
    loadingEl.hidden = false;
    errorEl.hidden = true;
    request('/' + YEAR).then(function (r) {
      if (!r.res.ok || !r.data || !r.data.doors) return Promise.reject(new Error('calendar'));
      today = parseInt(r.data.today, 10) || 0;
      doors = {};
      var list = r.data.doors.slice().sort(function (a, b) { return a.position - b.position; });
      list.forEach(function (d) { doors[d.day] = d; });
      buildGrid(list);
      renderView();
      openFromHash();
    }).catch(function () {
      loadingEl.hidden = true;
      errorEl.hidden = false;
    });
  }
  errorEl.querySelector('[data-retry]').addEventListener('click', loadCalendar);

  // ---------- Luukku ----------

  function safeLink(url) {
    if (!url) return null;
    if (url.charAt(0) === '/' && url.charAt(1) !== '/') return url; // sivuston oma polku
    try {
      var u = new URL(url);
      return (u.protocol === 'https:' || u.protocol === 'http:') ? u.href : null;
    } catch (e) { return null; }
  }

  var dateFormat;
  try {
    dateFormat = new Intl.DateTimeFormat('fi-FI', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Helsinki' });
  } catch (e) { dateFormat = null; }
  function formatTime(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime()) || !dateFormat) return '';
    return dateFormat.format(d);
  }

  function renderReactions(group, data) {
    group.textContent = '';
    var mineList = data.mine || [];
    REACTIONS.forEach(function (r) {
      var mine = mineList.indexOf(r.key) !== -1;
      var count = (data.reactions && data.reactions[r.key]) || 0;
      var b = el('button', 'kal-r');
      b.type = 'button';
      b.setAttribute('data-r', r.key);
      b.setAttribute('aria-pressed', String(mine));
      b.setAttribute('aria-label', r.name + ', ' + count);
      b.appendChild(el('span', '', r.icon));
      b.appendChild(el('span', 'ml-1', String(count)));
      group.appendChild(b);
    });
  }

  function renderComments(list, data) {
    list.textContent = '';
    var items = data.comments || [];
    if (!items.length) {
      list.appendChild(el('p', 'mt-2 text-meta', 'Ei vielä tervehdyksiä. Ole ensimmäinen!'));
      return;
    }
    items.forEach(function (c) {
      var item = el('div', 'kal-comment');
      var who = el('div', 'text-xs text-meta');
      who.appendChild(el('span', 'font-bold text-teal', c.nickname));
      var t = formatTime(c.created_at);
      if (t) who.appendChild(document.createTextNode(' · ' + t));
      item.appendChild(who);
      item.appendChild(el('div', 'whitespace-pre-line wrap-break-word', c.message));
      if (c.reply) {
        var reply = el('div', 'mt-1 border-l-2 border-mauve pl-2 whitespace-pre-line wrap-break-word');
        reply.appendChild(el('span', 'font-bold text-mauve', 'Marko: '));
        reply.appendChild(document.createTextNode(c.reply));
        item.appendChild(reply);
      }
      list.appendChild(item);
    });
  }

  // Luukun teksti tulee API:sta valmiiksi renderöitynä ja siivottuna HTML:nä (body_html).
  // Siivotaan se vielä täällä: vain sallitut tagit, ei attribuutteja paitsi linkkien href/rel/target ja koodin language-luokka.
  var MD_TAGS = { P: 1, BR: 1, STRONG: 1, EM: 1, CODE: 1, PRE: 1, A: 1, UL: 1, OL: 1, LI: 1, BLOCKQUOTE: 1, H3: 1, H4: 1, H5: 1, H6: 1, HR: 1, DEL: 1 };
  var MD_COLORS = /^c-(red|green|yellow|peach|blue|flag-blue|white|text)$/;
  function cleanNode(node, out) {
    Array.prototype.forEach.call(node.childNodes, function (n) {
      if (n.nodeType === 3) { out.appendChild(document.createTextNode(n.nodeValue)); return; }
      if (n.nodeType !== 1) return;
      if (n.tagName === 'SPAN') {
        // Värit ovat sallittuja vain koodilohkon sisällä (ASCII-taide) ja vain valkolistan luokilla
        var sc = n.getAttribute('class') || '';
        if (MD_COLORS.test(sc) && n.closest('pre')) {
          var sp = document.createElement('span');
          sp.className = sc;
          cleanNode(n, sp);
          out.appendChild(sp);
        } else {
          cleanNode(n, out);
        }
        return;
      }
      if (!MD_TAGS[n.tagName]) { cleanNode(n, out); return; } // tuntematon tagi: säilytetään vain sen teksti
      var c = document.createElement(n.tagName.toLowerCase());
      if (n.tagName === 'A') {
        var href = n.getAttribute('href') || '';
        if (/^https?:\/\//i.test(href)) {
          c.href = href;
          c.rel = 'noopener noreferrer';
          c.target = '_blank';
        } else if (/^\/(?!\/)/.test(href)) {
          c.href = href;
        }
      } else if (n.tagName === 'CODE') {
        var m = /(?:^|\s)(language-[a-z0-9_+-]+)/i.exec(n.getAttribute('class') || '');
        if (m) c.className = m[1];
      }
      cleanNode(n, c);
      out.appendChild(c);
    });
    return out;
  }
  // Kopioitavaan tekstiin ei tule värejä, joten valkoisen (c-white) täyteblokit vaihdetaan ░-merkkiin.
  // Silloin täytetyn ja valkoisen alueen ero säilyy pelkkinä merkkeinä (█ ja ░).
  function plainText(node) {
    var s = '';
    Array.prototype.forEach.call(node.childNodes, function (n) {
      if (n.nodeType === 3) s += n.nodeValue;
      else if (n.nodeType === 1) {
        var t = plainText(n);
        s += n.classList.contains('c-white') ? t.replace(/█/g, '░') : t;
      }
    });
    return s;
  }
  function renderMarkdown(html) {
    var tpl = document.createElement('template');
    tpl.innerHTML = html;
    var box = el('div', 'kal-teksti mt-2 text-text wrap-break-word');
    cleanNode(tpl.content, box);
    // Koodilohkoille (ASCII-taide) kopiointipainike: kopioi pelkät merkit ilman värejä
    Array.prototype.forEach.call(box.querySelectorAll('pre'), function (pre) {
      var wrap = el('div', 'kal-pre');
      var btn = el('button', 'kal-kopioi', 'kopioi');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Kopioi koodilohkon teksti leikepöydälle');
      btn.addEventListener('click', function () {
        var text = plainText(pre).replace(/\n$/, '');
        var done = function (ok) {
          btn.textContent = ok ? 'kopioitu' : 'ei onnistunut';
          setTimeout(function () { btn.textContent = 'kopioi'; }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
        } else {
          done(false);
        }
      });
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      wrap.appendChild(btn);
    });
    return box;
  }

  function renderDoor(data) {
    var day = data.day;
    dialogBody.textContent = '';
    dialogTitle.textContent = 'cat luukku_' + pad(day) + '.md';
    dialog.setAttribute('data-aatto', day === 24 ? 'true' : 'false'); // jouluaaton luukun ikkunassa on karkkitankoreunus

    var head = el('p', 'mb-4 whitespace-nowrap overflow-x-auto');
    head.innerHTML = promptSpans() + '<span class="text-text">cat luukku_' + pad(day) + '.md</span>';
    dialogBody.appendChild(head);

    dialogBody.appendChild(el('h2', 'text-lg font-bold text-red wrap-break-word', 'Luukku ' + day + ': ' + data.title));
    if (data.body_html) {
      dialogBody.appendChild(renderMarkdown(data.body_html));
    } else if (data.body) {
      // Varalla: vanha vastaus ilman body_html-kenttää näytetään pelkkänä tekstinä
      data.body.split(/\n{2,}/).forEach(function (para) {
        if (para.trim()) dialogBody.appendChild(el('p', 'mt-2 text-text whitespace-pre-line wrap-break-word', para.trim()));
      });
    }

    if (data.image && data.image.url) {
      // Sama kuvaikkuna kuin artikkeleissa (.sisalto figure.kuva) ja sama lightbox (window.hugoLightbox)
      var im = data.image;
      var dim = im.width && im.height ? im.width + '×' + im.height : '';
      var wrap = el('div', 'sisalto');
      var fig = el('figure', 'kuva');
      var bar = el('span', 'kuva-ikkuna');
      bar.setAttribute('aria-hidden', 'true');
      bar.appendChild(el('span', 'kuva-nimi', im.name || 'kuva'));
      if (dim) bar.appendChild(el('span', 'kuva-koko', dim));
      fig.appendChild(bar);
      var img = el('img', 'lb-zoom');
      img.src = im.url;
      img.alt = im.alt || '';
      img.decoding = 'async';
      if (im.width && im.height) { img.width = parseInt(im.width, 10); img.height = parseInt(im.height, 10); }
      img.addEventListener('click', function () {
        if (window.hugoLightbox) {
          window.hugoLightbox([{ src: im.url, alt: im.alt || '', caption: im.caption || im.alt || '', meta: [im.name, dim].filter(Boolean).join(' · ') }], 0);
        }
      });
      fig.appendChild(img);
      if (im.caption) fig.appendChild(el('figcaption', '', im.caption));
      wrap.appendChild(fig);
      dialogBody.appendChild(wrap);
    }

    if (data.embed && data.embed.provider === 'youtube' && /^[A-Za-z0-9_-]{6,20}$/.test(data.embed.id || '')) {
      // Ulkopuolinen palvelu ladataan vasta klikkauksella (youtube-nocookie)
      var emb = data.embed;
      var box = el('div', 'kal-embed');
      var go = el('button', 'kal-embed-go');
      go.type = 'button';
      go.appendChild(el('span', 'kal-embed-play', '▶'));
      go.appendChild(el('span', '', emb.title || 'Video'));
      go.appendChild(el('span', 'text-xs text-meta', 'Lataa videon YouTubesta (evästeetön upotus) klikkaamalla'));
      go.addEventListener('click', function () {
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + emb.id + '?autoplay=1&rel=0';
        f.title = emb.title || 'Video';
        f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        f.allowFullscreen = true;
        f.referrerPolicy = 'strict-origin-when-cross-origin';
        box.textContent = '';
        box.appendChild(f);
      });
      box.appendChild(go);
      dialogBody.appendChild(box);
    }

    var href = data.link && safeLink(data.link.url);
    if (href) {
      var a = el('a', 'kal-link', (data.link.label || 'Avaa linkki') + ' →');
      a.href = href;
      if (href.charAt(0) !== '/') { a.target = '_blank'; a.rel = 'noopener'; }
      dialogBody.appendChild(a);
    } else if (data.pending) {
      dialogBody.appendChild(el('p', 'mt-3 text-peach', 'Artikkeli julkaistaan pian.'));
    }

    var reactWrap = el('div', 'kal-react');
    reactWrap.setAttribute('role', 'group');
    reactWrap.setAttribute('aria-label', 'Reaktiot');
    renderReactions(reactWrap, data);
    dialogBody.appendChild(reactWrap);

    var cWrap = el('div', 'mt-5');
    cWrap.appendChild(el('h3', 'font-bold', 'Joulutervehdykset'));
    var list = el('div');
    renderComments(list, data);
    cWrap.appendChild(list);
    cWrap.appendChild(buildForm(day));
    dialogBody.appendChild(cWrap);
  }

  // ---------- Tervehdyslomake ----------

  var token = null; // { value, readyAt, expiresAt }
  var tokenRequest = null;
  function fetchToken() {
    if (tokenRequest) return tokenRequest;
    tokenRequest = request('/form-token').then(function (r) {
      if (!r.res.ok || !r.data.form_token) return Promise.reject(new Error('token'));
      var now = Date.now();
      token = {
        value: r.data.form_token,
        readyAt: now + (parseInt(r.data.min_seconds, 10) || 3) * 1000,
        expiresAt: now + ((parseInt(r.data.expires_in, 10) || 7200) - 60) * 1000
      };
      return token;
    }).then(function (t) { tokenRequest = null; return t; }, function (err) { tokenRequest = null; token = null; throw err; });
    return tokenRequest;
  }
  function ensureToken() {
    if (token && Date.now() < token.expiresAt) return Promise.resolve(token);
    return fetchToken();
  }

  function buildForm(day) {
    var form = el('form', 'mt-4 grid gap-2');
    form.setAttribute('aria-label', 'Jätä joulutervehdys');
    form.noValidate = true;
    form.innerHTML = '<p class="font-bold">Jätä joulutervehdys</p>' +
      '<label class="grid gap-1 text-subtext0">Nimimerkki<input name="nickname" maxlength="40" autocomplete="nickname" class="kal-input"></label>' +
      '<label class="grid gap-1 text-subtext0">Tervehdys<textarea name="message" rows="3" maxlength="2000" class="kal-input"></textarea></label>' +
      '<div class="absolute -left-[9999px]" aria-hidden="true"><label>Älä täytä tätä<input name="website" tabindex="-1" autocomplete="off"></label></div>' +
      '<div><button type="submit" class="kal-submit">Lähetä tervehdys</button> <span class="text-xs text-meta" data-form-msg role="status">Tervehdykset hyväksytään ennen julkaisua.</span></div>';
    var msg = form.querySelector('[data-form-msg]');
    var btn = form.querySelector('button[type="submit"]');
    var sending = false;
    form.elements.nickname.value = load(KEY_NICK, '');
    fetchToken().catch(function () {}); // haetaan etukäteen, jolloin odotusaika (min_seconds) on jo kulunut

    function setMsg(text, isError) {
      msg.textContent = text;
      msg.className = 'text-xs ' + (isError ? 'text-red' : 'text-meta');
    }
    function retryText(res) {
      var s = parseInt(res.headers.get('Retry-After'), 10);
      if (!isFinite(s) || s <= 0) return '';
      return s < 90 ? ' Yritä uudelleen noin ' + s + ' sekunnin kuluttua.' : ' Yritä uudelleen noin ' + Math.ceil(s / 60) + ' minuutin kuluttua.';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;
      var nick = form.elements.nickname.value.trim();
      var message = form.elements.message.value.trim();
      if (!nick || !message) { setMsg('Kirjoita nimimerkki ja tervehdys.', true); return; }
      sending = true;
      btn.disabled = true;
      setMsg('Lähetetään…', false);
      ensureToken().then(function (t) {
        var remaining = t.readyAt - Date.now();
        return remaining > 0 ? wait(remaining + 100).then(function () { return t; }) : t;
      }).then(function (t) {
        return request('/' + YEAR + '/' + day + '/comments', {
          method: 'POST',
          body: { nickname: nick, message: message, website: form.elements.website.value, form_token: t.value }
        });
      }).then(function (r) {
        var res = r.res;
        var data = r.data;
        if (res.status === 202 || res.status === 201 || res.status === 200) {
          save(KEY_NICK, nick);
          form.elements.message.value = '';
          token = null;
          fetchToken().catch(function () {});
          setMsg(data.message || 'Kiitos tervehdyksestä! Se julkaistaan hyväksynnän jälkeen.', false);
          return;
        }
        if (res.status === 422) {
          var errs = data.errors || {};
          if (errs.form_token) {
            token = null;
            fetchToken().catch(function () {});
            setMsg('Lomake ehti vanhentua. Lähetä tervehdys uudelleen, tekstisi on tallessa.', true);
            return;
          }
          var first = Object.keys(errs).map(function (k) { return errs[k][0]; })[0];
          setMsg(first || data.message || 'Tarkista kentät.', true);
          return;
        }
        if (res.status === 429) {
          setMsg('Liian monta tervehdystä.' + retryText(res), true);
          return;
        }
        if (res.status === 403) { setMsg('Tämä luukku on lukossa.', true); return; }
        token = null;
        fetchToken().catch(function () {});
        setMsg('Lähetys ei onnistunut. Tekstisi on tallessa, yritä hetken kuluttua uudelleen.', true);
      }).catch(function () {
        token = null;
        setMsg('Yhteys palvelimeen ei onnistunut. Tekstisi on tallessa, tarkista verkkoyhteys ja yritä uudelleen.', true);
      }).then(function () {
        sending = false;
        btn.disabled = false;
      });
    });
    return form;
  }

  // ---------- Luukun avaus ----------

  function openDoor(day) {
    var d = doors[day];
    if (!d || opening) return;
    if (!d.openable) {
      printCommand('avaa ' + day, 'bash: luukku ' + day + ': lukossa', 'text-red');
      return;
    }
    opening = true;
    printCommand('avaa ' + day, 'luukku ' + pad(day) + ': avataan…', 'text-subtext0', true);
    request('/' + YEAR + '/' + day).then(function (r) {
      if (r.res.status === 403) {
        d.openable = false;
        printCommand('avaa ' + day, 'bash: luukku ' + day + ': lukossa', 'text-red');
        return;
      }
      if (r.res.status === 404) {
        printCommand('avaa ' + day, 'luukku ' + pad(day) + ': sisältö ei ole vielä valmis', 'text-peach');
        return;
      }
      if (!r.res.ok || !r.data || !r.data.title) return Promise.reject(new Error('door'));
      if (opened.indexOf(day) === -1) {
        opened.push(day);
        save(KEY_OPENED, opened);
      }
      printCommand('avaa ' + day, 'luukku ' + pad(day) + ': avattu', 'text-green', true);
      updateGrid();
      current = r.data;
      renderDoor(current);
      dialogBody.scrollTop = 0;
      if (!dialog.open) dialog.showModal();
      try { history.replaceState(null, '', '#luukku-' + day); } catch (e) {}
    }).catch(function () {
      printCommand('avaa ' + day, 'luukku ' + pad(day) + ': avaus ei onnistunut, yritä uudelleen', 'text-red');
    }).then(function () { opening = false; });
  }

  function onClosed() {
    var day = current && current.day;
    current = null;
    printIdle();
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    var b = day && grid.querySelector('[data-day="' + day + '"]');
    if (b) b.focus({ preventScroll: true });
  }

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-day]');
    if (b) openDoor(parseInt(b.getAttribute('data-day'), 10));
  });

  dialog.addEventListener('close', onClosed);
  dialog.addEventListener('click', function (e) {
    // Tausta (dialog-elementti itse) tai sulkunappi sulkee
    if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
  });

  // Reaktio: päivitetään heti ja vahvistetaan API:n vastauksella
  dialogBody.addEventListener('click', function (e) {
    var b = e.target.closest('[data-r]');
    if (!b || !current || b.disabled) return;
    var key = b.getAttribute('data-r');
    var group = b.parentNode;
    var day = current.day;
    var mineList = (current.mine || []).slice();
    var active = mineList.indexOf(key) === -1;
    var before = { reactions: JSON.parse(JSON.stringify(current.reactions || {})), mine: mineList.slice() };
    // Optimistinen päivitys
    var after = { reactions: JSON.parse(JSON.stringify(before.reactions)), mine: mineList.slice() };
    after.reactions[key] = Math.max(0, (after.reactions[key] || 0) + (active ? 1 : -1));
    if (active) after.mine.push(key); else after.mine.splice(after.mine.indexOf(key), 1);
    current.reactions = after.reactions;
    current.mine = after.mine;
    renderReactions(group, current);
    var again = group.querySelector('[data-r="' + key + '"]');
    if (again) again.focus({ preventScroll: true });

    request('/' + YEAR + '/' + day + '/reactions', { method: 'POST', body: { reaction: key, active: active } }).then(function (r) {
      if (!current || current.day !== day) return;
      if (r.res.ok && r.data.reactions) {
        current.reactions = r.data.reactions;
        current.mine = r.data.mine || [];
      } else {
        current.reactions = before.reactions; // palautetaan, jos tallennus ei onnistunut
        current.mine = before.mine;
      }
      renderReactions(group, current);
      var f = group.querySelector('[data-r="' + key + '"]');
      if (f && document.activeElement === document.body) f.focus({ preventScroll: true });
    }).catch(function () {
      if (!current || current.day !== day) return;
      current.reactions = before.reactions;
      current.mine = before.mine;
      renderReactions(group, current);
    });
  });

  // Suora linkki luukkuun (#luukku-5) avaa luukun, jos se on jo avattavissa
  function openFromHash() {
    var m = /^#luukku-(\d{1,2})$/.exec(location.hash);
    if (m) openDoor(parseInt(m[1], 10));
  }

  loadCalendar();
})();
