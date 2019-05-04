FROM node:7.4
COPY package.json /src/package.json
WORKDIR /src
RUN npm install
COPY src/kittenbot.js /src
CMD ["node", "/src/kittenbot.js"]
