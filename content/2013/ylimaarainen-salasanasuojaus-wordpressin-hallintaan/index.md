---
title: "Ylimääräinen salasanasuojaus WordPressin hallintaan"
date: 2013-10-17T16:35:00
description: "Olen omille sivuilleni asettanut ylimääräisen salasanasuojauksen htaccessin avulla WordPressin hallintaan. Tämä sen takia, koska aika moni koitti pommittaa tuota kirjautumista ja koitti kirjautua milloin milläkin tunnuksilla sisälle. Koska tähän blogiin ei voi rekisteröityä ja kommentointi onnistuu sosiaalisten medioiden tunnuksilla niin koin turhaksi pitää tuota kirjautumissivua avoimena kaikille – säädin siis htaccess suojauksen tuohon ja tässä"
categories: ["Koodaus"]
tags: ["htaccess", "htpasswd", "salasanasuojaus", "turvallisuus", "wordpress", "wp-login"]
aliases: ["/ylimaarainen-salasanasuojaus-wordpressin-hallintaan/"]
---

Olen omille sivuilleni asettanut ylimääräisen salasanasuojauksen htaccessin avulla WordPressin hallintaan. Tämä sen takia, koska aika moni koitti pommittaa tuota kirjautumista ja koitti kirjautua milloin milläkin tunnuksilla sisälle. Koska tähän blogiin ei voi rekisteröityä ja kommentointi onnistuu sosiaalisten medioiden tunnuksilla niin koin turhaksi pitää tuota kirjautumissivua avoimena kaikille – säädin siis htaccess suojauksen tuohon ja tässä artikkelissa kerron miten se tapahtuu.

Itse prosessihan on suhteellisen yksinkertainen, sinun pitää muokata yhtä tiedostoa ja luoda toinen tiedosto. Tämän jälkeen kun menee WordPressin kirjautumiseen tulee selaimeesi ikkuna, joka kysyy tunnusta ja salasanaa, mikäli haluat useamman tunnuksen ja salasanan niin sekin onnistuu – kerron myös tästä.

Aloitetaan luomalla *.htpasswd* niminen tiedosto (huomioi piste alussa!). Tähän tiedostoon tulee tunnus ja salasana, voit luoda tunnuksen ja salasanan minun tekemällä lomakkeella. Mikäli haluat useita tunnuksia niin teet niitä niin monta kuin haluat ja jokainen tunnus ja salasana tulee omalle riville – alla onkin esimerkki .htpasswd tiedostosta.

```
marko:$apr1$FZLBhENO$3UcsZmxpl3Rf7cyjoknop0
```

Mikäli haluat usean tunnuksen niin alla on esimerkki siitäkin:

```
tunnus1:$apr1$oA2hjvFS$fTu94t3KiTq6ZwdGZEUMF/
tunnus2:$apr1$TK6Tr.O4$T0OloN8anV/Pe42a3HMkz0
```

Seuraavaksi siirrät .htpasswd tiedoston webbipalvelimelle, jos et tätä siis jo tehnyt. Itse jätin tämän juureen enkä laittanut www tai public_html kansion sisään.

Tämän siirron jälkeen muokkaa WordPressin .htaccess tiedostoa ja lisää loppuun seuraavanlainen tekstinpätkä:

```apache
<Files wp-login.php>
AuthUserFile /home/marko/.htpasswd
AuthName "Private access"
AuthType Basic
require valid-user
</Files>
```

Muokkaa polku oikeaksi, itselläni tämä on /home/marko/ – mikäli et tiedä niin voit katsoa verkkosivusi palveluntarjoajan hallinnasta tai sitten kysyä palveluntarjoajaltasi tätä polkua.

Tämän jälkeen kun menet omasivusi.fi/wp-admin osoitteeseen (huom. vaihda omasivusi.fi) niin pitäisi tulla ikkuna joka kysyy tunnusta ja salasanaa.
