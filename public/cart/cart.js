'use strict';

angular.module('cart', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cart', {
    templateUrl: '/cart/cart.html',
    controller: 'CartCtrl'
  });
}])

.controller('CartCtrl', [function() {
    
}]);
