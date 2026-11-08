---
title: "SMLIGHT SLZB-06 & Zigbee2MQTT Home Assistanttiin"
date: 2025-02-18T18:49:00
description: "Tällä kertaa otetaan käsittelyyn Zigbee verkon pystytys ja nimenomaan käytetään hyödyksi Zigbee2MQTT siltaa ja Home Assistanttia. Koordinaattoriksi laitetaan SMLIGHT SLZB-06 laite."
categories: ["Selfhosted"]
tags: ["zigbee", "zigbee2mqtt", "smlight", "slzb-06", "home assistant", "älykoti", "kotiautomaatio"]
series: ["Selfhosted"]
---

Tällä kertaa otetaan käsittelyyn ZigBee verkon pystytys ja nimenomaan käytetään hyödyksi Zigbee2MQTT siltaa ja Home Assistanttia. Koordinaattoriksi laitetaan SMLIGHT SLZB-06 laite.
{.lead}

Minulle tuli tämä tarpeeseen, kun järjesteltiin asuntoa hieman niin tuli tarve saada siirrettyä läppäripalvelin toiseen tilaan. Se kuitenkin piti äkkiä siirtää takaisin keskemmälle asuntoa sillä tuo antinen Sonoffin ZigBee koordinaattori oli USB:llä kiinni tuossa läppäripalvelimessa ja liian moni asia alkoi toimia huonommin. Laitoin sitten tilaukseen Power over Ethernetiä tukevan SMLIGHT SLZB-06 koordinattorin.

## SMLIGHT SLZB-06

Tämä päätyi minun ostoskoriin oikeastaan sen takia, että oli saanut kehuja Internetissä sekä isoimpana ominaisuutena on PoE tuki. Tämä siis saa virran ethernet kaapelista (jos siis on PoE injektori tai PoE kytkin). Tämä nimittäi helpottaa huomattavasti tämän sijoittelua sillä saan tämän yhdellä kaapelilla verkkoon ja virtoihin.

Tämän asennus oli myöskin super helppoa sillä pistin vain verkkopiuhan kiinni PoE kytkimeen ja sen jälkeen määrittelin pfSense boxista tälle vielä kiinteän IP osoitteen niin eipähän sekään muutu.

Tämän jälkeen kävin tuon hallintaisivuille (IP-osoitteen takana) katsomassa hieman määrityksiä ja päivittämässä tuoretta versiota sisään.

![SMLIGHT SLZB-06 hallintasivu](slzb-dash.png)

Tuollahan on hallinnassa kohta mistä saat napattua suoraan konffeja Zigbee2MQTT:tä varten. Tämä löytyy Z2M and ZHA kohdasta ja näiden konffien avulla saat tämän koordinaattorin toimimaan omassa systeemissäsi.

