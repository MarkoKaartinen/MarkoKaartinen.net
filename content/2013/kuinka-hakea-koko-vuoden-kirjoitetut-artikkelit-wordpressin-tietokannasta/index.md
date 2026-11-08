---
title: "Kuinka hakea koko vuoden kirjoitetut artikkelit WordPressin tietokannasta?"
date: 2013-01-02T15:33:00
description: "Tutkin taas tätä ongelmaa, kun kirjoittelin vuosittaista katsaustani ja ajattelin pistää tämän ongelman ratkaisun tänne jakoon ja itselleni muistutukseksi. Saat haettua kaikki haluttuna vuonna kirjoitetut artikkelit yhdellä simppelillä SQL-lauseella, jonka voit sitten esim. PhpMyAdminin kautta ajaa. SELECT count(*) as kpl FROM `wp_posts` WHERE post_status = ’publish’ AND YEAR(post_date) = 2012 AND post_type = ’post’ Tämä"
categories: ["Blogi"]
tags: ["artikkelit", "määrä", "phpmyadmin", "tietokanta", "vinkki", "wordpress"]
aliases: ["/kuinka-hakea-koko-vuoden-kirjoitetut-artikkelit-wordpressin-tietokannasta/"]
---

Tutkin taas tätä ongelmaa, kun kirjoittelin vuosittaista katsaustani ja ajattelin pistää tämän ongelman ratkaisun tänne jakoon ja itselleni muistutukseksi.

Saat haettua kaikki haluttuna vuonna kirjoitetut artikkelit yhdellä simppelillä SQL-lauseella, jonka voit sitten esim. PhpMyAdminin kautta ajaa.

```sql
SELECT count(*) as kpl FROM `wp_posts` WHERE post_status = 'publish' AND YEAR(post_date) = 2012 AND post_type = 'post'
```

Tämä lause palauttaa suoraan määrän montako artikkelia olet kirjoittanut vuonna 2012. Mikäli haluat vaihtaa vuotta niin voit muuttaa aivan vapaasti vuoden 2012 haluamaksesi. Mikäli taas haluat kaiken nähdä ihan kaiken datan mitä tietokanta palauttaa näistä artikkeleista niin korvaa count(\*) pelkällä tähdellä \*.

```sql
SELECT * as kpl FROM `wp_posts` WHERE post_status = 'publish' AND YEAR(post_date) = 2012 AND post_type = 'post'
```

Tässäkin vuosi on muutettavissa haluamaksesi, tässä saat listattuna omat artikkelisi ja kaiken tiedon mitä WordPress niistä haluaakaan näyttää posts taulussa.

Molemmat kyselyt ottavat huomioon vain julkaistut (post_status = ’publish) artikkelit sekä tyypiltään artikkelit (post_type = ’post’).
