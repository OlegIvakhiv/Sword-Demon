FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN node database_setup.js

EXPOSE 3000

CMD ["npm", "start"]