#!/bin/sh

REVISION="${SOURCE_VERSION}"
# PROPOSED_VERSION=$(npx sentry-cli releases propose-version)
APP_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",\t ]//g')
VERSION="$APP_VERSION"

if [ "$NODE_ENV" = "production" ]
then
  npx sentry-cli releases new $VERSION
  npx sentry-cli releases files $VERSION upload-sourcemaps dist --no-rewrite --validate
  # npx sentry-cli releases set-commits $VERSION --auto
  sentry-cli releases set-commits --commit "simon-johansson/grid-game@${REVISION}" $VERSION
  npx sentry-cli releases finalize $VERSION
else
  echo "Not creating new Sentry release because \$NODE_ENV is set to $NODE_ENV and not 'production'";
fi
