---
title: "Eka kosketus CachyOS Linuxiin pelikoneessa"
date: 2026-01-15T19:59:00
description: "Ensimmäiset pari päivää takana CachyOS Linuxin kanssa ja hommat on saatu ns. alulle. Kuten aiemmin sanoin, niin Windowsin rinnalle asennellaan CachyOS ja näin tapahtui tässä tiistaina iltapuhteiksi. Katsotaan hieman mihin asti on päästy parina iltana ja mitä on tullut vastaan tähän mennessä."
categories: ["Tietokoneet"]
tags: ["dualboot", "linux", "windows 11", "windows", "cachyos", "pelaaminen", "pelikone", "pelit", "arch linux", "kde plasma", "proton", "käyttöjärjestelmä", "amd", "secure boot", "limine"]
series: ["Windows ja Linux pelikoneessa"]
mastodon_post_id: "115900416276421454"
---

Ensimmäiset pari päivää takana CachyOS Linuxin kanssa ja hommat on saatu ns. alulle. Kuten [aiemmassa](/2026/windows-vai-linux-miksei-molemmat) sanoin, niin Windowsin rinnalle asennellaan CachyOS ja näin tapahtui tässä tiistaina iltapuhteiksi. Katsotaan hieman mihin asti on päästy parina iltana ja mitä on tullut vastaan tähän mennessä
{.lead}

## CachyOS:n asennus

