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

## Uuden sisällön luominen

Pohjat ovat kansiossa `archetypes/`. Luo tiedosto Hugolla niin front matter on valmiina (`draft: true`, joten `hugo server -D` näyttää sen). Slug on kansion tai tiedoston nimi: pienillä kirjaimilla, ilman ä/ö/å-kirjaimia ja välilyöntejä.

```sh
# Artikkeli (osoite /{vuosi}/{slug}, kuvat samaan kansioon)
hugo new content --kind artikkeli content/2026/uuden-artikkelin-slug/index.md

# Resepti (osoite /resepti/{slug})
hugo new content --kind resepti content/resepti/reseptin-slug/index.md

# Sivu (osoite /{slug}, esim. /tietoa)
hugo new content --kind sivu content/sivun-slug.md
```

Kun sisältö on valmis, poista front matterista `draft: true`. Artikkelin `date` on julkaisuaika (`2026-11-09T08:30:00`, ilman aikavyöhykettä). Jos artikkelista on postaus Mastodonissa, lisää sen tunnus kenttään `mastodon_post_id`, niin keskustelu näkyy artikkelin kommentteina. Kuvat nimetään slugattuina (`artikkelin-slug-kuvan-nimi.jpg`).

Lisätietoja periaatteista, rakenteesta ja käytännöistä on tiedostossa [AGENTS.md](AGENTS.md).

## Analytiikka (Plausible)

Skripti ladataan vain tuotantokoonnissa, ja se kulkee oman verkkotunnuksen kautta. Asetus on `params.plausible.proxy` (`hugo.toml`), ja nginxin pitää proxytata kaksi polkua Plausible-palvelimelle:

```nginx
# server-lohkoon (korvaa <plausible-palvelin> ja <skriptin-tunnus> Plausiblen antamilla arvoilla)
location = /plau/script.js {
    proxy_pass https://<plausible-palvelin>/js/<skriptin-tunnus>.js;
    proxy_set_header Host <plausible-palvelin>;
    proxy_ssl_server_name on;
}

location = /plau/event {
    proxy_pass https://<plausible-palvelin>/api/event;
    proxy_set_header Host <plausible-palvelin>;
    proxy_ssl_server_name on;
    proxy_http_version 1.1;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header CF-Connecting-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
}
```

Cloudflare-proxyn takana nginxin on palautettava kävijän oikea IP ennen tätä (`set_real_ip_from` Cloudflaren alueille ja `real_ip_header`, http-tasolla esim. `conf.d/cloudflare.conf`). Muuten `$remote_addr` on Cloudflaren osoite ja Plausible laskee kaikki kävijät samaksi.
