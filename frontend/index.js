var express = require('express');
var path = require('path');
var nunjucks = require('nunjucks');
var router = express();

nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: router
});

var map_lib = function(to, dir) {
    to.use('/vendor', express.static(path.join(__dirname, 'node_modules', dir)));
};

router.use(express.static(path.join(__dirname, 'public')));
map_lib(router, 'angular');
map_lib(router, 'angular-route');
map_lib(router, 'angular-resource');
map_lib(router, 'angular-strap/dist');
map_lib(router, 'bootstrap/dist');

router.route('/').
    get(function(req, res) {
        res.render('metaman.html');
    });

module.exports = router;

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
