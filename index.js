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

/**
 * Returns Faker.js generated data.
 *
 * @param {String} topic
 * @param {String} subtopic
 * @returns {String|Number|Object} Fake Data
 * @api private
 */

const generateFakerData = (topic, subtopic) => {
    if (topic === 'fake') {
        return faker[topic](subtopic.slice(1, -1))
    }
    return faker[topic][subtopic]()
}

/**
 * Parses function payload to the appropriate topic and subtopic.
 *
 * @param {String} payload
 * @returns {Array} [Topic, Subtopic]
 * @api private
 */

const parsePayload = payload => {
    let topic, subtopic
    if (/^fake/.test(payload)) {
        topic = 'fake'
        subtopic = payload.split(topic)[1]
    } else {
        [topic, subtopic] = payload.split(/\.(.+)/)
    }
    return [topic, subtopic]
}