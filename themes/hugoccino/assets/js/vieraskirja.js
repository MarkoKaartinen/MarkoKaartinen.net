/*
 * Vieraskirja: viestien listaus, sivutus ja lomake. Kaikki tehdään selaimessa API:n kautta
 * (osoite tulee data-api-attribuutista, ei kovakoodattuna). Käyttäjän tekstit asetetaan aina textContentilla.
 */
(function () {
  'use strict';

  var root = document.getElementById('vieraskirja');
  if (!root) return;

  var api = root.getAttribute('data-api').replace(/\/+$/, '');
  var form = root.querySelector('[data-form]');
  var statusEl = root.querySelector('[data-status]');
  var submitBtn = root.querySelector('[data-submit]');
  var submitLabel = root.querySelector('[data-submit-label]');
  var countEl = root.querySelector('[data-count]');
  var listEl = root.querySelector('[data-list]');
  var listStatus = root.querySelector('[data-list-status]');
  var listError = root.querySelector('[data-list-error]');
  var pager = root.querySelector('[data-pager]');
  var prevLink = root.querySelector('[data-prev]');
  var nextLink = root.querySelector('[data-next]');
  var pageEl = root.querySelector('[data-page]');
  var totalEl = root.querySelector('[data-total]');

  var fieldNames = ['nickname', 'homepage', 'message'];
  var token = null; // { value, readyAt, expiresAt }
  var tokenRequest = null;
  var submitting = false;
  var listRequest = 0;

  var dateFormat;
  try {
    dateFormat = new Intl.DateTimeFormat('fi-FI', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Helsinki' });
  } catch (e) {
    dateFormat = null;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  // Siistii rivinvaihdot: Windows-rivinvaihdot yhdeksi, alku- ja loppuvälit pois ja enintään yksi tyhjä rivi peräkkäin
  var CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;

  function cleanText(value) {
    return String(value || '').replace(CONTROL, '').replace(/\r\n?/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  function safeUrl(value) {
    if (!value) return null;
    try {
      var u = new URL(String(value));
      if (u.username || u.password) return null;
      return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null;
    } catch (e) {
      return null;
    }
  }

  // ---------- Turvallinen Markdown-osajoukko ----------
  // Tuetaan: **lihavointi**, *kursiivi*, _kursiivi_, `koodi`, [teksti](https://osoite), paljaat http(s)- ja www-osoitteet,
  // listat (- kohta, 1. kohta), lainaus (> teksti), koodilohko (``` rivit ```, kielimerkinnällä väritetty), kappaleet ja rivinvaihdot. Ei kuvia, otsikoita eikä HTML:ää: kaikki rakennetaan DOM-elementeistä
  // ja teksti asetetaan textContentilla, joten käyttäjän syöte ei voi tuottaa HTML:ää.

  var LINK_CLASS = 'text-blue underline underline-offset-2 hover:text-sapphire';
  var INLINE = new RegExp([
    '`([^`\\n]+)`',                              // 1 koodi
    '(!?)\\[([^\\]\\n]+)\\]\\(([^\\s)]+)\\)',    // 2 kuvamerkki, 3 teksti, 4 osoite
    '\\*\\*([^\\n]+?)\\*\\*',                    // 5 lihavointi
    '__([^\\n]+?)__',                            // 6 lihavointi
    '\\*([^\\s*][^*\\n]*?)\\*',                  // 7 kursiivi
    '_([^\\s_][^_\\n]*?)_',                      // 8 kursiivi
    '(https?:\\/\\/[^\\s<]+|www\\.[^\\s<]+)'     // 9 paljas osoite
  ].join('|'), 'g');

  function isWordChar(ch) {
    return !!ch && /[0-9A-Za-zÀ-ÿ]/.test(ch);
  }

  function addLink(parent, href, label) {
    var a = el('a', LINK_CLASS);
    a.href = href;
    a.rel = 'nofollow ugc noopener';
    renderInline(a, label, true);
    parent.appendChild(a);
  }

  function renderInline(parent, text, noLink) {
    var re = new RegExp(INLINE.source, 'g');
    var pos = 0;
    var m;
    while ((m = re.exec(text)) !== null) {
      var start = m.index;
      var end = re.lastIndex;
      var handled = false;

      if (m[1] !== undefined) {
        if (start > pos) parent.appendChild(document.createTextNode(text.slice(pos, start)));
        parent.appendChild(el('code', 'rounded bg-surface0 px-1 font-mono text-[0.9em]', m[1]));
        handled = true;
      } else if (m[3] !== undefined) {
        var href = safeUrl(m[4]);
        if (m[2] === '!') {
          // Kuvat näytetään sellaisenaan tekstinä (ei kuvaa, ei linkkiä)
          re.lastIndex = end;
          continue;
        }
        if (!href || noLink) {
          // Virheelliset linkit näytetään tekstinä
          re.lastIndex = start + 1;
          continue;
        }
        if (start > pos) parent.appendChild(document.createTextNode(text.slice(pos, start)));
        addLink(parent, href, m[3]);
        handled = true;
      } else if (m[5] !== undefined || m[6] !== undefined) {
        if (start > pos) parent.appendChild(document.createTextNode(text.slice(pos, start)));
        var strong = el('strong', 'font-bold');
        renderInline(strong, m[5] !== undefined ? m[5] : m[6], noLink);
        parent.appendChild(strong);
        handled = true;
      } else if (m[7] !== undefined || m[8] !== undefined) {
        // Alaviiva-kursiivi vain sanarajoilla (snake_case ei muutu)
        if (m[8] !== undefined && (isWordChar(text.charAt(start - 1)) || isWordChar(text.charAt(end)))) {
          re.lastIndex = start + 1;
          continue;
        }
        if (start > pos) parent.appendChild(document.createTextNode(text.slice(pos, start)));
        var em = el('em', 'italic');
        renderInline(em, m[7] !== undefined ? m[7] : m[8], noLink);
        parent.appendChild(em);
        handled = true;
      } else if (m[9] !== undefined) {
        if (noLink) {
          re.lastIndex = start + 1;
          continue;
        }
        var url = m[9];
        // Loppumerkit eivät kuulu osoitteeseen
        var trailing = url.match(/[.,;:!?'"]+$/);
        if (trailing) url = url.slice(0, -trailing[0].length);
        while (/\)$/.test(url) && url.split('(').length < url.split(')').length) url = url.slice(0, -1);
        while (/\]$/.test(url) && url.split('[').length < url.split(']').length) url = url.slice(0, -1);
        var target = safeUrl(/^www\./i.test(url) ? 'https://' + url : url);
        if (!target) {
          re.lastIndex = start + 1;
          continue;
        }
        if (start > pos) parent.appendChild(document.createTextNode(text.slice(pos, start)));
        addLink(parent, target, url);
        end = start + url.length;
        re.lastIndex = end;
        handled = true;
      }

      if (handled) pos = end;
    }
    if (pos < text.length) parent.appendChild(document.createTextNode(text.slice(pos)));
  }

  function renderRich(text, topClass, depth) {
    depth = depth || 0;
    var wrap = el('div', 'space-y-2 leading-normal break-words [overflow-wrap:anywhere] ' + (topClass || ''));
    var lines = cleanText(text).split('\n');
    var i = 0;
    var bullet = /^\s{0,3}[-*+]\s+(.*)$/;
    var numbered = /^\s{0,3}\d{1,3}[.)]\s+(.*)$/;
    var quote = /^\s{0,3}>\s?(.*)$/;
    var fence = /^\s{0,3}```/;

    // Sisäkkäisiä lainauksia ei tueta: sisemmällä tasolla > on tavallista tekstiä
    function startsBlock(line) {
      return bullet.test(line) || numbered.test(line) || (depth === 0 && (quote.test(line) || fence.test(line)));
    }

    while (i < lines.length) {
      if (!lines[i].trim()) { i++; continue; }

      if (depth === 0 && fence.test(lines[i])) {
        // Koodilohko: sisältö sellaisenaan tekstinä (ei muotoilua). Kielimerkintä avausrivillä ohitetaan.
        var lang = lines[i].replace(/^\s{0,3}```/, '').trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9+#-]/g, '');
        var code = [];
        i++;
        while (i < lines.length && !fence.test(lines[i])) {
          code.push(lines[i]);
          i++;
        }
        i++; // sulkeva rivi
        var pre = el('pre', 'chroma overflow-x-auto rounded-md border border-surface0 bg-crust p-3 font-mono text-sm leading-relaxed');
        var codeEl = el('code');
        highlightInto(codeEl, code.join('\n'), lang);
        pre.appendChild(codeEl);
        wrap.appendChild(pre);
        continue;
      }

      if (depth === 0 && quote.test(lines[i])) {
        var inner = [];
        while (i < lines.length && quote.test(lines[i])) {
          inner.push(lines[i].match(quote)[1]);
          i++;
        }
        var bq = el('blockquote', 'border-l-2 border-overlay0 pl-4 text-subtext0');
        bq.appendChild(renderRich(inner.join('\n'), '', depth + 1));
        wrap.appendChild(bq);
        continue;
      }

      var isBullet = bullet.test(lines[i]);
      var isNumbered = !isBullet && numbered.test(lines[i]);

      if (isBullet || isNumbered) {
        var list = el(isBullet ? 'ul' : 'ol', (isBullet ? 'list-disc' : 'list-decimal') + ' space-y-1 pl-6 marker:text-meta');
        var re = isBullet ? bullet : numbered;
        while (i < lines.length && re.test(lines[i])) {
          var li = el('li');
          renderInline(li, lines[i].match(re)[1], false);
          list.appendChild(li);
          i++;
        }
        wrap.appendChild(list);
        continue;
      }

      var p = el('p');
      var first = true;
      while (i < lines.length && lines[i].trim() && !startsBlock(lines[i])) {
        if (!first) p.appendChild(document.createElement('br'));
        renderInline(p, lines[i].trim(), false);
        first = false;
        i++;
      }
      wrap.appendChild(p);
    }
    return wrap;
  }

  // ---------- Kevyt syntaksiväritys koodilohkoille ----------
  // Oma pieni tokenisoija, joka tuottaa DOM-elementit (ei innerHTML:ää) ja käyttää samoja luokkanimiä (.chroma .k, .s, .c1 jne.)
  // kuin artikkelien koodilohkot, joten värit tulevat Catppuccin-teemasta. Tunnistaa kommentit, merkkijonot, luvut,
  // avainsanat, vakiot, funktiokutsut ja muuttujat. Tuntematon tai puuttuva kieli näytetään värittämättä.

  function words(list) {
    var o = {};
    list.split(' ').forEach(function (w) { o[w] = true; });
    return o;
  }

  var CONSTS = words('true false null nil none undefined NaN Infinity True False None TRUE FALSE NULL');
  var KW_JS = 'break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof let new of return super switch this throw try typeof var void while with yield async await static get set from as';
  var KW_CLIKE = 'abstract break case catch class const continue default do else enum extends final finally for if implements import interface namespace new package private protected public return static struct switch this throw throws try typeof using virtual void volatile while';
  var LANGS = {
    js: { line: ['//'], block: ['/*', '*/'], quotes: '"\'`', kw: words(KW_JS) },
    ts: { line: ['//'], block: ['/*', '*/'], quotes: '"\'`', kw: words(KW_JS + ' interface type enum implements public private protected readonly namespace declare abstract') },
    php: { line: ['//', '#'], block: ['/*', '*/'], quotes: '"\'', vars: true, kw: words('abstract and array as break callable case catch class clone const continue declare default do echo else elseif empty extends final finally fn for foreach function global if implements include include_once instanceof interface isset list match namespace new or print private protected public readonly require require_once return static switch throw trait try unset use var while xor yield') },
    python: { line: ['#'], quotes: '"\'', kw: words('and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield') },
    bash: { line: ['#'], quotes: '"\'`', vars: true, kw: words('if then else elif fi for while do done case esac in function select until return exit export local readonly declare alias unset source') },
    go: { line: ['//'], block: ['/*', '*/'], quotes: '"\'`', kw: words('break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var') },
    rust: { line: ['//'], block: ['/*', '*/'], quotes: '"', kw: words('as async await break const continue crate dyn else enum extern fn for if impl in let loop match mod move mut pub ref return self Self static struct super trait type unsafe use where while') },
    clike: { line: ['//'], block: ['/*', '*/'], quotes: '"\'', kw: words(KW_CLIKE) },
    ruby: { line: ['#'], quotes: '"\'', kw: words('def end class module if elsif else unless while until for in do begin rescue ensure return yield self then and or not require include') },
    sql: { line: ['--'], block: ['/*', '*/'], quotes: '"\'`', nocase: true, kw: words('select from where join left right inner outer on group by order having insert into values update set delete create table alter drop index and or not as distinct limit offset union case when then else end primary key foreign references') },
    css: { block: ['/*', '*/'], quotes: '"\'', at: true, kw: {} },
    markup: { quotes: '"\'', markup: true, kw: {} },
    data: { line: ['#'], quotes: '"\'', kw: {} }
  };
  var ALIASES = {
    js: 'js', javascript: 'js', jsx: 'js', mjs: 'js', node: 'js',
    ts: 'ts', typescript: 'ts', tsx: 'ts',
    php: 'php', py: 'python', python: 'python',
    sh: 'bash', bash: 'bash', shell: 'bash', zsh: 'bash', console: 'bash',
    go: 'go', golang: 'go', rs: 'rust', rust: 'rust',
    java: 'clike', c: 'clike', cpp: 'clike', 'c++': 'clike', cs: 'clike', csharp: 'clike', kotlin: 'clike',
    rb: 'ruby', ruby: 'ruby', sql: 'sql', mysql: 'sql', postgresql: 'sql',
    css: 'css', scss: 'css', html: 'markup', xml: 'markup', svg: 'markup',
    json: 'data', yaml: 'data', yml: 'data', toml: 'data', ini: 'data'
  };

  function highlightInto(parent, text, lang) {
    var key = ALIASES[lang];
    if (lang === 'diff' || lang === 'patch') {
      text.split('\n').forEach(function (ln, idx) {
        if (idx) parent.appendChild(document.createTextNode('\n'));
        var cls = /^\+(?!\+\+)/.test(ln) ? 'gi' : /^-(?!--)/.test(ln) ? 'gd' : /^@@/.test(ln) ? 'cp' : '';
        if (cls) parent.appendChild(el('span', cls, ln));
        else parent.appendChild(document.createTextNode(ln));
      });
      return;
    }
    var cfg = key && LANGS[key];
    if (!cfg) {
      parent.textContent = text;
      return;
    }

    var buf = '';
    function flush() {
      if (buf) { parent.appendChild(document.createTextNode(buf)); buf = ''; }
    }
    function emit(cls, t) {
      flush();
      parent.appendChild(el('span', cls, t));
    }

    var i = 0;
    var n = text.length;
    while (i < n) {
      var ch = text.charAt(i);
      var m;

      if (cfg.markup) {
        if (text.substr(i, 4) === '<!--') {
          var ce = text.indexOf('-->', i + 4);
          ce = ce < 0 ? n : ce + 3;
          emit('c', text.slice(i, ce));
          i = ce;
          continue;
        }
        m = /^<\/?[A-Za-z][\w:.-]*/.exec(text.substr(i, 80));
        if (m) { emit('nt', m[0]); i += m[0].length; continue; }
      }

      if (cfg.block && text.substr(i, cfg.block[0].length) === cfg.block[0]) {
        var be = text.indexOf(cfg.block[1], i + cfg.block[0].length);
        be = be < 0 ? n : be + cfg.block[1].length;
        emit('cm', text.slice(i, be));
        i = be;
        continue;
      }

      var lineComment = false;
      if (cfg.line) {
        for (var k = 0; k < cfg.line.length; k++) {
          var pre = cfg.line[k];
          if (text.substr(i, pre.length) === pre && !(pre === '#' && text.charAt(i - 1) === '$')) { lineComment = true; break; }
        }
      }
      if (lineComment) {
        var le = text.indexOf('\n', i);
        le = le < 0 ? n : le;
        emit('c1', text.slice(i, le));
        i = le;
        continue;
      }

      if (cfg.quotes.indexOf(ch) >= 0) {
        var j = i + 1;
        while (j < n) {
          var c = text.charAt(j);
          if (c === '\\') { j += 2; continue; }
          if (c === ch) { j++; break; }
          if (c === '\n' && ch !== '`') break;
          j++;
        }
        j = Math.min(j, n);
        emit('s', text.slice(i, j));
        i = j;
        continue;
      }

      if (/[0-9]/.test(ch) && !isWordChar(text.charAt(i - 1))) {
        m = /^(?:0x[0-9a-fA-F_]+|\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(text.substr(i, 40));
        if (m) { emit('m', m[0]); i += m[0].length; continue; }
      }

      if (cfg.at && ch === '@') {
        m = /^@[\w-]+/.exec(text.substr(i, 40));
        if (m) { emit('k', m[0]); i += m[0].length; continue; }
      }

      if (cfg.vars && ch === '$') {
        m = /^\$\{?[A-Za-z_]\w*\}?/.exec(text.substr(i, 60));
        if (m) { emit('nv', m[0]); i += m[0].length; continue; }
      }

      if (/[A-Za-z_]/.test(ch) && !isWordChar(text.charAt(i - 1))) {
        m = /^[A-Za-z_]\w*/.exec(text.substr(i, 80));
        var word = m[0];
        var lookup = cfg.nocase ? word.toLowerCase() : word;
        var after = text.charAt(i + word.length);
        if (cfg.kw[lookup]) emit('k', word);
        else if (CONSTS[word]) emit('kc', word);
        else if (after === '(') emit('nf', word);
        else buf += word;
        i += word.length;
        continue;
      }

      buf += ch;
      i++;
    }
    flush();
  }

  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    if (!dateFormat) return d.toLocaleString('fi-FI');
    return dateFormat.format(d).replace(',', ' klo');
  }

  // ---------- Viestilista ----------

  // Kirjoittajan merkki (Lucide coffee), sama kuin kommenteissa
  function authorBadge() {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('class', 'size-4 text-mauve');
    svg.setAttribute('aria-hidden', 'true');
    ['M10 2v2', 'M14 2v2', 'M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1', 'M6 2v2'].forEach(function (d) {
      var path = document.createElementNS(ns, 'path');
      path.setAttribute('d', d);
      svg.appendChild(path);
    });
    return svg;
  }

  function messageNode(m) {
    var li = el('li');
    var card = el('article', 'scroll-mt-24 rounded-lg border border-surface0 bg-mantle p-4 sm:p-5');
    card.id = 'viesti-' + m.id;

    var head = el('header', 'flex flex-wrap items-baseline gap-x-3 gap-y-1');
    var name = el('span', 'font-mono font-bold text-text', String(m.nickname || '').replace(CONTROL, ''));
    head.appendChild(name);
    var home = safeUrl(m.homepage);
    if (home) {
      var a = el('a', 'tap font-mono text-xs text-blue hover:text-sapphire', home.replace(/^https?:\/\//, '').replace(/\/$/, ''));
      a.href = home;
      a.rel = 'nofollow ugc noopener';
      head.appendChild(a);
    }
    var time = el('time', 'font-mono text-xs text-meta', formatDate(m.created_at));
    time.dateTime = m.created_at;
    head.appendChild(time);
    card.appendChild(head);

    card.appendChild(renderRich(m.message, 'mt-3'));

    if (m.reply) {
      var reply = el('div', 'scroll-mt-24 mt-4 rounded-md border border-l-2 border-surface0 border-l-mauve bg-base p-3');
      reply.id = 'vastaus-' + m.id;
      var rhead = el('p', 'flex flex-wrap items-center gap-x-2 font-mono text-xs text-meta');
      rhead.appendChild(authorBadge());
      rhead.appendChild(el('span', 'font-bold text-mauve', 'Marko vastasi'));
      if (m.replied_at) {
        var rt = el('time', 'ml-auto', formatDate(m.replied_at));
        rt.dateTime = m.replied_at;
        rhead.appendChild(rt);
      }
      reply.appendChild(rhead);
      reply.appendChild(renderRich(m.reply, 'mt-2'));
      card.appendChild(reply);
    }

    li.appendChild(card);
    return li;
  }

  function currentPage() {
    var p = parseInt(new URLSearchParams(location.search).get('sivu'), 10);
    return p > 0 ? p : 1;
  }

  function pageHref(n) {
    return n <= 1 ? location.pathname : location.pathname + '?sivu=' + n;
  }

  function setLoading(on) {
    listStatus.hidden = !on;
    if (on) listStatus.textContent = 'Ladataan viestejä…';
    root.setAttribute('aria-busy', on ? 'true' : 'false');
  }

  function loadList(page, opts) {
    opts = opts || {};
    var id = ++listRequest;
    listError.hidden = true;
    setLoading(true);

    return fetch(api + '?page=' + encodeURIComponent(page), {
      headers: { Accept: 'application/json' },
      credentials: 'omit'
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (data) {
        if (id !== listRequest) return;
        var items = Array.isArray(data.data) ? data.data : [];
        var meta = data.meta || {};
        var last = parseInt(meta.last_page, 10) || 1;

        // Liian suuri sivunumero: siirrytään viimeiselle sivulle
        if (!items.length && page > last && last >= 1) {
          history.replaceState(null, '', pageHref(last));
          return loadList(last, opts);
        }

        listEl.textContent = '';
        items.forEach(function (m) { listEl.appendChild(messageNode(m)); });
        setLoading(false);

        var total = parseInt(meta.total, 10);
        totalEl.textContent = isFinite(total) && total > 0 ? '(' + total + ')' : '';

        if (!items.length) {
          listStatus.hidden = false;
          listStatus.textContent = 'Ei vielä viestejä. Ole ensimmäinen!';
        }

        var cur = parseInt(meta.current_page, 10) || page;
        if (last > 1) {
          pager.hidden = false;
          pageEl.textContent = 'sivu ' + cur + ' / ' + last;
          setLink(prevLink, cur > 1 ? cur - 1 : null);
          setLink(nextLink, cur < last ? cur + 1 : null);
        } else {
          pager.hidden = true;
        }

        if (opts.scroll) {
          root.querySelector('#vk-viestit-otsikko').scrollIntoView({ block: 'start' });
        } else if (location.hash && /^#(?:viesti|vastaus)-\d+$/.test(location.hash)) {
          var target = document.getElementById(location.hash.slice(1));
          if (target) target.scrollIntoView({ block: 'start' });
        }
      })
      .catch(function () {
        if (id !== listRequest) return;
        setLoading(false);
        listEl.textContent = '';
        pager.hidden = true;
        listError.hidden = false;
      });
  }

  function setLink(a, n) {
    if (n === null) {
      a.removeAttribute('href');
      a.setAttribute('aria-disabled', 'true');
      a.classList.add('pointer-events-none', 'opacity-40');
      a.removeAttribute('data-n');
    } else {
      a.href = pageHref(n);
      a.removeAttribute('aria-disabled');
      a.classList.remove('pointer-events-none', 'opacity-40');
      a.setAttribute('data-n', String(n));
    }
  }

  [prevLink, nextLink].forEach(function (a) {
    a.addEventListener('click', function (e) {
      var n = parseInt(a.getAttribute('data-n'), 10);
      if (!n) { e.preventDefault(); return; }
      e.preventDefault();
      history.pushState(null, '', pageHref(n));
      loadList(n, { scroll: true });
    });
  });

  window.addEventListener('popstate', function () { loadList(currentPage()); });

  root.querySelector('[data-retry]').addEventListener('click', function () { loadList(currentPage()); });

  // ---------- Lomaketunnus ----------

  function fetchToken() {
    if (tokenRequest) return tokenRequest;
    tokenRequest = fetch(api + '/form-token', {
      headers: { Accept: 'application/json' },
      credentials: 'omit',
      cache: 'no-store'
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (data) {
        if (!data || !data.form_token) return Promise.reject(new Error('token'));
        var now = Date.now();
        token = {
          value: data.form_token,
          readyAt: now + (parseInt(data.min_seconds, 10) || 3) * 1000,
          // Uusitaan hieman ennen vanhenemista
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

  // ---------- Lomake ----------

  function field(name) { return form.elements[name]; }
  function errorEl(name) { return form.querySelector('[data-error="' + name + '"]'); }

  function setError(name, messages) {
    var p = errorEl(name);
    var input = fieldNames.indexOf(name) >= 0 ? field(name) : null;
    if (!p) return;
    if (messages && messages.length) {
      p.textContent = messages.join(' ');
      p.hidden = false;
      if (input) input.setAttribute('aria-invalid', 'true');
    } else {
      p.textContent = '';
      p.hidden = true;
      if (input) input.removeAttribute('aria-invalid');
    }
  }

  function clearErrors() {
    fieldNames.concat(['form_token']).forEach(function (n) { setError(n, null); });
  }

  function setStatus(text, isError) {
    statusEl.textContent = text || '';
    statusEl.classList.toggle('text-red', !!isError);
    statusEl.classList.toggle('text-subtext1', !isError);
  }

  function setBusy(on, label) {
    submitting = on;
    submitBtn.disabled = on;
    submitBtn.setAttribute('aria-disabled', on ? 'true' : 'false');
    submitLabel.textContent = label || (on ? 'lähetetään…' : 'lähetä viesti');
  }

  function validate() {
    var errors = {};
    if (!field('nickname').value.trim()) errors.nickname = ['Kirjoita nimimerkki.'];
    if (!field('message').value.trim()) errors.message = ['Kirjoita viesti.'];
    var home = field('homepage').value.trim();
    if (home && !safeUrl(home)) errors.homepage = ['Kotisivun pitää olla http- tai https-osoite.'];
    return errors;
  }

  function showErrors(errors) {
    var first = null;
    Object.keys(errors).forEach(function (name) {
      setError(name, errors[name]);
      if (!first && fieldNames.indexOf(name) >= 0) first = field(name);
    });
    if (first) first.focus();
  }

  field('message').addEventListener('input', function () {
    countEl.textContent = field('message').value.length + ' / 5000';
  });

  function retryAfterText(res) {
    var s = parseInt(res.headers.get('Retry-After'), 10);
    if (!isFinite(s) || s <= 0) return '';
    if (s < 90) return 'Yritä uudelleen noin ' + s + ' sekunnin kuluttua.';
    return 'Yritä uudelleen noin ' + Math.ceil(s / 60) + ' minuutin kuluttua.';
  }

  function send() {
    return ensureToken().then(function (t) {
      var remaining = t.readyAt - Date.now();
      if (remaining > 0) {
        setBusy(true, 'odota hetki…');
        return wait(remaining + 100).then(function () { return t; });
      }
      return t;
    }).then(function (t) {
      setBusy(true);
      return fetch(api, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify({
          nickname: field('nickname').value.trim(),
          homepage: field('homepage').value.trim() || null,
          message: field('message').value,
          website: field('website').value,
          form_token: t.value
        })
      });
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (submitting) return;
    clearErrors();
    setStatus('');

    var errors = validate();
    if (Object.keys(errors).length) {
      showErrors(errors);
      setStatus('Tarkista lomakkeen tiedot.', true);
      return;
    }

    setBusy(true);
    send()
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) { return { res: res, data: data }; });
      })
      .then(function (out) {
        var res = out.res;
        var data = out.data || {};

        if (res.status === 202 || res.status === 201 || res.status === 200) {
          form.reset();
          countEl.textContent = '0 / 5000';
          token = null;
          setStatus(data.message || 'Kiitos viestistäsi! Viesti julkaistaan hyväksynnän jälkeen.', false);
          fetchToken().catch(function () {});
          return;
        }

        if (res.status === 422) {
          var errs = data.errors || {};
          if (errs.form_token) {
            token = null;
            fetchToken().catch(function () {});
            setError('form_token', ['Lomake ehti vanhentua. Lähetä viesti uudelleen, tekstisi on tallessa.']);
          }
          var fieldErrors = {};
          fieldNames.forEach(function (n) { if (errs[n]) fieldErrors[n] = errs[n]; });
          showErrors(fieldErrors);
          setStatus(data.message || 'Tarkista lomakkeen tiedot.', true);
          return;
        }

        if (res.status === 429) {
          var wait429 = retryAfterText(res);
          setStatus(wait429 ? 'Liian monta viestiä. ' + wait429 : (data.message || 'Liian monta viestiä. Yritä myöhemmin uudelleen.'), true);
          return;
        }

        token = null;
        fetchToken().catch(function () {});
        setStatus('Viestin lähetys ei onnistunut. Tekstisi on tallessa, yritä hetken kuluttua uudelleen.', true);
      })
      .catch(function () {
        token = null;
        setStatus('Yhteys palvelimeen ei onnistunut. Tekstisi on tallessa, tarkista verkkoyhteys ja yritä uudelleen.', true);
      })
      .then(function () { setBusy(false); });
  });

  // ---------- Käynnistys ----------

  fetchToken().catch(function () { /* haetaan uudelleen lähetettäessä */ });
  loadList(currentPage());
})();
