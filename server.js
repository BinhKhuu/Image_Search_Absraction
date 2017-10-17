var express = require('express');
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

app.get('/:searchTerm([a-zA-Z0-9_]+)',(request,result)=>{
	//nojsoncallback=1 returns raw json with no function wrapper
	//without it you have to replace the function wrapper jsonFlickrApi
	//!!!!!!!!!!change name and location later
	//!!!!!!!! remember to set up heroku globals when deployed
	var apiKey = process.env.FLICKER_API_KEY;
	var baseUrl = 'https://api.flickr.com/' + 
								'services/rest/?method=flickr.photos.search' + 
								'&api_key='+ apiKey +
								'&text='+ request.params.searchTerm + '&format=json&nojsoncallback=1';
	var searchOBJ;
	var images = [];
	//!!!!!!!!! check for errors like incorrect api key
	https.get(baseUrl, (httpsRes)=>{
		var body = "";
		httpsRes.on('data', (chunk)=>{
			body += chunk;
		});
		httpsRes.on('end',()=>{
			searchOBJ = JSON.parse(body);
			images = createImage(10,searchOBJ);
			result.end(JSON.stringify(images));
		});
	}).on('error',(err)=>{
		console.log('ERROR! ', err);
	});
});

app.listen(port,(err)=>{
	if(err) console.log(err);
	console.log('listening on port: ' + port.toString());
});
//route /image search

function createImage (limit, searchOBJ) {
	if(typeof(limit) == 'undefined') limit = 20;
	var images = []
	for(var i = 0; i < limit; i++){
		var imageOBJ = {'url': '','snippit': ''}; 
		imageOBJ.url =	'https://farm' + searchOBJ.photos.photo[i].farm.toString() + 
									 	'.staticflickr.com/' + 
									 	searchOBJ.photos.photo[i].server.toString() + '/' + 
									 	searchOBJ.photos.photo[i].id.toString() + '_' + 
									 	searchOBJ.photos.photo[i].secret.toString() + '.jpg';
		imageOBJ.snippit = searchOBJ.photos.photo[i].title;
		images.push(imageOBJ);
	}
	return images;
}
