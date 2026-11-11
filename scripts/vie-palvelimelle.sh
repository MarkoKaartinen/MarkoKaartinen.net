#!/usr/bin/env bash
# Vie rakennetun sivun (public/) palvelimelle releases/current-rakenteeseen:
#
#   $DEPLOY_PATH/
#   ├── public/             huoltosivu (index.html), ei kosketa sivuston tiedostoihin
#   ├── releases/<aika-sha>/ jokainen vienti omaan kansioonsa
#   └── current -> releases/<uusin>
#
# Forgessa Web directory on /current. Huoltotilaan: vaihda se muotoon /public.
# Palautus edelliseen versioon: ln -sfn releases/<vanha> current (palvelimella).
#
# Ympäristömuuttujat: DEPLOY_HOST, DEPLOY_USER, DEPLOY_PATH. SSH-avain on ~/.ssh/id_deploy.
set -euo pipefail

: "${DEPLOY_HOST:?}" "${DEPLOY_USER:?}" "${DEPLOY_PATH:?}"
SAILYTA=3

kohde="$DEPLOY_USER@$DEPLOY_HOST"
ssh_cmd="ssh -i $HOME/.ssh/id_deploy"
julkaisu="$(date -u +%Y%m%d%H%M%S)-${GITHUB_SHA:0:7}"

# Rakenne valmiiksi. Huoltosivu public/-kansioon (uusi versio joka viennillä).
$ssh_cmd "$kohde" "mkdir -p '$DEPLOY_PATH/releases' '$DEPLOY_PATH/public'"
rsync -az -e "$ssh_cmd" huolto.html "$kohde:$DEPLOY_PATH/public/index.html"

# Uusi release aloitetaan edellisen kovalinkitetystä kopiosta (cp -al, ei vie levytilaa), minkä jälkeen
# rsync siirtää vain muuttuneet tiedostot (--checksum, koska CI:n tiedostojen aikaleimat ovat aina uudet)
# ja poistaa poistuneet. rsync kirjoittaa muuttuneet tiedostot uusina, joten vanha release ei muutu.
$ssh_cmd "$kohde" "set -e
  cd '$DEPLOY_PATH/releases'
  mkdir -p '$julkaisu'
  if [ -d ../current ]; then cp -al ../current/. '$julkaisu'/; fi"
rsync -az --checksum --delete --chmod=D755,F644 -e "$ssh_cmd" \
  public/ "$kohde:$DEPLOY_PATH/releases/$julkaisu/"

# Vaihda current atomisesti ja siivoa vanhat releaset (uusimmat $SAILYTA jäävät).
$ssh_cmd "$kohde" "set -e
  cd '$DEPLOY_PATH'
  ln -sfn 'releases/$julkaisu' current.uusi
  mv -T current.uusi current
  cd releases
  ls -1dt -- */ | tail -n +$((SAILYTA + 1)) | xargs -r rm -rf --"

echo "Julkaistu: releases/$julkaisu"
