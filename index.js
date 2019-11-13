'use strict'

/**
 * Module dependencies.
 */

const faker = require('faker')
const cloneDeep = require('lodash.clonedeep')

/**
 * Helper functions.
 */

const isType = (value, type) => typeof value === type
const isObject = value => isType(value, 'object')
const generateArrayOfLength = length => [...Array(length)]
const isObjectKey = (key, object) => Object.keys(object).includes(key)