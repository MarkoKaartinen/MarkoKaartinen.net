---
title: "Hovercardit saapuivat!"
date: 2010-11-17T18:02:00
lastmod: 2013-08-05T15:20:00
description: "Bongasin eräästä toisesta blogista Hovercardin ja aloin googlailemaan miten tänne saisi semmoisen. Kun viette hiiren minun pikkukuvani päälle tämän blogikirjoituksen alapuolella, niin näette pienen ”kortin” minusta. Tämänhän loistavan ominaisuuden mahdollistaa jälleen kerran Gravatar. Sekä tämän lisääminen omaan WordPress blogiisi on helppoa! Avaat vain teemasi functions.php tiedoston ja lisäät sinne alla olevan pätkän (huom. blogisi on"
categories: ["Kulisseissa"]
tags: ["blogi", "gravatar", "hovercard", "ominaisuus", "vinkki", "wordpress"]
aliases: ["/hovercardit-saapuivat/"]
---

Bongasin eräästä toisesta blogista Hovercardin ja aloin googlailemaan miten tänne saisi semmoisen. Kun viette hiiren minun pikkukuvani päälle tämän blogikirjoituksen alapuolella, niin näette pienen ”kortin” minusta.

Tämänhän loistavan ominaisuuden mahdollistaa jälleen kerran Gravatar. Sekä tämän lisääminen omaan WordPress blogiisi on helppoa!

Avaat vain teemasi **functions.php** tiedoston ja lisäät sinne alla olevan pätkän (huom. blogisi on käytettävä Gravatar avatareja oletuksena):

wp_enqueue_script( 'gprofiles', 'http://s.gravatar.com/js/gprofiles.js', array( 'jquery' ), 'e', true );

Tämän jälkeen homma toimii! Hienoa eikö? Omia hovercardin tietoja voit muokata [Gravatar.com](http://fi.gravatar.com/) sivustolla ja kun sinulle on sinne tunnukset ja olet kirjautunut sisään – löydät kohdan My account -\> Muokkaa omaa profiilia. Tämän kun tallennat, niin tiedot näkyvät Hovercardissasi.
