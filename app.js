const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const async = require('async');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportConfig = require('./auth/passport-config');
const routes = require('./routes/shopping-routes');
const env = require('./env/dev-env');


//move to future mongo file
const customerSchema = require('./models/customer-model');
const Customer = mongoose.model('Customers', customerSchema);

const categorySchema = require('./models/category-model');
const Category = mongoose.model('Category', categorySchema);

const productSchema = require('./models/product-model');
const Product = mongoose.model('Product', productSchema);

const cartSchema = require('./models/cart-model');
const Cart = mongoose.model('Cart', cartSchema);

const cartItemSchema = require('./models/cartItem-model');
const CartItem = mongoose.model('CartItem', cartItemSchema);

const orderSchema = require('./models/order-model');
const Order = mongoose.model('Order', orderSchema);



//



passport.use(new LocalStrategy(passportConfig.login));
passport.serializeUser(passportConfig.serializeUser);
passport.deserializeUser(passportConfig.deserializeUser);

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET_SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  name: 'shopping_cook',
  cookie: {
    httpOnly: false,
    maxAge: 10000 * 60 * 30
  },
  store: new MongoStore({
    url: process.env.CONNECTION_STRING
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

app.post('/login',
    passport.authenticate('local'),
    (req, res) => {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
          res.send(req.user);
     });
app.get('/store', passportConfig.validatedUser, (req, res) => {
  res.send('ok');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/index.html');
});
app.use('/routes', routes);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

const port = 3004;
async.waterfall([
  callback => mongoose.connect('mongodb://localhost:27017/shopping', {useMongoClient: true}, err => callback(err)),
  callback => app.listen(port, err => callback(err))
], (err, results) => {
  if (err) {
    return console.log(err);
  }
  return console.log(`Server up and running on port `+ port + ` and connected to mongo DB`);
});
