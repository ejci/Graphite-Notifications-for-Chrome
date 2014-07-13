/**
 * Main app module with dependencise
 */
var app = angular.module('app', ['ngStorage', 'ngSanitize']);

app.config(['$compileProvider',
function($compileProvider) {
	var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
	var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0, -1) + '|chrome-extension:' + currentImgSrcSanitizationWhitelist.toString().slice(-1);
	$compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);
}]);
/**
 * App controller
 */
app.controller('AppCtrl', function($scope, $window, $localStorage, $timeout, $http) {
	//localstorage
	$scope.storage = $localStorage.$default({
		graphite : {},
		notifications : []
	});
	$scope.utils = {};
	$scope.ui = {};
	$scope.graphite = ($scope.storage.graphite) ? $scope.storage.graphite : {};
	$scope.notifications = ($scope.storage.notifications) ? $scope.storage.notifications : [];

	/**
	 * TODO: move logic to services. Don't polute controllers!!!
	 */
	$scope.utils.serverTest = function() {
		$scope.ui.serverError = false;
		$http.get($scope.graphite.url).then(function(result) {
			$scope.ui.serverError = false;
		}, function(result) {
			$scope.graphite.enabled = 'false';
			$scope.ui.serverError = true;
		});
	};
	$scope.utils.removeAll = function() {
		$scope.notifications = [];
	};
	$scope.utils.addNotification = function() {
		$scope.notifications.push({
		});
	};
	$scope.utils.removeNotification = function(index) {
		delete $scope.notifications.splice(index, 1);

	};
	$window.onbeforeunload = function() {
		chrome.extension.sendMessage({
			closing : true
		});
	};

});

