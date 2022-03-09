FROM node:17.6.0-alpine
WORKDIR /my-app
COPY my-app/package.json /my-app/
COPY my-app/package-lock.json /my-app/
RUN npm ci
RUN npm ls --depth=0 | tail -n +2 | sed 's/+-- //g' | sed 's/`-- //g' | awk '!my-app' | xargs  -I {} echo {};
