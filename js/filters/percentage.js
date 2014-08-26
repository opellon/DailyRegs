/**
 * Created by jsilva on 14/08/14.
 */
'use strict';

app.filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
        return $filter('number')(input * 100, decimals) + '%';
    };
}]);