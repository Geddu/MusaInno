app.controller("assignmentsCtrl", function ($scope, $rootScope, RestService, common, $window) {
    RestService.getUserAssignments()
        .then(function (res) {
            var assignments = common.formatAssignmentDates(res);
            assignments = common.assignReadyStates(assignments);
            $scope.assignments = assignments;
            $scope.count = assignments.length;
        });
});
