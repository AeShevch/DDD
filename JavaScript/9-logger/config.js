module.exports = {
  transport: 'http',
  port: 8001,
  staticPort: 8000,
  postgres: {
    host: '127.0.0.1',
    port: 5432,
    database: 'example',
    user: 'marcus',
    password: 'marcus',
  },
  crypto: {
    password: {
      encoding: 'base64',
      bytes: 16,
      keyLength: 64,
    }
  },
}
