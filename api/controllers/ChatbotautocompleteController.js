module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getautocomplete: function (req, res) {
        if (req.body) {
            Chatbotautocomplete.getautocomplete(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    authenticate: function (req, res) {
        if (req.body) {
            Chatbotautocomplete.authenticate(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
};
module.exports = _.assign(module.exports, controller);