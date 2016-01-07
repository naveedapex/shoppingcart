/**
 * Created by Developers on 11/27/2015.
 */
var app=angular.module('cart');

app.factory('Main', ['$http', '$localStorage','$q', function($http, $localStorage,$q){
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
                    debugger
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
]).run(['$rootScope', '$location','Main',
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

    }])
