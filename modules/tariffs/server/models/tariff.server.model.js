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

// Getter
TariffSchema.path('price').get(function (num) {
  return (num / 100).toFixed(2);
});

// Setter
TariffSchema.path('price').set(function (num) {
  return num * 100;
});

mongoose.model('Tariff', TariffSchema);
