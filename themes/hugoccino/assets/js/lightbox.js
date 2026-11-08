// Kuvien ja gallerioiden lightbox. Käyttää <dialog>-elementtiä, ei riippuvuuksia.
// Sivun omat kuvat (.sisalto ja img[data-lightbox]) avautuvat automaattisesti. Muut skriptit (esim. Mastodon-kuvat)
// voivat avata katselun kutsulla window.hugoLightbox([{ src, alt, caption }], aloitusindeksi).
(function () {
  'use strict';
  if (typeof HTMLDialogElement === 'undefined') return;

  var dlg = null;
  var view, cap, count;
  var items = [];
  var cur = 0;

  function build() {
    if (dlg) return;
    dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Kuvan katselu');
    dlg.innerHTML =
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="lb-btn lb-close" aria-label="Sulje">&times;</button>' +
      '<button type="button" class="lb-btn lb-prev" aria-label="Edellinen">&lsaquo;</button>' +
      '<button type="button" class="lb-btn lb-next" aria-label="Seuraava">&rsaquo;</button>' +
      '<span class="lb-count"></span>';
    document.body.appendChild(dlg);
    view = dlg.querySelector('img');
    cap = dlg.querySelector('figcaption');
    count = dlg.querySelector('.lb-count');

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

    // Kosketus: pyyhkäisy sivulle vaihtaa kuvaa, pyyhkäisy alas sulkee
    var sx = 0, sy = 0, tracking = false;
    dlg.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { tracking = false; return; }
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      tracking = true;
    }, { passive: true });
    dlg.addEventListener('touchend', function (e) {
      if (!tracking) return;
      tracking = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - sx;
      var dy = t.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(cur + (dx < 0 ? 1 : -1));
      else if (dy > 90 && dy > Math.abs(dx) * 1.5) dlg.close();
    }, { passive: true });
  }

  function show(i) {
    cur = (i + items.length) % items.length;
    var it = items[cur];
    view.src = it.src;
    view.alt = it.alt || '';
    cap.textContent = it.caption || it.alt || '';
    count.textContent = items.length > 1 ? (cur + 1) + ' / ' + items.length : '';
    dlg.classList.toggle('lb-single', items.length < 2);
  }

  function open(list, i) {
    if (!list || !list.length) return;
    build();
    items = list;
    show(i || 0);
    if (!dlg.open) dlg.showModal();
  }
  window.hugoLightbox = open;

  // Sivun omat kuvat
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.sisalto img, img[data-lightbox]'))
    .filter(function (img, i, all) { return all.indexOf(img) === i && !img.closest('a') && (parseInt(img.getAttribute('width'), 10) || 999) >= 120; });

  function toItem(img) {
    var fc = img.closest('figure') && img.closest('figure').querySelector('figcaption');
    return { src: img.getAttribute('data-full') || img.currentSrc || img.src, alt: img.alt, caption: fc ? fc.textContent : img.alt };
  }

  imgs.forEach(function (img, i) {
    img.classList.add('lb-zoom');
    img.addEventListener('click', function () { open(imgs.map(toItem), i); });
  });
})();
