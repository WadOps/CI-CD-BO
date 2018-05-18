FROM vuejs/ci

EXPOSE 8080

COPY . .

RUN npm install && npm cache verify

RUN sudo su -c 'echo "deb http://deb.debian.org/debian jessie-backports main" >> /etc/apt/sources.list'

RUN | \
    && sudo rm -rf /var/lib/apt/lists/* \
    && sudo apt-get update \
    && sudo apt install -t jessie-backports  openjdk-8-jre-headless ca-certificates-java

RUN cp /postcss.config.js /node_modules/vuetify/dist/