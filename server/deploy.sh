#!/bin/bash

export MIX_ENV=prod
export PORT=4795
export NODEBIN=`pwd`/assets/node_modules/.bin
export PATH="$PATH:$NODEBIN"

echo "Building..."

mix deps.get
mix compile
mix phx.digest

mix ecto.migrate

echo "Generating release..."
mix release

echo "Starting app..."

PROD=t ./start.sh
