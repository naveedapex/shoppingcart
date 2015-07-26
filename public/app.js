'use strict';


angular.module('shoppingCart', [
    'ngRoute',
    'cart'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/login'
    });
}]);
