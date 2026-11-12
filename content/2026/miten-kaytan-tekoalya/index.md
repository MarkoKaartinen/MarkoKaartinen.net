---
title: "Miten käytän tekoälyä"
date: 2026-03-27T12:25:00
description: "Kerron hieman tässä jutussa miten käytän tekoälyä tällä hetkellä. Käyn läpi hieman miten käytän sitä omissa projekteissa (kuten tässä blogissa) ja muuallakin."
categories: ["Koodaus"]
tags: ["tekoäly", "ai", "openclaw", "claude", "vibekoodaus", "koodaaminen", "koodaus", "bloggaaminen", "blogi", "spottihinta"]
mastodon_post_id: "116300670948150788"
---

Kerron hieman tässä jutussa miten käytän tekoälyä tällä hetkellä. Käyn läpi hieman miten käytän sitä omissa projekteissa (kuten tässä blogissa) ja muuallakin. Luvassa tuttuun tapaan sekalainen rustaus.
{.lead}

Tekoäly on tullut toden teolla arkeen viimeisen vuoden aikana — siitä puhutaan joka paikassa ja käyttäjiä riittää nörteistä tavallisiin tallaajiin. Ennen Googlasit ja luit blogin, nyt kysyt tekoälyltä suoraan. Kätevää, mutta samalla ne sivustot joilta tieto on peräisin jäävät ilman kävijöitä ja mainostuloja — eikä se ole hyvä juttu.

Tästä aiheesta saisi kirjoitettua vaikka kuinka pitkän räntän, mutta mennään asiaan: itse en ole mikään tehokäyttäjä, mutta käytän tekoälyä jo jonkin verran. Kerron hieman miten.

## Miten minä käytän tekoälyä

Itse maksan Claude Pro tilauksesta ja se on riittänyt minulle vielä vallan mainiosti. Se kertonee myös jo hieman siitä miten paljon sitä käytän, jos ei ole tarvinnut kalliimpiin paketteihin lähteä. Käydään tässä nyt läpi esimerkein miten käytän tekoälyä niin se on ehkä paras tapa tai selkein tai jotain.

### Kysy tekoälyltä

Tämä on ehkä yksi käytetyin asia eli se kysyminen. Tätä käyttänee moni. Itse saatan kysellä tekoälyltä asioita kuten ennen Googlasin. Nyt ei tarvitse mietiä hakusanoja niin tarkkaan vaan voin kysyä omalla tapaa. Saatan monesti sitten kysyä vielä lähteitä ja lähden tutkimaan itse sivuja. Ja siitä ehkä sitten takaisin perinteisiin Googleen.

### Tekoälykokeiluja

Pitää hieman kokeilla tuota tekoälyä ja tutkailla miten se toimii. Olen pyytänyt tekoälyä luomaan tyhmiä kuvia ja antanut sen muokata kuvaan jotain hassua. Näitä pääosin olen sit tutuille jakanut, enkä niinkään julkisesti.

Yksi kokeilu koodiin liittyen oli MCP palvelimen tekeminen [SpottiHinta](https://spottihinta.fi) -sivustolle. Tämä oli lähinnä huvin vuoksi, että voi kysyä tekoälyltä kuluvaa spottihintaa ja se antaa silloin oikean hinnan, kun se hakee sen MCP palvelimelta. Tästä kirjoitin SpottiHinnan [tiedotteisiin](https://spottihinta.fi/tiedote/spottihinta-tukee-nyt-mcpta-kysy-sahkon-hintoja-suoraan-tekoalyltasi).

Pikaisesti koitin myös hypetettyä OpenClawta, mutta en halunnut lähteä vielä tuohon ja antaa sille pääsyä isommin mihinkään. Näissäkin näkee paljon erilaisia toteutuksia ja mitä saavat aikaan, mutta tämä vaatisi jo hieman harrastuneisuutta ja olla valmis heittämään rahaa erilaisille palveluille.

### Blogissa

En kirjoita kokonaisia artikkeleita tekoälyllä. Kirjoitan ne itse. Saatan kyllä tekoälyn kanssa sparrata jostain artikkelista, että miten voisi parantaa ja onko ajatuksia. Mutta senkin jälkeen teen itse muokkauksia jos se tuntuu hyvältä ajatukselta. Avainsanoja saatan kysyä tekoälyltä liittyen artikkeliin.

### Koodaaminen

Pitää kai se vibekoodaus mainita ensin. Näen sen semmoisena, että sä koodaat koko softan täysin tekoälyllä ja et itse tee oikein mitään. Tämä on perhanan vaarallista jos et oikeasti osaa koodata ja et tiedä siitä mitään mitä turvallisen softan teko vaatii.

Itse käytän tekoälyä apuna. Se ei koodaa koko softaa vaan tehdään ehkä enemmän yhdessä. Se on äärimmäisen hyvä apuri debuggaamiseen ja virheiden selvittämiseen. Voin heittää sille virheilmoituksen ja se tutkailee miten sen voisi korjata. 

Ns. "apinahommiin" se on myös hyvä apuri. "Apinahommilla" tarkoitan semmoista toistuvaa yksinkertaista touhua eli esim. etsi kaikki kääntämättömät stringit koodista ja korvaa ne käännösavaimilla. Tätä käytinkin apuna [Tapaaminen.net](https://tapaaminen.net) sivuston käännöksissä, kun etsin käännettäviä tekstejä koodista.

Erilaiset työkalut ja bash skriptit saan myös helposti tekoälyltä. Itselle kun ei tuo bash skriptaus niin ole hallussa niin saan helpotuksia Linuxin käyttöön kun kyselen miten saisi aikaan ja saan sitten suht valmista koodia. Itse yleensä lueskelen läpi ja tuunaan sitä vielä vähän, mutta tosi iso apu tulee noissa sitten.

Olen myös kysellyt miten joku ominaisuus voisi tehdä tai onko ajatusta yms. sparrausta. Melkein kuin puhelisi jonkun ihmisen kanssa, mutta voin kysellä huoletta tyhmiä 😆

Olen myös pyytänyt tekemään lomakkeita sillä ne perkeleet on joskus ärsyttäviä tehdä. Käytän siis tekoälyä apuna ja ärsyttäviin asioihin. Itse kuitenkin tykkään koodailla ja ratkoa ongelmia sitä kautta. Ehkä tuo backend on itselle sitä ominta puolta ja näkyy kyllä näistä omien tekeleiden fronteista sen sit.

## Loppulätinöitä

Tein tänne blogiin yleisen [/ai](/ai) -sivun, jossa kerron yleiseltä tasolta tekoälyn käytöstä. Ehkä koitan sitten jatkossa [Tekoäly](/avainsana/tekoaly) kategoriaan julkaista juttuja liittyen tekoälyyn ja sen käyttöön niin voi sinne tunkeutua katselemaan tarkempia.

Tuolla AI sivulla on myös juttua [human.json](https://codeberg.org/robida/human.json) systeemistä ja senkin otin käyttöön. Se on merkkinä, että takana on ihminen ei tekoäly.

Tekoäly tulee yleistymään tulevaisuudessa ja varmaan omaankin käyttöön se tulenee jollain tapaa lisääntymään. En vielä itsekään tiedä miten ja millä tapaa. Voi olla, että tämmöisiä juttuja mitä teen itse korvaan tekoälyllä - varsinkin jos on jotain semmoista työlästä ja itseään toistavaa.

Summa summarum — tekoäly on apuri, ei korvaaja. Ainakaan vielä.

**Miten sinä käytät tekoälyä?**
