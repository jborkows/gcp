FROM gcr.io/google-appengine/nodejs
WORKDIR /my-app
COPY my-app/package.json /my-app/
RUN npm install -g
CMD ["npm", "start"]
