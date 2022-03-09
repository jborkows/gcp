FROM gcr.io/google-appengine/nodejs
WORKDIR /my-app
COPY myapp/package.json /my-app/
RUN npm install
CMD ["npm", "start"]
