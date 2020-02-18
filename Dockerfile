FROM node:lts-alpine
WORKDIR /src

RUN apk upgrade -U \
 && apk add --no-cache ca-certificates make gcc g++ python ffmpeg git libva-intel-driver

# Install some chrome requirements
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont

RUN mkdir -p ./data
COPY package*.json ./
RUN npm install

ADD . .

EXPOSE 3000
CMD ["npm", "start"]
