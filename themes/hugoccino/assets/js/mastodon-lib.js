/*
 * Mastodon-apurit (jaettu etusivun syötteen ja kommenttien kesken).
 * Mastodonin HTML puhdistetaan ennen näyttämistä: sallitaan vain pieni joukko elementtejä ja vain https-/http-linkit.
 * Käyttö: var L = window.MastoLib; L.htmlToNode(html, emojis, 'luokka'), L.renderMedia(post), ...
 */
(function () {
  'use strict';

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

  // Pelkkä teksti (esim. näyttönimi), omat emojit mukana
  function textToNode(text, emojis, tag, className) {
    var out = el(tag || 'span', className);
    appendText(out, text || '', emojiMap(emojis));
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

  // Viestin sisältö: teksti, media, kysely ja linkkikortti, sisältövaroitus huomioiden
  function renderBody(post) {
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
      return details;
    }
    return content;
  }

  window.MastoLib = {
    dateFormat: dateFormat,
    el: el,
    isHttps: isHttps,
    isHttp: isHttp,
    htmlToNode: htmlToNode,
    textToNode: textToNode,
    plural: plural,
    renderMedia: renderMedia,
    renderPoll: renderPoll,
    renderCard: renderCard,
    renderBody: renderBody
  };
})();
