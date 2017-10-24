var config = {};
config.db = {};
//change this when app is launched
config.webhost = 'https://stormy-anchorage-75509.herokuapp.com/';
config.db.url = process.env.MONGOLAB_URI;


module.exports = config;

