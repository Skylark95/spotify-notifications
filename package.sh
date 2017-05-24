#!/bin/sh
rm -rf bin/
mkdir -p bin/
zip -r bin/spotify-notifications *.* src icons -x .git \*.md \*.sh
