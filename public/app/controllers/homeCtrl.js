angular.module('homeCtrl', ['toaster'])
    .controller('homeController', function($scope, $rootScope, $location, $state, Auth, LocalStorage, toaster, $timeout, User) {
        var vm = this;
        var userId = LocalStorage.getUserId();
        vm.showOption = false;
        vm.answered = false;

        User.getAnswers(userId).then(function(res) {
            if(res.data.answers.length > 0) {
                vm.answers = res.data.answers;
                vm.answered = true;
            }            
        });

        vm.catergories = [{
            title: 'Sports',
            value: 'sport'
        }, {
            title: 'Movies',
            value: 'movie'
        }, {
            title: 'Gadgets',
            value: 'gadget'
        }];

        vm.getQuestion = function() {
            User.getQuestion(vm.filter.catergory).then(function(res) {
                vm.questions = res.data;
                $scope.figureOutQuesToDisplay();
            });
        }

        $scope.filteredQues = [];
        $scope.itemsPerPage = 5;
        $scope.currentPage = 1;

        $scope.figureOutQuesToDisplay = function() {
            var pagedData = vm.questions.slice(
                ($scope.currentPage - 1) * $scope.itemsPerPage,
                $scope.currentPage * $scope.itemsPerPage
              );
              $scope.filteredQues = pagedData;
        };

        vm.createAnswer = function(){
            vm.questions[0].userId = userId;
            User.createAnswers(vm.questions).then(function(res){
                if(res.data.success) {
                    toaster.pop('success', res.data.message);
                    vm.showOption = true;
                } else {
                    toaster.pop('error', 'Something went wrong');
                }
            });
        }
        

        $scope.pageChanged = function() {
            $scope.figureOutQuesToDisplay();
        };


    }).controller('quesController', function($scope, toaster, User) {
        var vm = this;

        vm.question = [{}]
        vm.addQuesRow = function(index) {
            vm.question.push({});
        };

        vm.removeQuesRow = function(index) {
            if (vm.question.length > 1) {
                vm.question.splice(index, 1);
            }
        };

        vm.catergories = [{
            title: 'Sports',
            value: 'sport'
        }, {
            title: 'Movies',
            value: 'movie'
        }, {
            title: 'Gadgets',
            value: 'gadget'
        }];

        vm.createBulkQues = function() {
            var validQues = $scope.validation(vm.question);
            if(validQues === true) {
                User.createBulkQues(vm.question).then(function(res) {
                    if(res.data.success) {
                        toaster.pop('success', res.data.message);
                        vm.question = [{}]
                    } else {
                        toaster.pop('error', res.data.message);
                    }
                });
            } else {
                toaster.pop('error', validQues);
            }       
        };

        $scope.validation = function(questions) {
            var validation_message = '';
            for (var i = 0; i < questions.length; i++) {
                if (!questions[i].question || !questions[i].category || !questions[i].value) {
                    validation_message = 'Please Fill All Mandatory Fields'; 
                    return false, validation_message;
                } else {
                    if(!questions[i].value.option1 || !questions[i].value.option2 || !questions[i].value.option3) {
                        validation_message = 'Please Fill Option'; 
                        return false, validation_message;
                    }
                }
            }
            return true;
        };

    }).controller('resController', function($scope, $rootScope, $location, $state, Auth, LocalStorage, toaster, $timeout, User) {
        var vm = this;
        var userId = LocalStorage.getUserId();

        User.getAllResponse().then(function(res){
            vm.users = res.data.users
        });

        vm.viewResponse = function(id) {
            User.getAnswers(id).then(function(res) {
                vm.answers = res.data.answers;
                $('#manual_update_modal').modal('show');
            });
        };

        vm.makeAdmin = function(id) {
            User.updateAdmin(id).then(function(res) {
                if(res.data.success) {
                    toaster.pop('success', res.data.message);
                } else {
                    toaster.pop('error', 'Something went wrong');
                }
            });
        };

        vm.closeModal = function() {
            $('#manual_update_modal').modal('hide');
        }

    });