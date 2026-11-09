---
title: "Tietoa minusta ja sivuista"
description: "Tietoa minusta sekä sivuista. Miten sivut on tehty ja hieman historiaa niistä."
---

Moikka! Olen Kaartisen Marko ja ikää on {{< ika >}} vuotta. Asustelen Kuopiossa ja rakennan pääasiallisesti Internettiä eli koodailen verkkosivuja ja -sovelluksia.
{.lead}

MarkoKaartinen.net on pisimpiä projektejani ja täällä onkin artikkeleita aina vuodelta 2007 tähän päivään asti. Itse domain on ollut minulla ainakin vuodesta 2005 asti.

## Sivuston historia

Sivusto on ehtinyt vaihtaa alustaa useaan otteeseen. Sisältö on kuitenkin säilynyt koko ajan, ja vanhat osoitteet toimivat edelleen.

* **Ennen vuotta 2007 · Oma kotisivu.** Alussa sivut oli itse tehtyä koodia ja PHP taival, kun oli alussa niin sillä sitä tuli tehtyä. Silloin oli vähän sitä sun tätä.
* **2007 · WordPress.** Ensimmäinen artikkeli, joka on jemmassa julkaistiin 17.10.2007, ja blogi pyöri [WordPressin](https://wordpress.org) päällä lähes 17 vuotta. Vanhat kommentit ovat peräisin tältä ajalta.
* **2024 · Laravel.** Koodasin sivuston uusiksi [Laravelilla](https://laravel.com) ([Livewire](https://livewire.laravel.com) ja [Filament](https://filamentphp.com) hallintapaneelina). Uudet artikkelit kirjoitettiin markdown-tiedostoihin (vanhat WordPress-kirjoitukset jäivät vielä HTML-muotoon, mutta tuotiin .md tiedostoiksi), ja osoitteet muuttuivat muotoon `/vuosi/otsikko`. Vanhoista WordPress-osoitteista tehtiin ohjaukset, joten vanhat linkit toimivat edelleen.
* **2026 · Hugo.** Marraskuussa 2026 sivusto siirtyi [Hugoon](https://gohugo.io). Samalla myös vanhat WordPress-ajan kirjoitukset muunnettiin HTML:stä markdowniksi, joten kaikki 793 artikkelia ovat nyt tavallisia markdown-tiedostoja kuvineen samassa kansiossa. Sivusto on valmista staattista HTML:ää, joten se on nopea ja kevyt ylläpitää.

## Miten sivusto nyt toimii

Artikkelit ja sivut ovat markdown-tiedostoja, joten ne on helppo siirtää minne tahansa. [Hugo](https://gohugo.io) rakentaa niistä sivuston, ja ulkoasu on oma teema, jossa on [Tailwind](https://tailwindcss.com) ja [Catppuccinin](https://catppuccin.com) värit. Fontit ([JetBrains Mono](https://www.jetbrains.com/lp/mono/) ja [Atkinson Hyperlegible Next](https://www.brailleinstitute.org/freefont/)) tulevat omalta palvelimelta.

Haku toimii selaimessa, ja koko tekstin haun tekee [Pagefind](https://pagefind.app). Kommentit tulevat Mastodonista: artikkelin julkaisupostaukseen vastaamalla pääsee mukaan keskusteluun. Vanhat WordPress- ja Laravel-ajan kommentit on säilytetty artikkeleiden lopussa.

Koko sivusto ja teema ovat avointa lähdekoodia ja nähtävissä GitHubissa: [MarkoKaartinen/MarkoKaartinen.net](https://github.com/MarkoKaartinen/MarkoKaartinen.net).

## Yhteystiedot

Minulle voi pistää viestiä sähköpostilla [markokaartinen@gmail.com](mailto:markokaartinen@gmail.com) sähköpostin kautta tai sitten Mastodonissa [@marko@kaartinen.social](https://kaartinen.social/@marko) tilin kautta. Tsekkaa myös [nyt tapahtuu](/nyt) sivu.

Tsekkaa myös [Linkit](/linkit) sivulta muita projekteja.
