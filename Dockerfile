FROM node:20 AS builder

WORKDIR /home/node/app

COPY --chown=node:node . /home/node/app/

RUN npm ci
RUN npm run build

FROM node:20

ENV NODE_ENV=production
ENV ENVIRONMENT=production

WORKDIR /home/node/app

COPY --from=builder /home/node/app/build /home/node/app/build

COPY --from=builder /home/node/app/package.json /home/node/app/package.json
COPY --from=builder /home/node/app/package-lock.json /home/node/app/package-lock.json

RUN npm ci --only=production

RUN chown -R node:node /home/node/app

USER node

EXPOSE 3366
CMD [ "node", "build/server.cjs" ]
