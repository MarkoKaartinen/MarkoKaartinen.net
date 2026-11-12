---
title: "Lyhytosoite postauksesta"
date: 2010-02-13T13:29:00
lastmod: 2013-08-05T15:04:00
description: "Löysin kivan koodinpätkän jolla saa aikaan tämänkin blogiviestin alapuolella olevan ”Tämän blogauksen lyhytosoite on xxx”. Koodi käyttää TinyURL sivustoa avukseen. Aluksi laita seuraava koodinpätkä teemakansiossa olevaan functions.php tiedostoon (jos ei ole niin luo ko. tiedosto) <?php function getTinyUrl($url) { $tinyurl = file_get_contents(\"http://tinyurl.com/api-create.php?url=\".$url); return $tinyurl; } ?> Kyseinen funktio hakee tinyurlin osoitteesta lyhytosoitteen postistasi kun käytät"
categories: ["Koodaus"]
tags: ["koodi", "php", "vinkit", "wordpress"]
aliases: ["/lyhytosoite-postauksesta/"]
---

Löysin kivan koodinpätkän jolla saa aikaan tämänkin blogiviestin alapuolella olevan ”Tämän blogauksen lyhytosoite on xxx”.\
Koodi käyttää TinyURL sivustoa avukseen.

Aluksi laita seuraava koodinpätkä teemakansiossa olevaan functions.php tiedostoon (jos ei ole niin luo ko. tiedosto)

\<?php\
function getTinyUrl(\$url) {\
    \$tinyurl = file_get_contents("http://tinyurl.com/api-create.php?url=".\$url);\
    return \$tinyurl;\
}\
?\>

Kyseinen funktio hakee tinyurlin osoitteesta lyhytosoitteen postistasi kun käytät sitä esimerkiksi single.php tiedostossa seuraavalla tavalla:

T\&auml;m\&auml;n blogauksen lyhytosoite on \<a href="\<?php echo getTinyUrl(get_permalink(\$post-\>ID)); ?\>"\>\<?php echo getTinyUrl(get_permalink(\$post-\>ID)); ?\>\</a\>.

Samaa getTinyUrl() funktiota voit käyttää muuallakin sivustollasi kun annat sille urlin menemään niin se luo mistä tahansa osoitteesta lyhytosoitteen. Mutta muista, että funktiota pitää käyttää WordPress [loopin](http://codex.wordpress.org/The_Loop) sisällä.
