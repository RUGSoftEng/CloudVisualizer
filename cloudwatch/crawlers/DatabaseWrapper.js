const { MongoClient } = require('mongodb')

class DatabaseWrapper {
	constructor() {
		this.url = 'mongodb://localhost:27017/cloudwatch';
		this.db_ready = false
		this.queue = []
		console.log("waiting for db on " + this.url)
		this.db = this._initDb(this.storeQueue.bind(this));
	}

	_initDb(callback, cnt = 30) {
		setTimeout(() => {
			MongoClient.connect(this.url, (err, db) => {
				if(err) {
					if(cnt <= 0) {
						// timeout of 1 minute. Server should be running by then
						throw "Database conntection timed out. Is the mongod service running?"
					}
					this._initDb(callback, cnt - 1)
				} else {
					console.log("Database is ready!")
					callback(db)
				}
			})
		}, 2000)
	}

	storeQueue(db) {
		this.db = db
		this.db_ready = true
		// write enqueued items to the database
		for(let item of this.queue) {
			//console.log(item.data)
			this.writeCollection(item.name, item.data, item.unique)
		}
	}

	insertIfUnique(name, data) {
		let c = this.db.collection(name).find().sort({crawled_at: -1}).toArray((err, result) => {
			if(err) {
				console.log(err)
			} else if(result.length == 0) {
				this.writeCollection(name, data)
				return
			} else {
				let r = result[0]
				let changes = false
				for(let s in data.data.services) {
					for(let l in data.data.services[s].locales) {
						// three options: 
						//  - new service (key s does not exist)
						// 	- new locale (key l does not exist)
						//  - change in price
						if(!(s in r.data.services) || 
						   !(l in r.data.services[s].locales) || 
						   (r.data.services[s].locales[l] != data.data.services[s].locales[l])) {
							this.writeCollection(name, data)
							return
						}
					}
				}
				console.log("No changes found in service", name)
			}
		})
	}

	writeCollection(name, data, unique = false) {
		if(!this.db_ready) {
			// push the item for later storage
			this.queue.push({name, data, unique})
		} else {
			if(unique) {
				this.insertIfUnique(name, data) 
			} else {
				data.crawled_at = new Date().getTime()
				this.db.collection(name).insert(data, (error) => {
					if(error) {
						console.log("Error while inserting in ", name)
						console.log(error)
					} else {
						console.log("Inserted in ", name)
					}
				})
			}
		}
	}

	getCollection(name) {
		if(!this.db_ready) {
			return {
				success: false,
				collection: {}
			}
		} else {
			return {
				success: true,
				collection: this.db.collection(name)
			}
		}
	}
}

module.exports.DatabaseWrapper = DatabaseWrapper