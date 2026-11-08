---
title: "Pelittää.fi julkaistu!"
date: 2013-08-14T12:09:00
lastmod: 2014-12-10T18:41:00
description: "En tiedä kuinka moni huomasi eilen Twitteristäni kun twiittasin pari linkkiä Pelittää.fi sivustolle. Pelittää.fi on uusi pelaamiseen keskittynyt sivusto, jonne tulee arvosteluita, trailereita, artikkeleita ja yleistä keskustelua peleistä. Aluksi sisältöä on tietysti niukasti, mutta ajan kuluessa sisältöä tulee lisää ja suosion kasvaessa lisäämme uusia ominaisuuksia ja kehitämme sivustoa eteenpäin. Seuraa sivustoa myös Twitterissä (@Pelittaa_fi) josta näet"
categories: ["Blogi"]
tags: ["arvostelu", "arvostelut", "pelaaminen", "peliarvostelu", "pelit", "pelittää", "projekti", "sivusto"]
aliases: ["/pelittaa-fi-julkaistu/"]
---

![Pelittää.fi](logo9.png)

En tiedä kuinka moni huomasi eilen [Twitteristäni](https://twitter.com/MarkoK) kun twiittasin pari linkkiä [Pelittää.fi](http://pelittaa.fi) sivustolle.

Pelittää.fi on uusi pelaamiseen keskittynyt sivusto, jonne tulee arvosteluita, trailereita, artikkeleita ja yleistä keskustelua peleistä.

Aluksi sisältöä on tietysti niukasti, mutta ajan kuluessa sisältöä tulee lisää ja suosion kasvaessa lisäämme uusia ominaisuuksia ja kehitämme sivustoa eteenpäin. Seuraa sivustoa myös Twitterissä ([@Pelittaa_fi](https://twitter.com/Pelittaa_fi)) josta näet helposti uusimmat arvostelut ja sivustoon liittyvät muut asiat.

Jos lähden hieman valottamaan sivuston teknistä toteutusta sillä sehän suurinta osaa lukijoistani varmaan kiinnostaa. Taustalla pörrää tuttuun tapaan WordPress sisällönhallintajärjestelmä ja siihen on laitettu kasa lisäosia avuksi ja säädetty sitä niin frontendin kuin backendin puoleltakin.

WordPressin lisäksi foorumia pyörittää [bbPress](http://bbpress.org/) niminen lisäosa ja sen kaveriksi on laitettu vielä [BuddyPress](http://buddypress.org/) jolla taas saadaan hieman enemmän sosiaalisia elementtejä kuten yksityisviestejä, profiilisivuja ja muutenkin enemmän yhteisömäisyyttä sivustoon.

Teemasta pitääkin mainita jokunen seikka. Se on ilmainen Valor teema ja sitä on sitten tuunattu jonkin verran sillä halusin arvosteluista ja videoista omat artikkelityypit ([custom post types](http://codex.wordpress.org/Post_Types)) sekä niihin hieman erilaisia kenttiä kuten arvosteluissa näkyvät metatiedot julkaisija, kehittäjä, pelimuoto yms. WordPressissä on itsessään sisäänrakennettuna mahdollisuus näille [register_post_type()](http://codex.wordpress.org/Function_Reference/register_post_type) funktion kautta. Tämän lisäksi [Meta Box](http://wordpress.org/plugins/meta-box/) -lisäosa tuli tarpeeseen sillä sen avulla saatiin määritettyä mm. nuo metatiedot ja muut itse lisätyt kentät.

Näiden omien backendin tuunauksien myötä saatiinkin suhteellisen helposti hallittava kokonaisuus aikaan sillä arvostelut, videot ja artikkelit ovat omissa osissaan hallintaa ja arvosteluille ja videoille on omat permalinkitkin (/video/videon-nimi ja /arvostelu/arvostelun-nimi).

Tämä projekti oli suhteellisen opettavainen sillä en olekaan custom post typejen kanssa pelannutkaan ennen täysin itse ja Meta Box lisäosakin tuli uutena tuttavuutena. Samaten piti jokuista lisäriä käsin muokata, jotta ne sopivat tarpeisiini.

Pelittää.fi sivuston kehitys jatkuu ja sisältöäkin tuotetaan sinne sitä mukaa kun sitä saadaan aikaiseksi.
