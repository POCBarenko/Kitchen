var loggerConfig = require('config').logger

var log4js = require('log4js')
log4js.configure(loggerConfig)

module.exports = function(category){
	return log4js.getLogger(category)
}
