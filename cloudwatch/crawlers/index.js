const { Chromeless } = require('chromeless')
const { GoogleCrawler } = require('./GoogleCrawler')
const { AmazonCrawler } = require('./AmazonCrawler')
const { AzureCrawler } = require('./AzureCrawler')
const { DatabaseWrapper } = require('./DatabaseWrapper')
const fs = require('fs')

services = [
  ['google-cloud', './inits/google.txt'],
  ['amazon-webservices', './inits/amazon.txt'],
  ['microsoft-azure', './inits/azure.txt'],
]

async function crawl() {
  let db = new DatabaseWrapper()
  let crawlers = [
    //new GoogleCrawler(
    //'https://cloudpricingcalculator.appspot.com/',
    //'static/data/pricelist.json',
    //db),
    //new AmazonCrawler(
    //'https://aws.amazon.com/',
    //'ec2/pricing/on-demand/',
    //db),
    new AzureCrawler(
    'https://azure.microsoft.com/',
    db)
  ]

  crawlers.map((c) => {
    c.crawl()
  })

  console.log("Main thread finished")
}


// read file for each service in services and store in db if unique
async function initDbIfEmpty() {
  let db = new DatabaseWrapper()
  console.log("populating db with initial results")
  //let db = new DatabaseWrapper()
  for(let [service, file] of services) {
    f = JSON.parse(fs.readFileSync(file).toString())
    db.writeCollection(service, f, true)
  }
  console.log("finished enqueing results")
}

module.exports.crawl = crawl
module.exports.initDbIfEmpty = initDbIfEmpty