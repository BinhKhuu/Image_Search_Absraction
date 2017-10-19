var express = require('express');
var image = require('./image.js');
var https = require('https');
var mongoose = require('mongoose');
var config = require('./model/config.js');
var path = require('path');
var app = express();
var port = Number(process.env.PORT || 8080);
app.use(express.static(path.join(__dirname, 'public')));

//connect to db
mongoose.connect(config.db.url, (err,db)=>{
	if(err) console.log(err);
	console.log('MongoDB connected on '+ config.db.url);
});
//route / path
app.get('/',(req,res)=>{
	res.sendFile(path.join(__dirname + '/public/index.html'));
});


app.get('/imagesearch/:searchTerm([a-zA-Z0-9_]+)',(req,res)=>{
	//nojsoncallback=1 returns raw json with no function wrapper
	//without it you have to replace the function wrapper jsonFlickrApi
	//!!!!!!!!!!change name and location later
	//!!!!!!!! remember to set up heroku globals when deployed
	var offset = req.query.offset;
	if(!offset) offset = 0;
	var apiKey = process.env.FLICKER_API_KEY;
	var baseUrl = 'https://api.flickr.com/' + 
								'services/rest/?method=flickr.photos.search' + 
								'&api_key='+ apiKey +
								'&text='+ req.params.searchTerm + '&format=json&nojsoncallback=1';
	var searchOBJ;
	var images = [];
	//!!!!!!!!!add searchterm to history
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
			//res.end(JSON.stringify(images));
		});
	}).on('error',(err)=>{
		console.log('ERROR! ', err);
	});
});

//search history
app.get('/history',(req,res)=>{

});

app.listen(port,(err)=>{
	if(err) console.log(err);
	console.log('listening on port: ' + port.toString());
});


