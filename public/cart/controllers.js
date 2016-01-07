/**
 * Created by Developers on 11/27/2015.
 */

var app=angular.module('cart');
app.controller('cartCtrl',function(Main){
    var vm=this;
    vm.customer=Main.customer()

    vm.cartTotal=function(){
        var total=0;
        for(var i=0; i<Main.customer().cart.length;i++){
            var item= Main.customer().cart[i];
            total +=item.quantity * item.product[0].price;

        }
        vm.shipping=total*0.05;
        return total+vm.shipping;
    }
});
app.controller('productCtrl',function($http,$location,Main){
        var vm=this;
    Main.fetchCustomer();
    vm.addToCart=function(product){

        var zoom = detectZoom.zoom();
        var device = detectZoom.device();

        console.log(zoom, device);
        var found=false;
        for(var i=0;i<Main.customer().cart.length;i++){
            var item= Main.customer().cart[i];
            if(item.product[0] && item.product[0]._id==product._id){
                item.quantity +=1;
                found=true;
            }
        }
        if(!found){
            Main.customer().cart.push({quantity:1, product:[product]})

        }
        $http.post('/customers/update/cart',{updatedCart:Main.customer().cart})
            .success(function(data,status,headers,config){
                vm.content='/static/cart.html'
                $location.path('/cart')
            })
            .error(function(data,status,headers,config){
                $window.alert(data);
            })
    }


}

);

app.controller('productsCtrl',function(Main,$http){
    var vm=this;
    console.log("products ctrl calling");
    $http.get('/products')
        .success(function(data,status,headers,config){

            vm.products=data;
            vm.product=data[0];
        })
        .error(function(data,status,headers,config){
            vm.products=[];

        })
    console.log("calling in products");
})

app.controller('CartCtrl', ['$http', '$window','$location','$localStorage', 'Main',function( $http, $window,$location,$localStorage, Main) {
    var vm=this;
    vm.months=[1,2,3,4,5,6,7,8,9,10,11,12];
    vm.years=[2014,2015,2016,2017,2018,2019,2020];
    vm.content = '/static/products.html';

    vm.setContent=function(filename){
        //   vm.content='/static/'+filename;
        $location.path('/'+filename)
    }

    vm.setProduct=function(product){
        vm.product=product;
        $location.path('/product')
        //  vm.content = '/static/product.html';
    }

    vm.deleteFromCart=function(productId){
        vm.customer=Main.customer()
        for(var i=0;vm.customer.cart.length;i++){
            var item= vm.customer.cart[i];
            if(item.product[0]._id==productId){
                vm.customer.cart.splice(i,1);
                break;
            }
        }
        $http.post('/customers/update/cart',{updatedCart:vm.customer.cart})
            .success(function(data,status,headers,config){
                //     vm.content='/static/cart.html'
                $location.path('/cart')
            })
            .error(function(data,status,headers,config){
                $window.alert(data);
            })
    }

    vm.checkout=function(){
        vm.customer=Main.customer()
        $http.post('/customers/update/cart',{updatedCart:vm.customer.cart})
            .success(function(data,status,headers,config){
                //  vm.content='/static/shipping.html'
                $location.path('/shipping')
            })
            .error(function(data,status,headers,config){
                $window.alert(data);
            })


    }

    vm.setShipping=function(){
        vm.customer=Main.customer()
        $http.post('/customers/update/shipping',{updatedShipping:vm.customer.shipping[0]})
            .success(function(data,status,headers,config){
                //    vm.content='/static/billing.html'
                $location.path('/billing')
            })
            .error(function(data,status,headers,config){
                $window.alert(data);
            })
    }

    vm.verifyBilling=function(ccv){
        vm.ccv=ccv;
        vm.customer=Main.customer()

        $http.post('/customers/update/billing',{updatedCart:vm.customer.shipping[0], ccv:ccv})
            .success(function(data,status,headers,config){
                //  vm.content='/static/review.html'
                $location.path('/review')
            })
            .error(function(data,status,headers,config){
                $window.alert(data);
            })


    }


    vm.makePurchase=function(){
        vm.customer=Main.customer()
        $http.post('/orders',
            {orderBilling:vm.customer.billing[0],
                orderShipping:vm.customer.shipping[0],
                orderItems: vm.customer.cart
            })
            .success(function(data,status,headers,config){
                vm.customer.cart=[];
                $http.get('/orders').success(function(data,status,headers,config){
                    vm.orders=data;
                    //  vm.content='/static/orders.html';
                    $location.path('/orders')
                }).error(function(data,status,headers,config){
                    vm.orders=[];
                })

            })
            .error(function(data,status,headers,config){
                $window.alert(data);
            })


    }
    vm.credentials={};
    vm.data={};
    console.log("ctrl calling");

    if(vm.myForm)
    {
        if(myForm.name.$$touched)
            vm.loginerror="";
    }
    vm.signin = function() {
/*        if(vm.$$childHead.myForm)
        {
            vm.myForm=vm.$$childHead.myForm;
        }
        */var formData = {
            email: vm.credentials.email,
            password: vm.credentials.password
        }
        // console.log(vm.myForm);

        Main.signin(formData, function(res,status,headers,config) {
            console.log(res);
            if (!res.success) {
                vm.loginerror = "username/password is incorrect"
            } else {
                $localStorage.token = res.token;
                $location.path('#/products')
            }
        }, function(data,status,headers,config) {
            vm.loginerror = true
        })
    };
    console.log(vm.myForm);
    vm.signup = function() {
        var formData = {
            name: vm.credentials.name,
            email:vm.credentials.email,
            password: vm.credentials.password
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

    vm.me = function() {
        Main.me(function(res) {
            vm.myDetails = res;
        }, function() {
            $rootScope.error = 'Failed to fetch details';
        })
    };

    vm.logout = function() {
        Main.logout(function() {
            var aa=vm.$storage;
            delete vm.$storage.x;

            $location.path("/");
        }, function() {
            alert("Failed to logout!");
        });
    };
    vm.$storage=$localStorage.$default({
        x: 42
    });
    vm.$storage.token = $localStorage.token;
}])
