/**
 * Created by jsilva on 28/07/14.
 */
'use strict';

app.controller('LoginController', ['$scope', '$rootScope', '$location', 'loginService', 'AUTH_EVENTS', 'USER_ROLES',
    function($scope, $rootScope, $location, loginService, AUTH_EVENTS, USER_ROLES) {
        $scope.credentials = {
            username: '',
            password: ''
        };
        $scope.login = function (credentials) {
            loginService.login(credentials).then(function (user) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $rootScope.setCurrentUser(user);
                $location.path('/main');
            }, function () {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            });
        };

        $scope.$on(AUTH_EVENTS.notAuthenticated, function() {
            $location.path('/login');
        });

        $rootScope.currentUser = null;
        $rootScope.userRoles = USER_ROLES;
        $rootScope.isAuthorized = loginService.isAuthorized;

        $rootScope.setCurrentUser = function (user) {
            $rootScope.currentUser = user;
        };
        /*$scope.msgtxt = '';

        $scope.login = function (user) {
            loginService.login(user, $scope);
        };

        $scope.doLogin = function () {
            $location.path('/main');
        };*/
}]);