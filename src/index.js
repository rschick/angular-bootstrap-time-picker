angular.module('angular-bootstrap-time-picker', []).
directive('ngBootstrapTimePicker', function() {
	return {
		restrict: 'E',
		template: '<span class="input-group time-picker"> \
			<span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span> \
			<input type="text" class="form-control" maxlength="2" ng-model="hour" ng-model-options="{debounce: 500}" ng-class="{invalid: hourInvalid}" /> \
			<span class="input-group-addon">:</span> \
			<input type="text" class="form-control" maxlength="2" ng-model="minute" ng-model-options="{debounce: 500}" ng-class="{invalid: minuteInvalid}" /> \
			<span class="input-group-btn"> \
				<button class="btn btn-primary" type="button" ng-click="toggleAmPm($event)">{{ampm}}</button> \
			</span> \
		</span>',
		require: '?ngModel',
		scope: {},
		link: function (scope, elem, attrs, ngModel) {

			if (!ngModel) {
				return;
			}

			ngModel.$render = function() {
				updateView(ngModel.$viewValue);
			};

			function updateView(value) {
				scope.hour = moment(value).format('h');
				scope.minute = moment(value).format('mm');
				scope.ampm = moment(value).format('A');
			}

			scope.$watch('hour', function(newValue, oldValue) {
				if (oldValue === newValue) {
					return;
				}
				if (isNaN(newValue) || newValue > 12 || newValue < 1) {
					scope.hourInvalid = true;
					return;
				}
				scope.hourInvalid = false;
				var date = new Date(ngModel.$viewValue);
				var hour = newValue;
				if (date.getHours() > 12) {
					hour += 12;
				} else if (hour === 12) {
					hour = 0;
				}
				date.setHours(hour);
				ngModel.$setViewValue(date);
			});

			scope.$watch('minute', function(newValue, oldValue) {
				if (oldValue === newValue) {
					return;
				}
				if (isNaN(newValue) || newValue > 59 || newValue < 0) {
					scope.minuteInvalid = true;
					return;
				}
				scope.minuteInvalid = false;
				var date = new Date(ngModel.$viewValue);
				date.setMinutes(scope.minute);
				ngModel.$setViewValue(date);
			});

			scope.toggleAmPm = function() {
				var date = new Date(ngModel.$viewValue);
				var hour = date.getHours();
				if (hour >= 12) {
					date.setHours(hour - 12);
				} else {
					date.setHours(hour + 12);
				}
				ngModel.$setViewValue(date);
				updateView(date);
			};
		}
	};
});
