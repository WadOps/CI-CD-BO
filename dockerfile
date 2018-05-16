FROM vuejs/ci

EXPOSE 8080

COPY . .

RUN npm install && npm cache verify