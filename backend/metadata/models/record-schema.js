var mongoose = require('mongoose');
var fieldSchema = require('./field-schema');
var util = require('util');

var BaseRecordSchema = function() {
    mongoose.Schema.apply(this, arguments);
    this.add(
    {
        name: {type: String, required: true},
        owner: {type: String},
        createdOn: {type: Date, default: Date.now}
    }
    );
};
util.inherits(BaseRecordSchema, mongoose.Schema);

exports.UnstructuredRecordSchema = new BaseRecordSchema(
    {
        format: {type: String},
        exemplar: {type: Buffer}
    }
);

exports.StructuredRecordSchema = new BaseRecordSchema(
    {
        technology: {type: String},
        fields: [fieldSchema]
    }
);

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
