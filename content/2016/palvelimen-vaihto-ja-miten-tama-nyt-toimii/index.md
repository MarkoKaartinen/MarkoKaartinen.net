---
title: "Palvelimen vaihto ja miten tämä nyt toimii"
date: 2016-06-22T15:10:00
lastmod: 2017-03-06T08:31:00
description: "Olen viime aikoina puuhastellut Laravelin parissa ja tuli törmättyä Laravel Forgeen. Eilen tuli tehtyä tili Forgeen ja siitä se säätö lähti."
categories: ["Kulisseissa"]
tags: ["digitalocean", "git", "https", "laravel", "laravel forge", "let's encrypt", "letsencrypt", "linode", "palvelin.github", "ssl", "virtuaalipalvelin", "vps"]
aliases: ["/palvelimen-vaihto-ja-miten-tama-nyt-toimii/"]
---

Olen viime aikoina puuhastellut [Laravelin](https://laravel.com/) parissa ja tuli törmättyä tässä yhteydessä Laravel Forgeen. Eilen tuli sitten tehtyä sinne tili ja sen kautta [Linodeen](https://www.linode.com/?r=28f57b9930639eba1568ea7ecec425661e3752eb) virtuaalipalvelin. Sen takia tein muuten Linodeen, koska ne tuplasi muistin määrän. No nyt minulla on sitten uusi palvelin, jonne siirrän omat projektit yksi kerrallaan tässä tämän viikon aikana. Oma blogini oli ensimmäisistä siirroista.

Minulla oli ennen [DigitalOceanilla](https://m.do.co/c/34aebd17275a) virtuaalipalvelin ja pidän edelleen tästä palvelusta. Sen päällä oli [VestaCP](http://vestacp.com/), joka hoiti sitten sivujen hallintaa ja asensi palvelimet yms. minun puolesta. Tuo Forge kuitenkin mahdollistaa vieläki helpomman hallinnan ja suoran deployn Gitistä, joten lähdetään sen kanssa leikkimään. Siitä on varmasti hyötyä myös töiden kanssa, joten ei tässä voi kun voittaa – eikös?

Forge tukee myös suoraan [Let’s Encryptiä](https://letsencrypt.org/), joten minun sivuilla (ja muillakin) on nyt SSL sertifikaatti täysin ilmaiseksi! Kannattaa muuten kokeilla tuota, on suhteellisen simppeli käyttää, mutta jos haluaa itse tehdä niin vaatii hieman palvelinpuolen osaamistakin.

Oma sivusto on nyt siis Linoden päällä ja sillä on ssl sertifikaatti. Karsin lisäosia jonkun verran ja samalla otin käyttöön GitHub repositoryn ja [Bedrockin](https://roots.io/bedrock/) tälle sivulle. Niin siis tämä sivusto on GitHubissa ja voitte sitä ihmetellä repostani [MarkoKaartinen/MarkoKaartinen.net](https://github.com/MarkoKaartinen/MarkoKaartinen.net). Tuonne kun teen pushin niin se tulee täysin automaattisesti tänne. Tämä on hyödyllinen varsinkin, jos minulla olisi täysin itse tehty teema tässä alla ja muutenkin.

Pientä bugia ja säätöä on vielä varmasti ja jos huomaat jotain niin pistä kommenttia tai mailia minulle <markokaartinen@gmail.com> osoitteeseen!
