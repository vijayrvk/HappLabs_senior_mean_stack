angular.module('app.uiroutes', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('mainCommon', {
                abstract: true,
                templateUrl: 'app/views/templates/main_template.html',
                controller: 'mainController as vm'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/views/pages/login.html',
                controller: 'authController as login'
            }).state('mainCommon.home', {
                url: '/home',
                templateUrl: 'app/views/pages/home.html',
                controller: 'homeController as vm'
            }).state('mainCommon.question', {
                url: '/question',
                templateUrl: 'app/views/pages/question.html',
                controller: 'quesController as vm'
            }).state('mainCommon.response', {
                url: '/response',
                templateUrl: 'app/views/pages/response.html',
                controller: 'resController as vm'
            });

    });