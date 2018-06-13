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
nodes.forEach(node => {
  let client = new faye.Client((node.includes('http') ? node : 'http://' + node) + '/admin/faye');
  console.log(node);
  clients.push(client);
});

function check(server) {
  let port = server.address().port;
  if (!port) {
    console.error('komg health check start failed');
  } else {
    clients.forEach(client => {
      if (client) {
        client.publish('/up', {});
      }
    });
  }
}

process.on('beforeExit', () => {


});

module.exports = check;
