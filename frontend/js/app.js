// Link all the JS Docs here
var myApp = angular.module('myApp', [
    'ui.router',
    'pascalprecht.translate',
    'angulartics',
    'angulartics.google.analytics',
    'ui.bootstrap',
    'ngAnimate',
    'ngSanitize',
    'angular-flexslider',
    'ui.swiper',
    'angularPromiseButtons',
    'toastr',
    'ngCookies'
])



// Define all the routes below
myApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider,$sceDelegateProvider) {
    var tempateURL = "views/template/template.html"; //Default Template URL
    //$httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    //$httpProvider.defaults.headers.common = "Auth";
    //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    //$httpProvider.defaults.headers.post['X-CSRFToken'] = $.jStorage.get("csrftoken")
    //$httpProvider.defaults.headers.common['X-CSRFToken'] = '{{ csrf_token|escapejs }}';

    //  $httpProvider.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
    // $sceDelegateProvider.resourceUrlWhitelist([
    // // Allow same origin resource loads.
    //     'self',
    //     // Allow loading from our assets domain. **.
    //     'http://plnkr.co/edit/COnvjvoaYV643oQ46p9B?p=preview'
    // ]);
    // $sceDelegateProvider.resourceUrlBlacklist([
    // '']);
    // for http request with session
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: tempateURL,
            controller: 'HomeCtrl'
        })
        .state('form', {
            url: "/form",
            templateUrl: tempateURL,
            controller: 'FormCtrl'
        })
        .state('grid', {
            url: "/grid",
            templateUrl: tempateURL,
            controller: 'GridCtrl'
        });
    $urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode(isproduction);
});
myApp.run(['$http', '$cookies', function ($http, $cookies) {

    //$http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    //$http.defaults.headers.post['X-CSRFToken'] = $cookies.get("csrftoken");
    $http.defaults.headers.put['X-CSRFToken'] = $cookies.csrftoken;
    // $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    //$http.defaults.headers.common = "Auth";
    
    $(document).on('click', '.chat-body .changedthbg', function(){ 
        var stage = $(this).attr("data-bgstage");
        console.log(stage);
        $(".stage"+stage).css('background-color','#eee');
        $(".stage"+stage).css('color','#111195');
        
        $(this).css('background-color', '#ED6D05');
        $(this).css('color', '#fff');
    });  
}]);

// For Language JS
myApp.config(function ($translateProvider) {
    $translateProvider.translations('en', LanguageEnglish);
    $translateProvider.translations('hi', LanguageHindi);
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escape');
});