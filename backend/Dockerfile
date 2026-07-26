FROM node:22-alpine

RUN npm i -g npm@9

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci --omit=dev
RUN npm i -g prisma

COPY prisma.config.ts ./
COPY prisma/ ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node app.js"]