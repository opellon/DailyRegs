/**
 * Created by jsilva on 28/07/14.
 */
'use strict';

app.controller('MainController', ['$scope', 'DataService', function ($scope, DataService) {
    $scope.data = null;

    $scope.selectedChannel = '-';
    $scope.channels = [];
    $scope.selectedGeography = '-';
    $scope.geography = [];
    $scope.selectedBrand = '-';
    $scope.brands = [];
    $scope.updateDate = null;

    $scope.kpi1 = {
        kpi11: '-',
        kpi12: '-',
        kpi13: '-'
    };

    $scope.kpi2 = {
        kpi21: '-',
        kpi22: '-',
        kpi23: '-'
    };

    $scope.kpi3 = {
        kpi31: '-',
        kpi32: '-',
        kpi33: '-',
        kpi34: '-'
    };

    $scope.kpi4 = {
        kpi41: '-',
        kpi42: '-',
        kpi43: '-',
        kpi44: '-'
    };

    DataService.getAppData()
        .then(function (data) {
            $scope.data = data;

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

        var kpi1and2 = jsonPath.eval($scope.data, "$..CommonData[?(@.C=='" + $scope.selectedChannel + "'&&@.G=='" + $scope.selectedGeography + "')]");
        var kpi3and4 = jsonPath.eval($scope.data, "$..BrandsData[?(@.C=='" + $scope.selectedChannel + "'&&@.G=='" + $scope.selectedGeography + "'&&@.B=='" + $scope.selectedBrand + "')]");

        $scope.kpi1.kpi11 = kpi1and2[0].K11;
        $scope.kpi1.kpi12 = kpi1and2[0].K12;
        $scope.kpi1.kpi13 = kpi1and2[0].K13;

        $scope.kpi2.kpi21 = kpi1and2[0].K21;
        $scope.kpi2.kpi22 = kpi1and2[0].K22;
        $scope.kpi2.kpi23 = kpi1and2[0].K23;

        $scope.kpi3.kpi31 = kpi3and4[0].K31;
        $scope.kpi3.kpi32 = kpi3and4[0].K32;
        $scope.kpi3.kpi33 = kpi3and4[0].K33;
        $scope.kpi3.kpi34 = kpi3and4[0].K34;

        $scope.kpi4.kpi41 = kpi3and4[0].K41;
        $scope.kpi4.kpi42 = kpi3and4[0].K42;
        $scope.kpi4.kpi43 = kpi3and4[0].K43;
        $scope.kpi4.kpi44 = kpi3and4[0].K44;
    };

    $scope.applyArrow = function (value) {
        if(value >= 0){
            return 'glyphicon-circle-arrow-up green';
        }
        else if(value < 0){
            return 'glyphicon-circle-arrow-down red';
        }
    }

    $scope.applyColor = function (value) {
        if(value > 0){
            return 'green';
        }
        else if(value < 0){
            return 'red';
        }
        else if(value = 0){
            return '';
        }
    }
}]);