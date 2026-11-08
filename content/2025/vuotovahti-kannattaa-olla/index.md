---
title: "Vuotovahti kannattaa olla"
date: 2025-11-18T10:00:00
description: "Vuotovahti on pieni laite, joka tunnistaa veden läsnäolon ja lähettää ilmoituksen, jos vettä havaitaan paikassa, missä sitä ei pitäisi olla. Tässä artikkelissa kerron miksi vuotovahti kannattaa olla kotona ja miten se voi pelastaa isommalta vahingolta."
categories: ["Home Assistant"]
tags: ["selfhosted", "ikea", "vuotovahti", "kotiautomaatio", "badring"]
series: ["Älykoti"]
mastodon_post_id: "115569642951292354"
---

Vuotovahti on yksi niistä laitteista, mitä en välttämättä ensimmäisenä olisi ajatellut laittaa ja en laittanutkaan. Se tuli joka paikkaan vasti pari-kolme viikkoa sitten. Nyt kuitenkin sen arvon on huomannut ja näin suosittelenkin sitä kaikille.
{.lead}

## Mikä on vuotovahti?

Vuotovahti on pieni laite, joka tunnistaa veden läsnäolon. Se asetetaan esimerkiksi pesukoneen tai astianpesukoneen viereen, tai paikkaan, jossa on riski vesivuodolle, kuten pesualtaan alle tai kylpyhuoneen nurkkaan. Kun vuotovahti havaitsee vettä, se lähettää ilmoituksen puhelimeesi tai kotiautomaatiojärjestelmääsi.

Vuotovahdilla siis yksinkertaisesti varmistat, että saat tiedon veden läsnäolosta paikassa missä sitä ei haluaisi olevan.

## Vuotovahti osana kotiautomaatiota

