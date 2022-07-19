FROM node:16.14.2-alpine3.15

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .

RUN npm build
COPY .env ./dist/
COPY package.json ./dist/

WORKDIR ./dist
RUN npm install

EXPOSE 3000
CMD ["npm", "run", "start"]
