const config = require("./config");

let server;

try {
  server = require(`./transport/${config.transport}`);
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    throw new Error(`config.js contains unimplemented transport - ${config.transport}`);
  }

  throw err;
}

module.exports = server;
