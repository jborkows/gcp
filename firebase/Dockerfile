FROM node:18.1.0-alpine
WORKDIR /my-app
COPY package.json /my-app/
COPY package-lock.json /my-app/
RUN npm ci && npm install -g npm@8.10.0
