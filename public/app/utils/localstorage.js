angular.module('utils', [])

.factory('LocalStorage', ['$window', function($window) {
        return {
            getToken: function() {
                return $window.localStorage['token'] || '';
            },
            setToken: function(value) {
                $window.localStorage['token'] = value;
            },
            removeToken: function(key) {
                $window.localStorage[key] = '';
            },
            setUserId: function(userId) {
                $window.localStorage['userId'] = userId;
            },
            getUserId: function() {
                return $window.localStorage['userId'] || '';
            },
            removeUserId: function(key) {
                $window.localStorage[key] = '';
            }
        };
    }]);