Asennus oli suhteellisen suoraviivainen projekti, mutta eipä tästäkään ihan ilman kommelluksia selvitty. Tein aiemmin päivällä Macillä [CachyOS](https://cachyos.org/) asennusmedian ja kun aloin asentamaan niin eihän se BIOS sitä tunnistanut. No tekasin sitten uusiksi tämän asennusmedian ja sen jopa BIOS tunnistikin. 

Ensimmäinen este oli Secure Boot, joka piti ottaa BIOSista pois päältä, jotta CachyOS:n asennusmedia ylipäätään käynnistyi. Tämä ei ollut ihan loogisin tuossa Asuksen BIOSissa sillä OS Type piti pistää OtherOS määreeksi, jotta se oli pois. Tämä löytyi sitten [ohjeista](https://www.asus.com/support/faq/1049829/).

CachyOS asennushan toimii niin, kuten monessa muussakin Linuxissa, että käynnistetään ensin asennusmedialla oleva käyttöjärjestelmä ja sieltä sitten käynnistetään asennusohjelma, jolla itse Linux asennetaan kiintolevylle.

Asennusprosessi oli itsessään suhteellisen suoraviivainen. Käytiin asentajan stepit läpi ja syötettiin tunnukset ja infot sekä määritettiin minne asennetaan. Tämä asennus oli siitä helppo, että oli oma kiintolevy mille pistin asennuksen menemään. Tämä on myös ehkä se suositeltavin tapa, että on erillinen levy Windowsille ja Linuxille.

![CachyOS asennusohjelma](cachyos-asennus-1.jpg)

Asennuksen jälkeen päästäänkin sitten itse pihviin. Parin vaiheen (mm. bootti järjestyksen vaihdon) päästänkin näkemään miltä Limine näyttää. Tätä käsittääkseni voidaan hieman tuunata, mutta katsotaan sitä myöhemmin.

![Limine bootloader](cachyos-asennus-2.jpg)

Tokihan pitää ensin saada säädettyä näytöt näkymään oikein ja minulla, kun toinen näyttö on pystyssä niin eihän se oikein luonnistu tuo käyttäminen ilman asetusmuutosta. Sama homma on Windowsillakin.

![CachyOS KDE Plasma työpöytä](cachyos-asennus-3.jpg)

Tämän jälkeen oikeastaan ns. perusasennus on valmis ja pistin sitten vielä päivityksiäkin sisään.

## Secure Boot

Tämä ansaitsee oman kappaleen sillä tämän kanssa saikin tapella hetken ja olin jo [luovuttamassakin](https://kaartinen.social/@marko/115888519697952091) sen säädöstä siltä iltaa.

[Secure boot](https://en.wikipedia.org/wiki/UEFI#Secure_Boot) piti tosiaan ottaa pois käytöstä, kun asentelin tuota CachyOS:ää, mutta halusin sen takaisin päälle asennuksen jälkeen. Tähän syynä on se, että osa pelien huijauksenestoista vaatii sen. Tästä tuoreimpana esimerkkinä on Battlefield 6 peli, jota itse olen pelannutkin (nyt pieni tauko) ja sen Javelin huijauksenesto vaatii Secure Bootin olemisen päällä.

CachyOS [wikissä](https://wiki.cachyos.org/configuration/secure_boot_setup/) oli ohjetta tähän ja sen kanssa lähdin tekemään tätä ja eihän se mennyt kerralla maaliin. Sitten ankaran Googletuksen ja tekoälyn kanssa käydyn keskustelun ja yritys-erehdys taktiikan kautta se lopulta lähti toimimaan. 

Tässä ehkä oli jotain tekemistä dualbootilla/liminellä/kaikella muulla, mutta lopulta pääsin tilanteeseen missä Secure boot oli päällä BIOSissa ja Windows sekä CachyOS kertoi sen olevan päällä.

Tämän kanssa säätämiseen meni melkeinpä enemmän aikaa ja kirosanoja, kuin itse asennukseen.

## Ekat pelit

Tähänkin on osviittaa [wikissä](https://wiki.cachyos.org/configuration/gaming/) ja sen avulla pistettiinkin pelipaketit kuntoon ja saatiin Steami ja härvelit. Ihan ensimmäisenä koitin [Hades II](https://store.steampowered.com/app/1145350/Hades_II/) peliä ja se pyöri kuten odottaa saattoi - hyvin. Halusin vain lähinnä nähdä, että peli lähtee käyntiin ja toimii.

Seuraavana päivänä latailinkin sitten epätieteellistä koetta varten Cyberpunk 2077 pelin niin Windowsille, kuin CachyOS:lle. Halusin nimittäin ajaa pelin oman benchmarkin molemmissa käyttöjärjestelmissä ja katsoa mitä eroa on vai onko mitään. Tämä ei tosiaankaan ole mitenkään tieteellinen koe, mutta antaa jonkinlaista osviittaa sillä ajoin molemmat kerran. 

Koneen speksit voi kaivella tuosta [artikkelisarjasta](/sarja/pelikone-lapparin-tilalle), mutta resoluutiona oli 1440p molemmissa. Ajoin valmiilla Ultra asetuksilla ja sain 120fps kantturaan molemmat käyttikset, eli ei isoa eroa. Ultra Ray Tracing pääsin taas molemmilla 60fps kantturaan. Eli tässäkin oltiin samoissa. Kertonee, että peli pyörii aika lailla samalla tavalla molemmissa käyttöjärjestelmissä.

Cyberpunkia en kauheammin ole viime aikoina pelannut, mutta halusin sen nyt ottaa tohon, kun tiesin siitä löytyvän valmiin oman benchmarkin. Jos pelaisin niin pelaisin ilman ray tracingiä muutenkin sillä toi perli on pirun nätti ilmankin ja onhan se kivempi jos on 120fps, kuin 60fps.

Noh tuli mieleen, että mitäs jos pelailisin Fallout 76:sta. Tässä tulikin hieman ongelmaa eteen sillä hiiri perhana karkasi kakkosnäytölle hetkittäin. Tähän onneksi löytyi Internetistä apuja ja ongelma saatiin korjattua helposti. Tämän korjasi käytännössä laittamalla Steamin launch optionseihin `PROTON_ENABLE_WAYLAND=1 %command%` - tässä miinuksena Steamin overlay ei toimi, mutta eipä isosti haittaa.

Fallout 76 ei ole se ihan uusin eikä se optimoiduin peli Windowsillakaan. ProtonDB:stä löytyikin [vinkkejä](https://www.protondb.com/app/1151340) kommenteista ja otinkin osaa käyttöön. Sitten löysin [PC Gamerin](https://www.pcgamer.com/games/fallout/i-almost-quit-fallout-76-until-i-realized-bethesda-still-hides-its-most-important-setting-in-a-config-file/) artikkelista sopivia asetuksia vielä ja nytpä tuokin näyttää toimivan aika kivasti mitä pelailin tuossa.

Mitäs noiden lisäksi pelaillaan?

## Lopuksi ne lätinät

Homma on rullannut oikein kivasti. Fonttien määreisiin en ehkä ole tyytyväinen ja jotenkin ne näyttää paremmalta esim. Windows puolella ja Macillä. Tätä hieman jo säädin ja sainkin paremmaksi, mutta pitänee hieman säätää lisää. **Jos vinkkejä on niin saa huudella!**

Tämä touhu on ehkä herättänyt taas pitkästä aikaa tämmöisen pienen Linux säädön ja pelisäädön innostuksen. Ei ole vielä tullut kauheammin Windowsin puolella käytyä, en ole kyllä pelannut Battlefield 6:sta nyt. Saa nähdä mitä säädetään seuraavaksi tuohon.

Ajatuksena olisi koittaa saada toimimaan myös ohjelmia mitä olen käyttänyt muutenkin eli esim. Fusion360 softaa 3D-mallinnukseen. 

Mielenkiintoista on myös ollut tutustua tuohon Arch puoleen ja esim. Arch User Repositoryyn (AUR) tuon CachyOS:n paru työkalulla. Sieltä löytyikin jo Bambu Studio 3D-printterille sekä Zen selain ja 1Password.

**Jatketaan säätöä ja katsotaan mitä seuraavaksi!**
