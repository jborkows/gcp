ARG FIREBASE_BASE
FROM ${FIREBASE_BASE}
WORKDIR /my-app
COPY package.json /my-app/
COPY package-lock.json /my-app/
RUN npm ci

