'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('DailyRegs', ['ngRoute','ngMockE2E']);

app.config(['$routeProvider', 'USER_ROLES', function ($routeProvider, USER_ROLES) {
    $routeProvider.when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController',
        resolve: {
            authorizedRoles: function () {
                return [USER_ROLES.all, USER_ROLES.admin, USER_ROLES.guest];
            }
        }
    });
    $routeProvider.when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainController',
        resolve: {
            authorizedRoles: function () {
                return [USER_ROLES.admin];
            }
        }
    });
    $routeProvider.when('/ranking', {
        templateUrl: 'views/ranking.html',
        controller: 'RankingController',
        resolve: {
            authorizedRoles: function () {
                return [USER_ROLES.guest];
            }
        }
    });
    $routeProvider.otherwise({redirectTo: '/login'});
}]);

app.config(function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


app.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});

app.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    guest: 'guest'
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push([
        '$injector',
        function ($injector) {
            return $injector.get('AuthInterceptor');
        }
    ]);
});

app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
        responseError: function (response) {
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized,
                419: AUTH_EVENTS.sessionTimeout,
                440: AUTH_EVENTS.sessionTimeout
            }[response.status], response);
            return $q.reject(response);
        }
    };
});

app.run(function ($rootScope, AUTH_EVENTS, loginService) {
    $rootScope.$on('$routeChangeStart', function (event, next) {
        var authorizedRoles = next.resolve.authorizedRoles();
        if (!loginService.isAuthorized(authorizedRoles)) {
            event.preventDefault();
            if (loginService.isAuthenticated()) {
                // user is not allowed
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            } else {
                // user is not logged in
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
        }
    });
});

app.run(function ($httpBackend) {

    var authorized = false;
    $httpBackend.whenPOST('/login').respond(function(method, url, data) {
        if (jQuery.parseJSON(data).username == 'jsilva' && jQuery.parseJSON(data).password == '123'){
            authorized = true;
            var res = {id: 1, user: {id:'jsilva', role: 'admin'}};
            return [200, res];
        }
        else{
            authorized = false;
            return [401,'unauthorized'];
        }

    });
    $httpBackend.whenPOST('/logout').respond(function (method, url, data) {
        authorized = false;
        return [200];
    });
    //otherwise

    $httpBackend.whenGET(/.*/).passThrough();

});