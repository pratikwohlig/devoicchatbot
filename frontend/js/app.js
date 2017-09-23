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

    // Select the script tag used to load the widget.
    var scriptElement = document.querySelector("#your-widget");
    // Create an iframe.
    var iframe = document.createElement("iframe");
    // Insert iframe before script's next sibling, i.e. after the script.
    scriptElement.parentNode.insertBefore(iframe, scriptElement.nextSibling);

    // The URL of your API, without JSONP callback parameter.
    var url = "your-api-url";
    // Callback function used for JSONP.
    // Executed as soon as server response is received.
    function callback(count) {
    // Create a div element
    var div = document.createElement("div");
    // Insert online count to this element.
    // I assume that server response is plain-text number, for example 5.
    div.innerHTML = count;
    // Append div to iframe's body.
    iframe.contentWindow.document.body.appendChild(div);
    }
    // Create a script.
    var script = document.createElement("script");
    // Set script's src attribute to API URL + JSONP callback parameter.
    // It makes browser send HTTP request to the API.
    script.src = url + "?callback=callback";

}]);

// For Language JS
myApp.config(function ($translateProvider) {
    $translateProvider.translations('en', LanguageEnglish);
    $translateProvider.translations('hi', LanguageHindi);
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escape');
});