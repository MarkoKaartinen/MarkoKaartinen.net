#!/bin/sh
# Luo sosiaalisen median kuvien pohjat (themes/hugoccino/assets/og/bg.png ja default.png) ImageMagickilla.
# bg.png on otsikkokorttien pohja (Hugo kirjoittaa otsikon päälle), default.png on oletuskuva etusivulle ja listoille.
# Värit ovat Catppuccin Mochan viralliset värit. Aja repon juuresta: sh scripts/og/luo-pohjat.sh
set -e
OG=themes/hugoccino/assets/og
F=$OG/JetBrainsMono-Bold.ttf

magick -size 1200x630 xc:'#1e1e2e' -fill '#cba6f7' -draw 'rectangle 0,0 14,630' \
  \( static/favicon-96x96.png -resize 64x64 \) -geometry +72+34 -composite \
  -font "$F" -pointsize 32 \
  -fill '#cba6f7' -annotate +156+84 '~/' \
  -fill '#cdd6f4' -annotate +194+84 'markokaartinen' \
  -fill '#7f849c' -annotate +460+84 '.net' \
  -fill '#313244' -draw 'rectangle 72,120 1128,122' -strip "$OG/bg.png"

magick "$OG/bg.png" -font "$F" \
  -pointsize 80 -fill '#cdd6f4' -annotate +72+250 'Yhden nörtin projekti' -fill '#cba6f7' -annotate +72+250 'Y' \
  -pointsize 34 -fill '#a6adc8' \
  -annotate +72+335 'MarkoKaartinen.net on yhden nörtin projekti ja' \
  -annotate +72+383 'sisältää sekalaista settiä niin tekniikasta kuin' \
  -annotate +72+431 'muusta nörtteilystä.' \
  -fill '#a6e3a1' -annotate +72+560 '$' -fill '#cdd6f4' -annotate +112+560 'cat tervetuloa.md' -strip "$OG/default.png"
