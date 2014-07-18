		
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
		 customer: {
		  currency: 'CHF'
		 },
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
					
					if ( angular.isDefined(data.customer) && data.loginInfo == "authenticated"  )
					{
					 customer.account = data.customer.accounts[0];
                     window.location.href ="#/account";
					}
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
		app.controller('accountController', function($scope, $ionicModal, customer, debug) {
         $scope.account = customer.account;
		 $scope.invoices = customer.account.invoices;
		 $scope.request = debug.request;
		 $scope.response = debug.response;
		 
		 
		 $ionicModal.fromTemplateUrl('partials/invoiceDetail.html', {
		 scope: $scope,
		 animation: 'slide-in-right'})
		 .then ( function(modal) { 
		  $scope.modal = modal
		 });
		 
		 $scope.openModal = function () {
		  $scope.modal.show();
		 };

		 $scope.closeModal = function () {
		  $scope.modal.hide();
		 };

		 $scope.$on ( '$destroy', function () {
		  $scope.modal.remove();
		 });

		 
		});
	
