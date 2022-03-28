if (process.env.NEXT_PUBLIC_MODE === "production") {
  console.log("Using production")
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
