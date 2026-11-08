#!/usr/bin/env python3
"""
Siirrettyjen kuvien optimointi (ImageMagick):
- pitkä sivu enintään 2500 px (Hugo tekee näytettävät koot itse)
- kuvat käännetään EXIF-orientaation mukaan ja EXIF-tiedot poistetaan (mm. GPS-sijainnit, repo on julkinen)
- JPEG laatu 90. PNG säilyy PNG:nä, GIF jätetään rauhaan.

Käyttö: python3 scripts/migrate/optimize_images.py <content-kansio> [--max 2500]
"""
import argparse
import os
import subprocess
import sys

ap = argparse.ArgumentParser()
ap.add_argument('root')
ap.add_argument('--max', type=int, default=2500)
args = ap.parse_args()

before = after = changed = resized = 0
for d, _, files in os.walk(args.root):
    for f in sorted(files):
        ext = os.path.splitext(f)[1].lower()
        if ext not in ('.jpg', '.jpeg', '.png'):
            continue
        path = os.path.join(d, f)
        size = os.path.getsize(path)
        before += size
        dims = subprocess.run(['magick', 'identify', '-format', '%w %h', path + '[0]'], capture_output=True, text=True).stdout.split()
        w, h = (int(dims[0]), int(dims[1])) if len(dims) == 2 else (0, 0)
        big = max(w, h) > args.max
        tmp = path + '.opt' + ext
        cmd = ['magick', path, '-auto-orient']
        if big:
            cmd += ['-resize', '%dx%d>' % (args.max, args.max)]
        cmd += ['-strip']
        if ext in ('.jpg', '.jpeg'):
            cmd += ['-quality', '90', '-interlace', 'Plane']
        else:
            cmd += ['-define', 'png:compression-level=9']
        cmd.append(tmp)
        proc = subprocess.run(cmd, capture_output=True, text=True)
        if proc.returncode != 0 or not os.path.exists(tmp):
            print('VIRHE', path, proc.stderr.strip()[:120], file=sys.stderr)
            if os.path.exists(tmp):
                os.remove(tmp)
            after += size
            continue
        new = os.path.getsize(tmp)
        # JPEG korvataan aina (EXIF pois). PNG vain jos pieneni tai kuva pienennettiin.
        if ext in ('.jpg', '.jpeg') or big or new < size:
            os.replace(tmp, path)
            after += new
            changed += 1
            resized += 1 if big else 0
        else:
            os.remove(tmp)
            after += size

print('kuvia muokattu: %d (pienennetty %d px:iin: %d), koko %.0f MB -> %.0f MB' % (
    changed, args.max, resized, before / 1048576, after / 1048576))
