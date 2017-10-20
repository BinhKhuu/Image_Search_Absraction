function createImage (offset, searchOBJ) {
	if(!searchOBJ.hasOwnProperty('photos')) return [];
	if(typeof(offset) == 'undefined') offset = 0;
	var images = [];
	var limit = searchOBJ.photos.perpage;
	var count = 0;
	var i = offset;
	while(count < 10 && i < limit){
		var imageOBJ = {'url': '','snippit': ''}; 
		imageOBJ.url =	'https://farm' + searchOBJ.photos.photo[i].farm.toString() + 
									 	'.staticflickr.com/' + 
									 	searchOBJ.photos.photo[i].server.toString() + '/' + 
									 	searchOBJ.photos.photo[i].id.toString() + '_' + 
									 	searchOBJ.photos.photo[i].secret.toString() + '.jpg';
		imageOBJ.snippit = searchOBJ.photos.photo[i].title;
		images.push(imageOBJ);
		count++;
		i++;
	}
	return images;
}

module.exports.createImage = createImage;