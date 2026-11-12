---
title: "Tervetuloa uudistettuun blogiin!"
date: 2024-11-01T11:46:00
description: "Päätin tehdä MarkoKaartinen.net blogille isoimman uudistuksen pitkään, pitkään aikaan. Se nimittäin koodattiin itse ja sisältö tulee Markdownista ja sqlite tietokannasta."
categories: ["Kulisseissa"]
tags: ["uudistus", "laravel", "php", "blogi"]
---

Tervetuloa uudistettuun MarkoKaartinen.net blogiin. Tämä uudistus on varmaan isoimpia mitä on ollut pitkään aikaan. Uudistuksen tarkoituksena on ensinnäkin saada minut bloggaamaan enemmän ja tehdä tämmöinen pieni itse koodattu blogi (joka toki lähti rönsyilemään). 
{.lead}

Vanha blogihan oli iät ja ajat WordPressin päällä. Mutta ensimmäiset versiot ennen tätä olikin itsekoodattuja versioita. Nyt ikäänkuin palataan alkujuurille.

Nyt blogi on tosiaan koodattu itse PHP:tä ja Laravelia käyttäen. Tietokanta on SQLite ja sisältö on Markdown tiedostoina. 

Tämä blogi elää nyt omaa elämäänsä ja uudistuksia tulee, kun niitä koodailen. Asiat voi olla joissain suhteissa vinksallaan ja homma ei välttämättä toimi niin kuin ajattelisi. Tämä korjataan, kun keretään, voit kiusata minua [Mastodonissa](https://kaartinen.social/@marko) tästä!

## Uudistuksen tärkeimmät jutut

Käydään jokunen juttu läpi vielä erikseen. 

### Sisältö

Nyt kaikki uusi sisältö tulee olemaan täysin Gitissä ja Markdown muodossa. Vanha sisältö on myös markdown tiedostoina, mutta sisältö on WordPressistä tuotua HTML koodia.

Uuden artikkelin julkaisu esim. tapahtuu niin, että kun sen tila muuttuu julkaistuksi niin se tuodaan sivuille näkyviin. Tämä kaikki tapahtuu siinä vaiheessa kun Gitissä oleva sisältö tuodaan palvelimelle ja "deploy" vaiheet alkaa tekemään töitä.

### Blast from the past

[Mastodonissa](https://kaartinen.social/@marko/113395711775239313) oli keskustelua "vanhoista hyvistä ajoista". No siitä sitten tuli ajatus tehdä vieraskirja sekä kävijälaskuri sivuille.

#### Vieraskirja

Tarvitseeko tämä esittelyjä? Eipä oikeastaan. Käy jättämässä oma merkkisi [vieraskirjaan](/vieraskirja).

Vieraskirjaan tarvitsee syöttää vain nimimerkki ja viesti, halutessasi myös kotisivut. En kerää mitään muuta tietoa eikä siinä ole sen kummempaakaan.

#### Kävijälaskuri

Kaikkihan toki muistaa vanhojen aikojen kävijälaskurit jotka päivitty melkeinpä joka sivulatauksella. Siihen tuli koodattua joskus versio mikä piti sessiossa onko käynyt vai ei.

No tämä on hieman erilainen kävijälaskuri. Fiilis on vanhasta ajasta, mutta tieto tulee suoraan [Plausible analytiikan](https://plausible.io/) rajapinnasta. Haen itse hostatusta Plausible asennuksesta uniikit kävijät. 

### Kommentointi

Vanhojen artikkelien kommentointi on ainakin toistaiseksi suljettuna. Toin vanhat julkaistut kommentit näkyviin historiasyistä, mutta en vielä koodannut kommentointia vanhoihin.

Uusissa artikkeleissa kommentointi tapahtuu Mastodonissa. Jokainen artikkeli julkaistaan [Mastodon -tililläni](https://kaartinen.social/@marko) ja sen kommentit tulee näkyviin sitten artikkelin kohdalle.

## Vanhat artikkelit

Ne on nimensä mukaisesti vanhoja. Niitä ei ole ihan kovalla tykityksellä tullut ja ne on mitä on. Ne jää pysymään historiana ja halusin ne tuoda. 

Vanhoissa jutuissa voi olla hassuuksia, mutta on kuitenkin koitettu että ne toimii ja niitä olen selaillut läpi hieman ja fiksaillut importtia ja näkyvyyttä muutenkin.

Niihin teen varmaan fiksejä jossain välissä lisää - artikkelikohtaisesti.

## Bugeja 🐛

Niitä varmaan löytyy. Niistä voitte kiusata minua ja korjailen niitä kun kerkeän.

Tämä koko "roska" löytyy myös [GitHubista](https://github.com/MarkoKaartinen/blogi) joten pikaisesti koodattua purkkaa voi käydä siellä kuikuilemassa. Optimointeja ja testejä tehdään sitten "joskus".

## Kommentteja & ehdotuksia? 💬

Jos niitä on niin antaa paukkua! Kannattaa kuitenkin muistaa, että blogi on allekirjoittaneen ja toteutan jos kiinnostaa.
