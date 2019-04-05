FROM node:lts-alpine
WORKDIR /src

RUN apk upgrade -U \
 && apk add ca-certificates python ffmpeg git libva-intel-driver \
 && rm -rf /var/cache/*

RUN mkdir -p ./data
COPY package*.json ./
RUN npm install

ADD . .

EXPOSE 3000
CMD ["npm", "start"]
