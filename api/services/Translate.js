var schema = new Schema({
    
});

//schema.plugin(deepPopulate, {});
// schema.plugin(uniqueValidator);
// schema.plugin(timestamps);
//module.exports = mongoose.model('category', schema,'category');

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    translate: function (reqdata, callback) {
        const translate = require('google-translate-api');
        //console.log(reqdata);
        translate(reqdata.text, {from: 'en', to: reqdata.language}).then(res => {
            //console.log(res.text);
            callback(null, res.text);
            //=> Ik spreek Nederlands! 
            // console.log(res.from.text.autoCorrected);
            // //=> true 
            // console.log(res.from.text.value);
            // //=> I [speak] Dutch! 
            // console.log(res.from.text.didYouMean);
            // //=> false 
        }).catch(err => {
            //console.error(err);
        });
    },
    translatelink: function (reqdata, callback) {
        const translate = require('google-translate-api');
        //console.log(reqdata);
        var async = require('async');
        translate(reqdata.text, {from: 'en', to: reqdata.language}).then(res => {
            //console.log(res.text);
            callback(null, res.text);
            //=> Ik spreek Nederlands! 
            // console.log(res.from.text.autoCorrected);
            // //=> true 
            // console.log(res.from.text.value);
            // //=> I [speak] Dutch! 
            // console.log(res.from.text.didYouMean);
            // //=> false 
        }).catch(err => {
            //console.error(err);
        });
    }
};
module.exports = _.assign(module.exports, exports, model);