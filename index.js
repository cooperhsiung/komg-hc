/**
 * Created by Cooper on 2018/6/14.
 */
const os = require('os');
const redis = require('redis');
const nifs = Object.values(os.networkInterfaces());
const address = nifs.reduce((s, v) => s.concat(v), []).find(e => e.family === 'IPv4' && !e.internal).address;
// console.log(address);

class Checker {
  constructor() {
    this.publisher = null;
  }

  reserve(url = 'redis://127.0.0.1:6379/0') {
    this.publisher = redis.createClient(url, {
      retry_strategy: function(options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          console.error('The server refused the connection');
          return undefined;
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          console.error('Retry time exhausted');
          return undefined;
        }
        if (options.attempt > 10) {
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });
    return this;
  }

  check(server) {
    this.server = server;
    let port = server.address().port;
    if (!port) {
      console.error('komg health check start failed');
    } else {
      console.log(address, 'healthy~~');
      this.publisher.publish('komg/up', JSON.stringify({ server: address + ':' + port }));
    }
  }

  down() {
    console.log(address, 'exit~~');
    let port = this.server.address().port;
    if (!port) {
      console.error('komg health check start failed');
    } else {
      this.publisher.publish('komg/down', JSON.stringify({ server: address + ':' + port }), () => {
        process.exit();
      });
    }
  }
}

const checker = new Checker();

[
  'SIGHUP',
  'SIGINT',
  'SIGQUIT',
  'SIGILL',
  'SIGTRAP',
  'SIGABRT',
  'SIGBUS',
  'SIGFPE',
  'SIGUSR1',
  'SIGSEGV',
  'SIGUSR2',
  'SIGTERM'
].forEach(sig => process.on(sig, () => checker.down()));

module.exports = checker;
