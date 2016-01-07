'use strict';

angular.module('cart', ['ngRoute','ngStorage','ngMessages'])

.config(['$routeProvider','$httpProvider','$locationProvider', function($routeProvider,$httpProvider,$locationProvider) {
       /* $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');*//**/

        $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.token) {
                        config.headers.Authorization =  $localStorage.token;
                    }
                    return config;
                }, response: function (response) {

                    if (response.status === 401) {

                        console.log("Response 401");

                    }

                    return response || $q.when(response);

                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/signin');
                    }
                    return $q.reject(response);
                }
            };
        }])


  $routeProvider.when('/cart', {
    templateUrl: '/static/cart.html',
      controller:'cartCtrl',
      controllerAs:'cart'

  }).when('/billing', {
      templateUrl: '/static/billing.html'

  }).when('/orders', {
          templateUrl: '/static/orders.html'

      })
      .when('/product', {
          templateUrl: '/static/product.html',
          controller: 'productCtrl',
          controllerAs:'productctrl'

      })
      .when('/products', {
          templateUrl: '/static/products.html',
          controller: 'productsCtrl',
          controllerAs:'productsctrl'

      })
      .when('/review', {
          templateUrl: '/static/review.html'

      })
      .when('/shipping', {
          templateUrl: '/static/shipping.html'

      })
      .when('/login', {
          templateUrl: '/static/login.html'
      })
      .when('/signup', {
          templateUrl: '/static/signup.html'

      }).otherwise({
          redirectTo: '/login'
      });

}])
