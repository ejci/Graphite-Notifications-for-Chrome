app.directive('notif', function() {
	return {
		restrict : 'AE',
		scope : {
			notification : '=notification'
		},
		templateUrl : 'templates/notification.html',
		controller : function($scope, $window) {
			$scope.types = [{
				name : 'Value change',
				value : 'change'
			}, {
				name : 'Periodic notification',
				value : 'check'
			}];
			$scope.notification.type = ($scope.notification.type) ? $scope.notification.type : $scope.types[0].value;
			$scope.intervals = [{
				name : '1 minute',
				value : 1
			}, {
				name : '2 minutes',
				value : 2
			}, {
				name : '5 minutes',
				value : 5
			}, {
				name : '10 minutes',
				value : 10
			}, {
				name : '15 minutes',
				value : 15
			}, {
				name : '30 minutes',
				value : 30
			}];
			$scope.notification.interval = ($scope.notification.interval) ? $scope.notification.interval : $scope.intervals[2].value;

			$scope.periodicIntervals = [{
				name : '5 minutes',
				value : 5
			}, {
				name : '10 minutes',
				value : 10
			}, {
				name : '15 minutes',
				value : 15
			}, {
				name : '30 minutes',
				value : 30
			}, {
				name : '1 hour',
				value : 30
			}, {
				name : 'Always on HH:00',
				value : -60
			}, {
				name : 'Always on HH:00, HH:30',
				value : -30
			}, {
				name : 'Always on HH:00, HH:15, HH:30, HH:45',
				value : -15
			}];

			$scope.notification.periodicInterval = ($scope.notification.periodicInterval) ? $scope.notification.periodicInterval : $scope.periodicIntervals[5].value;

			$scope.priorities = [{
				name : 'Very high',
				value : 2
			}, {
				name : 'High',
				value : 1
			}, {
				name : 'Normal',
				value : 0
			}, {
				name : 'Low',
				value : -1
			}, {
				name : 'Very low',
				value : -2
			}];
			$scope.notification.priority = ($scope.notification.priority) ? $scope.notification.priority : $scope.priorities[2].value;

			$scope.aggregations = [{
				name : 'Average',
				value : 'avg'
			}, {
				name : 'Sum',
				value : 'sum'
			}, {
				name : 'Maximum',
				value : 'max'
			}, {
				name : 'Minimum',
				value : 'min'
			}, {
				name : 'Last value',
				value : 'last'
			}];
			$scope.notification.aggregation = ($scope.notification.aggregation) ? $scope.notification.aggregation : $scope.aggregations[0].value;

			$scope.colors = [{
				name : 'Blue',
				value : 'blue'
			}, {
				name : 'Green',
				value : 'green'
			}, {
				name : 'Grey',
				value : 'grey'
			}, {
				name : 'Orange',
				value : 'orange'
			}, {
				name : 'Red',
				value : 'red'
			}, {
				name : 'Yellow',
				value : 'yellow'
			}];
			$scope.notification.color = ($scope.notification.color) ? $scope.notification.color : $scope.colors[0].value;

			$scope.changes = [{
				name : 'Increase',
				value : 'increase'
			}, {
				name : 'Decrease',
				value : 'decreaseeen'
			}, {
				name : 'Increase & Decrease',
				value : 'all'
			}];
			$scope.notification.change = ($scope.notification.change) ? $scope.notification.change : $scope.changes[2].value;

			$scope.chartIntervals = [{
				name : '10 minutes',
				value : 10
			}, {
				name : '30 minutes',
				value : 30
			}, {
				name : '1 hour',
				value : 60
			}, {
				name : '2 hours',
				value : 120
			}, {
				name : '3 hours',
				value : 180
			}, {
				name : '6 hours',
				value : 360
			}, {
				name : '12 hours',
				value : 720
			}, {
				name : '1 day',
				value : 1440
			}];
			$scope.notification.chartInterval = ($scope.notification.chartInterval) ? $scope.notification.chartInterval : $scope.chartIntervals[2].value;

			//TODO: do it differently
			$scope.iconUrl = function() {
				return '../icons/' + $scope.notification.color + '_exclamation_circle.png';
			};
			//TODO: do it differently
			$scope.change = function() {
				console.log($scope.notification.type);
				if ($scope.notification.type === 'check') {
					$scope.notification.chart = 'true';
				}
			};
		}
	};
});
