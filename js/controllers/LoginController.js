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
                $scope.setCurrentUser(user);
            }, function () {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            });
        };

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