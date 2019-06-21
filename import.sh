#!/bin/sh
curl -o /data/gtfs.zip "$GTFS_URL" \
&& mkdir -p /data/gtfs \
&& unzip -o /data/gtfs.zip -d /data/gtfs \
&& node import.js -d /data/gtfs --prefix="$PREFIX"
