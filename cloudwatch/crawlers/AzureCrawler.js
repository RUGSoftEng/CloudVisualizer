let { Parser } = require("htmlparser2")
let { BaseCrawler } = require("./BaseCrawler")
let fs = require("fs")

class AzureCrawler extends BaseCrawler {
	constructor(host, db) {
		super(host, '', db)
		
		// read url log to determine next path to cralw
		let urls = JSON.parse(fs.readFileSync('./azureUrls.json'))
		this.current_path = urls.current
		this.path = urls.current.replace(/^\//, '')

		// init other variables
		this.datacnt = 0
		this.servicecnt = 0
		this.prices = {}
		this.in_table = false
		this.url_names = []
		this.current_vm_name = ''
		this.current_vm = ''
		this.vm_urls = []
	}

	async crawlImpl() {
		console.log("Azure crawler starting.\n\t crawling path:", this.path)
		let resp = await this.chromelessGet()
        this.parseData(resp)
	    console.log("Azure crawler finished")
	    return {
            service: 'microsoft-azure',
            data: {
                meta: {},
                services: this.prices
            } 
        }
	}

	parseData(html) {
		// create new data and write html to it
		let parser = new Parser({
            onopentag: this.onopentag.bind(this),
            onclosetag: this.onclosetag.bind(this),
            ontext: this.ontext.bind(this)
        }, {decodeEntities: true})

        parser.write(html)
        parser.end()

        // store the url data for next iteration
        let next_idx = (this.vm_urls.indexOf(this.current_path) + 1) % this.vm_urls.length
        let next_url = this.vm_urls[next_idx]

        fs.writeFileSync("./azureUrls.json", JSON.stringify(
        	{
        		current: next_url,
        		index: next_idx,
        		all: this.vm_urls
        	}))
	}

	onopentag(name, attribs) {
		if(name == 'select' && attribs['id'] == 'vm-type') {
			this.inVmType = true
		} else if(this.inVmType && name == 'option') {
			this.current_vm = attribs['value']
			this.vm_urls.push(attribs['value'])
		} else  if(name == 'div' && attribs['id'] == 'vm-tables') {
			this.in_table = true
		} else if(this.in_table && name == 'span' && attribs['class'] && attribs['data-amount'] && this.datacnt < this.servicecnt) {
			// only the first data-amount after a service name is the base rate.
			// The next 2 consist of the base price with a discount applied based 
			// on commitment to the subscription
			this.prices[this.current_name + ' ' + this.current_vm_name]['locales'] = JSON.parse(attribs['data-amount']).regional
			this.datacnt += 1
		} else if(this.in_table && name == 'button' && attribs['class'] && attribs['data-event-property'] && attribs['data-event-property'] != 'All') {
			// Before each price from the calculator, there is a button which 
			// contains the name of the corresponding service.
			this.current_name = attribs['data-event-property']
			this.prices[this.current_name + ' ' + this.current_vm_name] = {}
			this.servicecnt += 1
		}
	}

	ontext(text) {
		if(this.inVmType && text != ' ') {
			if(this.current_vm == this.current_path) {
				this.current_vm_name = text
			}
			this.url_names.push(text)
		}
	}

	onclosetag(name) {
		if(name == 'select') {
			this.inVmType = false
		}
	}
}

module.exports.AzureCrawler = AzureCrawler