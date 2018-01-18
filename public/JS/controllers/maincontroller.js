
app.controller('Maincontroller', ['$http','$scope','$routeParams','$location','part1','currentCart', '$cookies','ajaxService',function($http,$scope,$routeParams,$location,part1,currentCart, $cookies, ajaxService){
  errorHandler = response =>{
    if (response.status >=400) {
      $scope.err = response.statusText;
    }
  }
  authenticate = () =>{
    ajaxService.authenticate().then((response)=>{
      errorHandler(response);
      if(response.data != 'not logged in'){
        $scope.loggedIn = true;
        $scope.name = response.data.fname;
        $scope.userId = response.data._id;
        currentCart[0].customerID = response.data._id;
        $scope.cartDate = response.data.cartDate;
        if (response.data.role === 'admin') {
          $scope.admin = true;
          $scope.cartExists = false;
          $scope.shoppingState = 'Edit products';
        }else{
          $scope.admin = false;
        if (response.data.cartID) {
          currentCart[0].cartID = response.data.cartID;
          $scope.cartExists = true;
          $scope.shoppingState = 'Resume Shopping';
        }else{
          $scope.shoppingState = 'Start Shopping';
          $scope.cartExists = false;
        }
      }
        $scope.err = '';
      }else{
        $scope.loggedIn = false;
      }

      });
  }
  $scope.idFlag = false;
  checkID = (IdToCheck,view) =>{
    data= {
      IdToCheck: IdToCheck
    }
  ajaxService.checkID(JSON.stringify(data)).then((response)=>{
    errorHandler(response);
    if (response.data.data) {
      document.getElementById('idInput').focus();
      document.getElementById('idInput').setAttribute("style","color: red;");
      $scope.error = 'ID already exists, re-enter ID number';
      $scope.idFlag = false;
    }else{
      if(document.getElementById('idInput')){
      document.getElementById('idInput').setAttribute("style","color: black;");
    }
      $scope.error = '';
      $scope.idFlag = true;
      validatePassword();
      if (Form1.checkValidity() && $scope.idFlag) {
         part1.idnum = $scope.id;
         part1.username = $scope.username;
         part1.pass = $scope.pass1;
         $scope.password = $scope.pass1;
        $location.path(view);
      }
    }
    });
  }

  $scope.loggedIn = false;

  ajaxService.getStats().then((response)=>{
    errorHandler(response);
      $scope.productNumber = response.data.data.products.length;
      $scope.orderNumber = response.data.data.orders.length;
    });

  authenticate();
  $scope.validateUser = (flag) =>{
    if(flag){
      var user = $scope.username;
      var pass = $scope.password
    }else{
      var user = part1.username;
      var pass = part1.pass;
    }
    var data = {
      username: user,
      password: pass,
    }
    ajaxService.login(JSON.stringify(data)).then((response)=>{
      errorHandler(response);
      if(response.status === 401){
          $scope.err = 'User/Password combination not found!';
      };
      if(response.data){
        authenticate();
      }
      });
  }

  validatePassword = () =>{
    var pass1 = document.getElementById("pass1");
    var pass2 = document.getElementById("pass2");
    if ($scope.pass1 != $scope.pass2) {
      pass2.setCustomValidity("Passwords don't match");
    } else{
      pass2.setCustomValidity("");
    }
  }
  validateId = (view) =>{
    var idInput = document.getElementById("idInput");
    var patt = /^\d+$/;
    if ($scope.id) {
      if(!patt.test($scope.id)){
        idInput.setCustomValidity("Please enter digits only");
      }else{
        idInput.setCustomValidity("");
        checkID($scope.id, view);
      }
    }else{
      idInput.setCustomValidity("Please fill out this field.");
    }
  }

  $scope.sendForm = (e) =>{
    e.preventDefault();
  }

  $scope.changeView = view =>{
    validateId(view);
  }

  $scope.submitRegistration = view =>{
    if (Form2.checkValidity()) {
      var city = $scope.cityName.name;
      var street = $scope.street;
      var fname = $scope.fname;
      var lname = $scope.lname;
      var role = 'customer';
      var data = {
        idnum: part1.idnum,
        username: part1.username,
        password: part1.pass,
        city: city,
        streetAddress: street,
        fname: fname,
        lname: lname,
        role: role
      }
      $location.path(view);
      ajaxService.newUser(JSON.stringify(data)).then((response)=>{
        errorHandler(response);
        if(response.data){
          $scope.validateUser(false);
        }
        });
    }
  }

  $scope.shoppingView = () =>{
    if ($scope.admin) {
      $location.path('admin');
    }else{
    if(!$scope.cartExists){
    var $creationDate = new Date();
    var data = {
      customerID: $scope.userId,
      creationDate: $creationDate
    }
    ajaxService.newCart(JSON.stringify(data)).then((response)=>{
      errorHandler(response);
      if(response.data){
        currentCart[0].cartID = response.data.data._id;
        currentCart[0].customerID = response.data.data.customerID;
      }
      });
        }
    $location.path('store');
  }
  }

  $scope.logout = () =>{
    $cookies.remove('shopping_cook');
    authenticate();


  }
  $scope.cities = [{
    name: 'Tel Aviv'
  },{
    name: 'Jerusalem'
  },{
    name: 'Bnei Brak'
  },{
    name: 'Haifa'
  },{
    name: 'Rishon Letzion'
  },{
    name: 'Ashdod'
  },{
    name: 'Petach Tikva'
  },{
    name: "Be'er Sheva"
  },{
    name: 'Natanya'
  },{
    name: 'Holon'
  }];

}]);
