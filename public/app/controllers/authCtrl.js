angular.module('authCtrl', ['toaster'])
    .controller('authController', function($scope, $rootScope, $location, $state, Auth, LocalStorage, toaster, User) {
        var vm = this;
        vm.loginData = {};
        vm.submitted = false;
        vm.processing = false;
        vm.loginData = {};        

        vm.doLogin = function(isValid) {
            vm.processing = true;
            vm.submitted = true;
            vm.error = '';
            if (vm.loginData.username !== undefined) {
                var login = { username: vm.loginData.username, password: vm.loginData.password };
            }
            if (isValid) {
                Auth.authenticate(login)
                    .then(function(data) {
                        LocalStorage.setToken(data.data.token);
                        if (data.data.token && data.data.id) {
                            $state.go('mainCommon.home');
                        } else {
                            vm.processing = false;
                            toaster.pop('error', data.data.message)
                        }
                    });
            } else {
                if (vm.loginData.username !== '' && vm.loginData.username !== undefined) {
                    if (vm.loginData.password == '' || vm.loginData.password == undefined) {
                        toaster.pop('error', 'Please enter the password.');
                        vm.processing = false;
                    } else {
                        toaster.pop('error', 'Please enter a valid username and password.');
                        vm.processing = false;
                    }
                } else {
                    if (vm.loginData.password !== '' && vm.loginData.password !== undefined) {
                        toaster.pop('error', 'Please enter the username.');
                        vm.processing = false;
                    } else {
                        toaster.pop('error', 'Please enter a valid username and password.');
                        vm.processing = false;
                    }
                }

            }
        };

        vm.signUp = function() {
            $('#manual_update_modal').modal('show');
        };

        vm.creatUser = function(signUpDet) {
            if(signUpDet) {
                var userValid = $scope.validation(signUpDet);
                if(userValid === true) {
                    User.createUser(signUpDet).then(function(res) {
                        if(res.data.success) {
                            toaster.pop('success', res.data.message)
                            $('#manual_update_modal').modal('hide');
                            vm.signUpDet = {};
                        } else {
                            toaster.pop('error', res.data.message)
                        }
                        
                    });
                } else {
                    toaster.pop('error', userValid);
                }
            } else {
                toaster.pop('error', 'Please enter the mandatory field(s).');
            }
            
        };

        $scope.validation = function(manualData) {
            var validation_message = '';
            if(!manualData.firstName || !manualData.lastName || !manualData.email || !manualData.password || !manualData.cfnPassword) {
                validation_message = 'Please enter the mandatory field(s).';
                return false, validation_message;
            } else if (/^[A-Za-z]+[A-Za-z0-9-_'*`~&]+[.]{0,1}[A-Za-z0-9-_'*`~&]+[A-Za-z0-9]+@[a-z]+\.([a-z]{2,5}|[a-z]{2,5}[.]{0,1}[a-z]{2,5})$/.exec(manualData.email) === null) {
                vm.submitted = false;
                validation_message = 'Invalid  Email Id.';
                return false, validation_message;
            } else if(manualData.password !== manualData.cfnPassword) {
                vm.submitted = false;
                validation_message = 'Password don\'t match';
                return false, validation_message;
            }
                    
            return true;
        };

    });