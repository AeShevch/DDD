'use strict';

const crypto = require('node:crypto');
const config = require("./config");

const hash = (password) => new Promise((resolve, reject) => {
  const salt = crypto.randomBytes(config.crypto.password.bytes).toString(config.crypto.password.encoding);
  crypto.scrypt(password, salt, config.crypto.password.keyLength, (err, result) => {
    if (err) reject(err);
    resolve(salt + ':' + result.toString(config.crypto.password.encoding));
  });
});

module.exports = hash;
