myApp.factory('apiService', function ($http, $q, $timeout,$httpParamSerializer,$httpParamSerializerJQLike) {
    adminurl2 = "http://cingulariti.com:443/Dvois/";
    var adminurl3 = "http://localhost/api/";
    var adminurl3 = "http://104.46.103.162:8094/api/";
    var loginurl = "http://adserver.i-on.in:9001/validateUser";
    //adminurl2 = "http://localhost:8000/";
    //adminurl2 = "http://192.168.0.129:8000/";
    var serverurl = "http://adserver.i-on.in:9000/crm";
    return {

        // This is a demo Service for POST Method.
        getDemo: function (formData, callback) {
            $http({
                url: adminurl + 'demo/demoService',
                method: 'POST',
                data: formData
            }).success(callback);
        },
        // This is a demo Service for POST Method.
        getautocomplete: function(formData, callback) {
            
            return $http({
                url:adminurl3+ "Chatbotautocomplete/getautocomplete",
                method: 'POST',
                data: formData
            })
        },
        login: function(formData, callback) {
            
            return $http({
                url:loginurl,
                method: 'POST',
                data: formData
            })
        },
        serverlogin: function(formData, callback) {
            
            return $http({
                url:serverurl+"?customer="+formData.customer+"&pword="+formData.pword,
                method: 'GET',
                data: formData,
                headers: {'AuthKey':"685e968a14eaeeade097555e514cf2c1",'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8' },
            })
        },
        getCategoryFAQ: function (formData, callback) {
            return $http({
                url: adminurl2 + 'out/'+formData.user_id+"/",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8','X-CSRFToken':formData.csrfmiddlewaretoken },
                method: 'POST',
                data: $.param(formData),
                dataType:"json"
            });
        },
        outquery: function (formData, callback) {
            return $http({
                url: adminurl2 + 'outquery/'+formData.user_id+"/",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8','X-CSRFToken':formData.csrfmiddlewaretoken },
                method: 'POST',
                data: $.param(formData),
                dataType:"json"
            });
        },
        outfeedback:function(formData,callback){
            return    $http({
                url:adminurl2+'outfeedback/'+formData.user_id+"/",
                method: 'POST',
                data:$.param(formData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8','X-CSRFToken':formData.csrfmiddlewaretoken },
            });
            
            
        },
        getDthlinkRes:function(formData,callback){
            return    $http({
                url:adminurl2+'outDTL/'+formData.user_id+"/",
                //url: adminUrl3 + 'Chatbotautolist/getDthlink',
                method: 'POST',
                data:$.param(formData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8','X-CSRFToken':formData.csrfmiddlewaretoken },
            });
            
            
        },
        get_session: function (formData, callback) {
            return $http({
                url: adminurl2 + 'get_session/',
                //headers: {'X-CSRFToken':formData.csrfmiddlewaretoken },
                method: 'POST',
                data: $.param(formData),
                dataType:"json"
            });
        },
        getCategoryQuestions: function (formData, callback) {
            return $http({
                url: adminurl3+'Categoryquestions/getCategoryQuestions',
                method: 'POST',
                data: (formData),
            });
        },
        getCategoryDropdown: function (formData, callback) {
            return $http({
                url: adminurl3+'Category/getCategoryDropdown',
                method: 'POST',
                data: {},
            });
        },
        translate: function (formData,callback) {
            return $http({
                url: adminurl3+'Translate/translate',
                method: 'POST',
                data: formData,
            });
        },
        translatelink: function (formData,callback) {
            return $http({
                url: adminurl3+'Translate/translatelink',
                method: 'POST',
                data: formData,
            });
        },
    };
});