app.controller('Shoppingcontroller', ['$http','$scope','$routeParams','$location','$mdDialog','$mdSidenav','productInfo','currentCart','ajaxService',function($http,$scope,$routeParams,$location,$mdDialog,$mdSidenav,productInfo,currentCart,ajaxService){
  errorHandler = response =>{
    if (response.status >=400) {
      $scope.err = response.statusText;
    }
  }
  var flag = false;
  $scope.toggleBtn = 'Hide cart';
  ajaxService.checkUser().then(function(response){
    errorHandler(response);
      if(response.status == 401){
        $location.path('/');
      }
      });
  getCartItems = () =>{
    ajaxService.getAllCartItems().then(function(response){
      errorHandler(response);
      if(response.data) {
        if (currentCart.length > 0) {
          currentCart.splice(1,currentCart.length-1);
        }
        for (var i = 0; i < response.data.data.length; i++) {
          currentCart.push(response.data.data[i]);
        }
      $scope.cart = currentCart;
      totalCartPrice();
    }
  });
  }

  authenticate = () =>{
    ajaxService.authenticate().then(function(response){
      errorHandler(response);
      if(response.data != 'not logged in'){
        currentCart[0].customerID = response.data._id;
        if (response.data.cartID) {
          currentCart[0].cartID = response.data.cartID;
          getCartItems();
      }
    }
      });
  }

  authenticate();
  $scope.toggleLeft = buildToggler('left');
  $scope.categories= {};
  $scope.cart = currentCart;
  $scope.totalPrice = currentCart[0];
  function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            flag = !flag;
            if(flag){
            $scope.toggleBtn = 'Show Cart';
          }else{
            $scope.toggleBtn = 'Hide Cart';
          }
          });
      };


    }
  ajaxService.getCategories().then(function(response){
    errorHandler(response);
    if(response.data){
      $scope.categories = response.data.data;
    }
    });

  $scope.search = name =>{
    ajaxService.getProductName(name).then(function(response){
      if (response.status >=400 && response.status != 404) {
        $scope.err = response.statusText;
      }
      if(response.data){
        $scope.products = response.data.data;
      }
      if(response.status === 404){
        $scope.products = [];
      }
      });
  }

  $scope.showCategoryItems = $event =>{
    var catId = $event.target.id.split('-')[1];
    ajaxService.getProductsById(catId).then(function(response){
      errorHandler(response);
      if(response.data){
        $scope.products = response.data.data;
      }
      });
   }

   $scope.showProduct = function($event){
     productInfo.id = $event.currentTarget.id;
     productInfo.name =  $event.currentTarget.attributes.name.value;
     productInfo.imgSrc = $event.currentTarget.childNodes[0].src;
     productInfo.price = $event.currentTarget.attributes.price.value;
       $mdDialog.show({
         controller: DialogController,
         templateUrl: 'dialog1.tmpl.html',
         parent: angular.element(document.body),
         targetEvent: $event,
         clickOutsideToClose:true,
         fullscreen: $scope.customFullscreen
       })
       .then(function(answer) {
       }, function() {
       });
     };

     function DialogController($scope, $mdDialog) {

       $scope.title = productInfo.name;
       $scope.imgSrc = productInfo.imgSrc;
       $scope.amount = '1';
       $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.addToCart = () => {
      $mdDialog.hide();
      var count = 1;
      var totalPrice = $scope.amount*productInfo.price;
      if (currentCart.length === 1) {
        updateCartItem(true);
        totalCartPrice();
      }else{
      for (var i = 1; i < currentCart.length; i++) {
        if (currentCart[i].productID === productInfo.id) {
          currentCart[i].amount = $scope.amount;
          currentCart[i].totalPrice = totalPrice;
          currentCart[i].cartID = currentCart[0].cartID;
          currentCart[i].imgSrc = $scope.imgSrc;
          totalCartPrice();
          updateCartItem(false);
          updateCartItemDB(currentCart[i]);
        }else{
          count++;
        }
      }
        if(count == currentCart.length){
           updateCartItem(true);
           totalCartPrice();
           count = 0;
        }
    }
    }

    $scope.minusOne = () =>{
      if ($scope.amount > 0) {
        $scope.amount--;
      }
    }
    $scope.plusOne = () =>{
      $scope.amount++;
    }
    updateCartItem = addNew =>{
      var cartItem = {};
      var totalPrice = $scope.amount*productInfo.price;
      cartItem.productID = productInfo.id;
      cartItem.name = productInfo.name;
      cartItem.amount = $scope.amount;
      cartItem.totalPrice = totalPrice;
      cartItem.cartID = currentCart[0].cartID;
      cartItem.imgPath = $scope.imgSrc;
      if (addNew) {
        currentCart.push(cartItem);
        createCartItemDB(cartItem);
      }
    }

  }


totalCartPrice = () =>{
  var sum = 0;
  if (currentCart.length === 1) {
    currentCart[0].cartTotal = 0;
  }else{
  for (var j = 1; j < currentCart.length; j++) {
    sum +=currentCart[j].totalPrice;
    currentCart[0].cartTotal = sum;
 }
}
}

    $scope.removeCartItem = item =>{
      for (var i = 1; i < currentCart.length; i++) {
        if(currentCart[i].productID === item.currentTarget.parentNode.id){
          deleteCartItemDB(currentCart[i]._id);
          currentCart.splice(i,1);
          totalCartPrice();
        }
      }
    }
    $scope.removeAll = () =>{
          currentCart.splice(1);
          currentCart[0].cartTotal = 0;
          deleteAllCartItemsDB(currentCart[0].cartID);

    }
updateCartItemDB = currentItem =>{
  ajaxService.updateCartItem(JSON.stringify(currentItem)).then(function(response){
    errorHandler(response);
    if(response.data){

    }
    });
}
createCartItemDB = currentItem =>{
  ajaxService.createCartItem(JSON.stringify(currentItem)).then(function(response){
    errorHandler(response);
    if(response.data){

    }
    });
}

deleteCartItemDB = (currentCartItemID) =>{
  var data = {
    _id : currentCartItemID
  }
  ajaxService.deleteCartItem(data).then(function(response){
    errorHandler(response);
    if(response.data){
    }
    });
}

deleteAllCartItemsDB = (currentCartID) =>{
  var data = {
    cartID: currentCartID
  }
  ajaxService.deleteAllCartItems(data).then(function(response){
    errorHandler(response);
    if(response.data){
    }
    });
}
$scope.orderView = () =>{
  if (currentCart.length > 1) {
    $scope.cartError = '';
    $location.path('/order');
  }else{
    $scope.cartError = 'Please add items to the cart before sumbitting your order';
  }
}
}]);
