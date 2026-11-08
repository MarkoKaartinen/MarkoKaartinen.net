/*
 * Mastodon-syöte: haetaan tilin julkiset viestit suoraan instanssin julkisesta API:sta (ei tokenia).
 * Näyttää tekstit, boostit, kuvat, videot, äänet, kyselyt, linkkikortit, sisältövaroitukset ja omat emojit.
 * Puhdistus ja yhteiset osat ovat tiedostossa mastodon-lib.js.
 */
(function () {
  'use strict';

  var L = window.MastoLib;
  var root = document.getElementById('mastodon-feed');
  if (!L || !root) return;

  var instance = (root.getAttribute('data-instance') || '').replace(/\/$/, '');
  var account = root.getAttribute('data-account');
  var limit = parseInt(root.getAttribute('data-limit') || '6', 10);
  var list = root.querySelector('[data-list]');
  var statusEl = root.querySelector('[data-status]');
  if (!instance || !account || !list) return;

  var el = L.el;
  var CACHE_KEY = 'mastodon-feed:' + instance + ':' + account;
  var URL_API = instance + '/api/v1/accounts/' + encodeURIComponent(account) +
    '/statuses?exclude_replies=true&limit=' + Math.min(40, limit * 4);
  var iconBox = root.querySelector('template[data-icons]');
  var clamps = [];

  function icon(key) {
    var tpl = iconBox && iconBox.content.querySelector('[data-icon="' + key + '"]');
    return tpl ? tpl.firstElementChild.cloneNode(true) : null;
  }

  // Luku ja ikoni (ikonit tulevat sivun <template>-pohjasta)
  function stat(key, n, one, many) {
    var s = el('span', 'komm-stat');
    s.title = L.plural(n, one, many);
    var ic = icon(key);
    if (ic) s.appendChild(ic);
    s.appendChild(el('span', null, String(n)));
    return s;
  }

  // Pitkä viesti (teksti ja pikkukuvat) katkaistaan CSS:n max-heightilla, ja "näytä lisää" näkyy vain jos sisältö ylittää rajan.
  // Kuvat pysyvät pikkukuvina myös auki, ja ne avautuvat lightboxiin.
  function measure() {
    clamps.forEach(function (c) {
      if (c.open) return;
      var over = c.box.scrollHeight > c.box.clientHeight + 2;
      c.box.classList.toggle('masto-clamped', over);
      c.more.hidden = !over;
    });
  }

  function renderPost(status) {
    var isBoost = !!status.reblog;
    var post = isBoost ? status.reblog : status;
    var art = el('article', 'masto-post' + (isBoost ? ' masto-is-boost' : ''));

    var meta = el('div', 'masto-meta');
    var time = el('time');
    time.dateTime = status.created_at;
    time.textContent = L.dateFormat.format(new Date(status.created_at));
    var timeLink = el('a');
    timeLink.href = status.url || post.url;
    timeLink.target = '_blank';
    timeLink.rel = 'noopener noreferrer';
    timeLink.appendChild(time);
    meta.appendChild(timeLink);
    art.appendChild(meta);

    if (isBoost) {
      var by = el('div', 'masto-boost');
      var bi = icon('boosts');
      if (bi) by.appendChild(bi);
      by.appendChild(document.createTextNode('Boostasi '));
      var who = el('a', null, '@' + post.account.acct);
      who.href = post.account.url;
      who.target = '_blank';
      who.rel = 'noopener noreferrer';
      by.appendChild(who);
      art.appendChild(by);
    }

    var body = L.renderBody(post);
    art.appendChild(body);
    var box = body.classList.contains('masto-content') ? body : body.querySelector('.masto-content');
    if (box) {
      box.classList.add('masto-clamp');
      var more = el('button', 'masto-more', 'näytä lisää');
      more.type = 'button';
      more.hidden = true;
      more.setAttribute('aria-expanded', 'false');
      var clamp = { box: box, more: more, open: false };
      more.addEventListener('click', function () {
        clamp.open = !clamp.open;
        box.classList.toggle('masto-clamp', !clamp.open);
        box.classList.remove('masto-clamped');
        more.textContent = clamp.open ? 'näytä vähemmän' : 'näytä lisää';
        more.setAttribute('aria-expanded', clamp.open ? 'true' : 'false');
        if (!clamp.open) measure();
      });
      art.appendChild(more);
      clamps.push(clamp);
    }

    var replies = post.replies_count || 0;
    var boosts = post.reblogs_count || 0;
    var likes = post.favourites_count || 0;
    if (replies || boosts || likes) {
      var stats = el('div', 'komm-stats masto-stats');
      if (replies) stats.appendChild(stat('replies', replies, 'vastaus', 'vastausta'));
      if (boosts) stats.appendChild(stat('boosts', boosts, 'boostaus', 'boostausta'));
      if (likes) stats.appendChild(stat('likes', likes, 'tykkäys', 'tykkäystä'));
      art.appendChild(stats);
    }
    return art;
  }

  function render(statuses) {
    var visible = statuses.filter(function (s) {
      var p = s.reblog || s;
      return s.visibility === 'public' && (p.visibility === 'public') && (p.content || (p.media_attachments || []).length);
    }).slice(0, limit);

    if (!visible.length) return false;
    list.textContent = '';
    clamps = [];
    visible.forEach(function (s) {
      var item = el('div', 'masto-item');
      item.appendChild(renderPost(s));
      list.appendChild(item);
    });
    if (statusEl) statusEl.hidden = true;
    clamps = clamps.filter(function (c) { return document.contains(c.box); });
    requestAnimationFrame(measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    return true;
  }

  function setStatus(text) {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.textContent = text;
  }

  window.addEventListener('resize', measure);

  var shown = false;
  try {
    var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && Array.isArray(cached.data)) shown = render(cached.data);
  } catch (e) { /* ei välimuistia */ }

  var controller = typeof AbortController === 'function' ? new AbortController() : null;
  var timeout = controller ? setTimeout(function () { controller.abort(); }, 8000) : null;

  fetch(URL_API, { headers: { Accept: 'application/json' }, signal: controller ? controller.signal : undefined })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)); })
    .then(function (data) {
      if (!Array.isArray(data)) throw new Error('Odottamaton vastaus');
      shown = render(data) || shown;
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: data })); } catch (e) {}
      if (!shown) setStatus('Ei julkisia viestejä näytettäväksi.');
    })
    .catch(function () {
      if (!shown) setStatus('Mastodon-viestejä ei voitu ladata juuri nyt.');
    })
    .then(function () { if (timeout) clearTimeout(timeout); });
})();
