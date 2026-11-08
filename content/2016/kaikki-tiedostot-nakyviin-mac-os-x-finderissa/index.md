---
title: "Kaikki tiedostot näkyviin Mac OS X Finderissa"
date: 2016-05-12T09:11:00
lastmod: 2017-03-06T08:32:00
description: "Tänään se alkoi viimein ärsyttämään oikein olan takaa, kun en nähnytkään kaikkia tiedostoja Finderissa. Halusin nähdä nimenomaan .gitignore ja .htaccess filut, jotta saisin ne kopioitua eteenpäin toisaalle. No tämä on aiemmin tehty komentorivin kautta, mutta tänään päätin googlettaa ja löytää ratkaisun tähän. Tämä ratkaisu olikin onneksi helppo sillä se vaati vain parin komennon ajamisen päätteellä"
categories: ["Apple"]
tags: ["finder", "mac", "mac os x", "os x", "piilotetut tiedostot", "tiedostot", "vinkki"]
aliases: ["/kaikki-tiedostot-nakyviin-mac-os-x-finderissa/"]
---

Tänään se alkoi viimein ärsyttämään oikein olan takaa, kun en nähnytkään kaikkia tiedostoja Finderissa. Halusin nähdä nimenomaan .gitignore ja .htaccess filut, jotta saisin ne kopioitua eteenpäin toisaalle. No tämä on aiemmin tehty komentorivin kautta, mutta tänään päätin googlettaa ja löytää ratkaisun tähän. Tämä ratkaisu olikin onneksi helppo sillä se vaati vain parin komennon ajamisen päätteellä ja homma oli sillä selvä.

Tässä vielä muistiin itselle ja teille:

1.  Avaa pääte
2.  Kopioi tämä komento: `defaults write com.apple.finder AppleShowAllFiles YES`
3.  Tapa Finder tällä komennolla: `killall Finder`
4.  Nauti kaikista mahdollisista tiedostoista Finderissasi

Piiloon nämä tiedostot saat näillä tempuilla:

1.  Avaa pääte
2.  Kopioi tämä komento: `defaults write com.apple.finder AppleShowAllFiles NO`
3.  Tapa Finder tällä komennolla: `killall Finder`
4.  Poof – tiedostot katosivat näkyvistä
