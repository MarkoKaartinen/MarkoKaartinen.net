---
title: "Backspace näppäimestä edelliselle sivulle Firefoxissa"
date: 2009-01-24T13:34:00
description: "Asentelin CrunchEee Linuxin omaan Eeeheni ja tähän mennessä olen pitänyt ko. distrosta. Kuitenkin olen törmännyt samaan ongelmaan aiemminkin ja etsinyt aina samaan ongelmaan ratkaisua Googlesta, mutta nyt päätin blogata sen tänne, jotta ei tarvitse aina etsiä sitä. Eli ongelma on, että olen tottunut siihen, että Firefoxissa kun painnaa backspace näppäintä niin menee edelliselle sivulle. Jos"
categories: ["Blogi"]
tags: ["backspace", "cruncheee", "firefox", "linux"]
aliases: ["/backspace-nappaimesta-edelliselle-sivulle-firefoxissa/"]
---

Asentelin CrunchEee Linuxin omaan Eeeheni ja tähän mennessä olen pitänyt ko. distrosta.

Kuitenkin olen törmännyt samaan ongelmaan aiemminkin ja etsinyt aina samaan ongelmaan ratkaisua Googlesta, mutta nyt päätin blogata sen tänne, jotta ei tarvitse aina etsiä sitä.\
Eli ongelma on, että olen tottunut siihen, että Firefoxissa kun painnaa backspace näppäintä niin menee edelliselle sivulle. Jos näin ei tapahdu niin tässä tulee korjaus siihen:

Kirjoita about:config Firefoxin osoiteriville ja etsi kohta: browser.backspace_action ja määritä sille arvoksi 0\
Tämän jälkeen backspace näppäin toimii kuten haluankin.
