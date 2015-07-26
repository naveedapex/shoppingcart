
/*
 * GET home page.
 

exports.index = function(req, res){
  res.render('index');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};
*/
module.exports = function(app) {
var express=require('express');
    // Home route
    var index = require('../controllers/IndexCtrl'),
        products= require('../controllers/productsCtrl'),
        orders=require('../controllers/ordersCtrl'),
        customers=require('../controllers/customerCtrl'),
    jwt=require('jsonwebtoken'),
        mongoose=require('mongoose'),
        User=mongoose.model('User');

 /*   app.get('/products',products.getProducts)
    app.get('/orders',orders.getOrders);
    app.post('/orders',orders.addOrder);
    app.get('/customers',customers.getCustomer)
    app.get('/fill', customers.fillProducts)
   app.post('/customers/update/shipping',customers.updateShipping);
    app.post('/customers/update/billing',customers.updateBilling);
    app.post('/customers/update/cart',customers.updateCart);*/

    var apiRoutes = express.Router();
    apiRoutes.get('/',index.render);
    apiRoutes.post('/authenticate',index.authenticate)
    apiRoutes.post('/signup',index.setup)
    apiRoutes.get('/fill', customers.fillProducts);
    apiRoutes.post('/checkuser',index.checkuser)
    apiRoutes.use(function(req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['authorization'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.token = decoded.token || token;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                type: false,
                message: 'No token provided.'
            });

        }
    });
    apiRoutes.get('/customers',customers.getCustomer)
    apiRoutes.get('/me', index.me);
    apiRoutes.get('/products',products.getProducts);
    apiRoutes.get('/orders',orders.getOrders);
    apiRoutes.post('/orders',orders.addOrder);


    apiRoutes.post('/customers/update/shipping',customers.updateShipping);
    apiRoutes.post('/customers/update/billing',customers.updateBilling);
    apiRoutes.post('/customers/update/cart',customers.updateCart);
    app.use('/',apiRoutes);

    var Routes = express.Router();



// route middleware to verify a token
    Routes.use(function(req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });

    Routes.get('/users',index.users)
// apply the routes to our application with the prefix /api
    app.use('/api', Routes);

};