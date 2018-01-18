const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const customerSchema = require('../models/customer-model');
const Customer = mongoose.model('Customers', customerSchema);
const productSchema = require('../models/product-model');
const Product = mongoose.model('Products', productSchema);
const categorySchema = require('../models/category-model');
const Category = mongoose.model('Categories', categorySchema);
const cartSchema = require('../models/cart-model');
const Cart = mongoose.model('Cart', cartSchema);
const cartItemSchema = require('../models/cartItem-model');
const CartItem = mongoose.model('CartItems', cartItemSchema);
const orderSchema = require('../models/order-model');
const Order = mongoose.model('Orders', orderSchema);

function loggedIn(req, res, next) {
    if (req.user) {
      Cart.findOne({customerID: req.user._id}, (err, result)=>{
        if(result){
        req.user.cartID = result._id;
        req.user.cartDate = result.creationDate;
        res.send(req.user);
      }else{
        req.user.cartID = null;
        req.user.cartDate = null;
        res.send(req.user);
      }
      });

    } else {
        res.send('not logged in');
    }
}

const errorHandler = (err, res, cb) => {
  if (err) {
    return res.json(err);
  }
  return cb();
}

const successHandler = (req, data, next) => {
  req.data = data;
  return next();
}

const createSuccessResponse = data => ({data, success: true});
const getResponseMiddleware = (req, res) => res.json(createSuccessResponse(req.data));
const putAndPatchResponseMiddleware = (req, res) => res.status(201).json(createSuccessResponse(req.data));

const createNewUser = (req, res, next) =>{
  var fname = req.body.fname;
  var lname = req.body.lname;
  var username = req.body.username;
  var idnum = req.body.idnum;
  var city = req.body.city;
  var streetAddress = req.body.streetAddress;
  var role = req.body.role;
  const newCustomer = new Customer({fname,lname,username,idnum,city,streetAddress,role});
      newCustomer.setPassword(req.body.password);
      newCustomer.save((err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
}

const createNewProduct = (req, res, next) =>{
  var name = req.body.name;
  var categoryID = req.body.category;
  var price = req.body.price;
  var imgPath = req.body.imgPath;
  const newProduct = new Product({name,categoryID,price,imgPath});
      newProduct.save((err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
}

const updateProduct = (req, res, next) =>{
  var _id = req.body.id;
  var name = req.body.name;
  var categoryID = req.body.category;
  var price = req.body.price;
  var imgPath = req.body.imgSrc;
  Product.update({_id}, {name, categoryID, price, imgPath},(err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
}


const fetchProductsByName = (req, res, next) =>
    Product.find({name: {$regex : ".*"+req.params.name+".*"}}).exec((err, data) => successHandler(req, data, next));

const fetchProductsByCatId = (req, res, next) =>
    Product.find({categoryID: req.params.catid}).exec((err, data) => successHandler(req, data, next));

const fetchCategories = (req, res, next) =>
    Category.find({}).exec((err, data) => successHandler(req, data, next));

const createNewCart = (req, res, next) =>{
  var customerID = req.body.customerID;
  var creationDate = req.body.creationDate;
  Cart.findOne({customerID}, (err, result)=>{
    if (!err) {
      if (!result) {
        //create new cart
        newCart = new Cart({customerID,creationDate});
        newCart.save((err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
      }
    }
  });

}

const createCartItem = (req, res, next) =>{
    var name = req.body.name;
    var cartID = req.body.cartID;
    var productID = req.body.productID;
    var amount = req.body.amount;
    var totalPrice = req.body.totalPrice;
    var imgPath = req.body.imgPath;
    var newCartItem = new CartItem({name,productID,amount,totalPrice,cartID,imgPath});
        newCartItem.save((err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
}
const updateCartItem = (req, res, next) =>{
    var name = req.body.name;
    var productID = req.body.productID;
    var amount = req.body.amount;
    var totalPrice = req.body.totalPrice;
    var cartID = req.body.cartID;
    CartItem.update({productID: productID, cartID: cartID}, {amount: amount, totalPrice: totalPrice},(err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
}

const fetchStats = (req, res, next) =>{
    var stats ={};
    Product.find({}).exec((err, data) => {
      stats.products = data;
      Order.find({}).exec((err, data) => {
        stats.orders = data;
        successHandler(req, stats, next);
  });
    });
}

const fetchAllCartItems = (req, res, next) =>{
  var cartID = req.user.cartID;
  CartItem.find({cartID}).exec((err, data) => successHandler(req, data, next));
}

const deleteAllCartItems = (req, res, next) =>{
  var cartID = req.body.cartID;
  CartItem.remove({cartID}).exec((err, data) => successHandler(req, data, next));
}

const deleteCartItem = (req, res, next) =>{
  var _id = req.body._id;
  CartItem.remove({_id}).exec((err, data) => successHandler(req, data, next));
}

const compareID = (req, res, next) =>{
  var IdToCheck = req.body.IdToCheck;
  Customer.findOne({idnum: IdToCheck}).exec((err, data) => successHandler(req, data, next));
}

const createNewOrder = (req, res, next) =>{
    var customerID = req.user._id;
    var cartID = req.user.cartID;
    var finalPrice = req.body.finalPrice;
    var city = req.body.city;
    var streetAddress = req.body.streetAddress;
    var sendDate = req.body.sendDate;
    var creationDate = req.body.creationDate;
    var fourDigits = req.body.fourDigits;
    Order.find({sendDate}).exec((err, data) =>{
      if (data.length <= 3) {
        var newOrder = new Order({customerID,cartID,finalPrice,city,streetAddress,sendDate,creationDate,fourDigits});
            newOrder.save((err, data) => {
              if (!err) {
                CartItem.remove({cartID}).exec((err, data) =>{
                  if (!err) {
                    Cart.remove({_id: cartID}).exec((err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
                  }
                });
              }
            });
    }else{
      res.send('Too Many Orders for this Date');
    }
  });
}

router.get('/auth', loggedIn, function (req, res) {
  res.send('test');
});
router.put('/newuser', createNewUser, putAndPatchResponseMiddleware);

router.put('/newproduct', createNewProduct, putAndPatchResponseMiddleware);

router.patch('/updateproduct', updateProduct, putAndPatchResponseMiddleware);

router.get('/products/:name', fetchProductsByName, getResponseMiddleware);

router.get('/categories', fetchCategories, getResponseMiddleware);

router.get('/productsbyid/:catid', fetchProductsByCatId, putAndPatchResponseMiddleware);

router.put('/newcart', createNewCart, putAndPatchResponseMiddleware);

router.put('/newCartItem', createCartItem, putAndPatchResponseMiddleware);

router.patch('/updateCartItem', updateCartItem, putAndPatchResponseMiddleware);

router.get('/stats', fetchStats, getResponseMiddleware);

router.get('/getAllCartItems', fetchAllCartItems, getResponseMiddleware);

router.post('/deleteAllItems', deleteAllCartItems, putAndPatchResponseMiddleware);

router.post('/deleteCartItem', deleteCartItem, putAndPatchResponseMiddleware);

router.post('/checkID', compareID, putAndPatchResponseMiddleware);

router.put('/neworder', createNewOrder, putAndPatchResponseMiddleware);

module.exports = router;
