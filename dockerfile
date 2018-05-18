FROM vuejs/ci

EXPOSE 8080

COPY . .

RUN npm install && npm cache verify

RUN su -c 'echo "deb http://deb.debian.org/debian jessie-backports main" >> /etc/apt/sources.list'

RUN rm -rf /var/lib/apt/lists/* \
    && apt-get update \
    && apt install -t jessie-backports  openjdk-8-jre-headless ca-certificates-java

RUN cp /postcss.config.js /node_modules/vuetify/dist/