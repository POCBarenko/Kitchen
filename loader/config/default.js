module.exports = {
	logger: {
		appenders: [
			{
				type: 'console',
				layout: {
					"type": "pattern",
					"pattern": "%[%d [%5p] - %m%]"
				}
			},
			{
				type: 'file',
				filename: 'logs/loader.log',
				//category: 'loader',
				maxLogSize: 50e6,
				backups: 2,
				layout: {
					"type": "pattern",
					"pattern": "%d [%5p] - %m"
				}
			}
		],
		replaceConsole: true 
	},
	dbManager: {
		url: 'mongodb://localhost:27017/test',
		options: {
			server: {
				poolSize: 3,
				reconnectTries: 30,
				reconnectInterval: 500,
				socketOptions: {
					autoReconnect: true,
					socketTimeoutMS: 15000,
					connectionTimeoutMS: 15000
				}
			},
			db: {
				w: 1,
				j: false,
				readPreference: ReadPreference.SECONDARY_PREFERRED
			}
		}
	}
}