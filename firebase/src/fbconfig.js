if (process.env.MODE === "production") {
  console.log("Using production")
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
