---
title: "Linux palvelimen tiedostojen ja tietokannan varmuuskopiointi Dropboxiin"
date: 2018-07-24T15:14:00
description: "Kirjoittelin aamulla varmuuskopiointi skriptiä yhdelle palvelimelle. Tästä tulikin ihan hyödyllinen paketti ja jaankin tähän nyt ohjeistusta miten saat tämän toimintaan itsellekkin. Oletan, että olet sinut Linuxin kanssa ja peukalo ei ole keskellä kämmentä :) Eli halusin varmuuskopiot tietokannasta ja tiedostoista. Sekä koska maksan Dropboxista niin minulla on siellä kivasti tilaa niin olisi näppärä jos ne"
categories: ["Kotilabra"]
tags: ["dropbox", "howto", "koodi", "linux", "ohje", "opas", "palvelin", "tuto", "varmuuskopiointi", "vinkki"]
aliases: ["/linux-palvelimen-tiedostojen-ja-tietokannan-varmuuskopiointi-dropboxiin/"]
---

Kirjoittelin aamulla varmuuskopiointi skriptiä yhdelle palvelimelle. Tästä tulikin ihan hyödyllinen paketti ja jaankin tähän nyt ohjeistusta miten saat tämän toimintaan itsellekkin. Oletan, että olet sinut Linuxin kanssa ja peukalo ei ole keskellä kämmentä :)

Eli halusin varmuuskopiot tietokannasta ja tiedostoista. Sekä koska maksan Dropboxista niin minulla on siellä kivasti tilaa niin olisi näppärä jos ne menisi sinne automaattisesti. Eikun siis töihin. Itse tein touhut roottina joten kannattaa sudo komentoa käyttää tai mennä roottina sisään.

Aloitetaan vaikka asentamalla lbzip2, jota itse käytin tietokannan pakkaamiseen. Ohjeita löydät heidän omalta kotisivultaan: <http://lbzip2.org/>

Seuraavaksi luodaan kansio varmuuskopioille. Itse loin /backup kansion ja se onnistuu komennolla `mkdir /backup`

Mennään luotuun kansioon `cd /backup` komennolla.

Sinne voidaan sitten asennella Dropbox uploader. Itse latasin /backup kansioon tuon dropbox_uploader.sh tiedoston. Ohjeita löytyy Github reposta: <https://github.com/andreafabrizi/Dropbox-Uploader>

Muista antaa dropbox_uploader.sh tiedostolle oikeudet kuten ohjeistettu ja aja se kerran niin saat homman pelaamaan.

Tehdään Dropboxiin kansio varmuuskopioille komennolla `./dropbox_uploader.sh mkdir backups`

Sitten tehdään backup.sh tiedosto /backup kansioon. Itse käytän nanoa niin komento `nano /backup/backup.sh` hoitaa homman.

Siihen liitetään alla oleva koodi ja muokataan omien tarpeiden mukaan:

\#!/bin/bash\
MyUSER="tietokannan_tunnus"\
MyPASS="tietokannan_salasana"\
MyHOST="localhost"\
MyDB="tietokannan_nimi"\
\
NOW="\$(date +"%d-%m-%Y-%H-%M-%S")"\
\
FILES="/polku/tiedostoihin/"\
\
DEST="/backup/\$NOW"\
\
\[ ! -d \$DEST \] && mkdir -p \$DEST \|\| :\
\
FILE="\$DEST/db.sql"\
\
mysqldump -u \$MyUSER -h \$MyHOST -p\$MyPASS \$MyDB \> \$FILE\
\
/usr/local/bin/lbzip2 \$FILE\
\
cd \$FILES\
tar zcpf \$DEST/files.tar.gz ./\*\
\
cd \$DEST\
/backup/dropbox_uploader.sh upload \$DEST backups

Huomaa, että lbzip2 sijainti voi olla sinulla eri. Komennolla `which lbzip2` saat polun selville. Muokkaa myös tietokannan tiedot sopiviksi ja tiedostojen sijainti.

Tämän jälkeen tallenna tiedosto <span class="kbd">ctrl</span> + <span class="kbd">o</span> tekee tämän nano editorissa ja <span class="kbd">ctrl</span> + <span class="kbd">x</span> sulkee nanon.

Komennolla `chmod +x /backup/backup.sh` annetaan vielä hieman oikeuksia.

Voit koittaa homman toiminnan komennolla `sh /backup/backup.sh` – sen pitäisi luoda /backup kansioon päivämäärä ja aika niminen kansio jossa on kaksi tiedostoa: db.sql.bz2 ja files.tar.gz

Tämän voi sitten pistää esimerkiksi croniin pyörimään, jos haluat automaattisesti hoitaa ajamisen.

Mikäli tässä on virheitä tai aivopieruja niin en tietty vastaa ongelmista. Jokainen kokeilee omalla vastuullaan :)\
Palautteet ja kommentit ovat tervetulleita. Tämä toimii oikein mainiosti ja tätä voi kehittää pidemmällekkin mikäli haluaa.
