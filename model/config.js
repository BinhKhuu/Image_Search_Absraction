var config = {};
config.db = {};
//change this when app is launched
config.webhost = 'localhost:8080/';
//remember to set heroku enviroment variable when lanuched
//export MONGOLAB_URI="mongodb://etc"
config.db.url = process.env.MONGOLAB_URI;


module.exports = config;