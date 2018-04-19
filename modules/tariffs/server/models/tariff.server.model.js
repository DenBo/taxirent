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
 * Tariff Schema
 */
var TariffSchema = new Schema({
  activeAfter: {
    type: Number,
    min: 0,
    required: [true, 'Tariff activation time must be entered']
  },
  price: {
    type: Number
  }
}, {
  toJSON: {
    getters: true,
    setters: true
  }
});

mongoose.model('Tariff', TariffSchema);
