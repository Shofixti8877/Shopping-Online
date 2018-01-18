app.factory('currentCart', [function() {
  var cart= [{cartTotal:0, cartID: '', customerID:''}];
  return cart;
}]);
