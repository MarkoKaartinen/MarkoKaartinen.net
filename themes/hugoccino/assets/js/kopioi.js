/* Kopioi-napit: leikepöydälle data-copy-url-attribuutin osoite. */
(function () {
  'use strict';
  document.querySelectorAll('[data-copy-url]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var url = btn.getAttribute('data-copy-url');
      if (!navigator.clipboard || !url) return;
      navigator.clipboard.writeText(url).then(function () {
        var old = btn.textContent;
        btn.textContent = 'kopioitu!';
        setTimeout(function () { btn.textContent = old; }, 1500);
      });
    });
  });
})();
