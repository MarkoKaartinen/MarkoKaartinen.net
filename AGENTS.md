# MarkoKaartinen.net (Hugo)

MarkoKaartinen.net blogin staattinen Hugo-versio. Korvaa vanhan Laravel-version ([MarkoKaartinen/blogi](https://github.com/MarkoKaartinen/blogi)), kun valmis. Sisältö on suomeksi.

## Periaatteet

- Älä tee muutoksia, aja komentoja tai asenna mitään ilman käyttäjän hyväksyntää.
- Repo on **julkinen**. Älä koskaan kirjoita salaisuuksia, tokeneita, avaimia, sähköpostiosoitteita, tietokantadumppeja tai paikallisia tiedostopolkuja (esim. `/Users/...`) repoon, myöskään ohjetiedostoihin. Viittaa muihin projekteihin GitHub-osoitteella. Pidä `.gitignore` ajan tasalla.
- Nykyiset osoitteet säilyvät: artikkelit `/{vuosi}/{slug}` (ilman loppukauttaviivaa), `/kategoria/`, `/avainsana/`, `/sarja/`, `/reseptit`, `/resepti/` ja sivut kuten `/tietoa`. Slugeja ei muuteta.
- Loppukauttaviiva: Hugo tekee sivuista kansioita (`/2020/slug/`), mutta virallinen osoite on ilman viivaa. `canonical`, `og:url`, JSON-LD, sivukartta ja syötteet käyttävät partialia `canonical.html`, joka poistaa viimeisen `/` (etusivua lukuun ottamatta). Käytä sitä aina, kun kirjoitat sivun koko osoitteen. Palvelimen on tarjottava molemmat muodot ilman ohjausta (`try_files $uri $uri/index.html =404;`).

## Rakenne

- Artikkelit: `content/{vuosi}/{slug}/index.md`, kuvat samassa kansiossa (page bundle).
- Tiedostonimet slugattuna (ei ä/ö/å, ei välilyöntejä).
- Teema on oma, Tailwind. Värit ovat [Catppuccinin](https://catppuccin.com/palette/) viralliset: tumma on Mocha ja vaalea Latte. Käytä vain paletin virallisia värejä ja niiden nimiä (esim. `base`, `text`, `mauve`) äläkä keksi omia sävyjä.
- Poikkeus: Latten (vaalea) aksenttivärit eivät kaikki riitä tekstinä WCAG AA -kontrastiin (4,5:1). Esteettömyyden vuoksi vaaleassa teemassa on omia tummennettuja sävyjä `main.css`:ssä: `--ctp-peach-text` (kategorialinkit), `--ctp-prompt-text` (kehotteen polku), `--code-*` (koodin syntaksikorostus, vain `.chroma`-alueella) ja `--mark-bg`/`--mark-fg` (korostettu teksti). Tumma teema käyttää Mochan virallisia värejä. Uusia omia sävyjä ei saa lisätä ilman käyttäjän suoraa käskyä.

## Kategoriat

Artikkelilla on täsmälleen yksi kategoria (`categories: ["Mobiili"]`), ja nimi kirjoitetaan frontmatteriin täsmälleen alla olevassa muodossa. Tarkempi aihe, laite, merkki ja julkaisumuoto kirjataan avainsanoiksi (`tags`), jatkumot sarjoiksi (`series`). Ruoka, Apple, Tumblr ja perjantaipohdinta ovat avainsanoja.

Kategoriat: Elämä, Matkat, Mobiili, Tietokoneet, Vempaimet, Internet, Pelit, Koodaus, Kotilabra, Kulisseissa, Marko testaa, Podcastit ja vlogit, Kuulumiset, Huumori, Joulu. Kategoriasivujen kuvaukset ovat tiedostoissa `content/categories/{slug}/_index.md`.

Valintasäännöt, ensimmäinen osuma ratkaisee:

1. Tämän blogin omat uudistukset, tekniikka ja ilmoitukset: Kulisseissa.
2. Kotipalvelin, oman kodin verkko ja älykoti: Kotilabra. Julkisen verkkopalvelun tai instanssin (Mastodon, Lemmy) ylläpito ja pelkkä käyttö: Internet.
3. Testi, kokeilu tai arvio laitteesta, palvelusta, sovelluksesta tai pelistä: Marko testaa. Laite jää avainsanaksi.
4. Podcast-jakso tai videoblogi: Podcastit ja vlogit, myös silloin kun jakso käsittelee yhtä laitetta.
5. Joulukalenterin luukut, joulutervehdykset ja muut selvästi jouluun liittyvät jutut: Joulu.
6. Perjantaipohdinta, tilapäivitys, vuosikatsaus ja muut kuulumiset: Kuulumiset.
7. Vitsit, meemit, sarjakuvat ja hauskat videot: Huumori.
8. Matkakertomukset: Matkat.
9. Kehitystyö ja omat verkkoprojektit: Koodaus. Tekoäly kuuluu tänne vain, jos artikkeli käsittelee kehitystyötä, muuten Internetiin.
10. Pelin sisältö, konsolit ja mobiilipelit: Pelit. Pelitietokone ja komponentit: Tietokoneet.
11. Puhelimet, tabletit, älykellot ja mobiilisovellukset: Mobiili. Apple-artikkelit luokitellaan laitteen mukaan (iPhone ja iPad Mobiili, Mac Tietokoneet).
12. PC, Mac, käyttöjärjestelmät, hiiret ja näppäimistöt: Tietokoneet.
13. Muut lisälaitteet (kamerat, äänilaitteet, 3D-tulostus): Vempaimet.
14. Verkkopalvelut, some ja tietoturva: Internet.
15. Kaikki muu: Elämä.

Podcastit ja vlogit sekä Kuulumiset jakavat artikkelit muodon mukaan, eivät aiheen. Muut kategoriat ovat aiheita.

Vanhat kategoriaosoitteet ohjataan tiedostolla `data/ohjaukset.toml`. Kun kategoria poistetaan tai nimetään uudelleen, lisää rivi sinne. Koonti pysähtyy, jos kohdetta ei ole tai vanha osoite on taas oikea sivu.

## Fontit

- Leipäteksti: Atkinson Hyperlegible Next. Koodi ja meta: JetBrains Mono. Otsikoissa testataan aluksi JetBrains Monoa.
- Hostaus omalta palvelimelta (`assets/fonts/`, woff2). Ei ulkoisia fontti- tai skriptipalveluita.
- Lisenssitiedostot (OFL.txt) pysyvät fonttien vieressä.

## Git

Commitoi vain, kun käyttäjä pyytää.

- Jaa odottavat muutokset järkeviin osiin. Mieluummin monta pientä committia kuin yksi liian iso.
- Stage vain kyseiseen committiin kuuluvat tiedostot, ja tarkista staged-muutokset ennen committia.
- Älä koskaan commitoi toisiinsa liittymättömiä muutoksia samaan committiin.
- Älä koskaan commitoi salaisuuksia tai tunnuksia.
- Viesti suomeksi, imperatiivi: "Lisää", "Korjaa", "Päivitä", "Poista".
- Otsikko aina, lyhyt (max 72 merkkiä), kuvaava ja ilman etuliitteitä. Kerro mitä muuttui, ei pelkkää versionumeroa.
- Body, kun lisäkonteksti auttaa. Lyhyt ja ytimekäs.
- Ei emojeja commit-viesteihin.
- Ei koskaan Co-Authored-By -riviä eikä mitään AI-mainintoja tai -allekirjoituksia commiteissa tai pull requesteissa.

## Komennot

- `hugo server -D`: kehityspalvelin (`-D` näyttää luonnokset)
- `hugo`: rakenna `public/`
- `npm run build`: tuotantokoonti (`hugo` ja sen jälkeen Pagefind-hakuindeksi `public/pagefind/`). Tailwind lukee luokat suoraan teeman layouteista ja JS-tiedostoista (`@source` `main.css`:ssä), joten puhtaalla koonnilla (CI) ja kehityspalvelimella yksi koonti riittää. Jos ajat paikallisesti `hugo`-koonnin vanhan välimuistin päälle ja muokkasit templateja, CSS voi olla yhden koonnin jäljessä: aja uudelleen tai lisää `--ignoreCache`. Jos luokka muodostetaan templatessa osista (esim. `text-{{ .tone }}`), kirjoita koko luokka johonkin näkyviin tai lisää se `@source inline(...)`-listaan.
- `npm run search:dev`: tekee Pagefind-indeksin kehityspalvelinta varten (`static/pagefind/`, ei versionhallintaan). Aja uudelleen, kun sisältö muuttuu.
