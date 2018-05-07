app.controller("loginCtrl", function ($scope, $rootScope, $window, RestService, $state) {

    RestService.getBanks()
            .then(function (res) {
                $scope.banks = res;
            });

    $scope.showBanks = false;
    $scope.form = {};

    $scope.changeView = function () {
        $scope.showBanks = !$scope.showBanks;
    };

    $scope.login = function () {
        RestService.login($scope.credentials)
                .then(function (res) {
                    $window.sessionStorage.setItem('userId', res.user.id);
                    $window.sessionStorage.setItem('userComission', res.user.comission);
                    $window.sessionStorage.setItem('userRole', res.user.role);
                    $window.sessionStorage.setItem('sessionToken', res.token);
                    $state.go('frontpage');
                })
                .catch(function (err) {
                    alert('Invalid login!'); // TODO: lisää kunnon virheenhallinta
                });
    };

    // Tässä esimerkkitoteutus, jossa haetaan backendistä tarvittavat tiedot ja lähetetään ne onnistuu.fi:lle
    // HUOM onnistuu.fi EI tue REST-kutsuja - pitää lähettää "perinteisesti"

    redirect = function () {
        $window.location = "https://www.onnistuu.fi/external/entry";
    };

    $scope.serviceRedirect = function (bankValue) {
        RestService.register({auth_service: bankValue, ssn: $scope.form.sotu})
                .then(function (res) {
                    var $form = $(document.createElement('form')).css({display: 'none'}).attr("method", "POST").attr("action", "https://www.onnistuu.fi/external/entry").attr("onsubmit", "return redirect()");
                    var $input = $(document.createElement('input')).attr('name', 'customer').val(res.customer);
                    var $input2 = $(document.createElement('input')).attr('name', 'return_failure').val(res.return_failure);
                    var $input3 = $(document.createElement('input')).attr('name', 'data').val(res.data);
                    var $input4 = $(document.createElement('input')).attr('name', 'iv').val(res.iv);
                    var $input5 = $(document.createElement('input')).attr('name', 'return_after_failure').val(res.return_after_failure);
                    var $input6 = $(document.createElement('input')).attr('name', 'auth_service').val(res.auth_service);
                    $form.append($input).append($input2).append($input3).append($input4).append($input5).append($input6);
                    $("body").append($form);
                    $form.submit();
                })
    };

});
