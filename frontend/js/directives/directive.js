myApp.directive('img', function ($compile, $parse) {
        return {
            restrict: 'E',
            replace: false,
            link: function ($scope, element, attrs) {
                var $element = $(element);
                if (!attrs.noloading) {
                    $element.after("<img src='img/loading.gif' class='loading' />");
                    var $loading = $element.next(".loading");
                    $element.load(function () {
                        $loading.remove();
                        $(this).addClass("doneLoading");
                    });
                } else {
                    $($element).addClass("doneLoading");
                }
            }
        };
    })

    .directive('hideOnScroll', function ($document) {
        return {
            restrict: 'EA',
            replace: false,
            link: function (scope, element, attr) {
                var $element = $(element);
                var lastScrollTop = 0;
                $(window).scroll(function (event) {
                    var st = $(this).scrollTop();
                    if (st > lastScrollTop) {
                        $(element).addClass('nav-up');
                    } else {
                        $(element).removeClass('nav-up');
                    }
                    lastScrollTop = st;
                });
            }
        };
    })


    .directive('fancybox', function ($document) {
        return {
            restrict: 'EA',
            replace: false,
            link: function (scope, element, attr) {
                var $element = $(element);
                var target;
                if (attr.rel) {
                    target = $("[rel='" + attr.rel + "']");
                } else {
                    target = element;
                }

                target.fancybox({
                    openEffect: 'fade',
                    closeEffect: 'fade',
                    closeBtn: true,
                    padding: 0,
                    helpers: {
                        media: {}
                    }
                });
            }
        };
    })

    .directive('autoHeight', function ($compile, $parse) {
        return {
            restrict: 'EA',
            replace: false,
            link: function ($scope, element, attrs) {
                var $element = $(element);
                var windowHeight = $(window).height();
                $element.css("min-height", windowHeight);
            }
        };
    })


    .directive('replace', function () {
        return {
            require: 'ngModel',
            scope: {
                regex: '@replace',
                with: '@with'
            },
            link: function (scope, element, attrs, model) {
                model.$parsers.push(function (val) {
                    if (!val) {
                        return;
                    }
                    var regex = new RegExp(scope.regex);
                    var replaced = val.replace(regex, scope.with);
                    if (replaced !== val) {
                        model.$setViewValue(replaced);
                        model.$render();
                    }
                    return replaced;
                });
            }
        };
    })

    .directive('compTranslate', function ($compile, apiService) {
        return {
            restrict: 'A',
            scope: true,
            priority: 0,
            compile: function (element, attrs) {
                var originalText = element.text();
                //var originalTooltip = attrs['tooltip'];
                //console.log(originalText);
                return {
                    pre: function (scope, element, attrs) {
                        scope.originalText = originalText;
                        //scope.originalTooltip = originalTooltip;
                    
                        
                        var translationChangeOccurred = function () {
                            attrs.$observe('compTranslate', function(value) {
                                var languageid = $.jStorage.get("language");
                                var formData = { "text": value,"language":languageid };
                                //console.log(element);
                                //element.text(value);
                                //element.html(apiService.translate(formdata));
                                apiService.translate(formData).then( function (response) {
                                    element.text(response.data.data);
                                });
                                // if (scope.originalTooltip) {
                                //     attrs.$set('tooltip', translationService.translate(scope.originalTooltip));
                                // }
                    
                                $compile(element.contents())(scope);
                            });
                        };
                        //translation changes by default while linking!
                        translationChangeOccurred();
            
                        scope.$on('$translationLanguageChanged', translationChangeOccurred);
                    },
                    post: function () {
                    }
                };
            }
        };
    })

;