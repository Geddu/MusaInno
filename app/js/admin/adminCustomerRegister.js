app.controller("adminCustomerRegisterCtrl", function ($scope, $rootScope, RestService, common, $window) {
	RestService.getUsersAdmin()
	.then(function (users) {
		$scope.userReg = users
		$scope.count = users.length
	})

	$scope.itemsByPage = 10

	function formatDate(eventDate) {
        var date = new Date(eventDate);
        return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
    }

	$scope.getUserInfo = function (id) {
		$scope.paychecks_paid = []
		$scope.paychecks_not_paid = []

		RestService.getUserAdmin(id)
		.then(function(user){
			$scope.adminUser = user.user

			for (var i = 0; i < $scope.adminUser.assignments.length; i++) {
                $scope.adminUser.assignments[i].event_date_format = formatDate($scope.adminUser.assignments[i].event_date);
            }

            for (var i = 0; i < $scope.adminUser.paychecks.length; i++) {
                $scope.adminUser.paychecks[i].paid_date_format = formatDate($scope.adminUser.paychecks[i].paid_date);
                $scope.adminUser.paychecks[i].assignment.event_date_format = formatDate($scope.adminUser.paychecks[i].assignment.event_date);

                if($scope.adminUser.paychecks[i].paid == 1)
					$scope.paychecks_paid.push($scope.adminUser.paychecks[i])
				else
					$scope.paychecks_not_paid.push($scope.adminUser.paychecks[i])
            }
		})
	}

	$scope.editUser = function (user) {
		RestService.editUserAdmin(user, user.id)
		.then(function(res){
			if(res.response == "success")
				$('#edit-btn').addClass('btn-success').text('Päivitys onnistui!');
			else 
				$('#edit-btn').addClass('btn-danger').text('Päivitys epäonnistui!');

			setTimeout(function(){
				$('#edit-btn').removeClass('btn-success').removeClass('btn-danger').text('Päivitä tiedot')
			},2000)
		})
	}

	$scope.getters = {
		event_date: function(row) {
			return new Date(row.event_date);
		},
		assignment_event_date: function(row) {
			return new Date(row.assignment.event_date);
		},
		paid_date: function(row) {
			return new Date(row.paid_date);
		}
	}

	$scope.reportFields = {
		last_name: 'Sukunimi',
		first_name: 'Etunimi',
		bank_account_nbr: 'Tilinumero',
		pay_reference: 'Maksuviite',
		email: 'Sähköposti',
		phone_number: 'Puhelinnumero',
		address: 'Osoite',
		zip_code: 'Postinro',
		city: 'Kaupunki'
	}

})	