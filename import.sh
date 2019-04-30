#!/bin/sh
curl -o /data/gtfs.zip "$GTFS_URL" \
&& unzip -o /data/gtfs.zip -d /data/gtfs \
&& node import.js -d /data/gtfs --prefix="$PREFIX"
