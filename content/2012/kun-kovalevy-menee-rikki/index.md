---
title: "Kun kovalevy menee rikki..."
date: 2012-09-24T12:58:00
description: "Tämä on ehkä ärsyttävin tilanne mihin tietokoneen käyttäjä voi törmätä. Kovalevy on kuitenkin se osa tietokoneesta, jolle kaikki data tallennetaan. Monelle tulee yllätyksenä, se tilanne kun kovalevy menee rikka ja data saattaa olla menetetty. Itselläni tuli tämä tilanne eteen viime lauantaina kun oman MacBook Pro läppärini kiintolevy päätti sanoa työsopimuksensa irti. Itsellänihän on se tilanne,"
categories: ["Apple", "Blogi"]
tags: ["apple", "kiintolevy", "kovalevy", "laiterikko", "macbook", "macbook pro", "varmuuskopiointi"]
aliases: ["/kun-kovalevy-menee-rikki/"]
---

Tämä on ehkä ärsyttävin tilanne mihin tietokoneen käyttäjä voi törmätä. Kovalevy on kuitenkin se osa tietokoneesta, jolle kaikki data tallennetaan. Monelle tulee yllätyksenä, se tilanne kun kovalevy menee rikka ja data saattaa olla menetetty.

Itselläni tuli tämä tilanne eteen viime lauantaina kun oman MacBook Pro läppärini kiintolevy päätti sanoa työsopimuksensa irti. Itsellänihän on se tilanne, että MBP hoitaa työkoneen virkaa ja oman henk.koht. läppärini virkaa. Dataa siis koneella on ja vieläpä työhön liittyvää dataa. Onneksi suurin osa on meillä pilvessä ja koodit on versionhallinnassa, joten suuria menetyksiä ei tapahtunut. Olin itse muuten viikkoa aiemmin tyhjännyt Macin ja ottanut varmuuskopiot, joten tilannehan oli suhteellisen hyvä. Ainut huoli oli torstain ja perjantain koodit, sillä niitä ei ollut vielä versionhallinnassakaan! (laiska Marko kun ei päivittänyt koodia sinne…)

Lähdin selvittämään olisiko mahdollista saada mitään talteen tuolta kovolta ja ehkäpä jopa pelastettua sitä koko kovalevyä. Se kun tunnistautui mutta datan kirjoitus sille oli heikoissa kantimissa ja muutenkin se levy oli hieman noh… ovelan oloinen (ei ammattitermi!). Kiintolevy siis irti MacBookista ja kiinni telakkaan, jonka olin hankkinut noin kuukausi sitten [Verkkiksestä](http://www.verkkokauppa.com/fi/product/48273/dfdvn) (onneksi!).

Windows 7 koneeni ei tietysti tunnistanut Mac kiintolevyä tai se tunnisti sen disk managerissa, mutta en päässyt käsiksi siihen. Pelastus tuli kun löysin ohjelman nimeltä [HFSExplorer](http://www.catacombae.org/hfsx.html), jolla pääsin tonkimaan tuota kiintolevyä (se kun oli Macin omassa HFS formaatissa). Tuolla sainkin pelastettua tärkeimmät datat eli työtiedostot, osaa dataa ei saanut tuolla pois joten päätin laittaa lauantai-sunnuntai väliseksi yöksi hieman tarkistuksia menemään. Tätä koitin Stellar Phoenix Macintosh (trial) nimisellä ohjelmalla, jota kaveri vinkkasi. Samaten koitin seuraavana päivänä Windowsin omilla työkaluilla (kun olin muuntanut NTFS muotoon levyn) sekä parilla muulla ohjelmalla.

Lopputuloksena oli se, että levyssä on jokin vika joka estää siihen kirjoittamisen ja tätä kautta ei Mac voi formatoida sitä omaan muotoon saati tehdä sille tarkistuksia/korjauksia asennuslevyn työkaluilla. Myös monet muutkin keinot tuli kokeiltua (kiitos [@heinikangas](http://twitter.com/heinikangas) avusta!).

Laitoin sitten tilaukseen SSD-levyn johon päivittämistä olin jo miettinytkin. Nyt siihen tuli se viimeinen niitti, joten tulette näkemään artikkelin aiheesta SSD levyn laittaminen MacBook Prohon. Lopuksi vielä pari vinkkiä varmuuskopiointiin!

Mitä tapauksesta sitten opin? Ainakin sen, että varmuuskopiointia pitää tehostaa ja se koodi pitää pistää versionhallintaan mielellään useita kertoja työpäivässä! Ei nimittäin voi tietää milloin kovalevy hajoaa koneesta ja työt menetetään! Päivitänkin oman kodin varmuuskopionnin lähipäivinä kunnolliselle tasolle!

**Mikäli varmuuskopiointia ei vielä harrasta niin kannattaa se aloittaa heti!**

Varmuuskopiointi on loppujen lopuksi edullinen tapa pitää data turvassa ja sitä kautta myös minimoida tiedon hävikki, kun tulee laiterikko tai joku muu vastaava tapahtuma. Varmuuskopiointia kannattaisikin harrastaa mahdollisimman usein!

**Pilvipalveluihin** voi siirtää osan datasta kuten dokumentit ja tiedostot joita tarvitsee monella koneella muutenkin, näin sinulla on ne jo tallessa muuallakin kuin omalla koneella.

Mikäli ei halua dataa ulkoisiin pilvipalveluihin tai ei luota niihin niin suosittelen sitten **ulkoista kiintolevyä**. Mac koneissa Time Machinen avulla saa varmuuskopioinnin pelaamaan erittäin hyvin ja suosittelenkin sen käyttämistä. Tulen tästä aiheesta tekemään artikkelin, kunhan saan uuden kiintolevyn kotiin saakka! Windows koneissa homma onnistuu Backup and Restore (varmuuskopiointi ja palautus) kohdasta.

**Verkkokiintolevy** on myös yksi mahdollisuus varmuuskopiointiin, tällöin sinulla on lähiverkossasi kiinni yksi kiintolevy johon voit varmuuskopioida tietosi ja tällöin koneeseen ei tarvitse liittää erikseen USB-piuhalla kiintolevyä. Verkkokiintolevyt ovat yleensä hieman arvokkaampia, kuin tavalliset ulkoiset kiintolevyt. Varmuuskopioinnin asennus koneeseen onnistuu samalla tavalla kuin ulkoisessa kiintolevyssäkin (Mac: Time Machine / Windows: Backup and Restore).

Noiden vinkkien avulla saat varmasti toimivan ja simppelin varmuuskopioinnin aikaiseksi. Mikäli haluat lisätietoa asiasta niin voit **kysyä** kommentoinnin kautta!