Valmistajan sivut: [smlight.tech/product/slzb-06/](https://smlight.tech/product/slzb-06/)<br />
Ohjeet: [smlight.tech/manual/slzb-06/](https://smlight.tech/manual/slzb-06/)

## Zigbee2MQTT

Tämäkin menee Dockeriin ja tämän kaverina menee myös Mosquitto kontti. Näiden kahden kanssa saadaan sitten Zigbee2MQTT silta toimimaan.

Valitsin tuon Zigbee2MQTT sillan Home Assistantin ZHA yli oikeastaan sen takia, kun minulla oli ZHA käytössä ja se tuntui menevän rikki nyt viime aikoina. Jotkin pistokkeet ei menneet päälle HA dashboardin kautta ja oli muutakin hitautta. Epäilin syyksi, että joku on jossain ZHA:ssa jumissa ja pitäisi parittaa koko paletti uusiksi. Sen takia mietin, että sama lähteä tuon Zigbee2MQTT kelkkaan.

Asennushan on suhteellisen simppeli sillä pistetään Docker kontti pystyyn ja määritetään asetukset. Tässä onkin vielä tuo minun `docker-compose.yml` ja taas on `/opt/zigbee2mqtt` kansiossa tuo oma asennus.

```yaml
version: '3.8'
services:
    mqtt:
        image: eclipse-mosquitto:2.0
        restart: unless-stopped
        volumes:
            - '/opt/zigbee2mqtt/mosquitto-data:/mosquitto'
        environment:
            - TZ=Europe/Helsinki
            - PUID=1000
            - PGID=1000
        ports:
            - '1883:1883'
            - '9001:9001'
        command: 'mosquitto -c /mosquitto-no-auth.conf'

    zigbee2mqtt:
        container_name: zigbee2mqtt
        restart: unless-stopped
        image: koenkk/zigbee2mqtt
        volumes:
            - /opt/zigbee2mqtt/zigbee2mqtt-data:/app/data
            - /run/udev:/run/udev:ro
        ports:
            - 8082:8080
        environment:
            - TZ=Europe/Helsinki
            - PUID=1000
            - PGID=1000
```

Alla onkin noita omia konffeja ja siivoilin siitä hieman ns. turhaa pois. Kannattaa tuon <abbr title="Zigbee2MQTT">Z2M</abbr> ohjeita katsoa näihin. Nämähän on itsellä tuolla `zigbee2mqtt-data` kansion `configuration.yaml` tiedostossa.

```yaml
version: 4
mqtt:
  base_topic: zigbee2mqtt
  server: mqtt://mqtt
serial:
  port: tcp://10.10.10.8:6638
  baudrate: 115200
  adapter: zstack
frontend:
  enabled: true
homeassistant:
  enabled: true
  experimental_event_entities: true
```

Sen jälkeen päästäänkin taas web käyttöliittymän kautta säätämään. Tärkeää on määrittää tuo koordinaattori, jotta <abbr title="Zigbee2MQTT">Z2M</abbr> voi sitten käyttää sitä siksipä tuo kiinteä IP osoite lähiverkossa on todella hyvä olla tuolla koordinaattorilla.

![Zigbee2MQTT hallintanäkymä](z2m-home.png)

Sen jälkeen ei tarvitse kuin paritella laitteet <abbr title="Zigbee2MQTT">Z2M</abbr> kanssa. Se on helppoa sillä laitat vain <abbr title="Zigbee2MQTT">Z2M</abbr> tilaan, jossa laitteet voi liittyä ja pistät aina laitteen paritustilaan. Heidän sivuilla on tosi hyvä kattaus laitteita ja miten ne saa paritustilaan.

Kotisivut: [www.zigbee2mqtt.io](https://www.zigbee2mqtt.io/)

## Muuta säätöä

Home Assistantin päässä pitää tuo [MQTT integraatio](https://www.home-assistant.io/integrations/mqtt/) asentaa ja määrittää se. Sen jälkeen jokainen laite minkä lisäät <abbr title="Zigbee2MQTT">Z2M</abbr> päässä tulee tuonne Home Assistantin MQTT puolelle.

![Home Assistant MQTT näkymä](ha-mqtt.png)

Tämä ei oikeastaan sen isommin säätöä tarvinnut. Isoin työmaa oli tosiaan parittaa nuo kaikki laitteet uudelleen. Samalla nimesin nuo hieman järkevämmin. Onneksi <abbr title="Zigbee2MQTT">Z2M</abbr> sivuilla oli tosi hyvin ohjeita paritustilaan.

## Miten tämä kombo on nyt toiminut?

Lyhyesti sanottuna: **Hyvin**.

Ensimmäinen yllätys oli se, että pitkään ZHA kautta Home Assistantissa olleet Ikean Tretakt pistorasiat sai OTA päivityksen. Minulla oli OTA päivitykset myös ZHA puolella päällä ja ne välistä toimikin, mutta ilmeisesti ei ole noiden kohdalla toimineet.

Toinen positiivinen asia on tuo kartta minkä saa tuolta. ZHA kartta oli, noh semmoinen oli. Tämä on huomattavasti parempi sillä laitetta klikkaamalla näet mihin se on liitoksissa ja voit havainnoida sinun oman kotisi ZigBee verkkoa helposti. Samoin karttaa voi zoomata jolloin saat kokokuvan tai vähän lähemmän kuvan omasta verkosta.

![Zigbee2MQTT kartta](z2m-map.png)

Tuon hyvän kartan etuna on myös se, että sitä tulee käytettyä. Tulee hieman katsottua, että mikä laite on missäkin kiinni. Ei nimittäin kauheasti lämmitä jos esim. vuotovahti on yhdistynyt lamppuun joka sammutetaan kytkimestä ja näin ollen yhteys katkeaa.

## Loppu lätinää

Tämäkin menee sarjaan: olisinpa alusta asti tehnyt näin. On tämä hieman parempi systeemi, kuin Home Assistantin sisäänrakennettu ZHA.

Tuohan tämä taas yhden systeemin lisää tähän "himmeliin", mutta ei tämä nyt vielä ainakaan ongelmalliselta vaikuta. 

**Mitäs sitten säädetään?**
