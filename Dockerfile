FROM node:20 AS builder

WORKDIR /home/node/app

COPY --chown=node:node . /home/node/app/

RUN npm ci
RUN npm run build

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

FROM node:20-slim

ENV NODE_ENV=production
ENV ENVIRONMENT=production

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /home/node/app

COPY --from=builder /home/node/app/build /home/node/app/build

COPY --from=builder /home/node/app/package.json /home/node/app/package.json
COPY --from=builder /home/node/app/package-lock.json /home/node/app/package-lock.json

RUN npm ci --only=production

RUN chown -R node:node /home/node/app

USER node

EXPOSE 3366
CMD [ "node", "build/server.cjs" ]
