FROM node:16-alpine3.15

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
RUN npm i -g pm2

COPY . .

EXPOSE 4005
CMD ["pm2-runtime", "start", "ecosystem.config.js", "pm2", "logs"]
