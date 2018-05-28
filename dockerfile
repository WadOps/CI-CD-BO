FROM vuejs/ci

EXPOSE 8080

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN ls && ls /usr/src/app

RUN cp /usr/src/app/postcss.config.js /usr/src/app/.node_modules/vuetify/dist/

ENV NODE_ENV=production

RUN npm run build

# Remove unused directories
RUN rm -rf ./src
RUN rm -rf ./build