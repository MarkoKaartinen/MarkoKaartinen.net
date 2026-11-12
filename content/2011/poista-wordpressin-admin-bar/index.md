---
title: "Poista WordPressin admin bar"
date: 2011-06-07T12:53:00
description: "Itselleni tuli eteen tilanne, jossa halusin WordPressin Admin Bar -osan pois käytöstä. Tämähän on ominaisuus, joka on rakennettu WordPressiin ja suoraa on/off -painiketta ei taida olla olemassa. Ratkaisu on helppo, kopioi teemasi functions.php -tiedostoon seuraava koodinpätkä: add_filter( ’show_admin_bar’, ’__return_false’ ); Tämän jälkeen Admin Baria ei pitäisi enää näkyä!"
categories: ["Koodaus"]
tags: ["admin bar", "koodi", "ohjelmointi", "vinkki", "wordpress"]
aliases: ["/poista-wordpressin-admin-bar/"]
---

Itselleni tuli eteen tilanne, jossa halusin WordPressin Admin Bar -osan pois käytöstä. Tämähän on ominaisuus, joka on rakennettu WordPressiin ja suoraa on/off -painiketta ei taida olla olemassa.

Ratkaisu on helppo, kopioi teemasi **functions.php** -tiedostoon seuraava koodinpätkä:\
*add_filter( ’show_admin_bar’, ’\_\_return_false’ );*

Tämän jälkeen Admin Baria ei pitäisi enää näkyä!
