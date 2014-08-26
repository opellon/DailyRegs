'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('DailyRegs', ['ngRoute','ngMockE2E']);

app.config(['$routeProvider', 'USER_ROLES', function ($routeProvider, USER_ROLES) {
    $routeProvider.when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
    });
    $routeProvider.when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainController',
        resolve: {
            'auth' : function (loginService) {
                return loginService.isAuthorized(USER_ROLES.all);
            }
        }
    });
    $routeProvider.when('/ranking', {
        templateUrl: 'views/ranking.html',
        controller: 'RankingController',
        resolve: {
            'auth' : function (loginService) {
                return loginService.isAuthorized(USER_ROLES.all);
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
    editor: 'editor',
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

app.factory('AuthInterceptor', function ($rootScope, $q,AUTH_EVENTS) {
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



app.run(function($httpBackend) {

    var authorized = false;
    $httpBackend.whenPOST('/login').respond(function(method, url, data) {
        if(jQuery.parseJSON(data).username == 'jsilva' && jQuery.parseJSON(data).password == '123'){
            authorized = true;
            var res = {id: 1, user: {id:'jsilva', role:'*'}};
            return [200, res];
        }
        else{
            authorized = false;
            return [401,'unauthorized'];
        }

    });
    $httpBackend.whenPOST('auth/logout').respond(function(method, url, data) {
        authorized = false;
        return [200];
    });


    $httpBackend.whenPOST('data/public').respond(function(method, url, data) {
        return [200,'I have received and processed your data [' + data + '].'];
    });
    $httpBackend.whenPOST('data/protected').respond(function(method, url, data) {
        return authorized ? [200,'This is confidential [' + data + '].'] : [401];
    });

    //otherwise

    $httpBackend.whenGET(/.*/).passThrough();

});