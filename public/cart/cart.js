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
      controller:function($scope,Main){
          $scope.customer=Main.customer()

          $scope.cartTotal=function(){
              var total=0;
              for(var i=0; i<Main.customer().cart.length;i++){
                  var item= Main.customer().cart[i];
                  total +=item.quantity * item.product[0].price;

              }
              $scope.shipping=total*0.05;
              return total+$scope.shipping;
          }
      }

  }).when('/billing', {
      templateUrl: '/static/billing.html'

  }).when('/orders', {
          templateUrl: '/static/orders.html'

      })
      .when('/product', {
          templateUrl: '/static/product.html',
          controller: function($scope,$http,$location,Main){
              Main.fetchCustomer();
              /*$http.get('/customers')
                  .success(function(data,status,headers,config){
                      $scope.customer=data;

                  })
                  .error(function(data,status,headers,config){
                      $scope.customer=[];

                  })*/
              $scope.addToCart=function(productId){
                  var found=false;
                  for(var i=0;i<Main.customer().cart.length;i++){
                      var item= Main.customer().cart[i];
                      if(item.product[0]._id==productId){
                          item.quantity +=1;
                          found=true;
                      }
                  }
                  if(!found){
                      Main.customer().cart.push({quantity:1, product:[this.product]})

                  }
                  $http.post('/customers/update/cart',{updatedCart:Main.customer().cart})
                      .success(function(data,status,headers,config){
                          $scope.content='/static/cart.html'
                          $location.path('/cart')
                      })
                      .error(function(data,status,headers,config){
                          $window.alert(data);
                      })
              }


          }

      })
      .when('/products', {
          templateUrl: '/static/products.html',
          controller: function($scope,Main,$http){
            console.log("products ctrl calling");
              $http.get('/products')
               .success(function(data,status,headers,config){

               $scope.products=data;
               $scope.product=data[0];
               })
               .error(function(data,status,headers,config){
               $scope.products=[];

               })
              console.log("calling in products");




				  
        }

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

}]).
run(['$rootScope', '$location','Main',
    function ($rootScope, $location,Main) {
console.log("run");
        //Client-side security. Server-side framework MUST add it's
        //own security as well since client-based “security” is easily hacked
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if (next && next.$$route && next.$$route.regexp.test('/login')) {
                Main.isAuthenticated(function(auth){

                    if(auth.type)
                        $location.path('/products');
                    else
                        $location.path('/login');

                });


            }
            //Look at the next parameter value to determine if a redirect is needed
        });

    }]).factory('Main', ['$http', '$localStorage','$q', function($http, $localStorage,$q){
        var baseUrl = "your_service_url";
        var customer=null;
        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

   //     var currentUser = getUserFromToken();

        return {
            save: function(data, success, error) {
                $http.post('/signup', data)
                    .success(success)
                    .error(error)
            },
            signin: function(data, success, error) {
                $http.post('/authenticate', data)
                    .success(success)
                    .error(error)

            },
            me: function(success, error) {
                $http.get('/me')
                    .success(success)
                    .error(error)
            },
            logout: function(success) {
          //      changeUser({});
                var local=$localStorage.token;
                delete $localStorage.token;
                success();
            },
            isAuthenticated: function(cb){

                $http.get('/me').success(function(res){
                   cb(res)
                }).error(function(err){

                  cb(err)
                })

            },
            fetchCustomer: function(){

                $http.get('/customers')
                    .success(function(data,status,headers,config){
                        customer=data;

                    })
                    .error(function(data,status,headers,config){
                        customer=[];

                    })

            },
            customer: function(){

             return customer;

            }

        };
    }
    ])
