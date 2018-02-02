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
    'ngIdle',
    'ngCookies'
])


//var isproduction = false;
// Define all the routes below
myApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider,$sceDelegateProvider,IdleProvider,KeepaliveProvider) {
    var tempateURL = "views/template/template.html"; //Default Template URL
    IdleProvider.idle(1); // 1sec idle
    IdleProvider.timeout(25); // in seconds
    KeepaliveProvider.interval(180);
    $.jStorage.set("timer",25);
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
myApp.run(['$http', '$cookies','Idle','$rootScope', function ($http, $cookies,Idle,$rootScope) {

    //$http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    //$http.defaults.headers.post['X-CSRFToken'] = $cookies.get("csrftoken");
    $http.defaults.headers.put['X-CSRFToken'] = $cookies.csrftoken;
    // $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    //$http.defaults.headers.common = "Auth";
    
    $(document).on('click', '.q_btn', function(){ 
        //$(this).css('box-shadow','inset 0 3px 5px rgba(0, 0, 0, 0.125)');
    });
    
    $(document).on('click', '.chat-body .changedthbg', function(){ 
        var stage = $(this).attr("data-bgstage");
        console.log(stage);
        $(".stage"+stage).css('background-color','#fff');
        $(".stage"+stage).css('color','#ED6D05');
        
        $(this).css('background-color', '#ED6D05');
        $(this).css('color', '#fff');
    });  
    Idle.watch();
    $rootScope.session_id="";
}]);

// For Language JS
myApp.config(function ($translateProvider) {
    $translateProvider.translations('en', LanguageEnglish);
    $translateProvider.translations('hi', LanguageHindi);
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escape');
});