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
  },
  // car - not strictly necessary but since this is going to be refreshed
  // often it will lower query count
  car: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'Car associated with rent is required'
  }
});

mongoose.model('ActiveRent', ActiveRentSchema);
