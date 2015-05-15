var metamanApp = angular.module('metamanApp', [
  'ngRoute', 'ngResource', 'mgcrea.ngStrap'
]);

metamanApp.factory( 'Resource', [ '$log', '$resource', function( $log, $resource ) {
  return function( url, params, methods ) {
    var defaults = {
      update: { method: 'put', isArray: false },
      create: { method: 'post' }
    };

    methods = angular.extend( defaults, methods );

    var resource = $resource( url, params, methods );

    resource.prototype.$save = function() {
      if ( !this._id ) {
        return this.$create();
      }
      else {
        return this.$update();
      }
    };

    return resource;
  };
}]);

metamanApp.factory('DataSets', function(Resource) {
  return new Resource('/api/v1/DataSets/:id', { id: '@_id'});
});

metamanApp.service('metamanDataset', ['DataSets',
  function(DataSets) {
    var currentDataset;

    var newDataSet = function(name) {
      currentDataset = DataSets.create({'name': name});
      return currentDataset;
    };

    var selectDataSet = function(id) {
      currentDataset = DataSets.get({ id: id });
    };

    var addRecord = function(name) {
      currentDataset.records.push({"name": name});
      return currentDataset.records.length;
    };

    var saveRecord = function(name) {
      currentDataset.$save();
    };

    return {
      list: function() { return DataSets.query(); },
      current: function() { return currentDataset; },
      create: newDataSet,
      save: saveRecord,
      select: selectDataSet,
      addRecord: addRecord
    };
  }
]);

metamanApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/partials/main.html',
        controller: 'metamanMainController as ctrl'
      }).
      when('/dataset/:id', {
        templateUrl: '/partials/dataset.html',
        controller: 'metamanDatasetController as ctrl'
      }).
      when('/about', {
        templateUrl: '/partials/about.html',
        controller: 'metamanAboutController as ctrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);


metamanApp.controller('metamanMainController', ['$log', '$location', 'metamanDataset',
  function( $log, $location, metamanDataset ) {
    $log.info('main controller initialising');
    var self = this;
    self.datasetList = metamanDataset.list();
    self.datasetName = "";
    self.createDataSet = function(name) {
      metamanDataset.create(name)
        .$promise.then(function (data, err) {
          if (err) {
            $log.error(err);
          } else {
            self.datasetList = metamanDataset.list();
            $location.url('/dataset/'+data._id);
          }
        });
      };
  }
  ]);

metamanApp.controller('metamanDatasetController', [ '$routeParams', 'metamanDataset',
  function($routeParams, metamanDataset) {
    console.log('dataset controller initialising');
    var self = this;
    metamanDataset.select($routeParams.id);
    self.fields = ['name'];
    self.dataset = metamanDataset.current;
    self.addRecord = function() {
      self.selectedRecord = metamanDataset.addRecord() - 1;
    };
    self.save = metamanDataset.save;
    self.selectedRecord = -1;
  }]);

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
