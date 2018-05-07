app.controller("frontpageCtrl", function ($scope, _, RestService, common, $window) {
    RestService.getUserAssignments()
            .then(function (res) {
                var completedAssignments = _.filter(res, {'creator_ready': true, 'compensation_ready': true}).slice(0, 5);
                $scope.completed_assignments = common.formatAssignmentDates(completedAssignments);

                var incompleteAssignments = _.filter(res, function (o) {
                    return !o.creator_ready || !o.compensation_ready;
                }).slice(0, 5);
                $scope.incomplete_assignments = common.formatAssignmentDates(incompleteAssignments);
            })
            .catch(function (err) {
                alert('Failed to get assignments!'); // TODO: lisää kunnon virheenhallinta
            });

        $scope.activeAssignment = {}; // will be used in the view to hold the data of currently active assignment

        $scope.changeActiveAssignment = function (index) {
            // simple function to attach the data of the assignment clicked on to 
            // the active assignment object
            $scope.activeAssignment = index;
        };
});
