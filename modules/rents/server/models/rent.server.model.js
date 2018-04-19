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
 * Rent Schema
 */
var RentSchema = new Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'There cannot be a rent without a car']
  },
  dateStarted: {
    type: Date,
    required: [true, 'Rent date must be entered']
  },
  dateEnded: {
    type: Date
  },
  duration: {
    type: Number,
    min: 1,
    required: [true, 'Rent duration must be entered']
  },
  profit: {
    type: Number,
    default: 0
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'There cannot be a rent without a customer']
  }
});

mongoose.model('Rent', RentSchema);
