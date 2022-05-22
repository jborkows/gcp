ARG FIREBASE_BASE
FROM ${FIREBASE_BASE}
WORKDIR /my-app
COPY package.json /my-app/
COPY package-lock.json /my-app/
RUN npm ci
RUN npm install -g firebase-tools && \ 
    npm install -g npm@8.10.0 && \
    firebase setup:emulators:database && \
    firebase setup:emulators:firestore && \
    firebase setup:emulators:pubsub && \
    firebase setup:emulators:storage && \
    firebase setup:emulators:ui && \
    rm -rf /var/cache/apk/*
RUN npm test || true
# RUN npm ls --depth=0 | tail -n +2 | sed 's/+-- //g' | sed 's/`-- //g' | awk '!my-app' | xargs  -I {} echo {};
