'use strict';

angular.module('cart', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cart', {
    templateUrl: '/static/cart.html',
    controller: 'CartCtrl'
  }).when('/billing', {
      templateUrl: '/static/billing.html',
      controller: 'CartCtrl'
  }).when('/orders', {
          templateUrl: '/static/orders.html',
          controller: 'CartCtrl'
      })
      .when('/product', {
          templateUrl: '/static/product.html',
          controller: 'CartCtrl'
      })
      .when('/products', {
          templateUrl: '/static/products.html',
          controller: 'CartCtrl'
      })
      .when('/review', {
          templateUrl: '/static/review.html',
          controller: 'CartCtrl'
      })
      .when('/shipping', {
          templateUrl: '/static/shipping.html',
          controller: 'CartCtrl'
      })
}])

.controller('CartCtrl', ['$scope', '$http', '$window','$location',function($scope, $http, $window,$location) {

      $scope.months=[1,2,3,4,5,6,7,8,9,10,11,12];
      $scope.years=[2014,2015,2016,2017,2018,2019,2020];
        $scope.content = '/static/products.html';
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

        $scope.setContent=function(filename){
         //   $scope.content='/static/'+filename;
            $location.path('/'+filename)
        }

        $scope.setProduct=function(productId){
            $scope.product=this.product;
            $location.path('/product')
          //  $scope.content = '/static/product.html';
        }

        $scope.cartTotal=function(){
            var total=0;
            for(var i=0; i<$scope.customer.cart.length;i++){
                var item= $scope.customer.cart[i];
                total +=item.quantity * item.product[0].price;

            }
            $scope.shipping=total*0.05;
            return total+$scope.shipping;
        }

        $scope.addToCart=function(productId){
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
        }

        $scope.deleteFromCart=function(productId){

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
}]);
