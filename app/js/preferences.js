app.controller("preferencesCtrl", function ($scope, $rootScope, RestService, common, $window) {

	$scope.editUser = function () {
        // Jos uusi verokortti ladattu
        if($scope.new_tax_card)
             $scope.user.tax_card = $scope.new_tax_card;
         
		RestService.editUser($scope.user, $window.sessionStorage.getItem('userId'))
            .then(function (res) {
            	if(res.response == "success"){
            		$('#userInfoModal').modal('show');
            	}
            })
            .catch(function (err) {
                console.log('virhe!'); // TODO: lisää kunnon virheenhallinta
            });
    };

    $scope.showTaxCardInput = function() {
        $('#file').show();
        $('#fileAddBtn').hide();
    }

    $scope.newTaxCard = function() {
        var f = document.getElementById("file").files[0];   
        if (f) {
            var r = new FileReader();
            r.onload = function(e) {
                $scope.new_tax_card = r.result.split(',')[1];
            }
        }
        r.readAsDataURL(f);
    }

    RestService.getUser()
        .then(function (res) {
            $scope.user = res.user[0];
        });
});
