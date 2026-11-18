/*
 * Boostit: anonyymi emoji ja valinnainen lyhyt teksti artikkelin lopussa.
 * Osoite ja artikkelin polku tulevat data-attribuuteista. Kaikki käyttäjän tekstit asetetaan textContentilla.
 * Selaimeen tallennetaan vain satunnainen vierailijatunnus sekä oman boostin id ja poistotunnus.
 */
(function () {
  'use strict';

  var root = document.getElementById('boostit');
  if (!root) return;

  var API = root.getAttribute('data-api').replace(/\/+$/, '');
  var PATH = root.getAttribute('data-path');
  var MAX = 16;
  var KEY_VISITOR = 'boost-visitor';
  var KEY_MINE = 'boost:' + PATH;

  var picker = root.querySelector('[data-picker]');
  var dialog = root.querySelector('[data-dialog]');
  var form = root.querySelector('[data-form]');
  var dStatusEl = root.querySelector('[data-dialog-status]');
  var toggleBtn = root.querySelector('[data-toggle-picker]');
  var promptPathEl = root.querySelector('[data-prompt-path]');
  var commandEl = root.querySelector('[data-command]');
  var chosenEl = root.querySelector('[data-chosen]');
  var textEl = root.querySelector('[data-text]');
  var counterEl = root.querySelector('[data-counter]');
  var submitBtn = root.querySelector('[data-submit]');
  var statusEl = root.querySelector('[data-status]');
  var badgesEl = root.querySelector('[data-badges]');
  var messagesEl = root.querySelector('[data-messages]');
  var mineEl = root.querySelector('[data-mine]');
  var buttons = Array.prototype.slice.call(picker.querySelectorAll('[data-emoji]'));
  var moreBtn = picker.querySelector('[data-more]');
  var pickerBox = root.querySelector('[data-picker-box]');
  var pickerEl = null;
  var pickerLoading = false;
  var pickerOpen = false;
  var honey = form.elements.website;
  // Kehotteen polku on artikkelin osoite (~/2026/slug). Koko polku näkyy vihjeenä, kun se on typistetty.
  promptPathEl.textContent = '~' + PATH;
  promptPathEl.title = '~' + PATH;

  var chosen = null;
  var token = null; // { value, readyAt, expiresAt }
  var tokenRequest = null;
  var submitting = false;
  var mine = readMine();
  var state = { total: 0, groups: [], items: [] };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  function wait(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }

  // Ilmoitus katoaa hetken kuluttua (virheet myöhemmin). Pysyvä (sticky) jää, kunnes seuraava ilmoitus korvaa sen.
  var statusTimer = null;
  // Ilmoitus näkyy ikkunassa, kun se on auki, muuten sivulla.
  function setStatus(text, error, sticky) {
    clearTimeout(statusTimer);
    statusEl.textContent = '';
    dStatusEl.textContent = '';
    var node = dialog.open ? dStatusEl : statusEl;
    node.textContent = text || '';
    node.classList.toggle('text-red', !!error);
    node.classList.toggle('text-meta', !error);
    if (text && !sticky) statusTimer = setTimeout(function () { node.textContent = ''; }, error ? 8000 : 4000);
  }

  // ---------- Merkkien laskenta (grapheme-klusterit, kuten palvelimella) ----------

  var segmenter = null;
  try { if (window.Intl && Intl.Segmenter) segmenter = new Intl.Segmenter('fi', { granularity: 'grapheme' }); } catch (e) { segmenter = null; }

  function graphemes(value) {
    value = String(value || '');
    if (segmenter) return Array.from(segmenter.segment(value), function (s) { return s.segment; });
    return Array.from(value);
  }

  function clip(value) { return graphemes(value).slice(0, MAX).join(''); }

  // ---------- Tallennus selaimeen ----------

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

  function readMine() {
    try {
      var raw = localStorage.getItem(KEY_MINE);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveMine(value) {
    mine = value;
    try {
      if (value) localStorage.setItem(KEY_MINE, JSON.stringify(value));
      else localStorage.removeItem(KEY_MINE);
    } catch (e) {}
  }

  // ---------- Lomaketunnus ----------

  function fetchToken() {
    if (tokenRequest) return tokenRequest;
    tokenRequest = fetch(API + '/form-token', { headers: { Accept: 'application/json' }, credentials: 'omit', cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (data) {
        if (!data || !data.form_token) return Promise.reject(new Error('token'));
        var now = Date.now();
        token = {
          value: data.form_token,
          readyAt: now + (parseInt(data.min_seconds, 10) || 2) * 1000,
          expiresAt: now + ((parseInt(data.expires_in, 10) || 7200) - 60) * 1000
        };
        return token;
      })
      .then(function (t) { tokenRequest = null; return t; }, function (err) { tokenRequest = null; token = null; throw err; });
    return tokenRequest;
  }

  function ensureToken() {
    if (token && Date.now() < token.expiresAt) return Promise.resolve(token);
    return fetchToken();
  }

  // ---------- Lista ----------

  function mineEmoji() { return mine && mine.emoji ? mine.emoji : null; }

  // Kaksi riviä: emojit lukumäärineen ja niiden alla viestilliset reaktiot (emoji ja teksti)
  function renderBadges() {
    badgesEl.textContent = '';
    messagesEl.textContent = '';
    // API:n emojiryhmät sisältävät myös viestilliset reaktiot. Kun kaikki reaktiot ovat listassa, vähennetään viestilliset,
    // jotta yhteenveto laskee vain pelkät emojit eikä sama reaktio näy kahdessa badgessa.
    var withText = {};
    if (state.total <= state.items.length) {
      state.items.forEach(function (b) { if (b.text) withText[b.emoji] = (withText[b.emoji] || 0) + 1; });
    }
    state.groups.forEach(function (g) {
      var count = g.count - (withText[g.emoji] || 0);
      if (count < 1) return;
      var li = el('li');
      var pill = el('span', 'boost-pill' + (g.emoji === mineEmoji() && !(mine && mine.text) ? ' boost-pill-mine' : ''));
      pill.appendChild(el('span', null, g.emoji));
      pill.appendChild(el('span', 'tabular-nums text-subtext0', String(count)));
      li.appendChild(pill);
      badgesEl.appendChild(li);
    });
    state.items.forEach(function (b) {
      if (!b.text) return;
      var li = el('li');
      var pill = el('span', 'boost-pill' + (mine && mine.id === b.id ? ' boost-pill-mine' : ''));
      pill.appendChild(el('span', null, b.emoji));
      pill.appendChild(el('span', 'text-subtext1', b.text));
      li.appendChild(pill);
      messagesEl.appendChild(li);
    });
  }

  function renderPicker() {
    var mineE = mineEmoji();
    buttons.forEach(function (b) {
      var on = b.getAttribute('data-emoji') === mineE;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var cur = mineE;
    var custom = !!cur && !buttons.some(function (b) { return b.getAttribute('data-emoji') === cur; });
    moreBtn.textContent = custom ? cur : '+';
    moreBtn.setAttribute('aria-pressed', custom ? 'true' : 'false');
    mineEl.hidden = !mine;
  }

  function render() {
    renderBadges();
    renderPicker();
  }

  function applyData(data) {
    data = data && data.data ? data.data : data || {};
    state.total = parseInt(data.total, 10) || 0;
    state.groups = Array.isArray(data.groups) ? data.groups.filter(function (g) { return g && g.emoji; }) : [];
    state.items = Array.isArray(data.items) ? data.items.filter(function (b) { return b && b.emoji; }) : [];
    render();
  }

  // fresh = ohitetaan selaimen välimuisti (API välimuistittaa listan minuutin), kun lista haetaan oman muutoksen jälkeen
  function load(fresh) {
    return fetch(API + '?path=' + encodeURIComponent(PATH), { headers: { Accept: 'application/json' }, credentials: 'omit', cache: fresh ? 'reload' : 'default' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(applyData)
      .catch(function () { setStatus('Reaktioita ei saatu haettua juuri nyt.', true); });
  }

  // ---------- Valinta ja lähetys ----------

  // Ikkuna: pikarivin emoji avaa ikkunan valmiiksi valittuna ja `+` ilman valintaa. Molemmissa emojivalitsin on auki.
  function openDialog(emoji, withPicker) {
    setStatus('');
    textEl.value = '';
    chosen = null;
    var start = emoji || (mine && mine.emoji) || null;
    if (start) choose(start, true); else syncChosen();
    if (!dialog.open) dialog.showModal();
    if (withPicker) openPicker(); else closePicker();
    if (start) textEl.focus(); else toggleBtn.focus();
    ensureToken().catch(function () {});
  }

  function syncChosen() {
    chosenEl.textContent = chosen || '+';
    toggleBtn.classList.toggle('boost-chosen-empty', !chosen);
    submitBtn.disabled = submitting || !chosen;
    updateCommand();
    if (pickerEl) pickerEl.markSelected(chosen);
    renderPicker();
  }

  function choose(emoji, quiet) {
    chosen = emoji;
    if (mine && mine.emoji === emoji && !textEl.value) textEl.value = mine.text || '';
    updateCounter();
    syncChosen();
    // Valitsin pysyy auki ja fokus siinä, jotta emojin voi vaihtaa uudelleen (mobiilissa näppäimistö ei myöskään aukea itsestään)
    if (!quiet) setStatus('');
  }

  function closeDialog() {
    if (dialog.open) dialog.close();
  }

  // Ikkunan otsikko on komento, joka rakentuu valintojen mukana: react 🔥 "viesti"
  function updateCommand() {
    var text = textEl.value.replace(/\s+/g, ' ').trim();
    var cmd = 'react';
    if (chosen) cmd += ' ' + chosen;
    if (text) cmd += ' "' + text.replace(/"/g, '\\"') + '"';
    commandEl.textContent = cmd;
  }

  function updateCounter() {
    updateCommand();
    var len = graphemes(textEl.value).length;
    counterEl.textContent = len + '/' + MAX;
    counterEl.classList.toggle('text-red', len > MAX);
  }

  function errorMessage(data, fallback) {
    if (data && data.errors) {
      var out = [];
      Object.keys(data.errors).forEach(function (k) {
        [].concat(data.errors[k]).forEach(function (m) { out.push(String(m)); });
      });
      if (out.length) return out.join(' ');
    }
    return (data && data.message) || fallback;
  }

  function submit() {
    if (submitting || !chosen) return;
    var text = textEl.value.replace(/\s+/g, ' ').trim();
    if (graphemes(text).length > MAX) { setStatus('Viesti saa olla enintään ' + MAX + ' merkkiä.', true); return; }
    submitting = true;
    submitBtn.disabled = true;
    setStatus('Lähetetään…', false, true);

    ensureToken().then(function (t) {
      return wait(Math.max(0, t.readyAt - Date.now())).then(function () { return t; });
    }).then(function (t) {
      return fetch(API, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        credentials: 'omit',
        cache: 'no-store',
        body: JSON.stringify({
          path: PATH,
          emoji: chosen,
          text: text || null,
          form_token: t.value,
          website: honey ? honey.value : '',
          visitor_token: visitorId()
        })
      });
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) { return { res: res, data: data || {} }; });
    }).then(function (r) {
      token = null; // lomaketunnus on kertakäyttöinen
      if (!r.res.ok) {
        setStatus(errorMessage(r.data, r.res.status === 429 ? 'Liian monta yritystä, yritä hetken kuluttua uudelleen.' : 'Reaktion lähetys ei onnistunut.'), true);
        return;
      }
      var b = r.data.data || r.data;
      saveMine({ id: b.id, emoji: chosen, text: text, delete_token: b.delete_token || r.data.delete_token });
      closeDialog();
      setStatus('Kiitos reaktiosta!');
      return load(true);
    }).catch(function () {
      setStatus('Reaktion lähetys ei onnistunut. Yritä uudelleen.', true);
    }).then(function () {
      submitting = false;
      submitBtn.disabled = !chosen;
    });
  }

  function removeMine() {
    if (!mine || !mine.id) { saveMine(null); render(); return; }
    setStatus('Poistetaan…', false, true);
    fetch(API + '/' + encodeURIComponent(mine.id), {
      method: 'DELETE',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      credentials: 'omit',
      body: JSON.stringify({ delete_token: mine.delete_token, visitor_token: visitorId() })
    }).then(function (res) {
      if (res.ok || res.status === 404) {
        saveMine(null);
        setStatus('Reaktio poistettu.');
        return load(true);
      }
      setStatus('Poisto ei onnistunut.', true);
    }).catch(function () { setStatus('Poisto ei onnistunut.', true); });
  }

  // ---------- Emojivalitsin (ladataan vasta, kun lukija avaa sen) ----------

  function closePicker() {
    pickerOpen = false;
    pickerBox.hidden = true;
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  function openPicker() {
    pickerOpen = true;
    pickerBox.hidden = false;
    toggleBtn.setAttribute('aria-expanded', 'true');
    if (pickerEl || pickerLoading) return;
    var src = root.getAttribute('data-picker-js');
    if (!src) { closePicker(); setStatus('Emojivalitsinta ei saatu ladattua.', true); return; }
    pickerLoading = true;
    setStatus('Ladataan emojeita…', false, true);
    import(src).then(function (m) {
      pickerEl = m.createPicker(root.getAttribute('data-emoji-data'));
      pickerEl.addEventListener('emoji-click', function (e) {
        var emoji = e.detail && e.detail.unicode;
        if (emoji) choose(emoji);
      });
      pickerBox.appendChild(pickerEl);
      pickerEl.markSelected(chosen);
      setStatus('');
    }).catch(function () {
      closePicker();
      setStatus('Emojivalitsinta ei saatu ladattua.', true);
    }).then(function () { pickerLoading = false; });
  }

  toggleBtn.addEventListener('click', function () {
    if (pickerOpen) closePicker(); else openPicker();
  });

  // ---------- Tapahtumat ----------

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { openDialog(b.getAttribute('data-emoji'), true); });
  });
  moreBtn.addEventListener('click', function () { openDialog(null, true); });
  textEl.addEventListener('input', updateCounter);
  form.addEventListener('submit', function (e) { e.preventDefault(); submit(); });
  root.querySelector('[data-cancel]').addEventListener('click', closeDialog);
  root.querySelector('[data-close]').addEventListener('click', closeDialog);
  // Taustan napautus sulkee ikkunan
  dialog.addEventListener('click', function (e) { if (e.target === dialog) closeDialog(); });
  // Sulkeutuessa (myös Esc) tyhjennetään valinta
  dialog.addEventListener('close', function () {
    chosen = null;
    textEl.value = '';
    updateCounter();
    closePicker();
    syncChosen();
    dStatusEl.textContent = '';
  });
  root.querySelector('[data-remove]').addEventListener('click', removeMine);

  syncChosen();

  // Haetaan lista vasta, kun osio on lähellä näkymää
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (en) { return en.isIntersecting; })) { io.disconnect(); load(); }
    }, { rootMargin: '400px 0px' });
    io.observe(root);
  } else {
    load();
  }
})();
