---
title: "jQuery WordPressissä"
date: 2010-10-11T13:23:00
lastmod: 2013-08-05T15:10:00
description: "Tässä teemaa tehdessäni ja tutkiessani paria jQuery skriptiä – kävi ilmi, että WordPressissä onkin jQuery jo valmiiksi. Itsehän aluksi teemaan laitoin suoraan teema kansiosta jQueryn skriptin. Mutta tutkittuani jQueryn voikin laittaa suoraan teeman header tiedostoon ilman, että sinulla tarvitsee olla teeman sisällä omaa jQuery skripti tiedostoa. Hommahan onnistuu hyvinkin helposti. Avaa header.php -tiedosto editorissa. Etsi"
categories: ["Koodaus"]
tags: ["header", "html", "jquery", "koodivinkki", "php", "wordpress"]
aliases: ["/jquery-wordpressissa/"]
---

Tässä teemaa tehdessäni ja tutkiessani paria jQuery skriptiä – kävi ilmi, että WordPressissä onkin jQuery jo valmiiksi. Itsehän aluksi teemaan laitoin suoraan teema kansiosta jQueryn skriptin.\
Mutta tutkittuani jQueryn voikin laittaa suoraan teeman header tiedostoon ilman, että sinulla tarvitsee olla teeman sisällä omaa jQuery skripti tiedostoa.

Hommahan onnistuu hyvinkin helposti. Avaa **header.php** -tiedosto editorissa. Etsi kohta missä PHP funktio **wp_head();** kutsutaan. Lisää ennen sitä PHP funktion kutsu: **wp_enqueue_script(”jquery”);** ja näin jQuery on otettu teemaan ja voitkin käyttää sitä hyödyksi!

Ja tähän vielä pieni pala omaa **header.php** tiedostoani:

\<?php wp_enqueue_script("jquery"); ?\>\
\<?php wp_head(); ?\>\
\<script type="text/javascript" src="\<?php bloginfo('template_directory'); ?\>/MarkoInTheBox.js"\>\</script\>\
\</head\>

**HOX HOX**

Tutkiskelin lisää ja jQuery toimii ns. ”no conflict” -modessa. Ja tämä muuttaa hieman jQuery koodin tekemistä. Lisää siitä WordPressin Codexissa: [Linkki](http://codex.wordpress.org/Function_Reference/wp_enqueue_script#jQuery_noConflict_wrappers)
