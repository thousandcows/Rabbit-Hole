FROM node:16-alpine3.15

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
RUN npm i -g pm2
RUN npm i -g typescript
RUN pm2 install typescript
RUN npm install -g ts-node
COPY . .

EXPOSE 4000
CMD ["pm2-runtime", "start", "ecosystem.config.js", "pm2", "logs"]
