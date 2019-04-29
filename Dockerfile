FROM       node:10-alpine

WORKDIR /app

COPY ./ ./

RUN npm install

CMD ["node", "import.js", "-d", "$DATA", "--prefix=$PREFIX"]