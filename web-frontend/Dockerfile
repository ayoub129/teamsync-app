# frontend/Dockerfile

FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./


COPY Docker/entrypointfront.sh /usr/local/bin/entrypointfront.sh

RUN chmod +x /usr/local/bin/entrypointfront.sh

ENTRYPOINT [ "/usr/local/bin/entrypointfront.sh" ]

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
