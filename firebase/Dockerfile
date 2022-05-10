FROM node:18.1.0-alpine
WORKDIR /my-app
COPY package.json /my-app/
COPY package-lock.json /my-app/
RUN npm ci
# RUN npm ls --depth=0 | tail -n +2 | sed 's/+-- //g' | sed 's/`-- //g' | awk '!my-app' | xargs  -I {} echo {};
