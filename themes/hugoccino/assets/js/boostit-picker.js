/*
 * Reaktioiden emojivalitsin: emoji-picker-element suomenkielisenä. Ladataan vasta, kun lukija avaa valitsimen (js/boostit.js).
 * Emojidata haetaan omalta palvelimelta (dataSource), ei ulkoisista palveluista.
 */
import { Picker } from 'emoji-picker-element';

const i18n = {
  categoriesLabel: 'Luokat',
  emojiUnsupportedMessage: 'Selaimesi ei tue värillisiä emojeita.',
  favoritesLabel: 'Suosikit',
  loadingMessage: 'Ladataan…',
  networkErrorMessage: 'Emojeita ei saatu ladattua.',
  regionLabel: 'Emojivalitsin',
  searchDescription: 'Kun hakutuloksia on, valitse ylä- tai alanuolella ja vahvista Enterillä.',
  searchLabel: 'Hae',
  searchResultsLabel: 'Hakutulokset',
  skinToneDescription: 'Kun valikko on auki, valitse ylä- tai alanuolella ja vahvista Enterillä.',
  skinToneLabel: 'Valitse ihonsävy (nyt {skinTone})',
  skinTonesLabel: 'Ihonsävyt',
  skinTones: ['Oletus', 'Vaalea', 'Keskivaalea', 'Keskisävy', 'Keskitumma', 'Tumma'],
  categories: {
    custom: 'Omat',
    'smileys-emotion': 'Hymiöt ja tunteet',
    'people-body': 'Ihmiset ja keho',
    'animals-nature': 'Eläimet ja luonto',
    'food-drink': 'Ruoka ja juoma',
    'travel-places': 'Matkat ja paikat',
    activities: 'Aktiviteetit',
    objects: 'Esineet',
    symbols: 'Symbolit',
    flags: 'Liput'
  }
};

export function createPicker(dataSource) {
  const picker = new Picker({ dataSource: dataSource, locale: 'fi', i18n: i18n });
  // Piilotetaan suosikkirivi (alin rivi): yleiset emojit ovat jo sivun pikarivillä
  const style = document.createElement('style');
  style.textContent = '.favorites { display: none !important; }';
  picker.shadowRoot.appendChild(style);

  // Valittu emoji korostetaan ruudukossa: emojipainikkeiden aria-label alkaa emojilla ("🔥, tuli"),
  // joten korostus tehdään tyylillä, jota päivitetään valinnan vaihtuessa (ja se toimii myös haun tuloksissa)
  const mark = document.createElement('style');
  picker.shadowRoot.appendChild(mark);
  picker.markSelected = function (emoji) {
    if (!emoji) { mark.textContent = ''; return; }
    const base = String(emoji).replace(/["\\\uFE0F]/g, '');
    mark.textContent =
      'button.emoji[aria-label^="' + base + ',"], button.emoji[aria-label^="' + base + '\uFE0F,"] {' +
      ' background: var(--button-active-background); outline: 2px solid var(--indicator-color); outline-offset: -2px; border-radius: 0.375rem; }';
  };
  return picker;
}
