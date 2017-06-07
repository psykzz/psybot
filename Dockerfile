FROM mhart/alpine-node:6

WORKDIR /src
RUN mkdir -p ./data
ADD package.json .
RUN npm install
ADD . .

EXPOSE 3000
CMD ["npm", "start"]
