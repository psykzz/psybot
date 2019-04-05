FROM node:lts-alpine
WORKDIR /src

RUN apk upgrade -U \
 && apk add --no-cache ca-certificates make gcc g++ python ffmpeg git libva-intel-driver
 
RUN mkdir -p ./data
COPY package*.json ./
RUN npm install

ADD . .

EXPOSE 3000
CMD ["npm", "start"]
