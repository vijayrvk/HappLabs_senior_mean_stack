angular.module('userApp', [
        'ngAnimate',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap',
        'app.uiroutes',
        'authService',
        'mainCtrl',
        'authCtrl',
        'utils',
        'userService',
        'homeCtrl'
    ]).constant('_', window._)
    .config(function($httpProvider, $urlRouterProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
        $urlRouterProvider.otherwise('/login');
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        $httpProvider.defaults.headers.get = { 'X-Frame-Options' : 'DENY' }

    }).run([
        '$rootScope',
        '$location',
        'LocalStorage',
        '$state',
        '$window',
        function($rootScope, $location, LocalStorage, $state, $window) {

            $rootScope._ = window._;

            $rootScope.$on('$stateChangeStart', function(event) {
            });

            $rootScope.$on('$locationChangeSuccess', function() {
                $rootScope.actualLocation = $location.path();
                if ($('div').hasClass('modal-backdrop')) {
                    $('div').removeClass('modal-backdrop');
                }
            });

            $rootScope.$watch(function() { return $location.absUrl() }, function(newLocation, oldLocation) {
                if ($rootScope.actualLocation === $location.path()) {
                    // location.reload(true);
                    LocalStorage.removeToken('token');
                    LocalStorage.removeUserId('userId');
                    $state.go('login');
                }
            });
        }
    ]);