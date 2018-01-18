var app = angular.module('app1', ['ngRoute','ngMaterial','ngMessages','ngCookies']);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'Maincontroller',
      templateUrl: './views/main.html'
    })
    .when('/register',{
      controller: 'Maincontroller',
      templateUrl:'./views/register1.html'
    })
    .when('/register2',{
      controller: 'Maincontroller',
      templateUrl:'./views/register2.html'
    })
    .when('/store',{
      controller: 'Shoppingcontroller',
      templateUrl:'./views/mainstore.html'
    })
    .when('/order',{
      controller: 'Ordercontroller',
      templateUrl:'./views/order.html'
    })
    .when('/admin',{
      controller: 'Admincontroller',
      templateUrl:'./views/admin.html'
    })
    .otherwise({
      redirectTo: '/'
    });
});
