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
 * Car Schema
 */
var CarSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Name cannot be blank']
  },
  image: {
    type: String,
    default: ''
  },
  dateManufactured: {
    type: Date,
    required: [true, 'Manufacturing date must be entered']
  },
  maxPassengers: {
    type: Number,
    min: 1,
    max: 50,
    default: 5
  },
  maxSpeed: {
    type: Number,
    min: 1,
    max: 400,
    default: 180
  },
  tariffGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TariffGroup',
    required: [true, 'Tariff group must be entered']
  },
  status: {
    type: String,
    enum: ['in service', 'retired', 'being serviced'],
    default: 'in service'
  }
});

mongoose.model('Car', CarSchema);
