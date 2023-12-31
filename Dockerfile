FROM node:20-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn build

CMD ["sh", "-c", "yarn migration:run && yarn start:prod"]