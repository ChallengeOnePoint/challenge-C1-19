	// create the module and name it scotchApp
	var scotchApp = angular.module('scotchApp', ['ngRoute']);
  var as;


  scotchApp.run(function ($rootScope) {
        $rootScope.ar = "I am root!";
    });
	// configure our routes
	scotchApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'mainController'
			})
	});

	// create the controller and inject Angular's $scope
	scotchApp.controller('mainController', function($scope,$http,$rootScope,$window) {
		var contacta;
		var contactlist;
		$scope.import = function(import){
			$http.get('/import', {headers: {'url':import }})
			.then(
				function(data){
					$scope.contactlist = data.contactlist;
				});
		};

	});

	scotchApp.controller('aboutController', function($scope,$http,$rootScope,$window) {

		if (window.crypto && !window.crypto.subtle && window.crypto.webkitSubtle) {
		    window.crypto.subtle = window.crypto.webkitSubtle;
		}
		if(	!(localStorage.getItem('key')!="undefined" && 	localStorage.getItem('token')!="undefined" && localStorage.getItem('key')!=null && 	localStorage.getItem('token')!=null)){
			$window.location.href = '#/';
		}
		$scope.message = 'Look! I am an about page.';
		var aesgcm = cryptogcm;
		$scope.auth = function (data){
			var aesgcm = cryptogcm;
			req = {'email': localStorage.getItem('email'), 'iv': data.iv, 'data': data.data};
			console.log(req);
			console.log(data);
			$http.post('/Token',  {},{ headers : {'data' : JSON.stringify(req)}})
			.then(
				function(data){
					console.log(data.data.data);
					console.log($scope.key);
					console.log($scope.iv);
					aesgcm.decrypt(data.data.data,$scope.key,$scope.iv).then(function(decrypted){
						decrypted.data = JSON.parse(window.atob(decrypted.data));
						console.log(decrypted.data);
						//$scope.key = decrypted.data.key;
						//localStorage.setItem('key', decrypted.data.key);
						if(decrypted.data.status)
							$window.location.href = '#inbox';
					});
				}
			, function(data){
				localStorage.setItem('key', "undefined");
				localStorage.setItem('token', "undefined");
				$window.location.href = '#/';
					console.log(data);
				}
			);
		}

		$scope.authpost=function(){
			$scope.key =  localStorage.getItem('key');
			$scope.iv = aesgcm.bufferToBase64(window.crypto.getRandomValues(new Uint8Array(12)));
			data = {
				pad : aesgcm.bufferToBase64(window.crypto.getRandomValues(new Uint8Array(12))),
				token: localStorage.getItem('token'),
				endpad : aesgcm.bufferToBase64(window.crypto.getRandomValues(new Uint8Array(12)))
			};
			data = JSON.stringify(data);
			aesgcm.encrypt(window.btoa(data),$scope.key,$scope.iv).then(function(encrypted){
				$scope.auth(encrypted);
			})
		}

		$scope.log=function(){
		  console.log("auth");
		}
	});
