app.controller("addAssignmentCtrl", function ($scope, $state, RestService, $window, $http, CalculatorService) {
	$scope.myFile = null;
	$scope.tiedosto = [];
	$scope.hideExpensesForm = true;
	$scope.laskutettavaSumma = 1000;
	$scope.yhtKulut = true; // Laskutusmalli 'Jako henkilökohtaisen laskutusosuuden mukaan'
	$scope.kulut = true; // yhteenvedon verottomien kulujen piilotus
	$scope.newUser = false;
	$scope.henkiloKulut = [];
	$scope.existingUser = false;
	$scope.temporalExp = [];
	//HUOM! HUOM! kalenteri toimikii $scope.dt määritelmällä. Se on Date olio

	/*$scope.lisaatiedosto = function (file){
	 var file = $scope.myFile;
	 var tiedosto = [];
	 tiedosto.push(file);
 };*/

	/*$scope.$watch("myFile", function(newValue, oldValue){
	 if($scope.myFile.name !== null){
	 $scope.tiedosto.push(newValue);
	 }
 });*/

 RestService.getUser()
 .then(function (user){
	$scope.user = user.user[0];
	$scope.artistit = [];
	$scope.artistit.push($scope.user)
	$scope.henkiloKulut.push(false);
});
 
	//$scope.activePerson = $scope.getCurrentUser();
	$scope.import = function (){
		$(function(){      
			$("#includedContent").load("/app/html/kulut_modal.html");     
			console.log("Moi");
		});   
		return 'import' in document.createElement('link');
	}
	// Kulujen editointiin käytettävä muuttuja
	$scope.chooseArtist = function (index){
		$scope.editArtistiId = index;
		console.log($scope.artistit[index]);
	}
	//Ei vielä talllennetut kulut
	$scope.addExp = function (exp){
		switch(exp) {
		    case 1:
		    	tempExp = {'typeId': 1, 'type': 'Päiväraha', 'startDate': '','endDate': '', 'country': 'Suomi', 'amount': 41}
		        $scope.temporalExp.push(tempExp);
		        break;
		    case 2:
		        tempExp = {'typeId': 2, 'type': 'Kilometrikorvaus', 'route': '','distance': '', 'numberOfPpl': 1, 'amount': 0}
		        $scope.temporalExp.push(tempExp);
		        break;
		          case 3:
		        tempExp = {'typeId': 3, 'type': 'Kulukuitti', 'description': '','file': '', 'amount': 0}
		        $scope.temporalExp.push(tempExp);
		        break;
		    default:
		        break;
		}
	}

	// Kulujen lisäys
	$scope.saveExp = function (exp){
		
	}

	$scope.deleteExp = function(){
		$scope.temporalExp = [];
	}

	$scope.piilota = function () {
		if ($scope.lasktapa == 1) {
			// Verkkolasku
			$scope.laskutustapa = {
				ovt: false,
				vtunnus: false,
				osoite: true,
				sposti: true,
				postinro: true,
				kaupunki: true,
				ytunnus: true
			}
		}
		//Sähköpostilasku
		if ($scope.lasktapa == 2) {
			$scope.laskutustapa = {
				ovt: true,
				vtunnus: true,
				osoite: false,
				sposti: false,
				postinro: false,
				kaupunki: false,
				ytunnus: true
			}
		}

		if ($scope.lasktapa == 3) {
			$scope.laskutustapa = {
				ovt: true,
				vtunnus: true,
				osoite: false,
				sposti: true,
				postinro: false,
				kaupunki: false,
				ytunnus: true
			}
		}

	};

	$scope.laskutustapa = {
		ovt: true,
		vtunnus: true,
		osoite: true,
		sposti: true,
		postinro: true,
		kaupunki: true,
		ytunnus: true
	};

	$scope.getTopics = function () {
		RestService.getTopics()
		.then(function (topics) {
			$scope.topics = topics;
		})
	};
	$scope.getTopics();

	$scope.assignment = {
		billable_info_id: 1,
		statutory_payment: 0,
		created: Math.floor(Date.now() / 1000),
		modified: Math.floor(Date.now() / 1000),

		creator_ready: 0,
		compensation_ready: 0
	};

	$scope.lisaaArtisti = function () {
		RestService.getUserEmail($scope.osallinen)
		.then(function (user) {
			if(user.user==null){
				$scope.newUser = true;
				console.log("VÄÄRIN");
			} else {
				result = $.grep($scope.artistit, function(e){
					return e.email == user.user[0].email;
				});
				if(result == 0){
					$scope.newUser = false;
					$scope.osallinen = "";
					for (var i = $scope.artistit.length - 1; i >= 0; i--) {
						$scope.artistit[i].naytaKulut = true;
					}
					$scope.artistit.push(user.user[0]);
					$scope.artistit[$scope.artistit.length-1].naytaKulut = false;
				} else {
					$scope.newUser = false;
					$scope.existingUser = true;
				}

			}
		});
	};

	$scope.poistaArtisti = function (user) {
		$scope.artistit.splice($scope.artistit.indexOf(user), 1);
	};

	$scope.lisaaKulu = function(index){
		$scope.artistit[index].kulut = [
		{'type': 'Päiväraha', 'amount': 41},
		{'type': 'Kilometrikorvaus', 'amount': 11},
		];
		$scope.henkiloKulut[index] = false;
	}

	$scope.addAssignment = function () {
		$scope.assignment.user_id = $window.sessionStorage.getItem('userId');
		$scope.assignment.comission = $window.sessionStorage.getItem('userId');
		$scope.assignment.invoice_type_id = $scope.lasktapa;
		$scope.assignment.topic_id = $scope.assignment.topic_id.id;
		$scope.assignment.event_date = Math.floor($scope.dt.getTime() / 1000);
		$scope.billable_info.email = $scope.assignment.contact_email;
		RestService.addAssignment($scope.assignment, $scope.billable_info)
		.then(function (res) {
			$state.go("add_assignment", {id: 2});
		})
		.catch(function (err) {
					alert('Failed to add assignment!'); // TODO: lisää kunnon virheenhallinta
				});
	};

	$scope.lisaaTiedosto = function (file, index) {
	};

	$scope.removeFile = function (file) {
		index = $scope.$parent.tiedosto.indexOf(file);
		$scope.$parent.tiedosto.splice(index, 1);
	};

	
	$scope.provisio = function(){
		if($scope.user==undefined){
			return "";
		} else {
			return $scope.user.comission;
		} 
	}

	$scope.piilotaKulut = function () {
		if($scope.kulut){
			$scope.kulut = false;
		} else {
			$scope.kulut = true;
		}
	}

	$scope.piilotaHenkiloKulut = function(index){
		$scope.artistit[index].naytaKulut = !$scope.artistit[index].naytaKulut;
	}

	$scope.emptyProvisionAmount = function(index){
		$('#1').value = "";
	}

	$scope.intToCurrency = function(index){
		parse = artistit[index].yhtHloProvisio;
		artistit[index].yhtHloProvisio = parseFloat(parse.toFixed(2));
	}

	$scope.test = function () {
		console.log("testing");
		console.log($scope.artistit);
	}

//################Kalenteri##################################
	//funktio asettaa kalenterin päivän
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.inlineOptions = {
		customClass: getDayClass,
		minDate: new Date(),
		showWeeks: true
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		//maxDate: new Date(),
		minDate: new Date(2016, 1, 1),
		startingDay: 1
	};

	// Disable weekend selection
	function disabled(data) {
		var date = data.date,
		mode = data.mode;
		return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
	}

	$scope.open2 = function () {
		$scope.popup2.opened = true;
	};

	$scope.setDate = function (year, month, day) {
		$scope.dt = new Date(year, month, day);
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[2];
	$scope.altInputFormats = ['M!/d!/yyyy'];

	$scope.popup2 = {
		opened: false
	};

	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	var afterTomorrow = new Date();
	afterTomorrow.setDate(tomorrow.getDate() + 1);
	$scope.events = [
	{
		date: tomorrow,
		status: 'full'
	},
	{
		date: afterTomorrow,
		status: 'partially'
	}
	];

	function getDayClass(data) {
		var date = data.date,
		mode = data.mode;
		if (mode === 'day') {
			var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

			for (var i = 0; i < $scope.events.length; i++) {
				var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

				if (dayToCheck === currentDay) {
					return $scope.events[i].status;
				}
			}
		}

		return '';
	}

	$http.get('/app/json/toolTips.json').success(function (data) {
		$scope.tips = data[0];
	});

//##################################################

// CalculatorServicen testaus testaus 
$scope.brutto1 = function(osuus) {
   $scope.testi = CalculatorService.brutto1(
	1000, 0.045, 0, osuus);
   return $scope.testi;
}
});

app.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		scope: {
			index: '=',
			tiedosto: '=',
			addfile: '&'
		},
		link: function (scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function () {
				scope.$apply(function () {
					modelSetter(scope, element[0].files[0]);
				});
			});

			scope.$watch("myFile", function (newValue, oldValue) {
				if (scope.myFile != null) {
					scope.tiedosto.push(newValue);
					scope.addfile({myFile: scope.myFile}, {index: scope.index});
				}
			});
		}
	};
}]);

app.directive("mydatepicker", function () {
	return {
		restrict: "E",
		scope: {
			ngModel: "=",
			dateOptions: "=",
			opened: "="
		},
		link: function ($scope, element, attrs) {
			$scope.open = function (event) {
				event.preventDefault();
				event.stopPropagation();
				$scope.opened = true;
			};

			$scope.clear = function () {
				$scope.ngModel = null;
			};
		},
		templateUrl: '/app/html/datepicker.html'
	}
});
