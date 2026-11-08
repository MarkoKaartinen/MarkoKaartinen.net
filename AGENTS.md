# MarkoKaartinen.net (Hugo)

MarkoKaartinen.net blogin staattinen Hugo-versio. Korvaa vanhan Laravel-version ([MarkoKaartinen/blogi](https://github.com/MarkoKaartinen/blogi)), kun valmis. Sisältö on suomeksi.

## Periaatteet

- Älä tee muutoksia, aja komentoja tai asenna mitään ilman käyttäjän hyväksyntää.
- Repo on **julkinen**. Älä koskaan kirjoita salaisuuksia, tokeneita, avaimia, sähköpostiosoitteita, tietokantadumppeja tai paikallisia tiedostopolkuja (esim. `/Users/...`) repoon, myöskään ohjetiedostoihin. Viittaa muihin projekteihin GitHub-osoitteella. Pidä `.gitignore` ajan tasalla.
- Nykyiset osoitteet säilyvät: artikkelit `/{vuosi}/{slug}` (ilman loppukauttaviivaa), `/kategoria/`, `/avainsana/`, `/sarja/`, `/reseptit`, `/resepti/` ja sivut kuten `/tietoa`. Slugeja ei muuteta.

## Rakenne

- Artikkelit: `content/{vuosi}/{slug}/index.md`, kuvat samassa kansiossa (page bundle).
- Tiedostonimet slugattuna (ei ä/ö/å, ei välilyöntejä).
- `import/` on raakadataa vanhasta blogista, eikä se mene gitiin.
- Teema on oma, Tailwind. Värit ovat [Catppuccinin](https://catppuccin.com/palette/) viralliset: tumma on Mocha ja vaalea Latte. Käytä vain paletin virallisia värejä ja niiden nimiä (esim. `base`, `text`, `mauve`) äläkä keksi omia sävyjä.

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
