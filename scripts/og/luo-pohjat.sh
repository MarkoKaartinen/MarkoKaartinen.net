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

# joulu-bg.png on joulukalenterin korttipohja: jouluvalot ylhäällä (värit ja muoto kuten sivulla), lumisadetta ja lumivalli alareunassa sekä
# sama vasemman reunan viiva kuin muissa. Otsikkorivi ja jakoviiva on siirretty alemmas valojen alta.
D=$(mktemp)
awk 'BEGIN {
  srand(24)
  split("#f38ba8 #a6e3a1 #f9e2af #89b4fa #cba6f7 #fab387", c, " ")
  # lumivalli alareunassa
  printf "fill #cdd6f4 polygon 0,630"
  for (x = 0; x <= 1200; x += 20) printf " %d,%.1f", x, 600 + 8 * sin(x / 70) + 5 * sin(x / 23)
  print " 1200,630"
  # lumihiutaleet
  for (i = 0; i < 150; i++) {
    x = 20 + int(rand() * 1160); y = 50 + int(rand() * 570)
    r = (rand() < 0.15) ? 4 : (rand() < 0.5 ? 2 : 3); r -= (rand() < 0.4) ? 1 : 0
    a = 0.12 + rand() * 0.28
    printf "fill \"rgba(205,214,244,%.2f)\" circle %d,%d %d,%d\n", a, x, y, x + r, y
  }
  # jouluvalojen johto ja lamput
  swags = 6; sw = 1200 / swags; sag = 22
  print "fill none stroke #585b70 stroke-width 2"
  for (k = 0; k < swags; k++) printf "path \"M %d,0 Q %d,%d %d,0\"\n", k * sw, k * sw + sw / 2, 2 * sag, (k + 1) * sw
  print "stroke none"
  n = 0
  for (k = 0; k < swags; k++) for (j = 1; j <= 4; j++) {
    t = j / 5; x = k * sw + t * sw; y = 4 * sag * t * (1 - t); col = c[n % 6 + 1]; n++
    printf "fill \"%s14\" circle %.1f,%.1f %.1f,%.1f\n", col, x, y + 10, x + 17, y + 10
    printf "fill \"%s24\" circle %.1f,%.1f %.1f,%.1f\n", col, x, y + 10, x + 12, y + 10
    printf "fill \"%s40\" circle %.1f,%.1f %.1f,%.1f\n", col, x, y + 10, x + 9, y + 10
    printf "fill #585b70 roundrectangle %.1f,%.1f %.1f,%.1f 1,1\n", x - 2, y - 1, x + 2, y + 3
    printf "fill %s ellipse %.1f,%.1f 4.5,6.5 0,360\n", col, x, y + 10
  }
}' > "$D"

magick -size 1200x630 xc:'#1e1e2e' -draw "@$D" \
  -fill '#cba6f7' -draw 'rectangle 0,0 14,630' \
  \( static/favicon-96x96.png -resize 64x64 \) -geometry +72+64 -composite \
  -font "$F" -pointsize 32 \
  -fill '#cba6f7' -annotate +156+114 '~/' \
  -fill '#cdd6f4' -annotate +194+114 'markokaartinen' \
  -fill '#7f849c' -annotate +460+114 '.net' \
  -fill '#313244' -draw 'rectangle 72,150 1128,152' -strip "$OG/joulu-bg.png"
rm -f "$D"
