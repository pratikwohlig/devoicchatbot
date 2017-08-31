var schema = new Schema({
    questions: {
        type: String,
        required: true,
    },
    answers: {
        type: String,
        required: true,
    },
    link: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Categoryquestions', schema,'categoryquestions');

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getCategoryQuestions: function (reqdata, callback) {
        var Model = this;
        //console.log(reqdata.category);
        Model.find({
            category:reqdata.category,
        },{ _id: 1, questions: 1,answers:1,link:1 }).exec(function (err, data) {
            if (err) {
                //console.log(err);
                callback(err, null);
            } else {
                //console.log(data,"data");
               
                callback(err, data);
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);