FROM mhart/alpine-node:6
RUN mkdir -p ./data

WORKDIR /src
ADD package.json
RUN npm install
ADD . .

EXPOSE 3000
CMD ["npm", "start"]
