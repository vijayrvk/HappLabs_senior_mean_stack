angular.module('userService', [])
    .factory('User', function($http) {

        var userFactory = {};
        userFactory.createUser = function(updateData) {
            return $http.post('/api/createUser', updateData);
        };

        userFactory.getUserDetails = function(userId) {
            return $http.get('/api/getUserDetails/'+ userId);
        }
        userFactory.createBulkQues = function(questions) {
            return $http.post('/api/createBulkQues', questions);
        };

        userFactory.getQuestion = function(category) {
            return $http.get('/api/getQuestion/'+ category);
        }

        userFactory.createAnswers = function(answers) {
            return $http.post('/api/createAnswers', answers);
        }

        userFactory.getAnswers = function(userId) {
            return $http.get('/api/getAnswers/'+ userId);
        }

        userFactory.getAllResponse = function() {
            return $http.get('/api/getUsers');
        }

        userFactory.updateAdmin = function(id) {
            return $http.put('/api/updateAdmin/'+ id);
        }

        return userFactory;

    });