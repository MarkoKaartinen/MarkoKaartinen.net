---
title: "Asennetaan palvelimelle \"perusohjelmat\""
date: 2012-11-01T19:16:00
description: "”Perusohjelmilla” tarkoitan tässä tapauksessa ohjelmia, joita tarvitsen saadakseni webbipuolen toimimaan. Sekä samalla asennellaan phpMyAdmin sekä Webmin ja muuta mukavaa. Kaikki komennot toimivat Ubuntussa ja pitäisi toimia muissakin koneissa missä on APT käytössä. Tämän on tarkoitus olla muistilista itselle ja muille, jotka tarvitsee tämänkaltaisia komentoja."
categories: ["Kotipalvelin", "Projekti"]
tags: ["apache", "boksi", "kotipalvelin", "mysql", "ohjeet", "palvelin", "php", "phpmyadmin", "ssh", "webmin"]
aliases: ["/asennetaan-palvelimelle-perusohjelmat/"]
---

”Perusohjelmilla” tarkoitan tässä tapauksessa ohjelmia, joita tarvitsen saadakseni webbipuolen toimimaan. Sekä samalla asennellaan phpMyAdmin sekä Webmin ja muuta mukavaa. Kaikki komennot toimivat Ubuntussa ja pitäisi toimia muissakin koneissa missä on APT käytössä.

Tämän on tarkoitus olla muistilista itselle ja muille, jotka tarvitsee tämänkaltaisia komentoja.

## SSH

Aloitetaan kuitenkin sillä, että asennetaan palvelimelle SSH. Tämä sen takia, jotta päästään palvelimeen käsiksi SSH:n yli ja itse tykkään hallita Linux koneita ennemmin päätteen kautta. Asennus on varsin simppeli, ajetaan vain päätteessä seuraava komento:

`sudo apt-get install openssh-server`

Tämän jälkeen voitkin yhdistää toiselta koneelta SSH:n yli palvelimesi IP:seen.

## Apache

Toinen välttämättömyys itselle on Apache, tämä hoitaa webbipalvelinsoftan virkaa. Olen joskus myös käyttänyt hieman kevyemmissä setupeissa Lighttpd nimistä palvelinsoftaa. Asennus on taas simppeli komento:

`sudo apt-get install apache2`

Itselläni Apachen asennus antoi sitten vielä seuraavanlaisen ”herjan” kun Apachea alettiin käynnistämään:

`apache2: Could not reliably determine the server's fully qualified domain name, using 127.0.1.1 for ServerName`

Tämän ratkaisin muokkaamalla apache2.conf filua:

`sudo nano /etc/apache2/apache2.conf`

Lisäämällä alkuun rivin:

`ServerName boksi`

Ctrl + o yhdistelmä tallentaa Nanossa (boksi on oman palvelimeni nimi)\
Ctrl + x yhdistelmä sulkee Nanon

Sen jälkeen rebootataan vielä Apache:

`sudo /etc/init.d/apache2 restart`

Näet Apachen toimivuuden menemällä selaimella koneesi ip-osoitteeseen (esim. http://192.168.0.66), sen pitäisi sanoa **It works!**

## PHP

Itse kehitän sovellukseni PHP:llä joten tämä on oikeastaan Apachen rinnalla niitä tärkeitä softia mitä pitää asentaa koneelle. PHP:n asentaminen on myöskin simppelin komennon takana:

`sudo apt-get install php5`

Tämän jälkeen asentelen vielä pari lisäpakettia:

`sudo apt-get install php5-gd php5-cgi php5-curl`

## MySQL

Itse käytän tietokantana mieluiten MySQL tietokantaa ja senkin asennus on helppoa kuin heinänteko:

`sudo apt-get install mysql-server php5-mysql libapache2-mod-auth-mysql`

Asennus kysyy tietokannan salasanaa kahdesti.

Samalla asentuu myös PHP:n ja Apachen palikat MySQL tietokantaa varten.

## PhpMyAdmin

Itse pidän siitä, että voin hallita MySQL tietokantaa helposti selaimen kautta ja PhpMyAdmin on se työkalu. Se asennetaan seuraavanlaisesti:

`sudo apt-get install phpmyadmin`

Asennus kysyy mikä webbipalvelin on käytössä ja siihen vastataan, että **Apache 2**.\
Asennus kysyy myös aiemmin asetettua tietokannan salasanaa sekä haluaa laittaa PhpMyAdminille oman salasanan.

PhpMyAdminin toimivuuden voit tarkistaa menemällä koneesiIP/phpmyadmin osoitteeseen (esim. http://192.168.0.66/phpmyadmin/). Sisään pääset tunnuksella root ja salasana on aiemmin määrittämäsi salasana.

## Webmin

Webmin on pätevä selainpohjainen hallintasovellus palvelimelle. Sitä kautta voit näppärästi hallita käyttäjiä ja monia muitakin palvelimen asetuksia.

Aloitetaan lataamalla Webmin komennolla:

`wget http://prdownloads.sourceforge.net/webadmin/webmin_1.600_all.deb`

Sen jälkeen asennetaan paketti:

`dpkg --install webmin_1.600_all.deb`

Mikäli saat valituksia riippuvuuksista (depencies):

`apt-get install perl libnet-ssleay-perl openssl libauthen-pam-perl libpam-runtime libio-pty-perl apt-show-versions python`

Toimivuuden voit tarkistaa menemällä selaimella osoitteeseen https://omaip:10000 (esim https://192.168.0.66:10000). Tunnus on root ja salasana on oma salasanasi.

Seuraava huomio Webminin sivuilta:

> Some Debian-based distributions (Ubuntu in particular) don’t allow logins by the root user by default. However, the user created at system installation time can use sudo to switch to root. Webmin will allow any user who has this sudo capability to login with full root privileges

Tässä on hyvin perussetti webbipalvelinta varten. Tulen kirjoittelemaan tämäntapaisia artikkeleita lisää sillä nämä toimivat myös hyvinä muistiinpanoina itselleni.
