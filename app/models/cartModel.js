/**
 * Created by naveed on 6/10/2015.
 */
var mongoose=require('mongoose'),Schema=mongoose.Schema;

var addressSchema= new Schema({
    name: String,
    address: String,
    city: String,
    state: String,
    zip: String
},{ _id: false });

mongoose.model('Address',addressSchema);

var billingSchema = new Schema({
    cardtype: {type: String, enum: ['Visa','MasterCard','Amex']},
        name: String,
        number: String,
        expiremonth: Number,
        expireyear: Number,
        address: [addressSchema]
    },{_id:false});
mongoose.model('Billing',billingSchema);

var productSchema =new Schema({
    name: String,
    imageFile: String,
    description: String,
    price:Number,
    inStock:Number
});

mongoose.model('Product',productSchema);

var productQuantitySchema = new Schema({
    quantity: Number,
    product: [productSchema]
},{_id:false});
mongoose.model('ProductQuantity',productQuantitySchema);

var orderSchema = new Schema({
    userid:String,
    items:[productQuantitySchema],
    shipping:[addressSchema],
    billing: [billingSchema],
    status: {type: String, default: 'Pending'},
    timestamp: {type: Date, default: Date.Now}
});

mongoose.model('Order',orderSchema);

var customerSchema= new Schema({
    userid: {type: Schema.ObjectId, ref: 'User', unique: true, required: true},
    shipping: [addressSchema],
    billing: [billingSchema],
    cart: [productQuantitySchema]
});

mongoose.model('Customer',customerSchema);

var userSchema = new Schema({
    name:String,
    email:String,
    password: String,
    token: String
});

mongoose.model('User',userSchema);