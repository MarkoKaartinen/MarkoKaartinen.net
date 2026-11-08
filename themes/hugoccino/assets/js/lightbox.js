// Kuvien ja gallerioiden lightbox. Käyttää <dialog>-elementtiä, ei riippuvuuksia.
(function () {
  'use strict';
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.sisalto img, img[data-lightbox]'))
    .filter(function (img, i, all) { return all.indexOf(img) === i && !img.closest('a') && (parseInt(img.getAttribute('width'), 10) || 999) >= 120; });
  if (!imgs.length || typeof HTMLDialogElement === 'undefined') return;

  var dlg = document.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.setAttribute('aria-label', 'Kuvan katselu');
  dlg.innerHTML =
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button type="button" class="lb-btn lb-close" aria-label="Sulje">&times;</button>' +
    '<button type="button" class="lb-btn lb-prev" aria-label="Edellinen">&lsaquo;</button>' +
    '<button type="button" class="lb-btn lb-next" aria-label="Seuraava">&rsaquo;</button>' +
    '<span class="lb-count"></span>';
  document.body.appendChild(dlg);
  var view = dlg.querySelector('img');
  var cap = dlg.querySelector('figcaption');
  var count = dlg.querySelector('.lb-count');
  var cur = 0;

  function show(i) {
    cur = (i + imgs.length) % imgs.length;
    var img = imgs[cur];
    view.src = img.getAttribute('data-full') || img.currentSrc || img.src;
    view.alt = img.alt;
    var fc = img.closest('figure') && img.closest('figure').querySelector('figcaption');
    cap.textContent = fc ? fc.textContent : img.alt;
    count.textContent = imgs.length > 1 ? (cur + 1) + ' / ' + imgs.length : '';
    dlg.classList.toggle('lb-single', imgs.length < 2);
  }
  function open(i) {
    show(i);
    if (!dlg.open) dlg.showModal();
  }

  imgs.forEach(function (img, i) {
    img.classList.add('lb-zoom');
    img.addEventListener('click', function () { open(i); });
  });
  dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
  dlg.querySelector('.lb-prev').addEventListener('click', function () { show(cur - 1); });
  dlg.querySelector('.lb-next').addEventListener('click', function () { show(cur + 1); });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg || e.target.tagName === 'FIGURE') dlg.close();
  });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1); }
  });
  dlg.addEventListener('close', function () { view.removeAttribute('src'); });
})();
