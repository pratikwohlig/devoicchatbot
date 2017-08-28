var schema = new Schema({
    name: {
        type: String,
    },
    id: {
        type:String
    }
});

//schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('category', schema,'category');

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getCategoryDropdown: function (reqdata, callback) {
        var Model = this;
        Model.find({
            
        }).exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                callback(err, data);
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);