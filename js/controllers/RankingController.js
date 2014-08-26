/**
 * Created by jsilva on 18/08/14.
 */
'use strict';

app.controller('RankingController', ['$scope', 'DataService', function ($scope, DataService) {
    $scope.data = null;
    $scope.BrandsData = null;

    $scope.selectedChannel = '-';
    $scope.channels = [];
    $scope.selectedGeography = '-';
    $scope.geography = [];
    $scope.selectedBrand = '-';
    $scope.brands = [];
    $scope.updateDate = null;

    DataService.getAppData()
        .then(function (data) {
            $scope.data = data;
            $scope.BrandsData = data.BrandsData;
            $scope.fillFilters();
        });

    $scope.fillFilters = function () {

        var year = jsonPath.eval($scope.data, "$.Date").toString().substring(0,4);
        var month = jsonPath.eval($scope.data, "$.Date").toString().substring(4,6);
        var day = jsonPath.eval($scope.data, "$.Date").toString().substring(6,8);
        $scope.updateDate = new Date(year, month - 1, day);

        var channels = jsonPath.eval($scope.data, "$..C");
        $.each(channels.sort(), function(i, el){
            if($.inArray(el, $scope.channels) === -1) $scope.channels.push(el);
        });

        var geography = jsonPath.eval($scope.data, "$..G");
        $.each(geography.sort(), function(i, el){
            if($.inArray(el, $scope.geography) === -1) $scope.geography.push(el);
        });

        var brands = jsonPath.eval($scope.data, "$..B");
        $.each(brands.sort(), function(i, el){
            if($.inArray(el, $scope.brands) === -1) $scope.brands.push(el);
        });

        $scope.selectedChannel = $scope.channels[0];
        $scope.selectedGeography = $scope.geography[1];
        $scope.selectedBrand = $scope.brands[0];
        $scope.applyFilter();
    };

    $scope.applyFilter = function () {

        $scope.BrandsData = jsonPath.eval($scope.data, "$..BrandsData[?(@.C=='" + $scope.selectedChannel + "'&&@.G=='" + $scope.selectedGeography + "')]");

    };

    $scope.highlightBrand = function (text) {
        if($scope.selectedBrand==text){
            return 'selectedRow';
        }
    };

}]);