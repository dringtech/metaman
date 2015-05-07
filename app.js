var express = require('express');
var app = express();

var compression = require('compression');
var morgan = require('morgan');

app.use(compression());
app.use(morgan('dev'));

app.use(require('./backend'));

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

module.exports=app;

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