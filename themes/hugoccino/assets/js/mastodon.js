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

  function renderPost(status) {
    var isBoost = !!status.reblog;
    var post = isBoost ? status.reblog : status;
    var art = el('article', 'masto-post');

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
      by.appendChild(document.createTextNode('Boostasi käyttäjältä '));
      var who = el('a', null, '@' + post.account.acct);
      who.href = post.account.url;
      who.target = '_blank';
      who.rel = 'noopener noreferrer';
      by.appendChild(who);
      art.appendChild(by);
    }

    art.appendChild(L.renderBody(post));

    var stats = el('div', 'masto-stats', [
      L.plural(post.replies_count || 0, 'vastaus', 'vastausta'),
      L.plural(post.reblogs_count || 0, 'boostaus', 'boostausta'),
      L.plural(post.favourites_count || 0, 'tykkäys', 'tykkäystä')
    ].join(' · '));
    art.appendChild(stats);
    return art;
  }

  function render(statuses) {
    var visible = statuses.filter(function (s) {
      var p = s.reblog || s;
      return s.visibility === 'public' && (p.visibility === 'public') && (p.content || (p.media_attachments || []).length);
    }).slice(0, limit);

    if (!visible.length) return false;
    list.textContent = '';
    visible.forEach(function (s) {
      var item = el('div', 'masto-item');
      item.appendChild(renderPost(s));
      list.appendChild(item);
    });
    if (statusEl) statusEl.hidden = true;
    return true;
  }

  function setStatus(text) {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.textContent = text;
  }

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
