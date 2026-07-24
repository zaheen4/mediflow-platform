FROM node:22-alpine

RUN npm i -g npm@9

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "app.js"]
