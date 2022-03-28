const { join } = require('path')
const { https } = require('firebase-functions')
const functions = require('firebase-functions');

const { default: next } = require('next')

const nextjsDistDir = join('src', require('./src/next.config.js').distDir)

const nextjsServer = next({
  dev: false,
  conf: {
    distDir: nextjsDistDir,
  },
})
const nextjsHandle = nextjsServer.getRequestHandler()

//If you are using HTTP functions to serve dynamic content for Firebase Hosting, you must use us-central1.
// const functionProvider = process.env.FUNCTIONS_EMULATOR ? functions :  functions.region("europe-central2");

exports.nextjsFunc = functions
  .https.onRequest((req, res) => {
    return nextjsServer.prepare().then(() => nextjsHandle(req, res))
  })
