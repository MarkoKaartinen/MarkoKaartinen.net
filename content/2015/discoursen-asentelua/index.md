---
title: "Discoursen asentelua"
date: 2015-03-09T15:09:00
lastmod: 2016-09-26T15:42:00
description: "Löysin Discoursen vähän aikaa sitten. Muistaakseni törmäsin tähän jo aiemmin, mutta sivuutin sen aika pitkälti. Piru, se on ilmainen ja avointa lähdekoodia."
categories: ["Kotilabra"]
tags: ["digitalocean", "discourse", "foorumi", "https", "namecheap", "nörtti", "oppiminen", "pleikka", "pleikka.fi", "säätö", "ssl"]
aliases: ["/discoursen-asentelua/"]
---

Löysin Discoursen vähän aikaa sitten. Muistaakseni törmäsin tähän jo aiemmin, mutta sivuutin sen aika pitkälti. Törmäsin erääseen Discoursella toteutettuun foorumiin ja lähdin tutkimaan paljonko se kustantaisi. Piru, se on ilmainen ja avointa lähdekoodia – eikun säätämään siis.

[Pleikka.fi](/2015/pleikka-fi-uusin-projektini) oli loistava domain siihen ja jotain tämänkaltaista halusinkin rakentaa sille. Discourse on simppeli, mutta silti siinä on sitä jotain mikä vetoaa minuun ja muihinkin (toivottavasti). Discoursen ominaisuuksista ja muusta voi lukea sen omilta sivuilta: [www.discourse.org](http://www.discourse.org/)

Tuesta sen verran, että pistin eilen kyselyä Discoursen omille foorumeille ja sainkin suhteellisen nopeaan vastausta eli homma pelittää tälläkin saralla mainiosti.

Mielenkiintoista tässä on se, että tämä asentuu Dockerin kautta ja käyttää mm. Gittiä päivityksien lataamiseen ja muutenkin apunaan. Lisäosat asennellaan myös Gitin ja Dockerin avustuksella. Ainut miinus mitä olen löytänyt on se, että plugarin asennus vaatii tuon Docker containerin rebuildaamisen mikä aiheuttaa käyttökatkon foorumille.

Tämmöisellä setupilla lähdin liikenteeseen – ainakin aluksi:

- Domain Pleikka.fi ([Ficora](https://domain.fi))
- SSL Sertifikaatti ([Namecheap](http://www.namecheap.com/?aff=25198))
- Virtuaalipalvelin (1GB muistia) ([Digitalocean](https://www.digitalocean.com/?refcode=34aebd17275a))

Digitaloceanilla tuota droplettia voi kasvattaa isompaan mikäli tuo Pleikka.fi alkaa lähteä lentoon. Suosittelen muutenkin Digitaloceania sillä mm. tämä sivusto pyörii siellä VPS:n päällä.

Pleikka.fi domainin nimipalvelimet olikin jo valmiiksi asetettu Digitaloceanin nimipalvelimiin päin joten siitä ei tarvinnut huolehtia. SSL sertti piti kuitenkin säätää uusiksi. Homma on suhteellisen simppeli. Tarvitset siihen oikeastaan vain sähköpostin (esim. admin@pleikka.fi käy mainiosti) ja sitten pääsyn palvelimelle. Ensin generoidaan csr ja tämä syötellään sitten SSL tarjoajan (tässä tapauksessa Namecheap) sivustolle. Tämän jälkeen valitaan mihin sähköpostiin lähetetään vahvistus (itse olen tehnyt tuon admin@domain.fi osoitteen). Vahvistusviestissä klikataan käytännössä siinä olevaa linkkiä ja syötetään vahvistus koodit. Tämän jälkeen saat sähköpostiisi itse sertifikaatin. Itse SSL asennetaan Discoursen kanssa toimivaksi erikseen, mutta siihen on olemassa hyvä [ohje](https://meta.discourse.org/t/allowing-ssl-for-your-discourse-docker-setup/13847) – tee kuitenkin itse Discoursen asennus ensin.

Itse Discoursen asennus oli suhteellisen suoraviivainen sillä käytin apunani tätä [ohjetta](https://github.com/discourse/discourse/blob/master/docs/INSTALL-digital-ocean.md). Siinä käydään läpi dropletin luonti, swapin teko, Dockerin ja gitin asennus, Discoursen asennus, asetusten muunto ja itse containerin buildaus ja avaus. Siellä on myös linkkejä ssl sertin käyttöönottoon ja moneen muuhun asiaan. Eli aikas tekninen suoritus on tuon asennus jos sitä lähtee tekemään. Ihan kaikille tämä ei siis ole vaan hieman Linux tuntemusta on hyvä olla.

Discoursen asennettua sen asetusten säätö oli suhteellisen vaivatonta ja onpa tuossa sisäänrakennettuna mahdollisuus muokata CSS koodia ja neppailla muutenkin hieman ulkoasun kimpussa. Onpa tämä muuten aika pitkälle suomeksikin käännetty – joitain kukkasia löytyy ja ihan täydellinen ei tuo käännös vielä ole. Pitää jossain välissä tutkia miten tuota saisi hieman päiviteltyä tuon käännöksen osalta.

Nyt kun olen jokusen päivän pyöritellyt tuota niin olen kyllä pitänyt siitä. Hallinnan puolella on kivoja tilastoja heti kättelyssä ja näkee senkin onko Discourse ajantasalla. Varmuuskopion luominen käy nappia painamalla ja sen saisi myös automatisoitua Amazonin S3:een – samaten tiedostot saisi siirrettyä Amazonin S3 tilaan automaattisesti.

Lisäosan asennus on suhteellisen mielenkiintoinen homma tai oikeastaan simppeli homma. Muokkaat käytännössä containerin app.yml tiedostoa ja laitat sinne oikeaan paikkaan git clone komennon lisäosaan. Eli käytännössä kun lisäosan git repoon tulee päivitys niin saat sen myös sinäkin. Tämän rivin lisäämisen jälkeen rebuildataan ja homma on mahdollisia lisäosan asetuksia vaille valmista.

Muutenkin päivittäminen menee gitin kautta, kuten mainitsinkin jo aiemmin. Voit käytännössä päivittää oman Discoursen aina viimeisimpään committiin sillä päivitys otetaan suoraan Discoursen [Github reposta](https://github.com/discourse/discourse/). Odottelinkin tässä päivitystä käännöksiin sillä kävin lisäilemässä Discoursen Transifexiin muutaman rivin, jotka on jäänyt kääntämättä päivitysten ja muiden myötä.

Mikäli Pleikka.fi ottaa tuulta alleen niin tulen miettimään ensinnäkin isompaa droplettia, mutta tämä vaatii osittain myös hieman rahallista panostusta. Samaten tulen miettimään joko Amazon S3 tai CDN palvelun käyttöönottoa helpottamaan palvelimen omaa kuormaa.

Tällä hetkellä Discourse vaikuttaa erittäin hyvältä ja katsotaan miten Pleikka.fi kanssa käy. Tulen tuota Discoursea säätämään lisää kunhan keksin mitä haluan tuonne Pleikka.fi alle pistää. Muutenkin jos tulee projekteja niin pidän Discoursen mielessä josko se sopisi pohjaksi.
