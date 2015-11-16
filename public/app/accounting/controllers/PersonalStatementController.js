angular.module('oraApp.accounting')
	.controller('PersonalStatementController', ['$scope', '$stateParams', 'accountService',
		function ($scope, $stateParams, accountService) {
			var limit = 0;
			$scope.statement = null;
			this.getInitialBalance = accountService.getInitialBalance;
			this.loadMore = function() {
				limit += 10;
				accountService
					.personalStatement({ orgId: $stateParams.orgId, limit: limit })
					.$promise.then(function(result) {
						$scope.statement = result;
					});
			};
			this.loadMore();
		}]);