# komg-hc

[![NPM Version][npm-image]][npm-url]

komg healthy check.

## Install

```bash
npm i komg-hc -S
```

## Usage

```javascript

const { createServer } = require('http');

const server = createServer();
const port = 3000;
server.listen(port);

server.on('error', err => {
  console.error(err);
});

server.on('listening', () => {
  console.log(`env:${process.env.NODE_ENV},listening on ${port} ..`);
});

require('komg-hc')
  .reserve(env === 'prod' ? 'redis://172.0.0.1:6379/0' : 'redis://127.0.0.1:6379/0')
  .check(server);

module.exports = server;

```

[npm-image]: https://img.shields.io/npm/v/komg-hc.svg
[npm-url]: https://www.npmjs.com/package/komg-hc