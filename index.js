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

/**
 * Returns the appropriate fake data 
 * (generated using either Faker.js or custom functions).
 *
 * @param {String} payload
 * @param {Object} customFunctions
 * @returns {String|Number|Object} Fake Data
 * @api private
 */

const fake = (payload, customFunctions) => {
    let numOfValues = null
    let [topic, subtopic] = parsePayload(payload)
    if (subtopic && subtopic.includes('|')) {
        [subtopic, numOfValues] = subtopic.split('|')
        numOfValues = parseInt(numOfValues)
    } else if (!subtopic && topic && topic.includes('|')) {
        [topic, numOfValues] = topic.split('|')
        numOfValues = parseInt(numOfValues)
    }
    if (isObjectKey(topic, customFunctions)) {
        let func = customFunctions[topic]
        if (numOfValues) {
            if (func[subtopic] !== undefined) {
                return generateArrayOfLength(numOfValues).map(_ => func[subtopic]())
            }
            return generateArrayOfLength(numOfValues).map(_ => func())
        }
        if (func[subtopic]) {
            return func[subtopic]()
        }
        return func()
    }
    if ((faker[topic] === undefined || faker[topic][subtopic] === undefined) && !subtopic.includes('.') && !subtopic.includes('|')) {
        throw new Error(`Faker function ${JSON.stringify(topic + '.' + subtopic)} does not exist`)
    }
    if (numOfValues) {
        return generateArrayOfLength(numOfValues).map(_ => generateFakerData(topic, subtopic))
    }
    return generateFakerData(topic, subtopic)
}