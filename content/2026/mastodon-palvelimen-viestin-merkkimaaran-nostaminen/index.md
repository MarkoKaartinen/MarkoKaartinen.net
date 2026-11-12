---
title: "Mastodon palvelimen viestin merkkimäärän nostaminen"
date: 2026-02-16T14:00:00
description: "Tämä on enemmän itselle muistiin ja muille ehkä avuksi. Nimittäin miten saat nostettua Mastodon palvelimen viestin merkkimäärää. Bonuksena kyselyn vaihtoehtojen määrän nosto myös."
categories: ["Kotilabra"]
tags: ["mastodon", "merkkimäärä", "vinkki", "muistiin", "palvelin"]
mastodon_post_id: "116080214353122454"
---

Tämä on enemmän itselle muistiin ja muille ehkä avuksi. Nimittäin miten saat nostettua Mastodon palvelimen viestin merkkimäärää. Bonuksena kyselyn vaihtoehtojen määrän nosto myös.
{.lead}

Ensin se disclaimer, että nämä muutokset voi päivityksessä nollautua ja joudut tekemään ne uusiksi. Sen takia tämän otankin tähän itselle ylös. Tämä toimii ainakin uusimmissa versioissa!

Harmillisesti kumpikaan näistä ei ole esim `.env.production` tiedostossa, vaan ne pitää muuttaa suoraan koodiin. Eli jos et ole varma mitä teet, älä tee näitä muutoksia. En ota sit vastuuta jos sössit jotain!

## Merkkimäärän nostaminen

Tämä vaatii oikeastaan kahden tiedoston muokkaamista. Voit tehdä muokkauksia esim. `nano` editorilla. Nanossa <kbd>CTRL</kbd> + <kbd>O</kbd> tallentaa ja <kbd>CTRL</kbd> + <kbd>X</kbd> sulkee editorin.

Mene mastodon (`sudo su - mastodon`) käyttäjänä `/home/mastodon/live` hakemistoon.

Ensimmäisenä muokataan `compose_form_container.js` tiedostoa. 

```
nano app/javascript/mastodon/features/compose/containers/compose_form_container.js
```

Siellä etsitään kohta missä määritetään `maxChars` ja muutetaan se haluamaksesi merkkimääräksi. Oletuksena se on `500`.

```
maxChars: state.getIn(['server', 'server', 'configuration', 'statuses', 'max_characters'], 500),
```

Toinen muokattava tiedosto on `status_length_validator.rb`.

```
nano app/validators/status_length_validator.rb
```

Siellä etsitään kohta `MAX_CHARS` ja muutetaan se samaksi minkä määritimme aiemmin. Oletuksena se on `500`.

```
MAX_CHARS = 500
```

Tämän jälkeen pitää sitten assetteja kääntää alla olevalla komennolla.

```
RAILS_ENV=production bundle exec rails assets:precompile
```

Sitten vielä käynnistele Mastodonin prosesseja uudelleen.

```
sudo systemctl stop 'mastodon-*.service'

sudo systemctl start 'mastodon-*.service' --all
```

Jos kaikki meni kuten piti niin sitten pitäisi nähdä uusi merkkimäärä viestin kirjoituksessa!

## Bonus: Kyselyn vaihtoehtojen määrän nostaminen

Jos haluat vielä kyselyihin enenmmän, kuin 4 vaihtoehtoa niin voit muuttaa sitä `poll_options_validator.rb` tiedostossa.

```
nano app/validators/poll_options_validator.rb
```

Siellä etsitään kohta `MAX_OPTIONS` ja muutetaan se haluamaksi vaihtoehtojen määräksi. Oletuksena se on `4`.

```
MAX_OPTIONS = 4 
```
