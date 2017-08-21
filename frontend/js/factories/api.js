myApp.factory('apiService', function ($http, $q, $timeout,$httpParamSerializer) {
    adminurl2 = "http://cingulariti.com:8097/";
    adminurl2 = "http://localhost:8000/";
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
                headers: {'X-CSRFToken':formData.csrfmiddlewaretoken },
                method: 'POST',
                //user_id: 2471,
                data: $.param(formData),
                //dataType:"json"
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

    };
});