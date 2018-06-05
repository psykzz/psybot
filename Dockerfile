FROM mhart/alpine-node:6

WORKDIR /src
RUN mkdir -p ./data
ADD package.json .
RUN apk add --no-cache --virtual .build-deps alpine-sdk python \
 && npm install --production --silent \
 && apk del .build-deps
ADD . .

EXPOSE 3000
CMD ["npm", "start"]
