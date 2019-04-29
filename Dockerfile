FROM       node:10-alpine

WORKDIR /app

COPY ./ ./

RUN npm install

RUN curl -o gtfs.zip "$GTFS_URL" && unzip gtfs.zip -d /gtfs

CMD ["node", "import.js", "-d", "/gtfs", "--prefix=$PREFIX"]