Minulla on käytössä Home Assistant ja siinä on käytössä [SLZB-06](/2025/smlight-slzb-06-zigbee2mqtt-home-assistanttiin) Zigbee koordinaattori. Vuotovahdin valinta siis oli Zigbee yhteensopivat laitteet ja Ikealla tämmöinen onkin suoraan valikoimassa. [Ikea Badring](https://www.ikea.com/fi/fi/p/badring-vesivuotovahti-aelylaite-60504352/) on edullinen vuotovahti 9,99€ hinnalla ja sen saa suoraan Zigbee verkkoon kiinni Home Assistantin kautta.

Itsellä onkin vuotovahti useammassa paikkaa kuten astianpesukoneen takana, keittiön allaskaapissa, teknisessä tilassa missä on kaukolämmön laitteisto sekä vesimittarin luona. Näin saan ilmoituksen heti jos jossain näissä paikoissa on vettä missä ei pitäisi olla.

![Vuotovahdit Home Assistantissa](vuotovahdit.png)

Kun vuotovahti on osana Home Assistanttia tarvitsee tehdä vain automaatio. Itsellä on automaatio, joka lähettää Telegrammin kautta viestin meidän Koti ryhmään, jossa on mukana minä ja rouva niin molemmat saa ilmoituksen siitä.

Ajatuksena on jossain välissä tuoda hieman vielä enemmän huomiota herättävää ilmoitusta tähän kuten äänimerkki ja/tai valojen käyttäytyminen hälytyksen tullessa. Tämänkaltainen ilmoitus kuten vettä paikassa missä ei saa olla on kuitenkin erittäin kriittinen. **Jos tähän on hyviä (tai huonoja) ajatuksia niin saa pistää tulemaan!**

## Vuotovahti ilman kotiautomaatiota

TÄhän minulla ei ole suoraa vastausta sillä olen Home Assistanttia käyttänyt muutenkin ja se on ollut helppo tapa hallita ja luoda automaatioita. Kuitenkin tällä saralla on vaihtoehtoja ja suosittelenkin tekemään pientä tutkimusta. 

Tuo Ikea Badring pitää ääntä itsessään, mutta ei sitä joka paikasta välttämättä kuule. Ikealla on oma ekosysteemi heidän [Digigera](https://www.ikea.com/fi/fi/p/dirigera-aelykodin-hub-valkoinen-aelylaite-10503406/) huvin kautta, mutta itsellä ei kokemusta. 

Jos jollain on tähän liittyen omia vinkkejä niin jaa toki muille jotka ei halua alkaa Home Assistantin kanssa säätämään.

## Miten vuotovahti käytännössä pelasti isomman vahingon?

Nyt lopuksi ns. tosielämän tarina, joka tapahtui ihan viime viikolla.

Puoli 9 aikaan illalla saan Telegrammiin ilmoituksen teknisen tilan kosteudesta. Tässä ensimmäisenä oli mielessä, että nyt on kaukolämmön laitteissa vuoto tai jotain vastaavaa. No eikun alakertaan katsomaan mikä ongelma siellä on.

Siellähän sitten odotti alla oleva näky...

![Teknisen tilan lattialla ruskeaa vettä](tekninen-tila-vesi.jpg)

Lattialla oli kertynyt ruskeaa vettä ja paskahan siellä haisi. Kuvassa olen siirtänyt jo vesivuotovahdin pois ettei koko aikaa hälytä. Vuotovahti oli tuolla viemärin yläpuolella ja siksipä siis hälytti. Jos vuotovahtia ei olisi ollut tuossa niin tuota ei oltaisi välttämättä huomattu kuin seuraavana päivänä jos silloinkaan. Nyt siis voitiin lopettaa veden käyttö heti ja ei pääse ainakaan isompaa ongelmaa tulemaan. 

Tämä viemäri oli myös ainut mistä tuota vettä tuli "ylöspäin" ja näin siis saatiin ongelma rajattua ja ei päässyt isompaa haittaa tulemaan. Toki vessassa ei voinut käydä, mutta onneksi on naapuriapu olemassa. Tälle iltaa kun ei enää oikein saa putkaria/lokapalvelua tai se maksaisi sitten ilta/yölisää joten odoteltiin seuraavaan päivään.

Seuraavana päivänä soitto tutulle putkarille ja sieltä suoraan sanottiin ettei voi todnäk tehdä mitään vaan suoraan lokapalvelu. Lokapalvelu saatiin sitten iltapäivällä tulemaan ja aukaisemaan tukos ja putsaamaan putket. Tämän jälkeen homma toimi taas kuten piti.

Juurisyynä oli itseasiassa se, että tämä talo mikä ostettiin kolmisen kuukautta sitten on ollut tyhjillään ja ei ole aktiivisella käytöllä ollut. Nyt kun taloa ja putkistoa alettiin oikeasti käyttämään niin tuo tukos pääsi syntymään. Nyt kun nuo on putsattu niin ei pitäisi tulla ihan heti ongelmaksi, kun putkisto on normaalissa käytössä.

## Loppu lätinöitä

Tässä siis yksi esimerkki siitä, miksi vuotovahti kannattaa olla. Pieni investointi, joka voi säästää isommilta vahingoilta ja kalliilta korjauksilta. Jos sinulla ei vielä ole vuotovahteja kotona, suosittelen lämpimästi hankkimaan niitä ja liittämään ne osaksi kotiautomaatiotasi tai ainakin varmistamaan, että saat ilmoituksen veden läsnäolosta ajoissa.

Tässä nyt vielä koitan miettiä pitääkö jossain muualla olla vuotovahti. Pyykinpesukone on samassa tilassa suihkun kanssa ja muutenkin siellä missä on vettä muutenkin (suihku/sauna) niin ei ole järkevää jos ei ota pois sitä. WC tilassa voisi melkein olla ja autotallissakin voisi olla hyödyllinen.

**Jos jotain tästä lätinästä jäi mieleen niin hanki vuotovahti. Ihan sama millainen, mutta kunhan on joku!**
