var metamanValues = angular.module('metamanValues', [])
  .value('emptyDataset',
    function(name) {
      return {
        'name': name,
        createdOn: new Date(),
        structuredRecords: [],
        unstructuredRecords: []
      };
    })
  .value('emptyStructuredRecord', 
    function() {
      return {
        name: null,
        owner: null,
        createdOn: new Date(),
        technology: null,
        fields: []
      };
    })
  .value('emptyUnstructuredRecord', 
    function() {
      return {
        name: null,
        owner: null,
        createdOn: new Date(),
        format: null,
        fields: []
      };
    })
  .value('emptyField', 
    function() {
      return {
        name: null,
        externalName: null,
        description: null,
        type: 'null',
        category: false,
        include: false,
        personal: false,
        sensitive: false
      };
    });

var metamanApp = angular.module('metamanApp', [
  'metamanValues',
  'ngRoute', 'ngResource', 'mgcrea.ngStrap'
]);

metamanApp.value('fieldTypes',
  [
    {value: 'null', label: 'Null'},
    {value: 'boolean', label: 'True / False'},
    {value: 'integer', label: 'Integer'},
    {value: 'number', label: 'Number'},
    {value: 'string', label: 'String'},
    {value: 'array', label: 'Array'},
    {value: 'object', label: 'Object'}
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

metamanApp.directive('metamanRecord', ['emptyField',
  function(emptyField) {
    return {
      scope: { record:'=metamanRecord' },
      bindToController: true,
      controllerAs: 'recordCtrl',
      controller: ['$element', '$attrs',
        function($element, $attrs) {
          var self = this;
          self.addField = function() { self.record.fields.push(emptyField()); };
        }
      ],
      templateUrl: '/partials/record.html'
    };
}]);

metamanApp.directive('metamanField', ['fieldTypes',
  function(fieldTypes) {
    return {
      scope: { field:'=metamanField', open:'=fieldOpenedState' },
      bindToController: true,
      controllerAs: 'fieldCtrl',
      controller: ['fieldTypes', function (fieldTypes) {
        var self = this;
        self.fieldTypes = fieldTypes;
      }],
      templateUrl: '/partials/field.html'
    };
}]);

metamanApp.factory('DataSets', function(Resource) {
  return new Resource('/api/v1/DataSets/:id', { id: '@_id'});
});

metamanApp.service('metamanDataset', ['DataSets', 'emptyDataset', 'emptyStructuredRecord',
  function(DataSets, emptyDataset, emptyStructuredRecord) {
    var currentDataset;

    var newDataSet = function(name) {
      currentDataset = DataSets.create(emptyDataset(name));
      return currentDataset;
    };

    var selectDataSet = function(id) {
      currentDataset = DataSets.get({ id: id });
    };

    var addStructuredRecord = function() {
      currentDataset.structuredRecords.push(emptyStructuredRecord());
      return currentDataset.structuredRecords.length;
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
      addStructuredRecord: addStructuredRecord
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

metamanApp.controller('metamanDatasetController', [ '$routeParams', 'metamanDataset', 'emptyUnstructuredRecord',
  function($routeParams, metamanDataset, emptyUnstructuredRecord) {
    console.log('dataset controller initialising');
    var self = this;
    metamanDataset.select($routeParams.id);
    self.fields = ['name'];
    self.dataset = metamanDataset.current;
    self.addUnstructuredRecord = function() {
      var unstructuredRecords = self.dataset().unstructuredRecords;
      unstructuredRecords.push(emptyUnstructuredRecord());
      self.selectedUnstructuredRecord = unstructuredRecords.length - 1;
    };
    self.addStructuredRecord = function() {
      self.selectedRecord = metamanDataset.addStructuredRecord() - 1;
    };
    self.save = metamanDataset.save;
    self.selectedRecord = -1;
    self.selectedUnstructuredRecord = -1;
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
