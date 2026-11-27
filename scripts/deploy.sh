#!/usr/bin/env bash
# Deploy the static export to the nginx host behind schoolcompanion.ch.
#
#   npm run build && npm run deploy
#
# Uploads /out over SSH (host "hetzner" from ~/.ssh/config), unpacks it next to the live
# root and swaps the two directories, so the site is never half-updated. The previous
# root stays at /var/www/schoolcompanion.old until the next deploy — to roll back:
#   ssh hetzner 'mv /var/www/schoolcompanion /var/www/schoolcompanion.broken && mv /var/www/schoolcompanion.old /var/www/schoolcompanion'
set -euo pipefail

HOST="${DEPLOY_HOST:-hetzner}"
ROOT="${DEPLOY_ROOT:-/var/www/schoolcompanion}"
OUT="$(dirname "$0")/../out"

test -f "$OUT/index.html" || { echo "no build in /out — run npm run build first" >&2; exit 1; }

# On a Mac, tar packs a "._name" metadata file next to every file and folder, and the
# server unpacks them as real files into the web root (104 of them on 27 Nov 2026).
# COPYFILE_DISABLE stops that; --no-xattrs drops the attribute headers that only make the
# server's tar print a warning per file. Neither changes anything on Windows or Linux.
export COPYFILE_DISABLE=1

# Whatever else goes wrong in transit: the server must unpack exactly the files of the
# build, or the swap does not happen and the live site stays as it is.
FILES="$(find "$OUT" -type f | wc -l | tr -d ' ')"

tar --no-xattrs -C "$OUT" -czf - . | ssh -o BatchMode=yes "$HOST" "set -e
  rm -rf '$ROOT.new'; mkdir -p '$ROOT.new'
  tar -C '$ROOT.new' -xzf -
  test -f '$ROOT.new/index.html'
  got=\$(find '$ROOT.new' -type f | wc -l | tr -d ' ')
  test \"\$got\" -eq $FILES || { echo \"unpacked \$got files, the build has $FILES: not going live\" >&2; exit 1; }
  rm -rf '$ROOT.old'
  mv '$ROOT' '$ROOT.old'
  mv '$ROOT.new' '$ROOT'
  echo \"deployed \$(find '$ROOT' -type f | wc -l) files to $ROOT\""

curl -s -o /dev/null -w "https://schoolcompanion.ch/ → %{http_code}\n" https://schoolcompanion.ch/
curl -s -o /dev/null -w "https://schoolcompanion.ch/matura/ → %{http_code}\n" https://schoolcompanion.ch/matura/
