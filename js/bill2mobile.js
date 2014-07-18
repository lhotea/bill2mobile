		
var app = angular.module('myApp', ['ionic']);
app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
    url: '/',
    templateUrl: 'partials/login.html',
	controller: 'loginController',
	resolve: {
	 customer: function(customerService) {
	  return customerService.getCustomer()
	 },
	 debug: function(debugService) {
	  return debugService.getDebug()
	 } 
	}
  })
    .state('account', {
    url: '/account',
    templateUrl: 'partials/account.html',
	controller: 'accountController',
	resolve: {
	 customer: function(customerService) {
	  return customerService.getCustomer()
	 },
	 debug: function(debugService) {
	  return debugService.getDebug()
	 } 
	}

});
  $urlRouterProvider.otherwise('/');
  
});

/* services to share data between views */

	app.service ('customerService', function($q) {
		return {
		 customer: {},
		 getCustomer: function() {
		  return this.customer
		 }
		}
	});

	app.service ('debugService', function($q) {
		return {
		 debug: {
		  request: {},
		  response: {}
		 },
		 getDebug: function() {
		  return this.debug
		 },
		}
	});

/* controllers */

		app.controller('loginController', function($scope, customer, debug, $http) {
            $scope.cred = {};
			
			$scope.login = function() {
				var request = {
					language: 'en',
					login: {
						username: $scope.cred.username,
						password: $scope.cred.password
					},
					version: '1.1.7'
				};
				
				$scope.request = JSON.stringify(request);
//DEBUG INFO
                debug.request = $scope.request;

				$http({
					method: 'PUT',
					url: 'https://bill2mobile.upc.ch:443/bill2mobileserver/resources/getCustomer',
					data: request
				}).
				success(function(data, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available

					$scope.response = JSON.stringify(data);
//DEBUG INFO
                    debug.response = $scope.response;
					
					var myaccount = angular.isDefined(data.customer) ? data.customer.accounts[0] : {};
					customer.account = {
						account_number: myaccount.id,
						currency: "CHF",
						bill_lname: myaccount.lastName,
						bill_fname: myaccount.firstName,
						bill_title: myaccount.title,
						bill_address1: myaccount.address,
						bill_address2: "",
						bill_address3: "",
						bill_zip: myaccount.zip,
						bill_city: myaccount.city,
						open_balance: myaccount.balanceDue,
						unbilled_usage: myaccount.unbilledDue
					};
					customer.invoices = myaccount.invoices;
                    window.location.href ="#/account";
				}).
				error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					$scope.response = JSON.stringify(data);
//DEBUG INFO
                    debug.response = $scope.response;

             });
              
			};
		});
		app.controller('accountController', function($scope, customer, debug) {
         $scope.account = customer.account;
		 $scope.invoices = customer.invoices;
		 $scope.request = debug.request;
		 $scope.response = debug.response;
		 
		});
	
