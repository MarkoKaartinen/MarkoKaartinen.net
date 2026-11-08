---
title: "NTFS tuki Yosemiteen"
date: 2015-02-15T18:13:00
lastmod: 2016-09-26T15:42:00
description: "Mac osaa lukea oletuksena NTFS muotoisia levyjä, mutta jos olet kuin minä niin haluat myös kirjoittaa sinne. NTFS tuen asentelu on suhteellisen simppeli homma, asenna nämä kolme pakettia niin homman pitäisi toimia vallan mainiosti."
categories: ["Apple", "Blogi"]
tags: ["apple", "kiintolevy", "mac", "mac os x", "ntfs", "ohje", "os x", "yosemite"]
aliases: ["/ntfs-tuki-yosemiteen/"]
---

Mac osaa lukea oletuksena NTFS muotoisia levyjä, mutta jos olet kuin minä niin haluat myös kirjoittaa sinne. NTFS tuen asentelu on suhteellisen simppeli homma, asenna nämä kolme pakettia niin homman pitäisi toimia vallan mainiosti.

1.  Asenna FUSE for OS X
    - Lataa osoitteesta: <http://osxfuse.github.io/>
    - Asennuksessa valitse kohdat:
      - OSXFUSE Core
      - OSXFUSE Preference Pane
      - OSXFUSE Compatibility Layer
2.  Asenna NTFS-3G
    - Lataa osoitteesta: <http://macntfs-3g.blogspot.fi/2010/10/ntfs-3g-for-mac-os-x-2010102.html>
    - Valitse asennuksessa Caching mode: **No caching**
3.  Asenna fuse_wait
    - Lataa osoitteesta: <https://github.com/bfleischer/fuse_wait/downloads>

Itse asentelin nämä ja tämän jälkeen NTFS levylle kirjoittaminen onnistui.

Sama ohje kuvineen ja tarkempine selityksineen: [MacBreaker](http://www.macbreaker.com/2014/06/how-to-enable-writing-to-ntfs-hard.html)
