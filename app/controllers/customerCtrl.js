
var mongoose=require('mongoose'),
    Order=mongoose.model('Order'),
    Customer=mongoose.model('Customer'),
    Address=mongoose.model('Address'),
    Billing=mongoose.model('Billing'),
 Product = mongoose.model('Product');
 ProductQuantity = mongoose.model('ProductQuantity');

function addProduct(customer, order, name, imagefile,
                    price, description, instock){
    var product = new Product({name:name, imageFile:imagefile,
        price:price, description:description,
        instock:instock});
    product.save(function(err, results){
        order.items.push(new ProductQuantity({quantity: 1,
            product: [product]}));
        order.save();
        customer.save();
        console.log("Product " + name + " Saved.");
    });
}

exports.fillProducts=function(req, res){
    Product.remove().exec(function(){
        Order.remove().exec(function(){
            Customer.remove().exec(function(){
                var shipping = new Address({
                    name: 'Customer A',
                    address: 'Somewhere',
                    city: 'My Town',
                    state: 'CA',
                    zip: '55555'
                });
                var billing = new Billing({
                    cardtype: 'Visa',
                    name: 'Customer A',
                    number: '1234567890',
                    expiremonth: 1,
                    expireyear: 2020,
                    address: shipping
                });
                var customer = new Customer({
                    userid: 'customerA',
                    shipping: shipping,
                    billing: billing,
                    cart: []
                });
                customer.save(function(err, result){
                    var order = new Order({
                        userid: customer.userid,
                        items: [],
                        shipping: customer.shipping,
                        billing: customer.billing
                    });
                    order.save(function(err, result){
                        addProduct(customer, order, 'Delicate Arch Print',
                            'arch.png', 12.34,
                            'View of the breathtaking Delicate Arch in Utah',
                            Math.floor((Math.random()*10)+1));
                        addProduct(customer, order, 'Volcano Print',
                            'volcano.png', 45.45,
                            'View of a tropical lake backset by a volcano',
                            Math.floor((Math.random()*10)+1));
                        addProduct(customer, order, 'Tikal Structure Print',
                            'pyramid.png', 38.52,
                            'Look at the amazing architecture of early America.',
                            Math.floor((Math.random()*10)+1));
                        addProduct(customer, order, 'Glacial Lake Print',
                            'lake.png', 77.45,
                            'Vivid color, crystal clear water from glacial runoff.',
                            Math.floor((Math.random()*10)+1));
                    });
                });
            });
        });
    });;
    res.send(200);
}

exports.getCustomer=function(req, res){
    Customer.findOne({userid:'customerA'}).
        exec(function(err,customer){
            if(!customer){
                res.json(404,{msg: 'Customer not found'});
            }
            else
            {
                res.json(customer);

            }
        })

}


exports.updateShipping=function(req,res){
    var newShipping=new Address(req.body.updatedShipping);

    Customer.update({userid:'customerA'},{$set:{shipping:[ newShipping.toObject()]}})
        .exec(function(err,results){
            if(err || results < 1){
                res.json(404,{msg: 'Failed to update Shipping'})
            }
            else
            {
                res.json({msg:'Customer Shipping updated'})

            }


        })
}

exports.updateBilling=function(req,res){

    var newBilling=new Billing(req.body.updatedBilling);

    Customer.update({userid:'customerA'},{$set:{billing:[newBilling.toObject()]}})
        .exec(function(err, results){
            if(err || results<1){

                res.json(404,{msg: 'failed to update Billing'});
            }
            else
            {
                res.json({msg: 'Customer Billing Updated'});
            }

       })
}

exports.updateCart=function(req,res){
    Customer.update({userid:'customerA'},{$set:{cart:req.body.updatedCart}})
        .exec(function(err,results){
            if(err || results<1){

                res.json(404,{msg:'Failed to update cart.'})


            }
            else
            {
                res.json({msg:'Failed to update cart.'})

            }

        })


}