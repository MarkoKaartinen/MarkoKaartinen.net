---
title: "Portaiden valot syttymään automaattisesti"
date: 2021-12-03T11:10:00
lastmod: 2021-12-03T11:12:00
description: "Portaikon valot syttymään automaattisesti Ikea Trådfri liiketunnistimen ja valojen avulla. Kaksi liiketunnistinta ohjaa yhtä valoa."
categories: ["Älykoti"]
tags: ["äly", "älykoti", "ikea", "smart home", "trådfri", "valot"]
series: ["Älykoti"]
aliases: ["/portaiden-valot-syttymaan-automaattisesti/"]
---

Ensimmäisiä kevyitä älytyksiä piti tehdä portaisiin. Muistin, että aiemmasta mulla on jemmassa yksi Ikean Trådfri lamppu ja siihen jos parittaa Ikean liiketunnistimen niin siitähän saa portaisiin älyä.

Tavoite oli siis saada portaikon valo syttymään, kun siihen tullaan joko alhaalta tai ylhäältä. Portaikon muodosta ja eläimistä johtuen en usko, että yksi liiketunnistin olisi riittänyt.

Ikean ohjeissa ei löytynyt tietoa siitä, että saisiko kaksi liiketunnistinta yhteen lamppuun ilman Ikean siltaa ja en sitä halua ostaa, koska tilasin jo yleisen Zigbee tikun jonka kanssa Ikean kamat ovat yhteensopivia.

Verkosta kyseltyäni tämä olisi siis ehkä mahdollista. No eipä tuo kalliksi tule ja sitten ne viimeistään alkaisi toimimaan, kun saisin tuon Zigbee tikun. Noihan liiketunnistimet maksaa 9,99€ kappale ja ovat suht perus kamaa. Niissä on 3min ”cooldown” eli ne havaitsee liikettä 3min jälkeen ja tuon ajan se valokin pysyy päällä ellei siis havaita liikettä. 3 minuutissa kerkeät nuo portaat kiivetä kyllä.

## Asennus

Asennus oli suht simppeli homma. Lamppu päälle ja toisen tunnistimen paritus. Sit huomasinkin, että valo on himmeällä eli vanhojen säätöjen asetuksia olisiko ollut. Noh, paritin sen hetkeksi työhuoneen valojen kaukoon ja sain sitten valon kirkkauden sopivaksi ja jatketaan tunnistimien säätöä.

En ehkä saanut ekalla kertaa varmaan paritettua oikein, kun valo ei sammunutkaan. Noh tehdasasetukset takaisin tunnistimeen ja uusi kokeilu. Nyt onnistui paritus ja valo sammui ja syttyi sitten kun havaittiin liikettä. Oltiin siis puolessa välin.

Sitten piti saada vielä kaksi liiketunnistinta toimimaan tuon yhden valon kanssa. Ilmeisesti ne on mahdollista kloonata seuraavalla ohjeella:

1.  Nollaa varuiksi molemmat liiketunnistimet tehdasasetuksiin
2.  Parita toinen liiketunnistin lampun kanssa
3.  Kloonaa tunnistimet pitämällä niitä lähellä toisiaan ja painamalla synkkaus painiketta 10s
4.  Homma selvä

Itse tein tuon pari kertaa sillä eka ei varmaan onnistunut kunnolla ja sitten tein varuiksi toisen kerran. Sillä lähti pelittämään.

Noiden toiminnan testaus vaati hieman kärsivällisyyttä sillä piti odottaa, että valo sammuu ja sitten testata syttyykö valo toisesta tunnistimesta ja sitten taas odottaa. Tämän jälkeen vielä koitin, että toimiiko ne aiotusta asennuspaikasta. Toimihan ne.

## Lopputulos ja ajatuksia jatkosta

Alla on lyhyt video mistä näkee, että sehän valo syttyy kun portaikkoon menee. Eli homma rokkaa kuten olin ajatellutkin.

{{< youtube id="Riohd7Huv2A" >}}

Sitten, kun saan hieman älykkyyttä lisää tehtyä eli kun tulee Zigbee tikku niin pitää ehkä tehdä lisää älyä. Toihan voisi sitten toimia esimerkiksi niin, että valo syttyy kun havaitaan liikettä alhaalla ja sammuu kun havaitaan liikettä ylhäällä (sekä sama toisin päin).

Samaten voisi ohjelmoida, että yöaikaan valon teho olisi pienempi, kuin sitten päiväsaikaan.

En sitten tiedä onko se mahdollista, että kun alempi tunnistin havaitsee liikettä ylemmän tunnistimen jälkeen niin sytytetään myös valo alakerrasta.

Toinen mikä vielä mietityttää on, että miten sensorit ottaa elukoiden liikkeet. Sen näkeekin sitten tässä tulevaisuudessa, kunhan eletään tuon kanssa hieman.

Jatketaan puuhastelua ja tällä hetkellä tyytyväinen näihin.
