const { BaseCrawler } = require('./BaseCrawler')
const fs = require("fs")


class GoogleCrawler extends BaseCrawler {
	async crawlImpl() {
		console.log("Google crawler starting.")
		let resp = JSON.parse(await this.httpsGet())
		console.log("Google crawler finished")
		return {
			service: 'google-cloud',
			data: {
				meta: this.parseMetaData(resp),
				services: this.parseServices(resp)
			}
		}
	}

	/**
	 * Extracts the base multiplier and list of pricing tiers from
	 * the given object. This info is used in price calculations.
	 * Tiers other than the base rate are discounts.
	 * maximum_price == tiers[base] * price
	 */
	parseMetaData(obj) {
		let md = {
			tiers: {}
		}

		md.base = obj.gcp_price_list.sustained_use_base
		for(let key in obj.gcp_price_list.sustained_use_tiers) {
			let newKey = key.replace('.', ',')
			md.tiers[newKey] = obj.gcp_price_list.sustained_use_tiers[key]
		}
		return md
	}

	/**
	 * Extracts information about individual services listed
	 * in google's pricing API. Split into price data, listed
	 * per locale and properties like server specifications
	 * which are shared among all locales.
	 */
	parseServices(obj) {
		let serviceObj = {}
		let services = obj.gcp_price_list
		for(let key in services) {
			let s = services[key]
			if(key.match(/^(CP-|GPU_|GAPPS-)/) != null) {
				let prices = this.getPrices(s)
				let properties = this.getProperties(s)
				if(Object.keys(prices).length > 0) {
					serviceObj[key] = {locales: prices, properties}
				}
			}
		}
		return serviceObj
	}

	getPrices(service) {
		let prices = {}
		let isPrice = true
		for(let key in service) {
			let newKey = key.replace('.', '')
			isPrice = typeof service[key] == 'number' && isPrice
			if(isPrice) {
				prices[newKey] = service[key]
			}
		}
		return prices
	}


	getProperties(service) {
		let properties = {}
		let isPrice = true
		let isProperty = false;
		for(let key in service) {
			let newKey = key.replace('.', '')
			isPrice = typeof service[key] == 'number' && isPrice
			isProperty = (!isPrice && typeof service[key] != 'object')
			if(isProperty) {
				properties[newKey] = service[key]
			}
		}
		return properties
	}
}

module.exports.GoogleCrawler = GoogleCrawler