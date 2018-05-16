FROM vuejs/ci

EXPOSE 8080

COPY . .

RUN npm install && npm cache verify

RUN cp /postcss.config.js /node_modules/vuetify/dist/