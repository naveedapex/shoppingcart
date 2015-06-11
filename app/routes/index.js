
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

    // Home route
    var index = require('../controllers/IndexCtrl'),
        products= require('../controllers/productsCtrl'),
        orders=require('../controllers/ordersCtrl'),
        customers=require('../controllers/customerCtrl');

     app.get('/',index.render);
    app.get('/products',products)
    app.get('/orders',orders);
    app.post('/orders',orders);
    app.get('/customers',customers)
    app.post('/customers/update/shipping',customers.updateShipping);
    app.post('/customers/update/billing',customers.updateBilling);
    app.post('/customers/update/cart',customers.updateCart);

};