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

Apukomento `./uusi` kysyy tyypin ja otsikon, tekee otsikosta slugin (ä/ö/å → a/o/a, pienet kirjaimet, viivat), luo tiedoston oikeaan paikkaan ja täyttää front matterin. Pohjat ovat kansiossa `archetypes/`. Uusi sisältö on `draft: true`, joten `hugo server -D` näyttää sen.

```sh
./uusi                            # kysyy tyypin ja otsikon
./uusi artikkeli                  # kysyy otsikon
./uusi artikkeli "Otsikko tähän"  # content/{vuosi}/otsikko-tahan/index.md  -> /{vuosi}/otsikko-tahan
./uusi resepti "Reseptin nimi"    # content/resepti/reseptin-nimi/index.md  -> /resepti/reseptin-nimi
./uusi sivu "Sivun nimi"          # content/sivun-nimi.md                   -> /sivun-nimi
```

Komento ei ylikirjoita olemassa olevaa tiedostoa. Sama ilman apukomentoa: `hugo new content --kind artikkeli content/2026/slug/index.md` (myös `resepti` ja `sivu`). Kuvat laitetaan samaan kansioon ja nimetään slugattuina (`artikkelin-slug-kuvan-nimi.jpg`).

Kun sisältö on valmis, poista front matterista `draft: true`. Artikkelin `date` on julkaisuaika (`2026-11-09T08:30:00`, ilman aikavyöhykettä). Jos artikkelista on postaus Mastodonissa, lisää sen tunnus kenttään `mastodon_post_id`, niin keskustelu näkyy artikkelin kommentteina.

## Mastodon-postaus

`scripts/mastodon-post.py` postaa julkaistut artikkelit ja reseptit Mastodoniin ja kirjoittaa postauksen tunnuksen artikkelin front matteriin.

Artikkelin `mastodon_post_id` toimii näin:

| Arvo | Merkitys |
| --- | --- |
| `"115599350527283405"` | Postaus on tehty. Keskustelu näkyy artikkelin alla. |
| `false` | Artikkelia ei koskaan postata Mastodoniin. |
| kenttä puuttuu | Postataan, kun artikkeli on julkaistu (`draft: false`, `date` mennyt) ja `date` on uudempi kuin rajapäivä. |

Rajapäivä (`MASTODON_SINCE`, oletus `2026-11-09`) on olemassa, ettei satoja vanhoja artikkeleita postata. Vanhoihin ei siksi tarvitse lisätä `false`-arvoa.

Postaus koostuu alkulauseesta ("Blogiini on ilmestynyt uusi juttu!" tai "…uusi resepti!"), otsikosta, kuvauksesta (`description`), linkistä ja avainsanoista hashtageina (`tags`, resepteillä `recipe_tags`). Tyhjät osat jätetään pois. Reseptit (`content/resepti/`) postataan samalla säännöllä kuin artikkelit. Jos tilin viimeisimmistä postauksista löytyy jo artikkelin linkki, uutta ei postata vaan sen tunnus otetaan talteen.

Skripti lukee ympäristömuuttujat `MASTODON_TOKEN` (pääsytunnus, jolla on `write:statuses`-oikeus), `MASTODON_INSTANCE`, `MASTODON_ACCOUNT`, `MASTODON_SINCE` ja `SITE_URL`. Kokeilu ilman postausta: `DRY_RUN=1 python3 scripts/mastodon-post.py`.

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
