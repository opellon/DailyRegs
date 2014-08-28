/**
 * Created by jsilva on 31/07/14.
 */
'use strict';

app.factory('DataService', ['$q', '$http', function ($q, $http) {
    return {
        getAppData: function () {
            var d = $q.defer();
            $http.get('data/dataPackage.json')
                .success(function (data) {
                    d.resolve(data);
                })
                .error(function (reason) {
                    d.reject(reason);
                });
            return d.promise;
        }
    };
}]);