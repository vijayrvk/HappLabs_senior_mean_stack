angular.module('authService', [])
    .factory('Auth', function($http, $q, AuthToken) {
        var authFactory = {};

        authFactory.authenticate = function(login) {
            return $http.post('/api/authenticate', login)
            .success(function(data) {
                AuthToken.setUserId(data.id);
                return data;
            });
        };
        authFactory.forgetPasswordRequest = function(forgetPasswordReq) {
            return $http.post('/api/forgetPasswordRequest', forgetPasswordReq);
        };
        authFactory.setPassword = function(password) {
            return $http.post('/api/setPassword', password);				
        };
        authFactory.getPassword = function(userId) {
            return $http.get('/api/getPassword/'+ userId);				
        };
        return authFactory;
    })

.factory('AuthToken', function($window) {
        var authTokenFactory = {};

        authTokenFactory.getUserId = function() {
            return $window.localStorage.getItem('userId');
        };

        authTokenFactory.setUserId = function(userId) {
            if (userId) {
                $window.localStorage.setItem('userId', userId);
            } else {
                $window.localStorage.removeItem('userId');
            }
        };

        authTokenFactory.getToken = function() {
            return $window.localStorage.getItem('token');
        };

        authTokenFactory.setToken = function(token) {
            if (token) {
                $window.localStorage.setItem('token', token);
            } else {
                $window.localStorage.removeItem('token');
            }
        };

        return authTokenFactory;
    })
    .factory('AuthInterceptor', function($q, $location, AuthToken) {
        var interceptorFactory = {};
        interceptorFactory.request = function(config) {
            var token = AuthToken.getToken();
            if (token)
                config.headers['x-access-token'] = token;
            return config;
        };

        interceptorFactory.responseError = function(response) {
            if (response.status == 403) {
                AuthToken.setToken();
                $location.path('/login');
            }
            return $q.reject(response);
        }
        return interceptorFactory;
    });
