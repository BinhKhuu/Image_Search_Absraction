var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
var counter = mongoose.model('counter', CounterSchema);

var HistorySchema = new Schema({
	_id: {type: Number, index: true},
	query: String
});
//a hooks (arrow function) do not have lexical scope, use function insead of => if you want to use this
HistorySchema.pre('save',function(next){
	var doc = this;
	counter.findByIdAndUpdate({_id:'history_count'}, {$inc: {seq: 1}}, function(err,counter){
		if(err) return next(err);
		doc._id = counter.seq;
		next();
	});
});

var History = mongoose.model('History', HistorySchema);

module.exports = History;