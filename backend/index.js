var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var debug = require('debug')('backend');
var router = express();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride());

router.use(require('./metadata'));

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