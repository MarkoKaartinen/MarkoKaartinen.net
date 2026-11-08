/*
 * Kommentit Mastodonista: artikkelin julkaisupostauksen vastaukset haetaan instanssin julkisesta API:sta
 * (/api/v1/statuses/:id ja /context, ei tokenia). Vastaukset näytetään puuna, omat vastaukset merkitään.
 * Puhdistus ja yhteiset osat ovat tiedostossa mastodon-lib.js.
 */
(function () {
  'use strict';

  var L = window.MastoLib;
  var root = document.getElementById('keskustelu');
  if (!L || !root) return;

  var instance = (root.getAttribute('data-instance') || '').replace(/\/$/, '');
  var statusId = root.getAttribute('data-status');
  var authorId = root.getAttribute('data-author');
  var list = root.querySelector('[data-list]');
  var iconBox = root.querySelector('template[data-icons]');
  var infoEl = root.querySelector('[data-info]');
  var copyBtn = root.querySelector('[data-copy]');
  var postLink = root.querySelector('[data-post-link]');
  if (!instance || !statusId || !list) return;

  var el = L.el;
  // Kapealla näytöllä ketju näytetään suorana listana (ei sisennystä), ja viiva kulkee avatarista avatariin
  var narrowQuery = window.matchMedia ? window.matchMedia('(max-width: 639px)') : null;
  var NARROW = !!(narrowQuery && narrowQuery.matches);
  var lastData = null;
  var MAX_DEPTH = 4;

  function api(path) {
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timeout = controller ? setTimeout(function () { controller.abort(); }, 8000) : null;
    return fetch(instance + '/api/v1/statuses/' + encodeURIComponent(statusId) + path, {
      headers: { Accept: 'application/json' },
      signal: controller ? controller.signal : undefined
    }).then(function (r) {
      if (timeout) clearTimeout(timeout);
      return r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status));
    });
  }

  var RINGS = ['rosewater', 'flamingo', 'pink', 'red', 'peach', 'yellow', 'green', 'teal', 'sky', 'blue', 'lavender'];

  // Sama tili saa aina saman renkaan avatarin ympärille
  function ringFor(accountId) {
    var n = 0;
    String(accountId || '').split('').forEach(function (ch) { n = (n * 31 + ch.charCodeAt(0)) >>> 0; });
    return RINGS[n % RINGS.length];
  }

  // Luku ja ikoni (ikonit tulevat sivun <template>-pohjasta)
  function stat(key, n, one, many) {
    var s = el('span', 'komm-stat');
    s.title = L.plural(n, one, many);
    var tpl = iconBox && iconBox.content.querySelector('[data-icon="' + key + '"]');
    if (tpl) {
      var icon = tpl.firstElementChild.cloneNode(true);
      s.appendChild(icon);
    }
    s.appendChild(el('span', null, String(n)));
    return s;
  }

  function renderReply(status, children, depth) {
    var li = el('li', 'komm' + (children && children.length ? ' komm-has-children' : ''));
    var art = el('article', 'komm-body');
    var acc = status.account || {};
    var isAuthor = !!(authorId && acc.id === authorId);
    if (isAuthor) art.classList.add('komm-author');
    art.style.setProperty('--ring', 'var(--ctp-' + (isAuthor ? 'mauve' : ringFor(acc.id)) + ')');

    if (L.isHttps(acc.avatar_static || acc.avatar)) {
      var img = el('img', 'komm-avatar');
      img.src = acc.avatar_static || acc.avatar;
      img.alt = '';
      img.width = 40;
      img.height = 40;
      img.loading = 'lazy';
      img.decoding = 'async';
      art.appendChild(img);
    } else {
      art.appendChild(el('span', 'komm-avatar'));
    }

    var head = el('header', 'komm-head');
    var who = el('a', 'komm-who');
    who.href = L.isHttp(acc.url) ? acc.url : status.url;
    who.target = '_blank';
    who.rel = 'noopener noreferrer';
    who.appendChild(L.textToNode(acc.display_name || acc.username || acc.acct, acc.emojis, 'span', 'komm-name'));
    head.appendChild(who);
    if (isAuthor) {
      var mark = el('span', 'komm-author-mark');
      mark.title = 'Kirjoittaja';
      mark.setAttribute('aria-label', 'Kirjoittaja');
      var tpl = iconBox && iconBox.content.querySelector('[data-icon="author"]');
      if (tpl) mark.appendChild(tpl.firstElementChild.cloneNode(true));
      head.appendChild(mark);
    }
    head.appendChild(el('span', 'komm-acct', '@' + (acc.acct || '')));
    head.appendChild(el('span', 'komm-dot', '\u00b7'));

    var time = el('time');
    time.dateTime = status.created_at;
    time.textContent = L.dateFormat.format(new Date(status.created_at));
    var timeLink = el('a', 'komm-time');
    timeLink.href = status.url;
    timeLink.target = '_blank';
    timeLink.rel = 'noopener noreferrer';
    timeLink.appendChild(time);
    head.appendChild(timeLink);
    art.appendChild(head);

    art.appendChild(L.renderBody(status));

    var likes = status.favourites_count || 0;
    var boosts = status.reblogs_count || 0;
    if (likes || boosts) {
      var stats = el('div', 'komm-stats');
      if (boosts) stats.appendChild(stat('boosts', boosts, 'boostaus', 'boostausta'));
      if (likes) stats.appendChild(stat('likes', likes, 'tykkäys', 'tykkäystä'));
      art.appendChild(stats);
    }
    li.appendChild(art);

    if (children && children.length) {
      var ul = el('ul', 'komm-list' + (depth >= MAX_DEPTH ? ' komm-flat' : ''));
      children.forEach(function (c) { ul.appendChild(renderReply(c.status, c.children, depth + 1)); });
      li.appendChild(ul);
    }
    return li;
  }

  // Kapea näyttö: juurikommentti ja sen kaikki vastaukset peräkkäin samassa sarakkeessa (järjestys kuten puussa, ylhäältä alas)
  function renderThreadFlat(root) {
    var all = [];
    (function walk(node) {
      node.children.forEach(function (c) { all.push(c); walk(c); });
    })(root);
    var li = renderReply(root.status, [], 1);
    if (all.length) {
      li.classList.add('komm-next');
      var ul = el('ul', 'komm-list komm-flat');
      all.forEach(function (c, i) {
        var item = renderReply(c.status, [], 2);
        if (i < all.length - 1) item.classList.add('komm-next');
        ul.appendChild(item);
      });
      li.appendChild(ul);
    }
    return li;
  }

  function buildTree(descendants) {
    var nodes = {};
    descendants.forEach(function (s) { nodes[s.id] = { status: s, children: [] }; });
    var roots = [];
    descendants.forEach(function (s) {
      var parent = nodes[s.in_reply_to_id];
      if (parent) parent.children.push(nodes[s.id]);
      else roots.push(nodes[s.id]);
    });
    return roots;
  }

  // Luvut artikkelin tietoriville (vastaukset, boostaukset, tykkäykset)
  function showStats(status, totalReplies) {
    // replies_count on vain suorat vastaukset, joten näytetään koko ketjun vastausten määrä
    var counts = {
      replies: [totalReplies, 'vastaus', 'vastausta'],
      boosts: [status.reblogs_count || 0, 'boostaus', 'boostausta'],
      likes: [status.favourites_count || 0, 'tykkäys', 'tykkäystä']
    };
    document.querySelectorAll('[data-masto-meta]').forEach(function (meta) {
      meta.querySelectorAll('[data-masto-item]').forEach(function (item) {
        var c = counts[item.getAttribute('data-masto-item')];
        if (!c) return;
        item.title = L.plural(c[0], c[1], c[2]);
        item.querySelector('[data-count]').textContent = String(c[0]);
      });
      meta.hidden = false;
    });
    if (postLink && L.isHttp(status.url)) postLink.href = status.url;
    if (copyBtn && L.isHttp(status.url)) copyBtn.setAttribute('data-url', status.url);
  }

  function setInfo(text) {
    if (!infoEl) return;
    infoEl.hidden = !text;
    infoEl.textContent = text || '';
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var url = copyBtn.getAttribute('data-url') || (postLink && postLink.href);
      if (!url || !navigator.clipboard) return;
      navigator.clipboard.writeText(url).then(function () {
        var old = copyBtn.textContent;
        copyBtn.textContent = 'kopioitu!';
        setTimeout(function () { copyBtn.textContent = old; }, 1500);
      });
    });
  }

  // Välimuisti: tuore tulos (alle 2 min) näytetään sellaisenaan, vanhempi näytetään heti ja päivitetään taustalla.
  // Jos haku epäonnistuu, vanha tulos jää näkyviin. Välimuisti on selaimen localStoragessa, vain tälle viestille.
  var CACHE_KEY = 'mastodon-thread:' + instance + ':' + statusId;
  var FRESH_MS = 2 * 60 * 1000;
  var MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

  function render(status, rawDescendants) {
    lastData = { status: status, raw: rawDescendants };
    var descendants = (rawDescendants || []).filter(function (s) {
      return s.visibility === 'public' || s.visibility === 'unlisted';
    });
    showStats(status, descendants.length);
    list.textContent = '';
    if (!descendants.length) {
      setInfo('Ei vielä vastauksia. Ole ensimmäinen!');
      return;
    }
    setInfo('');
    buildTree(descendants).forEach(function (n) {
      list.appendChild(NARROW ? renderThreadFlat(n) : renderReply(n.status, n.children, 1));
    });
  }

  // Jos näytön leveys ylittää rajan (esim. puhelimen kääntö), ketju piirretään uudelleen sopivassa asettelussa
  if (narrowQuery && narrowQuery.addEventListener) {
    narrowQuery.addEventListener('change', function (e) {
      NARROW = e.matches;
      if (lastData) render(lastData.status, lastData.raw);
    });
  }

  var shown = false;
  var cachedAt = 0;
  try {
    var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && cached.status && Array.isArray(cached.descendants) && Date.now() - cached.at < MAX_AGE_MS) {
      render(cached.status, cached.descendants);
      shown = true;
      cachedAt = cached.at;
    }
  } catch (e) { /* ei välimuistia */ }

  if (shown && Date.now() - cachedAt < FRESH_MS) return;

  Promise.all([api(''), api('/context')]).then(function (res) {
    var status = res[0];
    var descendants = res[1].descendants || [];
    render(status, descendants);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), status: status, descendants: descendants }));
    } catch (e) { /* tila loppu tai estetty */ }
  }).catch(function () {
    if (!shown) setInfo('Vastauksia ei voitu ladata juuri nyt. Keskustelu löytyy Mastodonista.');
  });
})();
