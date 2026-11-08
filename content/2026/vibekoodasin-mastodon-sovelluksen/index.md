---
title: "Vibekoodasin Mastodon-sovelluksen"
date: 2026-10-12T11:35:00
description: "Vibekoodasin tekoälyn avulla oman Mastodon-sovelluksen. Näin syntyi Ronsu, jolla voin jatkaa Mastodonin lukemista samasta kohdasta eri laitteilla."
categories: ["Tekoäly"]
tags: ["tekoäly", "ai", "openclaw", "claude code", "claude", "chatgpt", "codex", "vibekoodaus", "koodaaminen", "koodaus", "ronsu", "mastodon", "ohjelmointi"]
mastodon_post_id: "117427018504238760"
---

Luit otsikon oikein. Vibekoodasin täysin tekoälyn avulla oman Mastodon sovelluksen. Kerron nyt hieman miksi ja miten.
{.lead}

Pohdin pitkään kirjoitanko tästä mitään sillä tämä aihe on ns. kuuma peruna vähän joka puolella. Mutta päätin silti kirjoittaa, koska sain tästä itselleni jotain käyttökelpoista aikaan ja jotain muutakin voi tämä kiinnostaa.

Tiedän, että tämä voi tuoda suht kärkkäitä mielipiteitä ja kommentteja Mastodonin ja blogin kommentoinnnin kautta. Koittakaa olla ihmisiksi silti ja kiltisti. Jos tekoäly hiertää pahasti niin lopeta lukeminen jo tähän, ainakin ennen kuin tuo AI tekemä kuva tulee vastaan 😆

## Vibekoodaus?

![Rennosti tuolissa istuva mies antaa ohjeita tekoälyrobotille, joka kirjoittaa koodia tietokoneella. Puhekuplat kuvaavat vibekoodauksen vaiheita ideasta virheiden korjaamiseen.](vibekoodasin-mastodon-vibekoodaus.png "AI generoima näkemys vibekoodauksesta")

Avataan ensin mitä ihmettä on vibekoodaus. Käytännössä annat tekoälyn tehdä hommat.

Käytännössä homma menee niin, että kirjoitat/puhut tekoälylle mitä sen pitää tehdä ja tekoäly sitten hoitaa koodauksen. Jos tulee ongelmia tai virheitä niin heität herjan tekoälylle ja se korjaa. Samoin jos haluat jotain muutoksia niin kerrot taas sen tekoälylle.

[Miten käytän tekoälyä](/2026/miten-kaytan-tekoalya) -artikkelissa rustasin miten itse käytän tekoälyä. En harrasta isommin ns. vibekoodausta, mutta nyt päätin koittaa sitä ja antaa tekoälyn tehdä hommat.

Tässä projektissa homma meni käytännössä niin, että kerroin mitä haluan, miten haluan homman toimivan ja mitä ominaisuuksia ensimmäisessä versiossa pitäisi olla.

Sen jälkeen sitten, kun sain ekan version toimimaan kehitettiin sitä pala palalta eteenpäin. Valmista ei vielä ole.

Käytin projektin tekemiseen Claude Codea, joka hoiti varsinaisen koodaamisen. ChatGPT:tä käytin puolestaan ominaisuuksien suunnittelussa, määrittelyssä ja ideoiden pallottelussa. Tekniseksi toteutukseksi muodostui Svelte 5, TypeScript ja Vite. Svelte ei ollut itselleni entuudestaan tuttu, mutta Vitestä ja TypeScriptistä oli jo kokemusta. Annoin tekoälyn kuitenkin hoitaa teknisen toteutuksen aika pitkälti itsenäisesti.

## Ronsu

Syntyi **Ronsu**. Ronsu on Mastodon sovellus ja se on ajateltu PWA:na toimivaksi. Voi sitä käyttää toki verkkoselaimella, mutta itse käytän sitä PWA:na puhelimessa ja tietokoneella.

Ronsun ajatus lähti siitä, kun vaihdoin tässä keväällä puhelinta Androidiin ja enää ei ollutkaan Mona sovellusta käytössä ja lukukohta ei synkronoitunut. En oikein löytänyt sopivaa softaa millä tämän olisin saavuttanut ja päätin sitten, että pistetään tekoäly töihin ja katsotaan mitä se tekee.

Ronsussa siis jatkat siitä kohtaa mihin jäit millä laitteella tahansa. Tai ainakin näin sen pitäisi toimia ja omalla kokemuksella on ihan ok toiminut ja tekoäly on parantanut sitä pyydettäessä.

Ronsussa ei ole myöskään mitään omaa taustapalvelinta, vaan se toimii kokonaan selaimessa ja keskustelee suoraan Mastodon-palvelimen kanssa. Lukukohta tallennetaan Mastodonin omaan rajapintaan, joten mitään erillistä palvelua sen synkronointiin ei tarvita.

