// Kahvilaskuri: suhde (1 : N), kupit pikanappeina ja tulos-kentät (kahvia ja vettä grammoina).
// vesi = kahvi * suhde. Kuppinappi asettaa veden määräksi kupit * kupin koko.
// Kumpaa tahansa tulos-kenttää voi muokata, toinen päivittyy. Asetukset tallentuvat selaimeen.
(function () {
  'use strict';
  var root = document.getElementById('kahvilaskuri');
  if (!root) return;
  var $ = function (s) { return root.querySelector(s); };
  var $$ = function (s) { return root.querySelectorAll(s); };
  var ratioIn = $('[data-ratio]');
  var cupIn = $('[data-cup]');
  var waterIn = $('[data-water]');
  var coffeeIn = $('[data-coffee]');
  var reset = $('[data-reset]');
  var DEF_RATIO = parseFloat(root.getAttribute('data-default-ratio'));
  var DEF_CUP = parseFloat(root.getAttribute('data-default-cup'));
  var KEY = 'kahvilaskuri3';
  var DEF_CUPS = 4;

  var cups = DEF_CUPS; // valittu kuppimäärä, null kun määrä on kirjoitettu itse
  var source = 'water'; // kumpi on "totuus": 'water' tai 'coffee'
  var amount = DEF_CUPS * DEF_CUP; // lähteen määrä grammoina

  function num(input, fallback) {
    var v = parseFloat(String(input.value).replace(',', '.'));
    return v > 0 ? v : fallback;
  }
  function round1(n) { return String(Math.round(n * 10) / 10); }
  function amounts() {
    var ratio = num(ratioIn, DEF_RATIO);
    return source === 'water'
      ? { ratio: ratio, water: amount, coffee: amount / ratio }
      : { ratio: ratio, coffee: amount, water: amount * ratio };
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ ratio: ratioIn.value, cup: cupIn.value, cups: cups, source: source, amount: amount }));
    } catch (e) {}
  }
  // typing: kenttä, jota käyttäjä parhaillaan kirjoittaa, jätetään rauhaan
  function render(typing) {
    var a = amounts();
    $$('[data-preset]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(parseFloat(b.getAttribute('data-preset')) === a.ratio));
    });
    $$('[data-cups]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(cups === parseInt(b.getAttribute('data-cups'), 10)));
    });
    if (typing !== 'water') waterIn.value = round1(a.water);
    if (typing !== 'coffee') coffeeIn.value = round1(a.coffee);
    reset.hidden = a.ratio === DEF_RATIO && num(cupIn, DEF_CUP) === DEF_CUP && cups === DEF_CUPS;
    save();
  }
  function setCups(n) {
    cups = n;
    source = 'water';
    amount = n * num(cupIn, DEF_CUP);
  }

  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved) {
      if (saved.ratio) ratioIn.value = saved.ratio;
      if (saved.cup) cupIn.value = saved.cup;
      if (saved.amount > 0 && (saved.source === 'water' || saved.source === 'coffee')) {
        source = saved.source;
        amount = saved.amount;
      }
      cups = saved.cups >= 1 && saved.cups <= 10 ? saved.cups : null;
    }
  } catch (e) {}

  $$('[data-preset]').forEach(function (b) {
    b.addEventListener('click', function () { ratioIn.value = b.getAttribute('data-preset'); render(); });
  });
  ratioIn.addEventListener('input', function () { render(); });
  cupIn.addEventListener('input', function () {
    if (cups) setCups(cups);
    render();
  });
  $$('[data-cups]').forEach(function (b) {
    b.addEventListener('click', function () {
      setCups(parseInt(b.getAttribute('data-cups'), 10));
      render();
    });
  });
  function typed(input, which) {
    input.addEventListener('input', function () {
      var v = parseFloat(String(input.value).replace(',', '.'));
      if (!(v > 0)) return;
      cups = null;
      source = which;
      amount = v;
      render(which);
    });
  }
  typed(waterIn, 'water');
  typed(coffeeIn, 'coffee');
  reset.addEventListener('click', function () {
    ratioIn.value = DEF_RATIO;
    cupIn.value = DEF_CUP;
    setCups(DEF_CUPS);
    render();
  });
  render();
})();
