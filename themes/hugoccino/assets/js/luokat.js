/*
 * Kategorialistan järjestys: ls-komennon liput (-S määrä, -t uusin, ei lippua = aakkos).
 */
(function () {
  'use strict';

  var list = document.querySelector('[data-sort-list]');
  var bar = document.querySelector('[data-sorts]');
  var flag = document.querySelector('[data-flag]');
  if (!list || !bar || !flag) return;
  bar.hidden = false;

  var items = Array.prototype.slice.call(list.children);
  var buttons = Array.prototype.slice.call(bar.querySelectorAll('[data-sort]'));

  var sorters = {
    S: function (a, b) { return b.dataset.n - a.dataset.n || a.dataset.a.localeCompare(b.dataset.a, 'fi'); },
    t: function (a, b) { return b.dataset.d.localeCompare(a.dataset.d) || b.dataset.n - a.dataset.n; },
    '': function (a, b) { return a.dataset.a.localeCompare(b.dataset.a, 'fi'); }
  };

  function apply(key) {
    items.slice().sort(sorters[key]).forEach(function (li) { list.appendChild(li); });
    flag.textContent = key;
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-sort') === key ? 'true' : 'false'); });
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { apply(b.getAttribute('data-sort')); });
  });
})();
