FROM node:lts-alpine
WORKDIR /src

RUN apk upgrade -U \
 && apk add --no-cache ca-certificates make gcc g++ python ffmpeg git libva-intel-driver

# Install some chrome requirements
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*


RUN mkdir -p ./data
COPY package*.json ./
RUN npm install

ADD . .

EXPOSE 3000
CMD ["npm", "start"]
