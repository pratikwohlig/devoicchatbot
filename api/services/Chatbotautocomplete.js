var schema = new Schema({
    questions: {
        type: String,
    },
    answers: {
        type: String,
    },
    que_ans: {
        type: String,
    },
    final: {
        type:String,
    },
    category: {
       type:String,
    }, 
    link: {
       type:String,
   },
});

schema.plugin(deepPopulate, {
    
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('Chatbotautocomplete', schema,'chatbotautocomplete');

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
//new RegExp(searchstring)
//{ $regex: searchstring, $options: 'i' }
var model = {
    getautocomplete: function (data, callback) {
        searchstring=data.string;
        searchstring = "/"+searchstring+"/";
        Chatbotautocomplete.find({
            questions:{ $regex: '.*' + data.string + '.*',$options:"i" }
        }, { answers: 1, questions: 1,category:1,link:1 }).limit(4).exec(function (err, found) {
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
    authenticate: function (data, callback) {
        var exec = require('child_process').execFile;
        var executablePath =  process.cwd()+'\\exe\license_validate.exe';
        var parameters = ["exponentiadata.co.in"];

        exec(executablePath, parameters, function(err, found) {
            console.log(err)
            console.log(found.toString());
            callback(null, found);
        });
        // searchstring=data.string;
        // searchstring = "/"+searchstring+"/";
        // Chatbotautocomplete.find({
        //     questions:{ $regex: '.*' + data.string + '.*',$options:"i" }
        // }, { answers: 1, questions: 1,category:1,link:1 }).limit(4).exec(function (err, found) {
        //     if (err) {
        //         callback(err, null);
        //     } 
        //     else {
        //         if (found) {
        //             callback(null, found);
        //         } else {
        //             callback({
        //                 message: "-1"
        //             }, null);
        //         }
        //     }

        // });
    },
};
module.exports = _.assign(module.exports, exports, model);