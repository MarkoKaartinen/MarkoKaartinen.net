// Etusivun joulukalenteri-osio: näkyy marraskuun alusta loppiaiseen. Pieni ruudukko on GitHubin
// contribution-kaavion tyylinen: sarakkeet ovat viikkoja, rivit viikonpäiviä, ja ruutu kertoo vain, onko luukku avattu.
// Päivä (today) haetaan API:sta (sama vastaus kuin kalenterisivulla, 60 s välimuisti). Jos haku ei onnistu, käytetään selaimen päivämäärää.
// Avatut luukut luetaan selaimen muistista, johon kalenterisivu ne tallentaa.
(function () {
  'use strict';
  var root = document.querySelector('[data-joulu-home]');
  if (!root) return;
  var YEAR = parseInt(root.getAttribute('data-year'), 10);
  var API = root.getAttribute('data-api').replace(/\/+$/, '');
  var $ = function (s) { return root.querySelector(s); };
  var textEl = $('[data-jk-text]');
  var countEl = $('[data-jk-count]');
  var cellsEl = $('[data-jk-cells]');

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  var fin = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Helsinki' }));
  var month = fin.getMonth() + 1;
  var inSeason = month === 11 || month === 12 || (month === 1 && fin.getDate() <= 6);
  if (!inSeason) { root.hidden = true; return; }

  // 0 = ennen joulukuuta, 1..24 = luukut auki tähän asti, 25 = joulun jälkeen (selaimen päivämäärästä, jos API ei vastaa)
  function clientToday() {
    if (month === 11) return 0;
    if (month === 12) return fin.getDate() > 24 ? 25 : fin.getDate();
    return 25;
  }

  function renderGrid(today) {
    var opened = load('joulukalenteri-' + YEAR + '-avatut', []);

    // Ruudukko: joulukuun 1.–24. päivä viikkosarakkeina (maanantai ylimpänä)
    var offset = (new Date(Date.UTC(YEAR, 11, 1)).getUTCDay() + 6) % 7;
    cellsEl.textContent = '';
    for (var d = 1; d <= 24; d++) {
      var idx = offset + d - 1;
      var isOpen = opened.indexOf(d) !== -1;
      var c = document.createElement('i');
      c.className = 'jk-cell';
      c.style.gridColumn = String(Math.floor(idx / 7) + 1);
      c.style.gridRow = String((idx % 7) + 1);
      c.setAttribute('data-state', isOpen ? (d === today ? 'today' : d === 24 ? 'aatto' : 'open') : 'closed');
      c.title = d + '. joulukuuta: ' + (isOpen ? 'avattu' : 'avaamatta');
      cellsEl.appendChild(c);
    }
  }

  function render(today) {
    var opened = load('joulukalenteri-' + YEAR + '-avatut', []);
    renderGrid(today);
    textEl.classList.remove('jk-loading');

    // Teksti ja mahdollinen lasku alkuun
    var upto = Math.min(today, 24);
    var missed = 0; // menneet luukut, joita ei ole vielä avattu (ei tämän päivän luukkua)
    for (var m = 1; m <= upto; m++) {
      if (m !== today && opened.indexOf(m) === -1) missed++;
    }
    var missedText = missed === 1 ? 'Yksi aiempi luukku on vielä avaamatta.' : missed + ' aiempaa luukkua on vielä avaamatta.';

    if (today === 0) {
      textEl.textContent = 'Joulukalenteri palaa! Ensimmäinen luukku aukeaa 1.12.';
      countEl.hidden = false;
      var timeEl = $('[data-jk-time]');
      var barEl = $('[data-jk-bar]');
      var el = function (cls, text) { var e = document.createElement('span'); e.className = cls; e.textContent = text; return e; };
      var tick = function () {
        var end = Date.UTC(YEAR, 11, 1, 0, 0) - 2 * 3600 * 1000;
        var start = Date.UTC(YEAR, 10, 1, 0, 0) - 2 * 3600 * 1000;
        var s = Math.floor(Math.max(0, end - Date.now()) / 1000);
        var dd = Math.floor(s / 86400); s -= dd * 86400;
        var h = Math.floor(s / 3600); s -= h * 3600;
        var mi = Math.floor(s / 60); s -= mi * 60;
        timeEl.textContent = dd + 'd ' + pad(h) + 'h ' + pad(mi) + 'm ' + pad(s) + 's';
        var pct = Math.max(0, Math.min(100, Math.floor((Date.now() - start) / (end - start) * 100)));
        var filled = Math.round(pct / 100 * 24);
        barEl.textContent = '[';
        barEl.appendChild(el('text-green', new Array(filled + 1).join('#')));
        barEl.appendChild(el('text-overlay0', new Array(24 - filled + 1).join('.')));
        barEl.appendChild(document.createTextNode(']'));
        barEl.appendChild(el('ml-2 text-subtext1', pct + ' %'));
      };
      tick();
      setInterval(tick, 1000);
    } else if (today <= 24) {
      if (opened.indexOf(today) === -1) {
        textEl.textContent = 'Tule katsomaan, millaista joulumieltä tämän päivän luukusta löytyy!';
      } else {
        textEl.textContent = (today < 24 ? 'Tämän päivän luukku on jo sinulla. Seuraava aukeaa huomenna.' : 'Jouluaaton luukku on avattu. Hyvää joulua!') + (missed ? ' ' + missedText : '');
      }
    } else {
      textEl.textContent = missed ? 'Kaikki luukut ovat auki. ' + missedText : 'Kaikki luukut avattu. Hyvää joulua!';
    }

    root.hidden = false;
  }

  // Piirretään kortti heti (ruudukko ja "Ladataan"), jotta sisältö ei hyppää API:n vastatessa
  renderGrid(-1);
  root.hidden = false;

  // Haetaan päivä API:sta, ja jos se ei onnistu 4 sekunnissa, käytetään selaimen päivämäärää
  var done = false;
  function finish(today) {
    if (done) return;
    done = true;
    render(today);
  }
  var timer = setTimeout(function () { finish(clientToday()); }, 4000);
  fetch(API + '/' + YEAR, { headers: { Accept: 'application/json' }, credentials: 'omit' })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (data) {
      clearTimeout(timer);
      var t = parseInt(data && data.today, 10);
      finish(isFinite(t) ? t : clientToday());
    })
    .catch(function () { clearTimeout(timer); finish(clientToday()); });
})();
