#!/usr/bin/env bash
set -e

echo "→ Entrando a server/"
cd server

echo "→ Instalando dependencias (prod)"
if [ -f package-lock.json ]; then
  npm ci --omit=dev
else
  npm i --omit=dev
fi

echo "→ Iniciando backend"
node src/index.js