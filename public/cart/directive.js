/**
 * Created by Developers on 11/27/2015.
 */
var app=angular.module('cart');

app.directive('usernameValidator', function($q, $timeout,$http) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.username = function(modelValue, viewValue) {
                return $http.post('/checkuser', {email: viewValue}).then(
                    function(response) {
                        if (!response.data.type) {
                            return $q.reject(response.data.errorMessage);
                        }
                        return true;
                    }
                );
            };
        }
    };
});