---
title: "@Liikennetieto botti"
date: 2012-07-07T10:06:00
description: "Eilen innostuin koodailemaan ja testaamaan miten saisin tehtyä pätevän botin Twitteriin. Koska työkseni koodaan PHP:tä niin kielen valinta oli luonnollinen ja lähdin rakentamaan sillä bottia joka parsii liikennedataa. Selitän tuon @Liikennetieto botin toimintaa seuraavaksi ja kerron hieman miten se tekee sen ja mitä ominaisuuksia siinä käytännössä on. Joka viides minuutti skripti tarkastaan onko tullut uusia"
categories: ["Blogi"]
tags: ["botti", "koodaus", "liikenne", "liikennetiedotteet", "liikennetieto", "php", "twitter"]
aliases: ["/liikennetieto-botti/"]
---

Eilen innostuin koodailemaan ja testaamaan miten saisin tehtyä pätevän botin Twitteriin. Koska työkseni koodaan PHP:tä niin kielen valinta oli luonnollinen ja lähdin rakentamaan sillä bottia joka parsii liikennedataa.

Selitän tuon [@Liikennetieto](http://twitter.com/Liikennetieto) botin toimintaa seuraavaksi ja kerron hieman miten se tekee sen ja mitä ominaisuuksia siinä käytännössä on.

Joka viides minuutti skripti tarkastaan onko tullut uusia liikennetiedotteita [TieInfon Apista](http://tieinfo.mustcode.fi/tieinfo/). Mikäli on tullut uusia niin lisätään se kantaan ja tviitataan uusi tiedote. Tviitissä on myös linkki sivustolle [liikenne.kaartinen.eu](http://liikenne.kaartinen.eu), jonne tallentuu kaikki tviitatut tiedotteet ja sieltä näkee myös tiedotteen tarkemman kuvauksen, sijainnin kartalla sekä kelikameroita lähistöltä (mikäli niitä löytyy). Yksinkertaisuudessaan homma on siinä, koodia itse bottiin ei tarvittu paljoa. Sivuston teko ja datan parsiminen tuotti eniten koodirivejä.

Tulen kehittämään tuota bottia tarpeen mukaan ja lisäämään ainakin joitain säätietoja lähistöltä tai jotain muuta vastaavaa. Te voitte ehdottaa minulle mitä tuohon voisi lisätä, tuo on aika toimiva paketti noinkin (vaikka itse sen sanonkin).

Esimerkki botin tviitistä:

> Tie 19, Lapua, Kauhava. ENSITIEDOTE LIIKENNEONNETTOMUUDESTA. [\#liikenne](https://twitter.com/hashtag/liikenne?src=hash&ref_src=twsrc%5Etfw) [\#Lapua](https://twitter.com/hashtag/Lapua?src=hash&ref_src=twsrc%5Etfw) <http://t.co/QynHOxz6>
>
> — Liikennetieto (@Liikennetieto) [July 7, 2012](https://twitter.com/Liikennetieto/status/221424560141107201?ref_src=twsrc%5Etfw)
