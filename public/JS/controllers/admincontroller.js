app.controller('Admincontroller', ['$http','$scope','$routeParams','$location','$mdDialog','$mdSidenav','productInfo','currentCart','categories','ajaxService',function($http,$scope,$routeParams,$location,$mdDialog,$mdSidenav,productInfo,currentCart,categories, ajaxService){
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

  authenticate = () =>{
    ajaxService.authenticate().then((response)=>{
      errorHandler(response);
      if(response.data != 'not logged in'){
        if(response.data.role != 'admin'){
          $location.path('/');
        }
        currentCart[0].customerID = response.data._id;
    }
      });
  }
  authenticate();
  $scope.categories= {};
  ajaxService.getCategories().then((response)=>{
    errorHandler(response);
    if(response.data){
      $scope.categories = response.data.data;
      categories = $scope.categories;
    }
    });

  $scope.search = name =>{
      ajaxService.getProductName(name).then((response)=>{
        if (response.status >=400 && response.status !=404) {
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
    $scope.products = null;
    var catId = $event.target.id.split('-')[1];
    $scope.currId = catId;
    ajaxService.getProductsById(catId).then((response)=>{
      errorHandler(response);
      if(response.data){
        $scope.products = response.data.data;
      }
      });
   }

   $scope.showProduct = ($event) => {
     $scope.showForm = true;
     $scope.newProductPressed = false;
     $scope.productName = productInfo.name =  $event.currentTarget.attributes.name.value;
     $scope.productId = productInfo.id = $event.currentTarget.id;
     $scope.productPrice = productInfo.price = $event.currentTarget.attributes.price.value;
     $scope.productImg = productInfo.imgSrc = $event.currentTarget.childNodes[0].src;
     $scope.productCategory = productInfo.category = $event.currentTarget.attributes.category.value;
     for (var i = 0; i < categories.length; i++) {
       if(productInfo.category === categories[i]._id ){
         $scope.productCategoryName = categories[i].name;
         break;
       }
     }
     };

   $scope.newProductForm = () => {
     $scope.showForm = true;
     $scope.newProductPressed = true;
     $scope.productName = '';
     $scope.productId = '';
     $scope.productPrice = '';
     $scope.productImg = '';
     $scope.productCategory = '';
     $scope.productCategoryName = '';
   }

    $scope.checkCat = () =>{
       var count = 0;
       for (var i = 0; i < categories.length; i++) {
         if ($scope.productCategory === categories[i]._id) {
           $scope.productCategoryName = categories[i].name;
           break;
         }else{
           count++;
         }
         if(count === categories.length){
           $scope.productCategoryName = 'no such category';
           count = 0;
         }
       }
     }

     $scope.saveToDB = () =>{
       if (adminForm.checkValidity()) {
       productInfo.name = $scope.productName;
       productInfo.price = $scope.productPrice;
       productInfo.imgPath = $scope.productImg;
       productInfo.category = $scope.productCategory;
       if (!$scope.newProductPressed) {
         ajaxService.updateProduct(JSON.stringify(productInfo)).then((response)=>{
           errorHandler(response);
           if(response.data){
             $scope.showAlert('update');
             ajaxService.getProductsById($scope.currId).then((response)=>{
               errorHandler(response);
               if(response.data){
                 $scope.products = response.data.data;
               }
               });
           }
       });
       }else{
         ajaxService.createProduct(JSON.stringify(productInfo)).then((response)=>{
           errorHandler(response);
           if(response.data){
             $scope.showAlert('addnew');
           }
           });
       }
     }
}

$scope.status = '  ';
$scope.customFullscreen = false;

$scope.showAlert = function(type) {
  if(type === 'update'){
    var message = 'product updated successfully';
  }else{
    var message = 'new product added successfully';
  }
  $mdDialog.show(
    $mdDialog.alert()
      .parent(angular.element(document.body))
      .clickOutsideToClose(true)
      .textContent(message)
      .ariaLabel('Alert Dialog Demo')
      .ok('Done')
  );
};
}]);
