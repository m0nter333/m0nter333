FROM node:18

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY parser.js ./

CMD ["node", "parser.js"]
