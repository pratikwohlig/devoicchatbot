var schema = new Schema({
    location: {
        type: String,
    },
    address: {
        type: String,
    },
    pincode: {
        type: String,
    },
    url: {
        type: String,
    },
    mapurl: {
        type: String,
    },
    name: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    timing: {
        type: String,
    },
});

schema.plugin(deepPopulate, {
    
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('Officelocator', schema,'officelocator');

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
//new RegExp(searchstring)
//{ $regex: searchstring, $options: 'i' }
var model = {
    getaddress: function (data, callback) {
        Officelocator.find({
            pincode:data.pincode
        }, { address: 1, pincode: 1,location:1,mapurl:1,url:1,city:1,state:1,timing:1,name:1,_id:0 }).exec(function (err, found) {
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