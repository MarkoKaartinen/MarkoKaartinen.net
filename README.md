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

### Kategorian valinta

Artikkelilla on täsmälleen yksi kategoria (`categories: ["Mobiili"]`), ja nimi kirjoitetaan täsmälleen alla olevassa muodossa. Tarkempi aihe, laite, merkki ja julkaisumuoto kirjataan avainsanoiksi (`tags`).

Kategoriat: Elämä, Matkat, Mobiili, Tietokoneet, Vempaimet, Internet, Pelit, Koodaus, Kotilabra, Kulisseissa, Marko testaa, Podcastit ja vlogit, Kuulumiset, Huumori ja Joulu.

Valitse ensimmäinen, joka sopii:

1. Tämän blogin omat uudistukset, tekniikka ja ilmoitukset: Kulisseissa.
2. Kotipalvelin, oman kodin verkko ja älykoti: Kotilabra. Julkisen verkkopalvelun tai instanssin (Mastodon, Lemmy) ylläpito ja pelkkä käyttö: Internet.
3. Testi, kokeilu tai arvio laitteesta, palvelusta, sovelluksesta tai pelistä: Marko testaa. Laite jää avainsanaksi.
4. Podcast-jakso tai videoblogi: Podcastit ja vlogit.
5. Joulukalenteri, joulutervehdys tai muu selvästi jouluun liittyvä juttu: Joulu.
6. Perjantaipohdinta, tilapäivitys, vuosikatsaus ja muut kuulumiset: Kuulumiset.
7. Vitsit, meemit, sarjakuvat ja hauskat videot: Huumori.
8. Matkakertomukset: Matkat.
9. Kehitystyö ja omat verkkoprojektit: Koodaus. Tekoäly vain, jos artikkeli käsittelee kehitystyötä, muuten Internet.
10. Pelin sisältö, konsolit ja mobiilipelit: Pelit. Pelitietokone ja komponentit: Tietokoneet.
11. Puhelimet, tabletit, älykellot ja mobiilisovellukset: Mobiili.
12. PC, Mac, käyttöjärjestelmät, hiiret ja näppäimistöt: Tietokoneet.
13. Muut lisälaitteet (kamerat, äänilaitteet, 3D-tulostus): Vempaimet.
14. Verkkopalvelut, some ja tietoturva: Internet.
15. Kaikki muu: Elämä.

Kategoriasivujen kuvaukset ovat tiedostoissa `content/categories/{slug}/_index.md`. Vanhat kategoriaosoitteet ohjataan tiedostolla `data/ohjaukset.toml`.

## Julkaisu ja Mastodon

GitHub Actions -workflow rakentaa ja julkaisee sivun sekä postaa uudet artikkelit Mastodoniin. Ajo käynnistyy pushista `main`-haaraan, ajastettuna (cron) ja käsin. Postauksen tekee `scripts/mastodon-post.py`, joka kirjoittaa postauksen tunnuksen artikkelin front matteriin.

Artikkelin `mastodon_post_id` toimii näin:

| Arvo | Merkitys |
| --- | --- |
| `"115599350527283405"` | Postaus on tehty. Keskustelu näkyy artikkelin alla. |
| `false` | Artikkelia ei koskaan postata Mastodoniin. |
| kenttä puuttuu | Postataan, kun artikkeli on julkaistu (`draft: false`, `date` mennyt) ja `date` on uudempi kuin workflowssa asetettu rajapäivä. |

Rajapäivä (`MASTODON_SINCE`, asetettu workflowssa) on olemassa, ettei satoja vanhoja artikkeleita postata. Vanhoihin ei siksi tarvitse lisätä `false`-arvoa.

Postaus koostuu alkulauseesta ("Blogiini on ilmestynyt uusi juttu!" tai "…uusi resepti!"), otsikosta, kuvauksesta (`description`), linkistä ja avainsanoista hashtageina (`tags`, resepteillä `recipe_tags`). Tyhjät osat jätetään pois. Reseptit (`content/resepti/`) postataan samalla säännöllä kuin artikkelit. Jos tilin viimeisimmistä postauksista löytyy jo artikkelin linkki, uutta ei postata vaan sen tunnus otetaan talteen.

Ajon kulku:

