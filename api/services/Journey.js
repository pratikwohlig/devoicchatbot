var schema = new Schema({
    Questions: {
        type: String,
    },
    Answers: {
        type: String,
    },
    Final: {
        type:String,
    },
    category: {
       type:String,
    }, 
    link: {
       type:String,
	},
	Type: {
       type:String,
	},
	
});

schema.plugin(deepPopulate, {
    
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('Journey', schema,'journey');

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
//new RegExp(searchstring)
//{ $regex: searchstring, $options: 'i' }
var model = {
    getautocomplete: function (data, callback) {
        searchstring=data.string;
        searchstring = "/"+searchstring+"/";
        Journey.find({
            Questions:{ $regex: '.*' + data.string + '.*',$options:"i" },
			Type:'FAQ'
        }, { Answers: 1, Questions: 1,category:1,link:1 }).limit(4).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, found);
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    
};
module.exports = _.assign(module.exports, exports, model);