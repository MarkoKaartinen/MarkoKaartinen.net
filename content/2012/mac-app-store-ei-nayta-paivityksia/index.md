---
title: "Mac App Store ei näytä päivityksiä?"
date: 2012-06-26T17:05:00
lastmod: 2012-06-26T09:52:00
description: "Onko sinulla ollut joskus ongelma Macin App Storen kanssa, kun koitat päivittää ohjelmia. Herjaako se silloin sinulle seuraavaa: ”Päivitä ohjelma kirjautumalla sisään tilille, jolla ostit ohjelman.”? Ei hätää tähän ongelmaan on ratkaisu. Itse törmäsin tähän ongelmaan tänään kun koitin päivittää Coda 2:sta ja tiesin, että siihen oli tullut päivitys. App Store ei näyttänyt, että minulla"
categories: ["Tietokoneet"]
tags: ["app store", "apple", "indeksointi", "mac", "mac app store", "päivitykset"]
aliases: ["/mac-app-store-ei-nayta-paivityksia/"]
---

Onko sinulla ollut joskus ongelma Macin App Storen kanssa, kun koitat päivittää ohjelmia. Herjaako se silloin sinulle seuraavaa: *”Päivitä ohjelma kirjautumalla sisään tilille, jolla ostit ohjelman.”*?

Ei hätää tähän ongelmaan on ratkaisu. Itse törmäsin tähän ongelmaan tänään kun koitin päivittää Coda 2:sta ja tiesin, että siihen oli tullut päivitys. App Store ei näyttänyt, että minulla olisi päivityksiä mihinkään sieltä hankkimaani ohjelmaan. Tämä vaikutti oudolta joten päätin tutkia (lue. Googlata) asiaa hieman lisää.

Tutkimisen tuloksena oli se, että indeksointi jos on pois päältä niin kaikki ohjelmien päivitykset ei tule näkymiin App Storeen. Minun tapauksessani ei ollut ensimmäistäkään päivitystä. Olin aikoinaan ottanut indeksoinnin pois päältä, kun koin sen turhaksi. No päivityksiä on kiva saada niin laitoin indeksoinnin takaisin päälle [NGPixelin](http://www.ngpixel.com/2011/06/25/mac-app-store-you-have-updates-available-for-the-other-accounts-bug/) ohjeilla.

> **Solution 1 – Spotlight works but the index is incomplete or empty:**
>
> 1.  Open System Preferences \> Spotlight
> 2.  Under the Privacy tab. Add your Macintosh HD (or whatever your main hard disk is called) to the list.
> 3.  Close the window. Wait a few seconds. Then go back to Spotlight settings and remove the entry you just added.
> 4.  The spotlight index should now begin to re-index completely. (A dot will fade-in/out inside the Spotlight icon in the taskbar)
> 5.  Wait for it to finish and then launch the Mac App Store. You should now see updates in the Updates tab.
>
>  
>
> **Solution 2 – Spotlight indexing is disabled (frequent on Mac OS X Server)**
>
> 1.  Open a Terminal window.
> 2.  Type the following command: *sudo mdutil -i on /*
> 3.  A message saying “Indexing enabled.” should appear after a few seconds.
> 4.  Close the Terminal window and the Spotlight indexing should now start automatically. (Again, a dot will appear inside the Spotlight icon during the indexing process)
> 5.  Wait for it to finish and then launch the Mac App Store. You should now see updates in the Updates tab.

Tarvittaessa voin myös suomentaa teille tuon ohjeen, mikäli on tarvis niin kommentteja kiitos!
