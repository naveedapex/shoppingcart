'use strict';

angular.module('cart', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cart', {
    templateUrl: '/cart/cart.html',
    controller: 'CartCtrl'
  });
}])

.controller('CartCtrl', ['$scope',function($scope) {

      $scope.months=[1,2,3,4,5,6,7,8,9,10,11,12];
      $scope.years=[2014,2015,2016,2017,2018,2019,2020];
      $http.get('/products')
          .success(function(data,status,headers,config){
            $scope.products=data;
            $scope.product=data[0];
          })
          .error(function(data,status,headers,config){
            $scope.products=[];

          })
      $http.get('/customers')
          .success(function(data,status,headers,config){
            $scope.customer=data;

          })
          .error(function(data,status,headers,config){
            $scope.customer=[];

          })

      $http.get('/orders')
          .success(function(data,status,headers,config){
            $scope.orders=data;

          })
          .error(function(data,status,headers,config){
            $scope.orders=[];

          })

}]);