1. Pushissa `main`-haaraan ja käsin ajettaessa julkaistaan aina (push tarkoittaa esim. ulkoasukorjausta). Ajastettu ajo tekee ensin kevyen tarkistuksen (ks. alla) eikä jatka, jos mitään ei ole julkaistavana.
2. Hugo rakentaa sivun. Tulevaisuuden päivämäärällä oleva artikkeli ei tule mukaan.
3. Sivu viedään palvelimelle (ks. "Palvelimen rakenne").
4. Jokaisesta postaamattomasta artikkelista tehdään Mastodon-postaus. Linkkikortti toimii, koska sivu on jo livenä.
5. Postauksen tunnus kirjoitetaan artikkelin front matteriin ja commitoidaan `main`-haaraan botin nimissä. Ennen committia tehdään `pull --rebase`.
6. Jos tunnuksia lisättiin, sivu rakennetaan ja viedään uudelleen, jolloin keskustelu tulee näkyviin.

Ajastettu ajo (15 minuutin välein) on olemassa tulevaisuuden artikkeleita varten: Hugo ei rakenna artikkelia ennen sen `date`-aikaa. Tarkistus (`scripts/odottaa-julkaisua.py`) ei rakenna mitään, vaan kestää muutaman sekunnin ja katsoo kahta asiaa:

- **Julkaisematon artikkeli:** artikkeli tai resepti ei ole luonnos ja sen `date` on mennyt, mutta osoite puuttuu livenä olevasta sivukartasta. Silloin sivu rakennetaan ja viedään, ja Mastodon-postaus tehdään perään.
- **Mastodon-postaus puuttuu:** julkaistu artikkeli odottaa postausta (esim. aiempi postaus epäonnistui). Silloin postataan ja viedään sivu uudelleen uudella tunnuksella.

Jos kumpaakaan ei ole, ajo päättyy tarkistukseen. Jos livenä olevaa sivukarttaa ei saada luettua, oletetaan että julkaisu tarvitaan. Cron ajetaan `main`-haarassa, ja GitHub voi myöhästyttää sitä muutaman minuutin.

Toteutus on `.github/workflows/julkaise.yml`, `scripts/odottaa-julkaisua.py`, `scripts/vie-palvelimelle.sh` ja `scripts/mastodon-post.py`. Ennen ensimmäistä ajoa GitHubiin tarvitaan `production`-ympäristö, jonka secretit ovat:

| Secret | Sisältö |
| --- | --- |
| `DEPLOY_HOST` | palvelimen osoite |
| `DEPLOY_USER` | SSH-käyttäjä |
| `DEPLOY_PATH` | sivuston juurikansio palvelimella (esim. `/home/mknet/markokaartinen.net`), jonka alle skripti tekee `releases/`, `current` ja `public/` |
| `DEPLOY_SSH_KEY` | yksityinen SSH-avain, jonka julkinen puoli on palvelimella |
| `DEPLOY_KNOWN_HOSTS` | palvelimen rivi `ssh-keyscan`-komennolla |
| `MASTODON_TOKEN` | kaartinen.social-sovelluksen pääsytunnus (`write:statuses`) |

Skripti lukee ympäristömuuttujat `MASTODON_TOKEN` (pääsytunnus, jolla on `write:statuses`-oikeus), `MASTODON_INSTANCE`, `MASTODON_ACCOUNT`, `MASTODON_SINCE` ja `SITE_URL`. Kokeilu ilman postausta: `DRY_RUN=1 python3 scripts/mastodon-post.py`.

### Palvelimen rakenne

`scripts/vie-palvelimelle.sh` vie sivun rsyncillä SSH:n yli. Jokainen vienti menee omaan kansioonsa ja `current`-symlinkki vaihdetaan siihen atomisesti, joten kävijä ei näe puolivalmista sivustoa:

```
$DEPLOY_PATH/
├── public/               huoltosivu (huolto.html -> index.html)
├── releases/<aika-sha>/  kolme viimeisintä vientiä
└── current -> releases/<uusin>
```

- Forgessa **Web directory** on `/current`, ja sivusto on livenä.
- **Huoltotila:** vaihda Web directoryksi `/public`, jolloin näkyy huoltosivu. Takaisin `/current`.
- **Palautus** edelliseen versioon palvelimella: `ln -sfn releases/<vanha> current`.
- Huoltosivu (`huolto.html` repon juuressa) päivitetään `public/`-kansioon joka viennillä. Se on itsenäinen eikä kuulu sivustoon.

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
