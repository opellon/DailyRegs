/**
 * Created by jsilva on 28/07/14.
 */
'use strict';

app.factory('loginService', function ($q, $http, Session) {
    var authService = {};

    authService.login = function (credentials) {
        return $http
            .post('/login', credentials)
            .then(function (res) {
                Session.create(res.data.id, res.data.user.id, res.data.user.role);
                return res.data.user;
            });
    };

    authService.isAuthenticated = function () {
        return !!Session.userId;
    };

    authService.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        if (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1) {
            return authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1;
        }
        else {
            return $q.reject('Not Authenticated');
        }
    };

    return authService;
    /*return{
        *//*login: function (user, scope) {
         $http.post('http://localhost:8888/DailyRegsService/user.php', user)
         .then(function (msg) {
         console.log(msg.data);
         if (msg.data == 'success') {
         scope.msgtxt = 'Logged in!!!';
         scope.doLogin();
         }
         else {
         scope.msgtxt = 'Error, check your credentials';
         }
         });
         }*//*
        login: function (user, scope) {
            $http.post('auth/login', user)
                .then(function (msg) {
                    console.log(msg.data);
                    if (msg.data == 'success') {
                        scope.msgtxt = 'Logged in!!!';
                        scope.doLogin();
                    }
                    else {
                        scope.msgtxt = 'Error, check your credentials';
                    }
                });
        }
    };*/

});

app.service('Session', function () {
    this.create = function (sessionId, userId, userRole) {
        this.id = sessionId;
        this.userId = userId;
        this.userRole = userRole;
    };
    this.destroy = function () {
        this.id = null;
        this.userId = null;
        this.userRole = null;
    };
    return this;
})
