const chromeLauncher = require('chrome-launcher')
const { Chromeless } = require('chromeless')
const zlib = require("zlib")
const Http = require('https');
const fs = require('fs')

class BaseCrawler {
  /**
   * Basic crawler requires a host and a path to crawl and a
   * database where crawl results can be stored
   */
  constructor(host, path, db) {
    this.host = host
    this.path = path
    this.db = db
    // crawl and wait for db in new thread
  }

  /**
   * Crawl interface to the outside world
   */
  crawl() {
    setTimeout(async () => {
      let data = await this.crawlImpl()
      //fs.writeFileSync('./inits/'+this.service+'.txt', JSON.stringify(data))
      this.db.writeCollection(data.service, data, true)
    }, 0)
  }

  crawlImpl() {
    console.log("Placeolder. override this method")
  }

  /**
   * Base abstraction of performing a get request through
   * chromeless. Returns the HTML of the requested url in
   * string format.
   */
  async chromelessGet() {
    const c = new Chromeless();

    let str = await c
      .goto(this.host + this.path)
      .wait(1000)
      .html()

    return str
  }

  /**
   * Base abstraction of performing a get request to
   * to a JSON api. Returns a Promise. When it resolves
   * succesfully, a JSON object is returned.
   */
  async httpsGet() {
    return new Promise((resolve, reject) => {
      const options = {
        host: this.host,
        path: this.path
      };

      Http.get(this.host + this.path, (res) => {
        var body = "";

        res.on('error', (err) => {
          reject(err)
        });

        var output;
        if( res.headers['content-encoding'] == 'gzip' ) {
          var gzip = zlib.createGunzip();
          res.pipe(gzip);
          output = gzip;
        } else {
          output = res;
        }

        output.on('data', (data) => {
          data = data.toString('utf-8');
          body += data;
        });


        output.on('end', () => {
          resolve(body)
        });
      })
    })
  }
}

module.exports.BaseCrawler = BaseCrawler
