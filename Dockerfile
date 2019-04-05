FROM node:10

WORKDIR /src
RUN mkdir -p ./data

COPY package.json ./
COPY yarn.lock ./

RUN yarn

ADD . .

EXPOSE 3000
CMD ["npm", "start"]
