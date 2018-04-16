'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Active rents Schema
 */
var ActiveRentSchema = new Schema({
  rent: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'Active rent has no purpose without rent'
  }
});

mongoose.model('ActiveRent', ActiveRentSchema);
