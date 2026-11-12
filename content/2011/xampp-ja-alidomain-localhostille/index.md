---
title: "XAMPP ja alidomain localhostille"
date: 2011-09-20T17:48:00
description: "Virittelen tässä itselleni työympäristöä ja en halua sekoittaa työtä ja normikoodailua keskenään. Halusin erottaa jotenkin localhostin ja työpuolen. No keksin sitten, että miten onnistuisi work.localhost osoitteen tekeminen. Käytössänihän on XAMPP ja Windows 7 – uskon tosin, että tämä toimii muillakin Windows asennuksilla. 1. Avaa C:WindowsSystem32driversetchosts tiedosto ja lisää sinne seuraava rivi: 127.0.0.1 work.localhost 2. Avaa C:xamppapacheconfextrahttpd-vhosts.conf tiedosto"
categories: ["Koodaus"]
tags: ["apache", "säätäminen", "säätö", "vhost", "virtualhost", "xampp"]
aliases: ["/xampp-ja-alidomain-localhostille/"]
---

Virittelen tässä itselleni työympäristöä ja en halua sekoittaa työtä ja normikoodailua keskenään. Halusin erottaa jotenkin localhostin ja työpuolen. No keksin sitten, että miten onnistuisi work.localhost osoitteen tekeminen.

Käytössänihän on XAMPP ja Windows 7 – uskon tosin, että tämä toimii muillakin Windows asennuksilla.

1\. Avaa C:\Windows\System32\drivers\etc\hosts tiedosto ja lisää sinne seuraava rivi:

```
127.0.0.1 work.localhost
```

2\. Avaa C:\xampp\apache\conf\extra\httpd-vhosts.conf tiedosto ja itse lisäsin seuraavat rivit sinne:

```apache
<VirtualHost work.localhost>
DocumentRoot "C:/Users/Marko/git"
ServerName work.localhost
ServerAlias work.localhost
<Directory "C:/Users/Marko/git">
Options Indexes FollowSymLinks
AllowOverride All
Order allow,deny
Allow from all
</Directory>
</VirtualHost>
```

Itselläni se ohjaa C:/Users/Marko/git kansioon, muuta tämän haluamaksesi kansioksi!

3\. Käynnistä XAMPPin Apache ja sen jälkeen osoitteen *http://work.localhost* pitäisi toimia. Jossain sanottiin, että käynnistä kone uusiksi, mutta itselläni ei tätä tarvinnut tehdä.
