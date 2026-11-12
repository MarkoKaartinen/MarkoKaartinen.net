---
title: "Pääsiäinen + PHP"
date: 2010-09-23T11:54:00
lastmod: 2015-01-04T16:15:00
description: "Tuli eteen työn merkeissä selvittää pääsiäinen. Noh laiskahan olisi tehnyt huonon ohjelmointitavan mukaisesti taulukon, jossa olisi ollut vaikka kymmeneksi vuodeksi eteenpäin pääsiäiset. Itse päädyin tutkimaan miten sen voi määrittää ja miten se määräytyy. Löysinkin artikkelin Wikipediasta, jossa oli ohje pääsiäisen laskemiseen. Ajattelin helpottaa muita vastaavassa tilanteessa olevia ja julkaista pienen PHP pätkän, joka laskee pääsiäisen."
categories: ["Koodaus"]
tags: ["koodaus", "koodi", "pääsiäinen", "php"]
aliases: ["/paasiainen-php/"]
---

Tuli eteen työn merkeissä selvittää pääsiäinen. Noh laiskahan olisi tehnyt huonon ohjelmointitavan mukaisesti taulukon, jossa olisi ollut vaikka kymmeneksi vuodeksi eteenpäin pääsiäiset. Itse päädyin tutkimaan miten sen voi määrittää ja miten se määräytyy. Löysinkin artikkelin [Wikipediasta](http://fi.wikipedia.org/wiki/P%C3%A4%C3%A4si%C3%A4inen#P.C3.A4iv.C3.A4m.C3.A4.C3.A4r.C3.A4n_laskeminen), jossa oli ohje pääsiäisen laskemiseen. Ajattelin helpottaa muita vastaavassa tilanteessa olevia ja julkaista pienen PHP pätkän, joka laskee pääsiäisen.

Funkkari ottaa arvoksi vuoden eli esimerkiksi 2010 ja tämän jälkeen palauttaa päivämäärän muodossa pp.kk.vvvv. Vuonna 2010 pääsiäinen oli 4. huhtikuuta. Kommentoikaa ja kertokaa jos koodissa on joku bugi tai härö.

\<?php\
function paasiainen(\$vuosi){\
    \$a = \$vuosi % 19;\
    \$b = (int)(\$vuosi / 100);\
    \$c = \$vuosi % 100;\
    \$d = (int)(\$b / 4);\
    \$e = \$b % 4;\
    \$f = (int)((\$b + 8) / 25);\
    \$g = (int)((\$b - \$f + 1) / 3);\
    \$h = (19 \* \$a + \$b - \$d - \$g + 15) % 30;\
    \$i = (int)(\$c / 4);\
    \$k = \$c % 4;\
    \$l = (32 + 2 \* \$e + 2 \* \$i - \$h - \$k) % 7;\
    \$m = (int)((\$a + 11 \* \$h + 22 \* \$l) / 451);\
    \$n = (int)((\$h + \$l - 7 \* \$m + 114) / 31);\
    \$p = (\$h + \$l - 7 \* \$m + 114) % 31;\
\
    \$kuuk = \$n;\
    \$paiv = \$p + 1;\
    \$paasiainen = "\$paiv.\$kuuk.\$vuosi";\
    return \$paasiainen;\
}\
?\>
