/**
 * Created by Cooper on 2018/06/13.
 */
const os = require('os');
const faye = require('faye');
const nifs = Object.values(os.networkInterfaces());
const address = nifs.reduce((s, v) => s.concat(v), []).find(e => e.family === 'IPv4' && !e.internal).address;
console.log(address);

const nodes = ['http://localhost:2350'];

const clients = [];

class Checker {
  constructor(server) {
    this.clients = [];
    this.server = null;
  }

  reserve(nodes) {
    nodes.forEach(node => {
      let client = new faye.Client((node.includes('http') ? node : 'http://' + node) + '/admin/faye');
      this.clients.push(client);
    });
    return this;
  }

  check(server) {
    this.server = server;
    let port = server.address().port;
    if (!port) {
      console.error('komg health check start failed');
    } else {
      this.clients.forEach(client => {
        if (client) {
          client.publish('/up', `${address}:${port}`);
        }
      });
    }
  }

  down() {
    let port = this.server.address().port;
    if (!port) {
      console.error('komg health check start failed');
    } else {
      clients.forEach(client => {
        if (client) {
          client.publish('/down', `${address}:${port}`);
        }
      });
    }
  }
}

let checker = new Checker();

process.on('beforeExit', () => {
  checker.down();
});
// hc.reserve(['localhost:2350']).check(server)
module.exports = checker;
