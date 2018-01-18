app.factory('ajaxService', ['$http',function($http) {
  return {
  getAllCartItems: () =>{
    return $http({
    method: 'GET',
    url: '/routes/getAllCartItems'
    }).then(response =>{return response;}, error =>{return error;});
  },
  checkUser: () =>{
    return $http({
    method: 'GET',
    url: '/store'
    }).then(response =>{return response;}, error =>{return error;});
  },
  authenticate: () =>{
    return $http({
    method: 'GET',
    url: '/routes/auth'
    }).then(response =>{return response;}, error =>{return error;});
  },
  getCategories: () =>{
    return $http({
    method: 'GET',
    url: '/routes/categories'
    }).then(response =>{return response;}, error =>{return error;});
  },
  getProductName: name =>{
    return $http({
    method: 'GET',
    url: '/routes/products/'+name
    }).then(response =>{return response;}, error =>{return error;});
  },
  getProductsById: catId =>{
    return $http({
    method: 'GET',
    url: '/routes/productsbyid/'+catId
    }).then(response =>{return response;}, error =>{return error;});
  },
  updateCartItem: data =>{
    return $http({
    method: 'PATCH',
    url: 'routes/updateCartItem',
    data
    }).then(response =>{return response;}, error =>{return error;});
  },
  createCartItem: data =>{
    return $http({
    method: 'PUT',
    url: 'routes/newCartItem',
    data
    }).then(response =>{return response;}, error =>{return error;});
  },
  deleteCartItem: data =>{
    return $http({
    method: 'POST',
    url: 'routes/deleteCartItem',
    data
    }).then(response =>{return response;}, error =>{return error;});
  },
  deleteAllCartItems: data =>{
    return $http({
    method: 'POST',
    url: 'routes/deleteAllItems',
    data
    }).then(response =>{return response;}, error =>{return error;});
  },
  updateProduct: data =>{
    return $http({
    method: 'PATCH',
    url: 'routes/updateproduct',
    data
    }).then(response =>{return response;}, error =>{return error;});
  },
  createProduct: data =>{
    return $http({
    method: 'PUT',
    url: 'routes/newproduct',
    data
    }).then(response =>{return response;}, error =>{return error;});
  },
  createNewOrder: data =>{
    return $http({
    method: 'PUT',
    url: 'routes/neworder',
    data
    }).then(response =>{return response;}, error =>{return error;});
  },
  checkID: data =>{
    return $http({
    method: 'POST',
    url: 'routes/checkID',
    data
    }).then(response =>{return response;}, error =>{return error;});
  },
  getStats: () =>{
    return $http({
    method: 'GET',
    url: 'routes/stats'
    }).then(response =>{return response;}, error =>{return error;});
  },
  newUser: data =>{
    return $http({
    method: 'PUT',
    url: 'routes/newuser',
    data
    }).then(response =>{return response;}, error =>{return error;});
  },
  newCart: data =>{
    return $http({
    method: 'PUT',
    url: 'routes/newcart',
    data
    }).then(response =>{return response;}, error =>{return error;});
  },
  login: data =>{
    return $http({
    method: 'POST',
    url: 'login',
    data
    }).then(response =>{return response;}, error =>{return error;});
  }
}
}]);
