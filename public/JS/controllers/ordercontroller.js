app.controller('Ordercontroller', ['$http','$scope','$routeParams','$location','$mdDialog','$mdSidenav','productInfo','currentCart','ajaxService',function($http,$scope,$routeParams,$location,$mdDialog,$mdSidenav,productInfo,currentCart,ajaxService){
  errorHandler = response =>{
    if (response.status >=400) {
      $scope.err = response.statusText;
    }
  }
  ajaxService.checkUser().then((response)=>{
    errorHandler(response);
      if(response.status == 401){
        $location.path('/');
      }
      });
  $scope.sendForm = (e) =>{
    e.preventDefault();
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

  getCartItems = () =>{
    ajaxService.getAllCartItems().then((response)=>{
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
  };
  authenticate = () =>{
    ajaxService.authenticate().then((response)=>{
      errorHandler(response);
      if(response.data != 'not logged in'){
        $scope.loggedIn = true;
        $scope.city = response.data.city;
        $scope.streetAddress = response.data.streetAddress;
        currentCart[0].customerID = response.data._id;
        if (response.data.cartID) {
          currentCart[0].cartID = response.data.cartID;
          getCartItems();
      }
        $scope.cartDate = response.data.cartDate;
        $scope.err = '';
      }else{
        $scope.loggedIn = false;
      }

      });
  }
  authenticate();

  $scope.cart = currentCart;
  for (var i = 0; i < $scope.cart.length; i++) {
    $scope.cart[i].highlight='';
  }

  var creditCardPattern = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/; //only works for Visa cards, could'nt get others to work :(

  $scope.userInput = inputType =>{
    if (inputType === 'city') {
      $scope.cityName = $scope.city;
    }
    if (inputType === 'street') {
      $scope.street = $scope.streetAddress;
    }
  }
  $scope.backToShop = () =>{
    $location.path('/store');
  }

  $scope.markItem = () =>{
    for (var i = 1; i < currentCart.length; i++) {
      if($scope.search){
      if (currentCart[i].name.includes($scope.search)) {
        currentCart[i].highlight = 'highlight';
      }else{
        currentCart[i].highlight = '';
      }
    }else{
      currentCart[i].highlight = '';
    }
    }
  }
  $scope.submitRegistration = () =>{
    var creditCardInput = document.getElementById('creditCard');
    if(!creditCardPattern.test($scope.creditCard)){
      creditCardInput.setCustomValidity("Incorrect credit Card, please try again");
    }else{
      creditCardInput.setCustomValidity("");
    }

    if (Order.checkValidity()) {
    var lastFour = $scope.creditCard.substr($scope.creditCard.length - 4);
    var data ={
      finalPrice: currentCart[0].cartTotal,
      city: $scope.cityName,
      streetAddress: $scope.street,
      sendDate: $scope.sendDate,
      creationDate: new Date(),
      fourDigits: lastFour
    }
    ajaxService.createNewOrder(JSON.stringify(data)).then(function(response){
      errorHandler(response);
      if(response.data){
        if(response.data === 'Too Many Orders for this Date'){
          $scope.err = 'Too Many orders for this date, please choose a different date';
        }else{
          showConfirmation();
        }
      }
      });
        }
  }
  showConfirmation = function($event) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'dialog2.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:false,
      fullscreen: $scope.customFullscreen
    })
    .then(function(answer) {
    }, function() {
    });

};

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
 $mdDialog.hide();
};

$scope.cancel = function() {
 $mdDialog.cancel();
};

var content = "";
for (var i = 1; i < currentCart.length; i ++) {
    content += currentCart[i].name + ", " + currentCart[i].amount + "Units, " + currentCart[i].totalPrice +"NIS, " +"\n";
}
content += "Total: " + currentCart[0].cartTotal + " NIS" +"\n";
content += "Thank You for Shopping ar Our Store!";

    var textFile = null,
    makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }
    textFile = window.URL.createObjectURL(data);
    return textFile;
  };

 $scope.textFile = makeTextFile(content);
 $scope.backToMain = () =>{
   $location.path('/');
   $mdDialog.hide();
 }
}
  }]);
