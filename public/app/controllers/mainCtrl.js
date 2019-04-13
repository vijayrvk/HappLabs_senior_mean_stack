angular.module('mainCtrl', ['toaster'])
    .controller('mainController', function($state, LocalStorage, User) {
        var vm = this;
        var userId = LocalStorage.getUserId();

        User.getUserDetails(userId).then(function(res) {
            vm.username = res.data.firstName + ' ' + res.data.lastName;
            vm.adminUser = res.data.userType;
        });

        vm.createQuestion = function() {
            $state.go('mainCommon.question');
        };

        vm.listUser = function() {
            $state.go('mainCommon.response');
        };

        vm.doLogout = function() {
            LocalStorage.removeToken('token');
            LocalStorage.removeUserId('userId');
            $state.go('login');
        };

    });