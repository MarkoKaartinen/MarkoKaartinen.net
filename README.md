# MarkoKaartinen.net

MarkoKaartinen.net blogin staattinen [Hugo](https://gohugo.io/)-versio.

- Sivusto: [markokaartinen.net](https://markokaartinen.net)
- Teema: oma `hugoccino` (Tailwind, Catppuccin-värit)

## Vaatimukset

- Hugo extended (kehitetty versiolla 0.169)
- Node.js 22.15 tai uudempi (Tailwind-CLI tarvitsee sen). Aja `npm ci` ennen ensimmäistä koontia.
- ImageMagick vain jakokuvien pohjien uudelleen luontiin (`scripts/og/luo-pohjat.sh`)

## Komennot

- `hugo server -D`: kehityspalvelin (`-D` näyttää luonnokset)
- `npm run build`: tuotantokoonti. Tyhjentää `public/`-kansion (poistuneet sivut eivät jää mukaan) ja tekee sen jälkeen Pagefind-hakuindeksin. Älä julkaise pelkällä `hugo`-koonnilla, koska silloin `/haku` ei toimi.
- `npm run search:dev`: tekee hakuindeksin kehityspalvelinta varten (`static/pagefind/`, ei versionhallintaan). Aja uudelleen, kun sisältö muuttuu.

Lisätietoja periaatteista, rakenteesta ja käytännöistä on tiedostossa [AGENTS.md](AGENTS.md).
