const express = require('express');
const router = express.Router();
const { DatabaseWrapper } = require('../crawlers/DatabaseWrapper')


db = new DatabaseWrapper()

/* GET users listing. */
router.post('/', function(req, res, next) {
	d = req.body
	query = parse_opts(d)
	resolve_query(query, res)
})

router.options('/', function(req, res, next) {
	res.status(200).json({
		POST: {
			description: "Request crawling data for a given service. 'service; parameter indicates which service should be queried (google-cloud, microsoft-azure, amazon-webservices). 'start' and 'end' parameters can be used to give an interval. Results that were crawled within the given interval will be returned.",
			parameters: {
				service: {
					type: "string",
					required: false,
					oneOf: ["google-cloud", "microsoft-azure", "amazon-webservices"]
				},
				start: {
					type: "string",
					required: false,
					format: "datetime"
				},
				end: {
					type: "string",
					required: false,
					format: "datetime"
				}
			}
		}
	})
})

/**
 * Possible opts:
 *		services: Array containing one or multiple of: (empty list means all)
 *				 ['microsoft-azure', 'amazon-webservices', 'google-cloud']
 *		start: Date that indicates the start of the interval that is to be retrieved.
 *		end: Date that indicates the end of the interval that is to be retrieved.
 */
function parse_opts(opts) {
	query = {}
	query['service'] = opts['service']
	query['start'] = new Date(opts['start'] || 0).getTime()
	if(opts['end']) {
		query['end'] = new Date(opts['end']).getTime()
	} else {
		query['end'] = new Date().getTime()
	}
	return query
}

/**
 * Takes a set of options (see parse_opts for description) and executes the resulting query
 */
function resolve_query(opts, res) {
	result = {'data': {}, 'error': ''}
	if(!db.db_ready) {
		result['error'] = 'The database has not been initialized yet. Please try again later.'
		res.status(400).json({data: result})
	}
	c = db.getCollection(opts.service)
	if(c.success == false) {
		res.status(400).json(
			{error: "The collection you requested does not exist, or the database is unavailable"})
	} else {
		c.collection.find(
			{crawled_at: {$gte: opts['start'], $lte: opts['end']}}
		).toArray((err, result) => {
			if(err) {
				res.status(400).json({error: "Something went wrong while executing the query"})
			} else {
				res.status(200).json({data: result})
			}
		})
	}
}

module.exports = router;