Ronsu löytyy [GitHubista](https://github.com/MarkoKaartinen/ronsu) ja sitä voi koittaa myös suoraan [ronsu.markok.dev](https://ronsu.markok.dev/) osoitteen kautta.

Olen itse tätä käytellyt nyt tovin verran ja se onkin ollut nyt pääasiallinen tapa selata Mastodonia itsellä.

Tämä on siis täysin tekoälyn koodaama. Olen itse tutustunut koodiin, mutta en ole sitä itse tuottanut. Samoin logon on tehnyt tekoäly.

Ronsussa on tällä hetkellä mahdollista seurata omaa syötettä, julkaista sisältöä, vastata, lainata, buustata, tykätä sekä nähdä omia ilmoituksia. Lisää ominaisuuksia tulee sitä mukaa kun tulee itselle tarve.

Ronsussa syötettä on myös tarkoitus lukea eikä vain selata loputtomasti. Ajatuksena on, että voit aloittaa vanhimmasta lukemattomasta julkaisusta ja edetä siitä uusimpiin. Sovellus näyttää myös, kuinka paljon olet ajallisesti jäljessä uusimmista julkaisuista.

Ronsu isolla näytöllä:

{{< galleria >}}
![Ronsun syöte ja ilmoitukset isolla näytöllä](ronsu-desktop-1.png)
![Ronsun asetukset isolla näytöllä](ronsu-desktop-2.png)
![Ronsun profiilinäkymä isolla näytöllä](ronsu-desktop-3.png)
![Ronsun uusi julkaisu -ikkuna isolla näytöllä](ronsu-desktop-4.png)
{{< /galleria >}}

Ja puhelimella:

{{< galleria >}}
![Ronsun syöte mobiilissa](ronsu-mobi-1.jpg)
![Ronsun uusi julkaisu mobiilissa](ronsu-mobi-2.jpg)
![Ronsun ilmoitukset mobiilissa](ronsu-mobi-3.jpg)
![Ronsun asetukset mobiilissa](ronsu-mobi-4.jpg)
![Ronsun profiilinäkymä mobiilissa](ronsu-mobi-5.jpg)
![Ronsun ketjunäkymä mobiilissa](ronsu-mobi-6.jpg)
{{< /galleria >}}

Tuo on ns. opinionated eli miten itse haluaisin asioiden toimivan. Asiat siis saattaa muuttua johonkin suuntaan jos siltä tuntuu. Samoin löytynee joitain hassuuksia / bugeja. Sekä on asioita varmaan mitä en ole huomioinut vielä tai törmännyt semmoiseen.

## Loppulätinöitä

Vibekoodaus on yleistynyt viime aikoina melkoisesti ja erilaisia tekoälyllä tehtyjä sovelluksia tuntuu ilmestyvän jatkuvasti lisää. Työkalut ovat kehittyneet siihen pisteeseen, että lähes kuka tahansa voi saada aikaan ainakin jonkinlaisen toimivan sovelluksen ilman varsinaista ohjelmointiosaamista. Se on sinällään hieno asia, sillä moni idea voi nyt muuttua oikeasti toimivaksi sovellukseksi.

Samalla tässä on tietysti myös kääntöpuolensa. Kun sovelluksia voi tehdä näin helposti, niitä myös julkaistaan ilman, että tekijä välttämättä ymmärtää mitä tekoäly on oikeastaan tehnyt. Tietoturva, ylläpidettävyys ja kaikenlaiset muut ongelmat saattavat jäädä huomioimatta. Toimiva sovellus kun ei automaattisesti tarkoita hyvää tai turvallista sovellusta.

Ja vaikka ensimmäisen version saisi tekoälyllä tehtyä nopeasti, pitäisi sitä sovellusta myös ylläpitää ja kehittää jatkossa. Saa nähdä miten käy, kun tekoälyllä tehtyjä sovelluksia alkaa olla enemmän ja niiden tekijät joutuvat selvittelemään ongelmia vuosien päästä.

Tämä on ollut mielenkiintoinen kokemus ja olisin totta puhuen itsekin saanut tehtyä tämän. En ehkä näillä tekniikoilla, joita tekoäly käytti, mutta lopputulos olisi ollut vastaava.

Pääsihän tässä ns. helpolla ja tuota on sinällään "hauska" kehittää, kun voi pyytää tekoälyä tekemään toimintoja ja itse testata. Siitä sitten vain puuttuu se oma tekemisen ilo ja kädenjälki mikä tulee, kun koodaat itse.

Ymmärrän kyllä hyvin myös vibekoodaukseen kohdistuvan kritiikin. Tekoäly voi tuottaa toimivan näköistä koodia, mutta se ei tarkoita, että koodi olisi välttämättä hyvää, turvallista tai edes järkevästi toteutettua. Vastuu lopputuloksesta jää kuitenkin sille, joka sovelluksen julkaisee ja käyttää. Täähän menee tähän savolaisuuteen, että vastuu on kuulijalla? 🙈

Koska sain tästä jotain käytettävää irti ja käytän tätä tällä hetkellä niin pyydän AI:ta kehittämään tätä, kun tulee jotain mieleen / vastaan. Ei tosiaan ole kaikkia ominaisuuksia. Jos haluat niin pistä oma tekoäly töihin ja tee PR!
