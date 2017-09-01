myApp.factory('apiService', function ($http, $q, $timeout,$httpParamSerializer,$httpParamSerializerJQLike) {
    adminurl2 = "http://cingulariti.com:8097/";
    var adminurl3 = "http://localhost/api/";
    //var adminurl3 = "http://104.46.103.162:8094/api/";
    //adminurl2 = "http://localhost:8000/";
    //adminurl2 = "http://192.168.0.129:8000/";
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
        getCategoryFAQ: function (formData, callback) {
            return $http({
                url: adminurl2 + 'out/'+formData.user_id+"/",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8','X-CSRFToken':formData.csrfmiddlewaretoken },
                //headers: {'X-CSRFToken':formData.csrfmiddlewaretoken },
                method: 'POST',
                //user_id: 2471,
                data: $.param(formData),
                //data : $httpParamSerializer(formData),
                dataType:"json"
                //withCredentials:false
            });
        },
        get_session: function (formData, callback) {
            return $http({
                url: adminurl2 + 'get_session/',
                //headers: {'X-CSRFToken':formData.csrfmiddlewaretoken },
                method: 'POST',
                //user_id: 2471,
                data: $.param(formData),
                dataType:"json"
                //withCredentials:false
            });
        },
        getCategoryQuestions: function (formData, callback) {
            return $http({
                url: adminurl3+'Categoryquestions/getCategoryQuestions',
                //headers: {'X-CSRFToken':formData.csrfmiddlewaretoken },
                method: 'POST',
                //user_id: 2471,
                data: (formData),
                //dataType:"json"
                //withCredentials:false
            });
        },
        getCategoryDropdown: function (formData, callback) {
            return $http({
                url: adminurl3+'Category/getCategoryDropdown',
                method: 'POST',
                //user_id: 2471,
                data: {},
                //dataType:"json"
                //withCredentials:false
            });
        },
        translate: function (formData,callback) {
            return $http({
                url: adminurl3+'Translate/translate',
                method: 'POST',
                //user_id: 2471,
                data: formData,
                //dataType:"json"
                //withCredentials:false
            });
        },
    };
});