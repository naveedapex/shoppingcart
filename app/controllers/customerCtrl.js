
var mongoose=require('mongoose'),
    Order=mongoose.model('Order'),
    Customer=mongoose.model('Customer'),
    Address=mongoose.model('Address'),
    Billing=mongoose.model('Billing');

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
    var newShipping=new Address(req.body.updateShipping);

    Customer.update({userid:'customerA'},{$set:[newShipping.toObject()]})
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