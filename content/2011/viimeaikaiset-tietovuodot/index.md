---
title: "Viimeaikaiset tietovuodot"
date: 2011-11-28T18:36:00
lastmod: 2011-11-29T14:56:00
description: "Heitänpä minäkin oman lusikan soppaan tai heitän lusikan soppaan tässä blogissa. Olen puhunut tästä aiheesta RantSitellä ja yksityisissä keskusteluissa. Nyt on aika tuoda tämä aihe myös tälle sivustolle. Viime yönä julkaistiin taas tietoja, tällä kertaa kyseessä oli noin 70000 ihmisen salasanat, sähköpostiosoitteet ja tunnukset Terve.fi sivustoperheestä. Näiden takanahan on Darwin Media Oy ja heidän mukaansa"
categories: ["Internet"]
tags: ["fail", "phpbb", "phpbb2", "tietovuodot", "tietovuoto"]
aliases: ["/viimeaikaiset-tietovuodot/"]
---

Heitänpä minäkin oman lusikan soppaan tai heitän lusikan soppaan tässä blogissa. Olen puhunut tästä aiheesta [RantSitellä](http://rantsite.net/2011/11/pari-sanaa-tietovuodosta/) ja yksityisissä keskusteluissa. Nyt on aika tuoda tämä aihe myös tälle sivustolle.

Viime yönä julkaistiin taas tietoja, tällä kertaa kyseessä oli noin 70000 ihmisen salasanat, sähköpostiosoitteet ja tunnukset Terve.fi sivustoperheestä. Näiden takanahan on Darwin Media Oy ja heidän mukaansa Helistin.fi sivustolle oli tehty tietoturvapäivitykset (tästä lisää kohta). Listassa oli mm. lääkärien ja muiden tietoja.

Mitä kautta tämä hyökkäys tehtiin? Vastaus on yksinkertainan: PhpBB2 foorumin kautta. He [väittivät](http://www.tohtori.fi/?page=4229755&id=3194005), että päivitykset olivat tehty. Muuten hyvä, mutta PhpBB2 ei ole tullut moneen vuoteen tietoturvapäivityksiä, sen tukikin on jo lopetettu. He sanoivat tehneensä asianmukaiset päivitykset vuonna 2007, eli neljä vuotta sitten. Kuinka moni uskoo, että neljä vuotta sitten päivitetty sovellus on enää tietoturvallinen? En minä ainakaan. Heidän olisi pitänyt päivittää PhpBB3 versioon aikoja sitten – miksihän näin ei muuten tehty?

PhpBB2 virallinen tuki lopetettiin 1.2.2009 ja sitä ei saanut edes ladattua 1.10.2008 jälkeen ([lähde](http://www.phpbb.com/community/viewtopic.php?t=900655)). Huomaatteko muuten, että he sanoivat tehneensä päivitykset vuonna 2007? MikroPC:n mukaan heillä oli käytössä vuonna 2006 julkaistu 2.0.22 versio ([lähde](http://www.mikropc.net/kaikki_uutiset/helistinfin+tietoturva+ei+ollut+ajan+tasalla/a730224)), eli vielä heikommaksi mennään tämänkin asian suhteen.

Salasanan suojaus PhpBB2:ssa oli erittäin huonossa jamassa tämän päivän tarpeisiin verrattuna. Pelkkänä md5 hashauksella suojatut salasanat voidaan selvittää hyvinkin pikaisesti. En kerro tämän selvittämisestä sen enempää, mutta tuttavani OP on kirjoittanut aiheesta [artikkelin](http://unknownpixels.com/blogi.php?kategoria=ohjelmointi&id=149).

Vuodosta saaduilla tunnuksilla päästään muihinkin sivustoihin kuten Mustapippuri.fi, Tohtori.fi, Terkkari.fi ja Pudottajat.fi. Sinänsä hyvä idea, että yhdellä tunnarilla pääsee joka paikkaan, mutta miksi sitten pitää yhtä sivustoa heikoimpana lenkkinä? Tietty jokaisessa järjestelmässä on heikoin lenkki, mutta se on yleensä käyttäjä itse.

Sitä en osaa sanoa kuka on tämän vuodon takana ollut, Anon Finland on kieltänyt olevansa osallisena ja lista julkaistiin Ylilaudalla. Tuolta sivustolta muuten ihmiset menivät kirjautumaan Helistin.fi sivustolle (sekä muille). Eräs henkilö sulki tuon Helistin.fi saitin tai näin ainakin MikroPC [väittää](http://www.mikropc.net/kaikki_uutiset/quotsuljin+helistinfin+koska+en+kestanyt+katsoa+ylilautakulttuuriaquot/a729851).

Tämänkin olisi voinut väittää päivittämällä sovellukset ajantasaiseksi. Yleisimmät mokat viime aikaisiin tietovuotoihin taitaa olla peru SQL-injektio, järjestelmien päivittämättömyys ja oma huolimattomuus järjestelmän tietoturvassa (tämä pätee kahteen edelliseenkin).

Kiitos ja hyvää alkavaa viikkoa. Mielipiteet ovat tervetulleita, sekä mikäli tiedoissa on virheitä niin saa korjata.

**Parsimaani dataa:** *(datassa voi olla virheitä)*\
– [Tunnuksien mailiosotteiden domainit](http://www.slideshare.net/markokaartinen/helistin-emailin-domainit)\
– [Salasanojen tutkailua](http://www.slideshare.net/markokaartinen/helistin-salasana-tutkailua)

**Muokattua**: Lisäsin loppuun hieman parsimaani dataa.
