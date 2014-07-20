		var app = angular.module('myApp', ['ionic']);
 		app.config(function($stateProvider, $urlRouterProvider) {

			$stateProvider
				.state('login', {
					url: '',
					templateUrl: 'partials/login.html',
					controller: 'loginController',
					resolve: {
						customer: function(customerService) {
							return customerService.getCustomer();
						},
						debug: function(debugService) {
							return debugService.getDebug();
						}
					}
				})
				.state('account', {
					url: '/account',
					templateUrl: 'partials/account.html',
					controller: 'accountController',
					resolve: {
						customer: function(customerService) {
							return customerService.getCustomer();
						},
						debug: function(debugService) {
							return debugService.getDebug();
						}
					}

				})
				.state('invoice', {
					url: '/invoice/:invoice',
					templateUrl: 'partials/invoiceDetail.html',
					controller: 'invoiceController',
					resolve: {
						invoice: function(customerService,$stateParams) {
							return customerService.getInvoice($stateParams.invoice);
						},
						customer: function(customerService) {
							return customerService.getCustomer();
						}
					}
				})
			.state('unbilledUsage' , {
				url: '/unbilledUsage',
				templateUrl: 'partials/unbilledUsage.html'
			})
			.state('settings' , {
				url: '/settings',
				templateUrl: 'partials/settings.html'
			})
			.state('openBalanceInfo' , {
				url: '/openBalanceInfo',
				templateUrl: 'partials/openBalanceInfo.html'
			})
			.state('help' , {
				url: '/help',
				templateUrl: 'partials/help.html'
			})
			.state('customerOverview' , {
				url: '/customerOverview',
				templateUrl: 'partials/customerOverview.html'
			})
			;
			
		//	$urlRouterProvider.otherwise('');

		});

		/* services to share data between views */

		app.service('customerService', function($q) {
			return {
				customer: {
					currency: 'CHF'
				},
				getCustomer: function() {
					return this.customer;
				},
				getInvoice: function(index) {
					return this.customer.account.invoices[index];
				}
			};
		});

		app.service('debugService', function($q) {
			return {
				debug: {
					request: {},
					response: {},
					debug: 0
				},
				getDebug: function() {
					return this.debug;
				},
			};
		});

		/* controllers */

		app.controller('loginController', function($scope, customer, debug, $http, $state) {
			$scope.cred = {
				username: "arnaud.lhote@hispeed.ch",
				password: "minisoph70"
			};

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
				debug.debug = $scope.cred.debug;

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

					if (angular.isDefined(data.customer) && data.loginInfo == "authenticated") {
						customer.account = data.customer.accounts[0];
						$state.go('account');
						//window.location.href = "#/account";
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
		app.controller('invoiceController', function($scope, customer, invoice ) {
			$scope.account = customer.account;
			$scope.account.currency = customer.currency;
			$scope.invoice = invoice;
		});

		app.controller('accountController', function($scope, $ionicModal, $ionicPlatform, customer, debug) {
			$scope.account = customer.account;
			$scope.account.currency = customer.currency;
			$scope.invoices = customer.account.invoices;
			$scope.request = debug.request;
			$scope.debug = debug.debug;
			$scope.response = debug.response;
			$ionicPlatform.registerBackButtonAction(function () { /* do nothing */}, 100);


/*
			$ionicModal.fromTemplateUrl('partials/invoiceDetail.html', {
				scope: $scope,
				animation: 'slide-in-right'
			})
				.then(function(modal) {
					$scope.modal = modal;
				});

			$scope.openModal = function(index) {
				$scope.invoice = $scope.invoices[index];
				$scope.modal.show();
			};

			$scope.closeModal = function() {
				$scope.modal.hide();
			};

			$scope.$on('$destroy', function() {
				$scope.modal.remove();
			});
*/

		});