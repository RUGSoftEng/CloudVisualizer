let { Parser } = require("htmlparser2")
let { BaseCrawler } = require("./BaseCrawler")
let fs = require("fs")

class AmazonCrawler extends BaseCrawler {
    constructor(host, path, db) {
        super(host, path, db)
        this.state = []
        this.services = [{properties: {}}]
        this.categories = {}
        this.cat_idx = 0
        this.transition = this.maintainCategories
        this.os = []
        this.os_idx = 0
    }

    async crawlImpl() {
        console.log("Amazon crawler starting.")
        let resp = await this.chromelessGet()
        let result = this.parseData(resp)
        console.log("Amazon crawler finished")
        return {
            service: 'amazon-webservices',
            data: {
                meta: {},
                services: this.groupByService()
            } 
        }
    }

    parseData(html) {
        let parser = new Parser({
            onopentag: this.onopentag.bind(this),
            ontext: this.ontext.bind(this),
            onclosetag: this.onclosetag.bind(this)
        }, {decodeEntities: true})

        parser.write(html)
        parser.end()

        // top element is always empty after parsing. Delete it
        this.services.pop()
    }

    groupByService() {
        let o = {}
        for(let service of this.services) {
            // concat the OS with service name and remove any dots from the name (MongoDb does not like dots)
            let name = (service.name + '-' + service.properties.os).replace(/\.( )?/, '-')
            // also remove dots from locale
            service.locale = service.locale.replace(/\.( )?/, '-')
            delete service.properties['os']
            if(o[name]) {
                // We found the service before. Add a locale and its price to the service
                o[name].locales[service.locale] = service.price
            } else {
                // New service. Initalize the service and add its properties
                o[name] = {
                    locales: {},
                    properties: service.properties
                }
                // Add the first locale and price
                o[name].locales[service.locale] = service.price
            }
        }
        return o
    }

    /**
     * In order to extract pricing data from the html page, we are interected in a
     * a subset of tags that indicate structure: tables, table rows, table cells, 
     * table headers and captions. These contain pricing info, as well as meta data
     * about the service itself. We push these elements onto a stack, so we can
     * match agains the nesting level of elements.
     */
    onopentag(name, attribs){
        let o = {}
        o[name] = attribs
        switch(name) {
            case 'table': this.state.push(o); break;
            case 'thead': this.state.push(o); break;
            case 'th': this.state.push(o); break;
            case 'td': this.state.push(o); break;
            case 'tr': this.state.push(o); break;
            case 'caption': this.state.push(o); break;
            case 'main': this.state.push(o); break;
            case 'a': this.state.push(o); break;
            case 'li': this.state.push(o); break;
            default: break;
        }
    }

    /**
     * When we encounter text, we first look at the stack of tags that we built up,
     * and based on the size of the stack and the content of the stack we decide what
     * to do with the text
     */
    ontext(text){
        let top = this.state.length - 1;
        switch(top) {
            case 2: {
                if('caption' in this.state[top] && 'table' in this.state[top-1]) {
                    /* Locales only occur in a caption within a table*/
                    if(!this.locale) {
                        this.first_locale = text
                    } else if(text == this.first_locale) {
                        this.os_idx += 1;
                        this.cat_idx = 0
                    }
                    this.locale = text
                }  
                if('a' in this.state[top] && 'li' in this.state[top-1] && 'main' in this.state[top-2]) {
                    /* The links that refer to operating systems (tabs) are inside a main -> li -> a tag */
                    this.os.push(text)
                } 
            }
            case 3: {
                if('td' in this.state[top] && 'tr' in this.state[top-1] && this.state[top-1].tr.class == 'sizes') {
                    /* Service data is in a td within a tr. The tr always has class "sizes"*/
                    this.serviceData(text)
                }
                if('th' in this.state[top] && 'tr' in this.state[top-1]) {
                    /* Table headers within a tr indicate the service type*/
                    this.instanceType = text
                }
            }
            case 4: {
                if('th' in this.state[top] && 'tr' in this.state[top-1] && 'thead' in this.state[top-2] && 'table' in this.state[top-3]) {
                    /* table -> thead -> tr -> th contains the column headers of the service table.
                     * We use a finite state machine to keep track of the list of categories */
                    this.transition(text)
                }
            }
        }

    }
    onclosetag(tagname){
        /**
         * When we find a closing tag, we check whether it is one of tags that we
         * keep track of on the stack, and if we're interested in the tag we pop 
         * the top of the stack.
         */
        switch(tagname) {
            case 'table': this.state.pop(); break;
            case 'thead': this.state.pop(); break;
            case 'th': this.state.pop(); break;
            case 'td': this.state.pop(); break;
            case 'tr': this.state.pop(); break;
            case 'caption': this.state.pop(); break;
            case 'main': this.state.pop(); break;
            case 'a': this.state.pop(); break;
            case 'li': this.state.pop(); break;
            default: break;
        }
    }

    serviceData(text) {
        // remove all '.' from the text
        let m, os;
        let keys = Object.keys(this.categories)
        // curent table column
        let column = keys[this.cat_idx]
        
        // current service

        let top = this.services.length - 1
        if(this.os_idx <= this.os.length) {
            os = this.os[this.os_idx]
        } else {
            /**
             * There is one more category that we detect: EBS
             * These instances are optimized for working with 
             * Amazon Elastic Block Store. This price is additive
             * with the regular price listings. 
             */
            os = 'EBS'
        }
        
        // we found a price. The price is always the last element listed in a service.
        if((m = text.match(/^\$\d+\.?\d*/))) {
            // update the top service with meta parameters and price
            this.services[top].price = m[0].replace('$', '')
            this.services[top].locale = this.locale
            this.services[top].instanceType = this.instanceType
            this.services[top].properties.os = os
            
            // initalize a new service and push this onto the stack
            let o = {properties: {}}
            this.services.push(o)
        } else {
            let s = this.services[top]
            if(keys[this.cat_idx] == 'name') {
                // if the current category is name, we are at the first property of a service
                s.name = text
            } else {
                // otherwise we're reading a service property (specs: number of cpu, ram, storage etc)
                s.properties[keys[this.cat_idx]] = text
            }
        }

        // set idx of next column
        this.cat_idx = (this.cat_idx + 1) % this.len

    }

    buildCategories(text) {
        if(text in this.categories) {
            this.transition = this.maintainCategories
        } else {
            this.categories[text] = ''
            this.len += 1
        }
    }

    maintainCategories(text) {
        if(!(text in this.categories)) {
            let keys = Object.keys(this.categories).reverse()
            if(keys.length > 0) {
                if(text == 'Pricing') {
                    this.categories = {name: ''}
                } else {
                    delete this.categories[keys[0]]
                }
            } else {
                this.categories = {name: ''}
            }
            this.categories[text] = ''
            this.len = Object.keys(this.categories).length
            this.transition = this.buildCategories
        }
    }
}

module.exports.AmazonCrawler = AmazonCrawler
