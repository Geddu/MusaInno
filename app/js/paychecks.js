app.controller("paychecksCtrl", function ($scope, RestService, common, _) {
    RestService.getPaychecks()
        .then(function (res) {
            var paychecks = res;
            _.each(paychecks, function (paycheck) {
                paycheck.assignment = common.formatAssignmentReadyDates([paycheck.assignment])[0];
            });
            $scope.paychecks = paychecks;
            $scope.count = res.length;
        });
});
