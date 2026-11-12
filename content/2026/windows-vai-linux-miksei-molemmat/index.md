---
title: "Windows vai Linux? Miksei molemmat!"
date: 2026-01-11T16:59:00
description: "Pelikoneeseen asennetaan Windows 11 ja CachyOS Linux dualboot-ympäristöön. Miksi valitsin juuri CachyOS:n, miten dualboot toteutetaan ja mitä haasteita edessä? Seuraa projektin etenemistä artikkelisarjassa."
categories: ["Tietokoneet"]
tags: ["dualboot", "linux", "windows 11", "windows", "cachyos", "pelaaminen", "pelikone", "pelit", "arch linux", "kde plasma", "proton", "käyttöjärjestelmä", "amd"]
series: ["Windows ja Linux pelikoneessa"]
mastodon_post_id: "115877079033996373"
---

Päätös on tehty. On aika alkaa säätämään pelikoneen kanssa. Hieman Windowsin uudelleenasennusta tässä pohdiskelin ja sen takia sitten tuli mieleen, että samassa projektissa voisi pistää myös koko paletin uusiksi. Puhdas Windows ja puhdas Linux rinnakkain.
{.lead}

## Miksi?

Kysymys ennemmin että miksi ei? Kuten pohdiskelin [Linux pelaaminen](https://pelittaa.fi/t/linux-pelaaminen/36?u=zetakes) ketjussa niin Linux pelaaminen on kehittynyt hurjaa vauhtia viime aikoina ja osa kiitoksesta menee Valvelle sillä he on edistänyt tätä puolta isosti. Tässä taas syynä se, että heillä on Linuxin päällä pyörivä tuote nimeltä Steamdeck ja tulossa on "Steambox" tai millä nimellä se tulee olemaankaan.

Sitten mennään myös siihen perinteiseen, että pidän säätämisestä ja ei tuo kokeilu tule hukkaan menemään. Tästä tuleekin ihan artikkeli sarja tänne blogiin ja se kantaa nimeä [Windows ja Linux pelikoneessa](/sarja/windows-ja-linux-pelikoneessa). Tämähän on oikeastaan jatkoa sarjalle [Pelikone läppärin tilalle](/sarja/pelikone-lapparin-tilalle).

Itsellä Linux tulee siis pelikoneeseen ja ajatus on nimenomaan pelata myös Linux puolella. Itse olin tätä onneksi hieman jo pohdiskellut aikanaan, kun konetta kasasin ja päädyin AMD näytönohjaimeen, joka onkin ainakin aikoinaan ollut paremmin tuettu Linux puolella. 

## Mikä distro?

Tämä olikin ehkä tässä vaiheessa se haastavin vaihe. Olen aiemmin ROG Ally käsikoneessa pyörittänyt [Bazzitea](https://bazzite.gg/) ja [SteamOS](https://store.steampowered.com/steamos/) käyttöjärjestelmiä. Bazziten taustalla on muistaakseni Fedora ja SteamOS taas Arch. 

Nyt kuitenkin ajattelin lähteä kokeilemaan [CachyOS](https://cachyos.org/) käyttöjärjestelmää. Tämä pyörii Arch Linuxin päällä ja on itselle sinänsä uusi kokemus sillä olen pääosin pyöritellyt Debian pohjaisia Linuxeja ja palvelin käytössä onkin useampi Ubuntu virtuaalipalvelin pyörimässä.

CachyOS onkin nyt suht hyvässä nosteessa ja onkin kirjoitushetkellä [DistroWatchin](https://distrowatch.com/) 6kk suosilistan ensimmäinen heti [Mintin](https://linuxmint.com/) edellä. Mitä itse olen tässä hieman lueskellut niin CachyOS vaikuttaa mielenkiintoiselta senkin takia, että ilmeisesti on optimoitu suorituskykyä eri tavoin ja Archiin verrattuna on hieman helppokäyttöisempi. Ilmeisesti myös juuri pelaamiseen tämä on ollut nyt suosiossa juuri suorituskyvyn optimoinnin takia.

Mikään ei myöskään estä vaihtamasta distroa jos siltä alkaa tuntumaan. Tuo pelikone kun ei ole ns. työkäytössä niin sillä voi hieman kokeilla.

Työpöytänä tulen varmaan koittamaan KDE Plasmaa tai jos jollain on suositella selkeästi jotain muuta niin saa heittää viestiä! Näitäkin voinee suht helpolla työllä vaihtaa ihan ilman uudelleenasennustakin.

## Miksi dualboot?

Kaikki pelit ei tule toimimaan Linuxilla. Osa vaatii anticheattia, jota ei ole saatavilla Linuxille. Ainakin Battlefield 6 on sellainen peli johon tarvitaan Windowsia. Siksi melkein pitää olla Windows tuossa rinnalla pyörimässä. Koitan kuitenkin pääasiallisesti käyttää Linuxia. 

Windows on myös melkein oltava siksi, että joskus pitää säätää Windowsin puolella jotain työhön liittyvää ja monesti tuo kone on se helpoin rasti. Muuten voisi tuolla emulaattorissa pyörittää Windowsia, mutta siinä ei sitten tuo peli puoli toimi.

Dualboot on onneksi tänä päivänä helppo ratkaisu ja [Boot managereiksi](https://wiki.cachyos.org/installation/boot_managers/) on vaihtoehtoja. Ehkä lähden koittamaan itselle uutta [Limineä](https://codeberg.org/Limine/Limine). 

## Loppulätinät

Tässä, kun tänä sunnuntaina aamulla aloitin tämän kirjoituksen niin tämä oli jo mielessä ollut vajaa pari viikkoa. Piti hieman pohdiskella, että tulenko tekemään ja jaksanko alkaa niin päädyin sitten, että kyllä alan tekemään ja kyllä jaksan.

Nyt kun tässä illan kähmässä kirjoitan tätä loppuun niin olen asentanut Windows 11 käyttiksen uudelleen ja päivitin myös BIOSin joutessani. En tule rustailemaan Windowsin asennuksesta sen isommin sillä siinä ei nyt sinällään mitään uutta tai ihmeellistä ole.

Seuraavaksi odottelen sitten omaa kovalevyä tuolle Cachylle ja pääsen sitten asentelemaan sitä. Oma kovalevy on omasta vinkkelistä melkein vaatimus niin ei sitten tule isompaa sekoilua osioiden kanssa. Vähän on semmoista tuntumaa ja juttua Internetissä, että tuo on muutenkin paras vaihtoehto dualbootille.

**Nyt onkin hyvä hetki pistää vinkkejä ja omia kokemuksia tulemaan!**
