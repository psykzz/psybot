FROM node:10
WORKDIR /src

# We want the "add-apt-repository" command
RUN apt-get update && apt-get install -y software-properties-common

# Install "ffmpeg"
RUN add-apt-repository ppa:mc3man/trusty-media
RUN apt-get update && apt-get install -y ffmpeg

RUN mkdir -p ./data

COPY package.json ./
COPY yarn.lock ./

RUN yarn

ADD . .

EXPOSE 3000
CMD ["npm", "start"]
