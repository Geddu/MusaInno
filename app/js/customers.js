app.controller("customersCtrl", function ($scope, RestService) {
    RestService.getUsers()
        .then(function (users) {
            $scope.userReg = users;
            $scope.count = users.length;
        });

    $scope.reportFields = {
        last_name: 'Sukunimi',
        first_name: 'Etunimi',
        social_security_nbr: 'sotu',
        bank_account_nbr: 'Tilinumero',
        pay_reference: 'Maksuviite',
        tax_percentage: 'Vero-%',
        email: 'Sähköposti',
        phone_number: 'Puhelinnumero',
        address: 'Osoite',
        zip_code: 'Postinro',
        city: 'Kaupunki'
    };
});
