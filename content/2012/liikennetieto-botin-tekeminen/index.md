---
title: "Liikennetieto botin tekeminen"
date: 2012-07-16T13:10:00
lastmod: 2012-07-16T11:43:00
description: "Ajattelin aukaista teille hieman tekniikkaa ja koodia tuon @Liikennetieto botin takaa. Tässä postauksessa on siis aimo annos nörtti-puhetta. Käytetyt tekniikat Liikennetieto botin takana on paljon muutakin, kuin pelkkä Twitter-tili johon ilmestyy automaattisesti päivityksiä. Kerron tässä kappaleessa seikkaperäisesti eri tekniikoista ja miten niitä käytetään tämän botin kanssa. TwitterOAuth on PHP-kirjasto, jonka avulla voidaan käyttää Twitterin APIa"
categories: ["Koodaus"]
tags: ["bootstrap", "botti", "git", "jquery", "koodaus", "nörtti", "ohjelmointi", "php", "twitter"]
aliases: ["/liikennetieto-botin-tekeminen/"]
---

Ajattelin aukaista teille hieman tekniikkaa ja koodia tuon @Liikennetieto botin takaa. Tässä postauksessa on siis aimo annos nörtti-puhetta.

## Käytetyt tekniikat

Liikennetieto botin takana on paljon muutakin, kuin pelkkä Twitter-tili johon ilmestyy automaattisesti päivityksiä. Kerron tässä kappaleessa seikkaperäisesti eri tekniikoista ja miten niitä käytetään tämän botin kanssa.

[TwitterOAuth](https://github.com/abraham/twitteroauth/) on PHP-kirjasto, jonka avulla voidaan käyttää Twitterin APIa suhteellisen helposti. Tämän kirjaston avulla saadaan Twitteriin uusi päivitys.

[Cronilla](http://fi.wikipedia.org/wiki/Cron) taas saadaan koodinpätkä katsomaan 5 minuutin välein onko tullut uusia liikennetiedotteita ja päivittämään ne Twitteriin ja tietokantaan automaattisesti.

[Google Maps API](https://developers.google.com/maps/documentation/javascript/)lla toteutin kartan botin kotisivuille ja sitä on muutenkin käytetty hyödyksi esim. staattisissa karttakuvissa, 24h kartassa sekä liikennetiedotteen infoissa.

[Bootstrap](http://twitter.github.com/bootstrap/) sai tälläkin kertaa toimia ulkoasun frameworkkinä. Suosittelen lämpimästi tätä täysin ilmaista ”koodikasaa”.

[Fancyboxilla](http://fancyapps.com/fancybox/) saatiin aikaan se kiva efekti, jossa kuva pomppaa nokkasi eteen.

[Htaccess](http://fi.wikipedia.org/wiki/Htaccess) -tiedostolla saatiin aikaan ”siistit” urlit tuonne sivuille. Tällöin esimerkiksi osoite *http://liikenne.kaartinen.eu/arkisto/kunta/Kuopio* onkin muotoa *http://liikenne.kaartinen.eu/index.php?p=arkisto&do=kunta&kunta=Kuopio* – ei liene vaikeaa päätellä kumpi on luettavampi muoto?

[GIT](http://git-scm.com/) on erittäin pätevä versionhallintaohjelmisto, jota itse käytän työssäni päivittäin ja käytän sitä myös omissa koodausprojekteissani. Tässä projektissa sille muodostui kuitenkin omanlainen rooli sillä sen avulla päivitän myös tuotannon. Ohjelmoin ensin muutokset ja korjaukset localhostiin ja sen jälkeen pushaan ne GIT repositoryyn. Tämän jälkeen pullaan muutokset tuotannossa ja tadaa – muutokset ovat toiminnassa.

## Käytetyt ohjelmointikielet

**PHP** on se kieli mitä itse tulee käytettyä lähes päivittäin, teen tällä kielellä työkseni sovelluksia joten valinta oli itselleni luonteva.

**Javascript** ja **jQuery** kulkee itsellä nykyään käsikädessä ja aika monessa tekemässäni sovelluksessa on mukana näitä kieliä jollain tapaa.

## Yleistä

Tämän botin koodaaminen oli sinällään erittäin hauska haaste, sillä en ole Twitterin APIn kanssa puljannut ja sitä kautta kun löysi tuon TwitterOAuth kirjaston niin homma vaan helpottui. Tämän myötä kynnys tehdä Twitter yhteensopivia koodinpätkiä madaltui ja voin luottavaisin mielin sanoa pystyväni tekemään Twitter botin joka toimii!

Botti on nyt ollut toiminnassa noin 10 päivää ja en ole huomannut sen toiminnassa mitään ongelmia. Jokusen bugin olen liiskannut verkkosivun puolelta ja siellä taitaa joitain vielä lymytä. Tulen myös kehittämään tuota verkkosivun puolta mm. tilastoilla ja päiväkohtaisella arkistolla. Tietty te voitte ehdottaa jos haluatte jotain lisäominaisuuksia tuohon!