.controller('CartCtrl', ['$scope', '$http', '$window','$location','$localStorage', 'Main',function($scope, $http, $window,$location,$localStorage, Main) {

      $scope.months=[1,2,3,4,5,6,7,8,9,10,11,12];
      $scope.years=[2014,2015,2016,2017,2018,2019,2020];
        $scope.content = '/static/products.html';

 /*     $http.get('/products')
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

          })*/
        $scope.setContent=function(filename){
         //   $scope.content='/static/'+filename;
            $location.path('/'+filename)
        }

        $scope.setProduct=function(productId){
            $scope.product=this.product;
            $location.path('/product')
          //  $scope.content = '/static/product.html';
        }

        /*$scope.cartTotal=function(){
            var total=0;
            for(var i=0; i<$scope.customer.cart.length;i++){
                var item= $scope.customer.cart[i];
                total +=item.quantity * item.product[0].price;

            }
            $scope.shipping=total*0.05;
            return total+$scope.shipping;
        }*/

      /* $scope.addToCart=function(productId){
            var found=false;
            for(var i=0;i<$scope.customer.cart.length;i++){
                var item= $scope.customer.cart[i];
                if(item.product[0]._id==productId){
                    item.quantity +=1;
                    found=true;
                }
            }
            if(!found){
                $scope.customer.cart.push({quantity:1, product:[this.product]})

            }
            $http.post('/customers/update/cart',{updatedCart:$scope.customer.cart})
                .success(function(data,status,headers,config){
                    $scope.content='/static/cart.html'
                    $location.path('/cart')
                })
                .error(function(data,status,headers,config){
               $window.alert(data);
                })
        }*/

        $scope.deleteFromCart=function(productId){
            $scope.customer=Main.customer()
            for(var i=0;$scope.customer.cart.length;i++){
                var item= $scope.customer.cart[i];
                if(item.product[0]._id==productId){
                   $scope.customer.cart.splice(i,1);
                    break;
                }
            }
            $http.post('/customers/update/cart',{updatedCart:$scope.customer.cart})
                .success(function(data,status,headers,config){
               //     $scope.content='/static/cart.html'
                    $location.path('/cart')
                })
                .error(function(data,status,headers,config){
                    $window.alert(data);
                })
        }

        $scope.checkout=function(){
            $scope.customer=Main.customer()
            $http.post('/customers/update/cart',{updatedCart:$scope.customer.cart})
                .success(function(data,status,headers,config){
                  //  $scope.content='/static/shipping.html'
                    $location.path('/shipping')
                })
                .error(function(data,status,headers,config){
                    $window.alert(data);
                })


        }

        $scope.setShipping=function(){
            $scope.customer=Main.customer()
            $http.post('/customers/update/shipping',{updatedShipping:$scope.customer.shipping[0]})
                .success(function(data,status,headers,config){
                //    $scope.content='/static/billing.html'
                    $location.path('/billing')
                })
                .error(function(data,status,headers,config){
                    $window.alert(data);
                })
        }

        $scope.verifyBilling=function(ccv){
            $scope.ccv=ccv;
            $scope.customer=Main.customer()

            $http.post('/customers/update/billing',{updatedCart:$scope.customer.shipping[0], ccv:ccv})
                .success(function(data,status,headers,config){
                  //  $scope.content='/static/review.html'
                    $location.path('/review')
                })
                .error(function(data,status,headers,config){
                    $window.alert(data);
                })


        }


        $scope.makePurchase=function(){
            $scope.customer=Main.customer()
            $http.post('/orders',
                {orderBilling:$scope.customer.billing[0],
                    orderShipping:$scope.customer.shipping[0],
                orderItems: $scope.customer.cart
                })
                .success(function(data,status,headers,config){
                    $scope.customer.cart=[];
                   $http.get('/orders').success(function(data,status,headers,config){
                       $scope.orders=data;
                     //  $scope.content='/static/orders.html';
                       $location.path('/orders')
                   }).error(function(data,status,headers,config){
                        $scope.orders=[];
                   })

                })
                .error(function(data,status,headers,config){
                    $window.alert(data);
                })


        }
        $scope.credentials={};
        $scope.data={};
        console.log("ctrl calling");
		
		if($scope.myForm)
		{
		if(myForm.name.$$touched)
			$scope.loginerror="";
		}
        $scope.signin = function() {
            if($scope.$$childHead.myForm)
		{
		$scope.myForm=$scope.$$childHead.myForm;
		}
            var formData = {
                email: $scope.credentials.email,
                password: $scope.credentials.password
            }
            // console.log($scope.myForm);

            Main.signin(formData, function(res,status,headers,config) {
                console.log(res);
                if (!res.success) {
                    $scope.loginerror = "username/password is incorrect"
                } else {
                    $localStorage.token = res.token;
                    $location.path('#/products')
                }
            }, function(data,status,headers,config) {
                $scope.loginerror = true
            })
        };
        console.log($scope.myForm);
        $scope.signup = function() {
            var formData = {
                name: $scope.credentials.name,
                email:$scope.credentials.email,
                password: $scope.credentials.password
            }

            Main.save(formData, function(res) {
                if (res.type == false) {
                    alert(res.data)
                } else {
                    $localStorage.token = res.data.token;
                    $location.path('/products')
                }
            }, function() {
                $rootScope.error = 'Failed to signup';
            })
        };

        $scope.me = function() {
            Main.me(function(res) {
                $scope.myDetails = res;
            }, function() {
                $rootScope.error = 'Failed to fetch details';
            })
        };

        $scope.logout = function() {
            Main.logout(function() {
                var aa=$scope.$storage;
                delete $scope.$storage.x;

            $location.path("/");
            }, function() {
                alert("Failed to logout!");
            });
        };
        $scope.$storage=$localStorage.$default({
            x: 42
        });
        $scope.$storage.token = $localStorage.token;
}]);
