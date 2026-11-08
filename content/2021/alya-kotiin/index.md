---
title: "Älyä kotiin"
date: 2021-12-02T10:05:00
lastmod: 2021-12-03T10:26:00
description: "Nyt alkaa todennäköisesti suht pitkä sarja artikkeleita nimeltä \"Älykoti\". Nimensä mukaisesti aletaan laittamaan tätä asuntoa älykkääksi."
categories: ["Älykoti"]
tags: ["äly", "älykoti", "ikea", "ruuvi", "ruuvitag", "smart home", "trådfri"]
series: ["Älykoti"]
aliases: ["/alya-kotiin/"]
---

Nyt alkaa todennäköisesti suht pitkä sarja artikkeleita nimeltä [”Älykoti”](/sarja/alykoti). Nimensä mukaisesti aletaan laittamaan tätä asuntoa älykkääksi tai ainakin sinnepäin.

Tässä artikkelissa hieman alustan nykyistä tilannetta ja ei olla kuitenkaan ihan nollissa ns. älykkyyden suhteen. Katsellaan myös hieman mitä suunnitelmia onkaan ja mitä voisi ”älyttää”. Kommenttiboxiin voikin pistää omia ajatuksia!

Tulen tässä sarjassa kirjoittamaan kokemuksia, arvosteluita sekä mielipiteitä kodin ”älyttämisestä”. Artikkeleita sarjaan tulenee tipoittain ja silloin, kuin jotain uutta on tullut tehtyä. Säätämistähän siis on varmasti luvassa!

## Nykytila

Ensinnäkin tässä asunnossa on hieman rajoitusta siinä miten pitkälle mennään ja miten pitkälle on järkeväkään mennä. Asutaan vuokralla rivitalo kolmiossa. Touhuja siis rajoittaa se, että tämä ei ole omistusasunto ja ihan kaikkea ei siis ole mahdollista tehdä niin siististi kuin haluaisi tai pystyisi. Mennään siis asunnon ehdoilla tällä hetkellä.

Eli isompia huonekaluja kuten jääkaappia ei aleta älyttämään tai tekemään isompi asennuksia valojen tai sähköjen suhteen. Kaikki elementit pitää siis olla helposti tulevaisuudessa mukaan otettavia, ettei nyt jätetä tavaraa tänne.

Otetaan sitten hieman nykytilan kartoitusta. Olen teille kirjoitellutkin jo aiemmin miten lämpötilaa seuraan ja se hoituu [RuuviTagien](/avainsana/ruuvi) avulla. Eli sillä saralla ollaankin jo menty eteenpäin ja myös Ruuvit tullaan ottamaan käyttöön uusissa systeemeissäkin. Tulen myös tuon vanhan systeemin pitämään toiminnassa sillä se on toiminut tosi hyvin.

Meillä on itseasiassa myös jo älyvalojakin. [Ikean Trådfri](https://www.ikea.com/fi/fi/cat/aelyvalaistus-36812/) sarjaa on tullut jo hankittua tässä vuoden sisään. Työhuoneessa on yksi setti valoja kaukosäätimellä, jotta sinne saa valkoista valoa, jossa itse olen kokenut mukavammaksi työskennellä. Samoin olohuoneessa on yksi setti valoja kaukosäätimellä, jotta sinne saa myös sopivaa valoa tilanteen mukaan. Näissähän on himmennyskin, joten saa halutessaan myös tunnelmaakin. Näihin olen ollut tyytyväinen jo nyt, mutta näitä voi vielä hieman jatkojalostaa.

Loppujaan aika vähän on älyä tässä huushollissa vielä. Isoin älykkyys on tosiaan tuolla lämpötilojen puolella, mutta sitäkään dataa ei sinällään käytetä isommin automaatioihin. Paitsi, kun sauna on lämmin tulee Telegrammiin ilmoitus siitä. Samoin pakastimissa on hälytys liian korkeasta lämpötilasta.

Eläimet (2 kissaa ja koira) tulee myös hieman rajoittamaan älyllistämistä sillä niiden lelujen yms. takia ei voi esim. ajastaa roboimuria tekemään töitä, kun kukaan ei ole kotona.

## Suunnitelmia / Ajatuksia

Harmillisesti tämän projektin aloitus tuli vasta tässä tiistaina. Eli meni BF ja CM tarjoukset ohi suun. Ajatus ei muutenkaan ole lähteä sillä kalleimmalla kamalla liikenteeseen vaan lähteä pala palalta rakentamaan.

Äkkiseltään kun tässä laskeskelen niin esim. lamppuja tässä huushollissa on 12 jos lasketaan mukaan kylppäri ja saunakin. Voi olla pari mitä unohdin, mutta se mitä noista on järkevä älyllistää onkin toinen juttu.

Ensimmäisiä kevyitä automaatioita olisi ajatus saada tuohon portaikkoon. Eli tässä olisi hyvä valon syttyä mikäli joku siinä kävelee. Ajatus on pistää sensori rappusien ylä- sekä alapäähän ja siinä onkin yksi paikka valolle. Tähän ajattelin kokeilla tuttua Ikean sarjaa sillä siellä on nuo liikesensorit edukkaita sekä mulla on yksi lamppu jemmassa jo valmiina.

Sitten, kun tässä mennään kuitenkin diy hengessä ja pitkälle niin pitänee pistää yksi Rapsberry Pi töihin ja alkaa säätämään [Home Assistantin](https://www.home-assistant.io) kanssa. Tällä saadaan sitten sitä älyä ja automatiikkaa, jotta voidaan esim. sammuttaa automaattisesti kaikki valot, kun kukaan ei ole kotona.

Tähän projektiin liittyen on jo tulossa Zigbee tikku, jolla saadaan ainakin Ikean kamaa liitettyä sekä paljon muutakin.

Samoin pitää tutkia miten voisi esim. ESP32 deviboardia hyödyntää tähän hommaan. Mulla kun on pari niitä tuolla ekstrana ja sitten 3D-tulostin niin mahdollisuuksiahan on.

Löytyypi tuolta myös yksi vanha iPad joka on lojunut pidemmän aikaa nurkissa, joten siitä voisi saada semmoista kodin ohjauslaitetta ja näyttää hyödyllistä infoa.

Listaan tähän vielä alle muutaman ajatuksen mitä voisi ottaa seurantaan ja alkaa älyttämään valojen lisäksi.

- Kosteusanturi / vuotosensori astianpesukoneen luo sekä keittiön kaapistoon
- Motorisoitu rullaverho tai jopa verhot? DIY ratkaisuja voisi tutkia
- Lisää lämpötilasensoreita eli Ruuveja. Esim. jääkaapit on seuraamatta vielä
- Puhelimella valojen ohjaus
- Pistokkeita hallittavaksi puhelimella

Mahdollisuuksiahan on ihan pirusti ja kaikkea en oikein osaakaan vielä hahmottaa. Varsinkin automaatioiden puolella on mahdollisuutta ihan jonkin verran ja sieltä en kaikkea ehkä ihan tajuakaan vielä.

**Mitäs kaikkea muuta rivitalossa voisi älyttää?**
