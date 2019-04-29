#!/bin/sh

curl -o gtfs.zip "$GTFS_URL" \
&& unzip -o gtfs.zip -d ./gtfs \
&& node import.js -d ./gtfs --prefix="$PREFIX"
