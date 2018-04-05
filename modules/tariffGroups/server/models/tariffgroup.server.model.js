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
 * Tariff Group Schema
 */
var TariffGroupSchema = new Schema({
  tariffs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Tariff',
    required: [true, 'Tariff group must include at least one tariff'],
    validate: [arrayLimit, 'Tariff group must include at least one tariff']
  },
  class: {
    type: Number,
    required: [true, 'Tariff class must be entered'],
    min: 1
  }
});

mongoose.model('TariffGroup', TariffGroupSchema);

function arrayLimit(val) {
  return val.length >= 1;
}
