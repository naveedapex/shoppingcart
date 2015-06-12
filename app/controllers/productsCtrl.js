/**
 * Created by naveed on 6/10/2015.
 */
var mongoose=require('mongoose'),
    Product=mongoose.model('Product');

exports.getProduct=function(req, res){
Product.findone({_id:req.query.productId}).exec(function(err,product){
    if(!product)
    {
        res.json(404,{msg:'Photo Not Found'});
    }
    else
    {
        res.json(product);
    }


})




};

exports.getProducts=function(req,res){

    Product.find().exec(function(err,products){

        if(!products){

            res.json(404,{msg:"photos not found"})
        }
        else{

            res.json(products);
        }



    })




}