FROM node:18.14.2-alpine

WORKDIR /app

COPY packege*.json ./

RUN npm install

COPY . .

COPY ./dist ./dist

CMD [ "npm", "run", "start:dev" ]