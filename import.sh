#!/bin/sh

mkdir -p /gtfs \
&& curl -o gtfs.zip "$GTFS_URL" \
&& unzip gtfs.zip -d /gtfs \
&& node import.js -d /gtfs --prefix="$PREFIX"
