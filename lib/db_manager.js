const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ReadPreference = mongodb.ReadPreference
const Logger = require('../lib/logger')
const DEBUG = Logger.Levels.DEBUG
const log = Logger('DBManager')


function attachEventsOnDB(owner, db){
	db.once('fullsetup', function(){
		log.debug('Fullsetup done. Connected with all servers!')
	})
	db.on('parseError', function(err){
		log.error('ParseError: ', err);
	})
	db.on('error', function(err){
		log.error('Error: ', err);
	})
	db.on('reconnect', function(){
		log.warn('Database reconnected!')
	})
	db.on('timeout', function(){
		log.error('Database connection timeout!')
	})
}

const DBManager = {
	configure: function(config){
		if(!this.config)
			this.config = config || require('config').dbManager;
	},
	connect: function(cb){
		if(this.db){
			return cb(null, this.db)
		}

		this.configure(null)

		MongoClient.connect(this.config.url, this.config.options, function(err, db){
			if(err){
				log.fatal(err)
				throw err
			}

			db.once('close', function(){
				log.warn('Database closed.')
				owner.db = null
			})

			if(log.isLevelEnabled(DEBUG)){
				attachEventsOnDB(DBManager, db)
			}

			this.db = db
			cb(err, db)
		})
	},
	getDb: function(cb){
		this.connect(cb)
	}
	unorderedBulk: function(collection, cb){
		this.getDB(function(err, db){
			if(err) return cb(err)
			var collection = db.collection(collection)
			cb(null, collection.initializeUnorderedBulkOp());
		})
	},
	orderedBulk: function(collection, cb){
		this.getDB(function(err, db){
			if(err) return cb(err)
			var collection = db.collection(collection)
			cb(null, collection.initializeOrderedBulkOp());
		})
	}
}

DBManager.configure()

module.export = DBManager