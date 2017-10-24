var express = require('express');
var History = require('./data/history.js');
var image = require('./lib/image.js');
var https = require('https');
var mongoose = require('mongoose');
var config = require('./model/config.js');
var path = require('path');
var app = express();
var port = Number(process.env.PORT || 8080);
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(config.db.url, function(err,db){
	if(err) console.log(err);
	console.log('MongoDB connected on '+ config.db.url);
});
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

//image search route
app.get('/imagesearch/:searchTerm([a-zA-Z0-9_]+)',function(req,res){
	//nojsoncallback=1 returns raw json with no function wrapper
	//without it you have to replace the function wrapper jsonFlickrApi
	var offset = req.query.offset;
	if(!offset) offset = 0;
	var apiKey = process.env.FLICKER_API_KEY;
	var baseUrl = 'https://api.flickr.com/' + 
								'services/rest/?method=flickr.photos.search' + 
								'&api_key='+ apiKey +
								'&text='+ req.params.searchTerm + '&format=json&nojsoncallback=1';
	var searchOBJ;
	var images = [];
	//save searchterm to history
	var history = History({query: req.params.searchTerm});
	history.save((err)=>{
		if(err) console.log(err);
		console.log('history saved');
	});
	https.get(baseUrl, (httpsRes)=>{
		var body = "";
		httpsRes.on('data', (chunk)=>{
			body += chunk;
		});
		httpsRes.on('end',()=>{
			searchOBJ = JSON.parse(body);
			images = image.createImage(offset,searchOBJ);
			res.json(images);
			res.end();
		});
	}).on('error',(err)=>{
		console.log('ERROR! ', err);
	});
});

//history route 
app.get('/history',function(req,res){
	var searchHistory = [];
	var query = History.find({_id:{$gt: 0}});
	query.limit(1000);
	query.exec(function(err, history){
		if(err) return console.log(err);
		for(var i = 0; i < history.length; i++){
			searchHistory.push(history[i].query);
		}
		res.json(searchHistory);
	});
});

app.listen(port,function(err){
	if(err) console.log(err);
	console.log('listening on port: ' + port.toString());
});


