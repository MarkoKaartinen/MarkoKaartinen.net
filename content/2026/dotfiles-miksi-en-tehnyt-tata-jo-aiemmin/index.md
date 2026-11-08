---
title: "dotfiles - miksi en tehnyt tätä jo aiemmin?"
date: 2026-10-19T13:03:00
description: "Tämä menee tosiaan sarjaan miksi ei tullut tehtyä jo aiemmin tätä urakkaa. Nimittäin ottaa ylös omia dotfiles määreitä ja pistää ne gittiin, josta ne saa helposti omille koneille."
categories: ["Devaus"]
tags: ["dotfiles", "github", "git", "macos", "linux", "asetukset", "konffaus", "windows", "devaus"]
mastodon_post_id: "117467028340039955"
---

Tämä menee tosiaan sarjaan miksi ei tullut tehtyä jo aiemmin tätä urakkaa. Nimittäin ottaa ylös omia dotfiles määreitä ja pistää ne gittiin, josta ne saa helposti omille koneille.
{.lead}

Tämä nykyinen MacBook Pro on ollut minulla käytössä about 2021 asti. Tämä on MacBook Pro 14″ vm. 2021 ja tässä on M1 Pro prosessori ja 16 Gt muistia ja 500 gigaa levytilaa. Eli suht perusmalli tuohon aikaan. Tämä pelittää vielä ja käytän tätä niin kauan, kuin se kestää. 

**Olisi** tietysti kiva joku tuoreempi kone ja enemmän tehoa sekä levytilaa, mutta tällä pärjää vielä hyvin. Sekä hinnat ovat mitä ovat...

## Mikä ihmeen dotfiles

Dotfiles tarkoittaa ohjelmien asetustiedostoja/-kansioita, joiden nimet alkavat usein pisteellä. Esimerkiksi `.gitconfig` ja `.bashrc` ovat tällaisia.

Käytännössä dotfiles-repoon voi kerätä kaikenlaisia ohjelmien asetuksia, vaikka tiedostojen nimet eivät alkaisikaan pisteellä.

Ideana on säilyttää asetukset versionhallinnassa, jolloin ne löytyvät helposti myös uudelle koneelle.

Aiheesta löytyy lisää tietoa osoitteesta [dotfiles.github.io](https://dotfiles.github.io/).

## Omat "pistetiedostot"

Laitoin toki omat dotfiles tiedostot [GitHubiin](https://github.com/MarkoKaartinen/dotfiles) ja sinne sitä tässä hissukseen rakentelen. 

Terminaali oli pidempään ajatus pistää vaihtoon ja ottaa käyttöön avoimen lähdekoodin [WezTerm](https://wezterm.org/) ja siihen [fish](https://fishshell.com/) shelliksi. Siitä se sitten ajatus lähti, että otetaan asetukset ylös niin saan samat määreet myös CachyOS Linux koneelle.

Sinne tulee uusia ja vanhoja konffeja sitä mukaa kun niitä sinne jaksan pistää. Itsellä tässä mäkillä pyörii jo devausympäristöt niin en tähän hetkeen ole noita olemassaolevia juurikaan laitellut - vasta näitä uudempia.

Repo on julkinen, joten sieltä saa vapaasti käydä kurkkimassa ja poimimassa omiin käyttöihin sopivia asetuksia.

## Tekoäly apuna

Tässä on tekoälyä äkytetty apuna. Dokumentointi on itselle sitä tylsintä niin tekoäly on saanut niitä pistää tonne ylös ja tehdä commit viestejä. Mä saan keskittyä säätämiseen.

Apua on kanssa kysytty, kun menee konffauksessa "sormi suuhun" ja on kyselty miksi joku ei toimi tai miten minkäkin saa toimimaan.

Sit joskus, kun on aika tehdä jonkinlainen asennus skripti tähän niin siinäkin saa sit tekoäly olla apuna.

On myös tullut palloteltua ajatuksia AI kanssa ja se onkin omanlaista hupia jo sekin.

## Homma jatkuu lätinöillä ja säädöllä

Tähän tulee tipoittain lisää säätöä ja muutosta. Osa backlogissa olevista jutuista jää käyttöön ja osa ei. Nykyisiä määreitä mitä ennen tän aloitusta ei välttis ole vielä täällä ollenkaan.

Tulevaisuudessa, kun joskus konetta uusii ja pääsee tekemään ihan puhtaalta pöydältä testiä niin näkee mitenkä tämä auttaa hommassa sekä mitä kaikkea tulee lisää.

Tästä on jo nyt ollut isosti hyötyä kun MacBookin ja CachyOS terminaalin konffit ui gitin yli koneelta toiselle. Pientä poikkeusta per käyttis on pitänyt tehdä sillä mäkkiä käyttelen pääosin tällä 14" näytöltä ja sitten CachyOS on vähän isompi pelinäyttö kii.

**Miksi vasta nyt?** - kysymykseen mulla ei ole vastausta. Jälkiviisaana olisi vuonna 2021 pitänyt alkaa tekemään jo tätä sillä silloin tuli tauon jälkeen taas MacBook työkoneeksi niin olisi ollut oikein mainio hetki.
