var mongoose=require('mongoose'),
    User=mongoose.model('User'),
    Customer=mongoose.model('Customer'),
jwt=require('jsonwebtoken'),
    app = require('express')();

exports.render = function(req, res) {
  //  var username=req.session&& req.session.currentUser? req.session.currentUser.username:null;
  //  res.render('index', {user:username});

 res.sendfile('shopping.html',{'root':__dirname + '/../../public'});
 //res.send(200);
};
exports.users=function(req,res){

User.find({},function(err,users){

res.json(users);

})

};
exports.authenticate=function(req, res) {

    // find the user
    User.findOne({
        name: req.body.name
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var token=req.app.get('superSecret');
                var token = jwt.sign(user, token, {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
};
exports.setup= function(req, res) {
var body=req.body;
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            } else {
                var userModel = new User();
                userModel.name = req.body.name;
                userModel.email=req.body.email;
                userModel.password = req.body.password;
                userModel.save(function (err, user) {
                    user.token = jwt.sign(user, req.app.get('superSecret'));
                    user.save(function (err, user1) {

                        var customer=new Customer();
                            customer.userid=user1._id;
                            customer.cart=[];
                            customer.shipping=[];
                            customer.billing=[];
                        customer.save(function(err,customer1){
                            res.json({
                                type: true,
                                data: user1,
                                token: user1.token
                            });
                        });


                        });



                })
            }
        }});
    // create a sample user
   /* var nick = new User({
        name: body.name,
        password: body.password,
        admin: true
    });

    // save the sample user
    nick.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });*/
};