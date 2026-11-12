---
title: "Mitä kotiverkossani oikein \"pyörii\""
date: 2025-02-14T18:55:00
description: "Nyt alkaa artikkelisarja, jossa kerron hieman mitä kotiverkossani oikein pyörii. Samaan sarjaan menee tämän kotiverkon säätäminen ja siihen liittyvät artikkelit."
categories: ["Kotilabra"]
tags: ["kotiverkko", "selfhosted", "home assistant", "zigbee", "docker", "pfsense", "palvelin", "kotiautomaatio"]
series: ["Selfhosted"]
---

Nyt aloitetaan uusi sarja joka hieman sivuaa vanhempaa [älykoti](/sarja/alykoti) sarjaa. Tässä kuitenkin lähdetään hieman laajemmalta kantilta sillä minullahan kotiverkossa pyörii vaikka sun mitä. 
{.lead}

Tässä uudessa Selfhosted nimeä kantavassa artikkelisarjassa lähdetään pitkälle (siis pitkälle) matkalle yhdessä itse hostaamisen maailmaan. Katsotaan mitä kaikkea sitä täällä minun kotiverkossa pyörii. 

Toki tässä sarjassa taklataan erinäisiä ongelmia ja tämä olkoon jonkinlaista dokumentointia (avautumista) itselle ja infoa muille.

Tässä ekassa osassa käydään pintapuolisesti läpi mitä täällä nyt tällä hetkellä pyörii. Sitten tulevissa osissa käydään läpi sitten yksittäisiä osia ja säätämisiä.

## Palomuuri

Aloitetaan siitä mikä hoitaa minulla dhcp virkaa ja muutenkin yksi tärkeä osa tätä verkkoa. 

