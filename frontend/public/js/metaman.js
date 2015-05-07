var metamanApp = angular.module('metamanApp', [
  'ngRoute'
]);

metamanApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/partials/main.html',
        controller: 'metamanMainController'
      }).
      when('/about', {
        templateUrl: '/partials/about.html',
        controller: 'metamanAboutController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);


metamanApp.controller('metamanMainController', [
    function() {
        console.log('main controller initialising');
    }
    ]);

metamanApp.controller('metamanAboutController', [
    function() {
        console.log('about controller initialising');
    }
    ]);

// Copyright 2015 Giles Dring

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
