/* Kopioi-napit: leikepöydälle data-copy-url-attribuutin osoite. Jos napissa on [data-copy-label], vain sen teksti vaihtuu (kuvake säilyy). */
(function () {
  'use strict';
  document.querySelectorAll('[data-copy-url]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var url = btn.getAttribute('data-copy-url');
      if (!navigator.clipboard || !url) return;
      navigator.clipboard.writeText(url).then(function () {
        var label = btn.querySelector('[data-copy-label]') || btn;
        var old = label.textContent;
        label.textContent = 'kopioitu!';
        setTimeout(function () { label.textContent = old; }, 1500);
      });
    });
  });
})();