Ostin pari vuotta sitten käytettynä eBaystä Fujitsu Futro S920 tietokoneen ja verkkokortin siihen. Siitä rakentelin sitten [pfSense](https://www.pfsense.org/) pohjaisen palomuurin ja se onkin hoitanut virkansa erittäin mallikkaasti.

pfSense boxi hoitaakin myös lähiverkon dhcp palvelimen virkaa ja luo minulle oman 10.10.10.x lähiverkon. pfSense boxista saan halutessani avattua portteja tarkemmin ulkomaailmaan eli esim. jos haluan hostata jotain pelipalvelinta ja se kaipaa jotain tiettyä.

## Läppäripalvelin

Palomuurikoneen jälkeen vanha kannettava, josta on tehty palvelin on tämän kodin tärkeimpiä työjuhtia. Tässä onkin tuoretta Ubuntua sisässä sillä itselle on tuo Ubuntu ja Debian pohjaiset Linuxit tutuimpia palvelinympäristössä.

Tällä koneella nimittäin pyörii melkein kaikki tässä huushollissa tarvittava. Oikeastaan kaikki palvelut pyörii [Docker](https://www.docker.com/) konteissa ja siinä on apuna [Docker compose](https://docs.docker.com/compose/), jolloin saan hieman jaettua kansioihin ja yml filuihin noita.

Ei ole yhtä mega isoa `docker-compose.yml` filua vaan olen koittanut hieman jakaa niitä osiin ja näin saada toisiinsa liittyvät kontit samaan "nippuun".

Läppäripohjaisen palvelimen "etu" on se, että siinä on periaatteessa pienimuotoinen akku matkassa ja virran katketessa se toimii. Tämä ei tietysti kauheasti lämmitä sillä jos koko talosta katkeaa virta niin katoaa nettikin.

## NASsikka

Tämä verkko NAS onkin yksi uusimpia lisäyksiä verkkoon. Ostin nimittäin käytetyn ZyXEL NAS542 purkin johon pistin sitten 3x 4 teran levyä ja vielä olisi yksi paikka vapaanakin. 

Nämä on RAID5:ssä joten noista voi yksi hajota ja tilaa on käytettävissä noin 8 teraa. Yhdellä levyllä saisin tuon nostettua vielä 12 teraan.

Tämä oli loistava hankinta sillä tuo vanha boxi toimii mun tarkoitukseen oikein hyvin ja se korvasi vanhan (siis tosi vanhan) koneen joka alkoi vedellä viimeisiään.

## Langaton verkko

Langaton verkko onkin itsellä [Ubiquiti U6+](https://techspecs.ui.com/unifi/wifi/u6-plus?subcategory=all-wifi) tukiasemien varaan rakennettu. Tätä varten mulla pyöriikin [Unifin konttia MongoDB](https://hub.docker.com/r/linuxserver/unifi-network-application) kanssa, jotta saan hallittua langatonta verkkoa näppärästi.

Mulla on ylä- ja alakerrassa omat tukarit ja näillä onkin sitten riittävä kattavuus koko asuntoon ja parvekkeelle. Noissa U6+ purkeissa on toiminut hyvin mesh ominaisuus ja laitteet vaihteleekin ylä- ja alakerran tukarien välillä itsestään. 

## Kotiautomaatio

Tämä on ehkä se tärkein ja isoin osa tätä himmeliä mikä kotona oikein pyörii. Nimittäin kotiautomaatio... tämä loputon suo, johon saa aina lisää säätöä.

Minulla homma pohjautuu [Home Assistanttiin](https://www.home-assistant.io/). Siihen nimittäin saa yhdistettyä vaikka sun mitä. Tämän lisäksi olen päättänyt käyttää [ZigBee](https://fi.wikipedia.org/wiki/ZigBee) laitteita mahdollisuuksien mukaan sillä niitä saa esim. Ikeasta.

ZigBeen säädin juuri äsken uusiksi. Asensin nimittäin vihdoin tuon SLZB-06 PoE koordinaattorin ja samalla sitten pistin [ZigBee2MQTT](https://www.zigbee2mqtt.io/) ja Mosquitto brokerin toimintaan. Tämä vaati kaiken parittamisen uudelleen, mutta oli se sen väärti sillä OTA päivityksiä tuli heti pariin kytkimeen.

Ettei viimeaikainen säätö loppuisi niin vaihdoin tietokannan oletus SQLitestä [MariaDB](https://mariadb.org/) tietokantaan sekä samalla muutin asetuksista sen, että MariaDB:ssä on 7 päivän verran dataa. Historiatiedon pistin nimittäin menemään [InfluxDB:seen](https://www.influxdata.com/) ja sitä ihmettelen sitten [Grafanan](https://grafana.com/) avulla.

[AdminerEvo](https://docs.adminerevo.org/) kontti minulla on sitten ihan vain, että voin halutessani käydä katselemassa tuota MariaDB:tä, jos innostuin jotain hakemaan sieltä suoraan.

Samoin odottamassa on [Node-RED](https://nodered.org/) kontti jos hieman monimutkaisempia säätöjä tekisin sen kanssa. Ehkä joku päivä.

Sitten minulla on kotona pari ESP32 lastua. Toisessa on lämpötilasensori kiinni, joka menee sitten takapihalle. Toisessa on taas sitten etupihan sensori ja se bluetoothilla hakee saunasta olevasta Inkbird IBS-TH1 sensorista. 

Home Assistanttiin on myös kytketty paljon muuta. Tässä nyt pientä listaa:

- Robotti imuri
- 3D-tulostin
- Kalenteri
- Pörssisähkön hintaa
- Säätä
- Bussiaikataulua
- Siitepölyä
- ZigBee lamppuja
- ZigBee lämpötilasensoreita
- ZigBee kytkimiä
- ZigBee liiketunnistimia
- ZigBee pistokkeita
- Sekä varmaan jotain muuta mitä unohtanut

## Muuta mukavaa

Tämä menee sit osioon vähän kaikkea mainitsemisen arvoista mitä sattuu pyörimäänkään.

[Plex](https://www.plex.tv/) pyörii tietysti ja tuolta NASsin puolelta voidaankin katsoa elokuvia sekä sarjoja mitä jokunen sieltä löytyy.

Pitäähän sitä selaimella päästä helposti muokkaamaan Home assistantin ja muita Docker konttien konffeja niin pyörii tietty [Visual Studio Code Server](https://code.visualstudio.com/docs/remote/vscode-server), jolla näppärästi selaimella päästään editoriin.

[Portainer](https://www.portainer.io/) mulla on oikeastaan ihan sen takia, että voin sieltä käydä vilkuilemassa konttien tilaa ja lokeja. Sen nyt ehkä hitusen on korvannut [Dozzle](https://dozzle.dev/), jota olen käyttänyt logien lukuun. En itse Portainerin kautta kontteja muuten hallitse. Joskus lähinnä debuggaamiseen käyttänyt sitä.

Uusimpia lisäyksiä on [Uptime Kuma](https://uptime.kuma.pet/) ja konttien sekä kotiverkossa olevien laitteiden monitorointi. Mulla on tuolla kaikki kontit seurannassa sekä muutama palvelu ja laite erikseen monitoroinnista. Mikäli joku menee alas niin tulee Telegrammiin ilmoitusta siitä. Tämä on vaikuttanut toimivan hyvin sillä pari kertaa, kun olen seuratun ESP32 lastun pistänyt alas niin on tullut ilmoitusta.

[Homer](https://github.com/bastienwirtz/homer) taas toimii itsellä näppäränä "kotisivuna", jonne olen linkitellyt näitä eri palveluita niin ei tarvitse ulkoa muistaa missäs portissa sitä mitäkin oli.

## Loppusanoja

Jotain tästä nyt varmaan jäi uupumaan sillä tuota systeemiä on ihan jonkun verran tuolla pyörimässä...

Otan muuten vastaan ideoita ja ehdotuksia! Mikäli sulla on jotain mukavaa, hassua, hauskaa tai jotain mielessä niin pistä viestiä!

**Säädätkö sinä kotipalvelimen kanssa?**
