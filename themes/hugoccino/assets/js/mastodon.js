/*
 * Mastodon-syöte: haetaan tilin julkiset viestit suoraan instanssin julkisesta API:sta (ei tokenia).
 * Näyttää tekstit, boostit, kuvat, videot, äänet, kyselyt, linkkikortit, sisältövaroitukset ja omat emojit.
 * Mastodonin HTML puhdistetaan ennen näyttämistä.
 */
(function () {
  'use strict';

  var root = document.getElementById('mastodon-feed');
  if (!root) return;

  var instance = (root.getAttribute('data-instance') || '').replace(/\/$/, '');
  var account = root.getAttribute('data-account');
  var limit = parseInt(root.getAttribute('data-limit') || '6', 10);
  var list = root.querySelector('[data-list]');
  var statusEl = root.querySelector('[data-status]');
  if (!instance || !account || !list) return;

  var CACHE_KEY = 'mastodon-feed:' + instance + ':' + account;
  var URL_API = instance + '/api/v1/accounts/' + encodeURIComponent(account) +
    '/statuses?exclude_replies=true&limit=' + Math.min(40, limit * 4);

  var ALLOWED = { P: 1, BR: 1, A: 1, SPAN: 1, STRONG: 1, B: 1, EM: 1, I: 1, CODE: 1, PRE: 1, BLOCKQUOTE: 1, UL: 1, OL: 1, LI: 1, DEL: 1, S: 1 };
  var SKIP = { SCRIPT: 1, STYLE: 1, IFRAME: 1, OBJECT: 1, EMBED: 1, FORM: 1, INPUT: 1, TEXTAREA: 1, SVG: 1 };
  var SPAN_CLASSES = { invisible: 1, ellipsis: 1 };
  var A_CLASSES = { mention: 1, hashtag: 1, 'u-url': 1 };

  var dateFormat = new Intl.DateTimeFormat('fi-FI', {
    day: 'numeric', month: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Helsinki'
  });

  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text != null) e.textContent = text;
    return e;
  }

  function isHttps(url) {
    return typeof url === 'string' && /^https:\/\//i.test(url);
  }

  function isHttp(url) {
    return typeof url === 'string' && /^https?:\/\//i.test(url);
  }

  function emojiMap(emojis) {
    var map = {};
    (emojis || []).forEach(function (e) {
      if (e && e.shortcode && isHttps(e.static_url || e.url)) map[e.shortcode] = e.static_url || e.url;
    });
    return map;
  }

  function appendText(parent, text, emojis) {
    var parts = text.split(/(:[a-zA-Z0-9_]+:)/g);
    parts.forEach(function (part) {
      var m = /^:([a-zA-Z0-9_]+):$/.exec(part);
      if (m && emojis[m[1]]) {
        var img = el('img', 'masto-emoji');
        img.src = emojis[m[1]];
        img.alt = part;
        img.title = part;
        img.loading = 'lazy';
        parent.appendChild(img);
      } else if (part) {
        parent.appendChild(document.createTextNode(part));
      }
    });
  }

  function sanitizeInto(src, dst, emojis) {
    src.childNodes.forEach(function (n) {
      if (n.nodeType === 3) {
        appendText(dst, n.nodeValue, emojis);
        return;
      }
      if (n.nodeType !== 1) return;
      var tag = n.tagName.toUpperCase();
      if (SKIP[tag]) return;
      if (!ALLOWED[tag]) {
        sanitizeInto(n, dst, emojis);
        return;
      }
      var out = document.createElement(tag.toLowerCase());
      if (tag === 'A') {
        var href = n.getAttribute('href');
        if (!isHttp(href)) {
          sanitizeInto(n, dst, emojis);
          return;
        }
        out.href = href;
        out.target = '_blank';
        out.rel = 'nofollow noopener noreferrer';
        (n.getAttribute('class') || '').split(/\s+/).forEach(function (c) {
          if (A_CLASSES[c]) out.classList.add(c);
        });
      } else if (tag === 'SPAN') {
        (n.getAttribute('class') || '').split(/\s+/).forEach(function (c) {
          if (SPAN_CLASSES[c]) out.classList.add(c);
        });
      }
      sanitizeInto(n, out, emojis);
      dst.appendChild(out);
    });
  }

  function htmlToNode(html, emojis, className) {
    var doc = new DOMParser().parseFromString(html || '', 'text/html');
    var out = el('div', className);
    sanitizeInto(doc.body, out, emojiMap(emojis));
    return out;
  }

  function plural(n, one, many) {
    return n + ' ' + (n === 1 ? one : many);
  }

  function renderMedia(post) {
    var items = post.media_attachments || [];
    if (!items.length) return null;

    var wrap = el('div', 'masto-media masto-media-' + Math.min(items.length, 4));
    items.forEach(function (m) {
      var cell = el('div', 'masto-media-item');
      var alt = m.description || '';
      if (m.type === 'image' && isHttps(m.preview_url || m.url)) {
        var a = el('a');
        a.href = post.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        var img = el('img');
        img.src = m.preview_url || m.url;
        img.alt = alt;
        img.loading = 'lazy';
        img.decoding = 'async';
        a.appendChild(img);
        cell.appendChild(a);
      } else if ((m.type === 'video' || m.type === 'gifv') && isHttps(m.url)) {
        var v = el('video');
        v.src = m.url;
        if (isHttps(m.preview_url)) v.poster = m.preview_url;
        v.controls = true;
        v.preload = 'none';
        v.playsInline = true;
        if (m.type === 'gifv') { v.loop = true; v.muted = true; }
        v.setAttribute('aria-label', alt || 'Video');
        cell.appendChild(v);
      } else if (m.type === 'audio' && isHttps(m.url)) {
        var au = el('audio');
        au.src = m.url;
        au.controls = true;
        au.preload = 'none';
        au.setAttribute('aria-label', alt || 'Ääni');
        cell.appendChild(au);
      } else {
        var link = el('a', 'masto-link', 'Liite: ' + (m.type || 'tiedosto'));
        link.href = post.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        cell.appendChild(link);
      }
      wrap.appendChild(cell);
    });

    if (post.sensitive) {
      var guard = el('div', 'masto-sensitive');
      var btn = el('button', 'masto-reveal', 'Arkaluonteinen sisältö, näytä');
      btn.type = 'button';
      btn.addEventListener('click', function () {
        guard.classList.add('masto-revealed');
        btn.remove();
      });
      guard.appendChild(wrap);
      guard.appendChild(btn);
      return guard;
    }
    return wrap;
  }

  function renderPoll(post) {
    var poll = post.poll;
    if (!poll || !poll.options) return null;
    var total = poll.votes_count || 0;
    var box = el('div', 'masto-poll');
    poll.options.forEach(function (o) {
      var pct = total ? Math.round(((o.votes_count || 0) / total) * 100) : 0;
      var row = el('div', 'masto-poll-row');
      var bar = el('div', 'masto-poll-bar');
      bar.style.width = pct + '%';
      var label = el('div', 'masto-poll-label');
      label.appendChild(el('span', null, o.title));
      label.appendChild(el('span', null, pct + ' %'));
      row.appendChild(bar);
      row.appendChild(label);
      box.appendChild(row);
    });
    box.appendChild(el('div', 'masto-poll-meta', plural(total, 'ääni', 'ääntä') + (poll.expired ? ' · kysely päättynyt' : '')));
    return box;
  }

  function renderCard(post) {
    var c = post.card;
    if (!c || !isHttp(c.url) || (post.media_attachments || []).length) return null;
    var a = el('a', 'masto-card');
    a.href = c.url;
    a.target = '_blank';
    a.rel = 'nofollow noopener noreferrer';
    if (isHttps(c.image)) {
      var img = el('img');
      img.src = c.image;
      img.alt = '';
      img.loading = 'lazy';
      a.appendChild(img);
    }
    var body = el('div', 'masto-card-body');
    if (c.provider_name) body.appendChild(el('div', 'masto-card-provider', c.provider_name));
    if (c.title) body.appendChild(el('div', 'masto-card-title', c.title));
    a.appendChild(body);
    return a;
  }

  function renderPost(status) {
    var isBoost = !!status.reblog;
    var post = isBoost ? status.reblog : status;
    var art = el('article', 'masto-post');

    var meta = el('div', 'masto-meta');
    var time = el('time');
    time.dateTime = status.created_at;
    time.textContent = dateFormat.format(new Date(status.created_at));
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

    var content = el('div', 'masto-content');
    content.appendChild(htmlToNode(post.content, post.emojis, 'masto-text'));
    var media = renderMedia(post);
    if (media) content.appendChild(media);
    var poll = renderPoll(post);
    if (poll) content.appendChild(poll);
    var card = renderCard(post);
    if (card) content.appendChild(card);

    if (post.spoiler_text) {
      var details = el('details', 'masto-cw');
      var summary = el('summary');
      summary.appendChild(htmlToNode('<p>' + post.spoiler_text.replace(/</g, '&lt;') + '</p>', post.emojis, 'masto-cw-text'));
      details.appendChild(summary);
      details.appendChild(content);
      art.appendChild(details);
    } else {
      art.appendChild(content);
    }

    var stats = el('div', 'masto-stats', [
      plural(post.replies_count || 0, 'vastaus', 'vastausta'),
      plural(post.reblogs_count || 0, 'boostaus', 'boostausta'),
      plural(post.favourites_count || 0, 'tykkäys', 'tykkäystä')
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
