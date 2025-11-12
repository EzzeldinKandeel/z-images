FROM node:22 as base
EXPOSE 3000

FROM base as dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:dev"]