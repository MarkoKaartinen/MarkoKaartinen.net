// Reseptin annosmäärän skaalaus: ainesosien määrät päivittyvät, murtoluvut säilyvät (esim. 2/3 tl).
(function () {
  'use strict';
  var root = document.getElementById('ainekset');
  if (!root) return;
  var base = parseFloat(root.getAttribute('data-base'));
  var out = root.querySelector('[data-servings]');
  if (!base || !out) return;
  var cur = base;
  var reset = root.querySelector('[data-reset]');

  function parse(s) {
    s = String(s);
    if (s.indexOf('/') !== -1) {
      var p = s.split('/');
      return parseFloat(p[0]) / parseFloat(p[1]);
    }
    return parseFloat(s.replace(',', '.'));
  }
  function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
  function fmt(n) {
    var whole = Math.floor(n), frac = n - whole;
    if (frac < 0.01) return String(whole);
    if (frac > 0.99) return String(whole + 1);
    var bn = 1, bd = 2, be = Infinity;
    for (var d = 2; d <= 8; d++) {
      var k = Math.round(frac * d);
      if (k === 0 || k === d) continue;
      var e = Math.abs(frac - k / d);
      if (e < be) { be = e; bn = k; bd = d; }
    }
    var g = gcd(bn, bd);
    var f = (bn / g) + '/' + (bd / g);
    return whole === 0 ? f : whole + ' ' + f;
  }
  function render() {
    out.textContent = cur;
    root.querySelectorAll('[data-amount]').forEach(function (el) {
      var v = parse(el.getAttribute('data-amount'));
      if (!isNaN(v)) el.textContent = fmt(v * cur / base);
    });
    if (reset) reset.hidden = cur === base;
  }
  root.querySelectorAll('[data-step]').forEach(function (b) {
    b.addEventListener('click', function () {
      cur = Math.max(1, cur + parseInt(b.getAttribute('data-step'), 10));
      render();
    });
  });
  if (reset) reset.addEventListener('click', function () { cur = base; render(); });
  render();
})();
