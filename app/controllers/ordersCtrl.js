/**
 * Created by naveed on 6/10/2015.
 */
var mongoose=require('mongoose'),
    Order=mongoose.model('Order'),
    Customer=mongoose.model('Customer'),
    Address=mongoose.model('Address'),
    Billing=mongoose.model('Billing'),
    User=mongoose.model('User');
var ObjectId = mongoose.Types.ObjectId;

exports.getOrder=function(req,res){

    Order.findOne(function(err,order){
    if(!order)
    {

    res.json(404,{msg:'No Order Found'})
    }
    else{

        res.json(order);
    }

    })



};

exports.getOrders=function(req,res){
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            Order.find({userid: new ObjectId(user._id)}, function (err, order) {
                if (!order) {

                    res.json(404, {msg: 'No Order Found'})
                }
                else {

                    res.json(order);
                }

            })
        }

    })
};

exports.addOrder=function(req,res){

    var orderShipping= new Address(req.body.updatedShipping);
    var orderBilling=  new Billing (req.body.updatedBilling);
    var orderItems= req.body.orderItems;

    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            var newOrder= new Order({userid:new ObjectId(user._id), items:orderItems, shipping: orderShipping, billing: orderBilling})
            newOrder.save(function(err,results){

                if(err)
                {

                    res.json(500,{msg:'Failed to save Order'})
                }
                else{

                    Customer.update({userid:new ObjectId(user._id)},{$set:{cart:[]}}).
                        exec(function(err,results){
                            if(err || results<1){

                                res.json(404,{msg: 'Failed to update Cart'})
                            }
                            else {
                                res.json({msg: 'Order Saved'})

                            }


                        })
                }


            });


        }
    })






};