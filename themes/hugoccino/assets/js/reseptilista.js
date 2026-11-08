/*
 * Reseptilistan suodatus kategorian mukaan. Valinta näkyy osoitteessa (?kategoria=dipit).
 */
(function () {
  'use strict';

  var box = document.getElementById('resepti-suodatin');
  var list = document.getElementById('resepti-lista');
  if (!box || !list) return;
  box.hidden = false;

  var buttons = Array.prototype.slice.call(box.querySelectorAll('[data-cat]'));
  var cards = Array.prototype.slice.call(list.children);

  function apply(cat, push) {
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cat') === cat ? 'true' : 'false'); });
    cards.forEach(function (li) {
      li.hidden = !!cat && (li.getAttribute('data-c') || '').indexOf('|' + cat + '|') === -1;
    });
    if (push) {
      var url = location.pathname + (cat ? '?kategoria=' + encodeURIComponent(cat) : '');
      history.replaceState(null, '', url);
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { apply(b.getAttribute('data-cat'), true); });
  });

  var wanted = (new URLSearchParams(location.search).get('kategoria') || '').toLowerCase();
  if (wanted && buttons.some(function (b) { return b.getAttribute('data-cat') === wanted; })) apply(wanted, false);
})();
