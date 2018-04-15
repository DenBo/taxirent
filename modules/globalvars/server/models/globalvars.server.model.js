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
 * Global Var Schema
 */
var GlobalVarSchema = new Schema({
  profit: {
    type: Number,
    default: 0
  }
});

mongoose.model('GlobalVar', GlobalVarSchema);
