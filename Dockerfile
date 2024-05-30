FROM node:18-alpine

WORKDIR /app

RUN mkdir /app/output_files

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
