/**
 * Created by Cooper on 2018/6/13.
 */
const unirest = require('unirest');
let servers = ['127.0.0.1:2350'];

class Kmanager {
  constructor(servers) {
    this.servers = servers || [];
  }

  reserve(servers) {
    this.servers = servers;
    return this;
  }

  req(action, body) {
    this.servers.forEach(server => {
      unirest
        .post(`http://${server}/${action}`)
        .headers({ Accept: 'application/json', 'Content-Type': 'application/json' })
        .send(body)
        .end(function(response) {
          console.log(response.body);
        });
    });
  }

  up(target) {
    this.req('up', { target });
  }

  down(target) {
    this.req('down', { target });
  }
}
