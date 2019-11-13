import test from 'ava'
const jaymock = require('./index')

const fixtures = {
    flat: {
        firstName: 'name.firstName',
        lastName: 'name.lastName'
    },
    nested: {
        addresses: {
            homeAddress: {
                streetAddress: 'address.streetAddress',
                city: 'address.city',
                zipCode: 'address.zipCode'
            },
            workAddress: {
                streetAddress: 'address.streetAddress',
                city: 'address.city',
                zipCode: 'address.zipCode'            
            }
        }
    },
    repeat: {
        firstName: 'name.firstName',
        lastName: 'name.lastName',
        _repeat: 5
    },
    repeatNested: {
        firstName: 'name.firstName',
        lastName: 'name.lastName',
        ipAddress: {
            ipv4: 'internet.ip',
            ipv6: 'internet.ipv6',
            _repeat: 3
        }
    },
    arrayFunction: {
        ipAddress: 'internet.ip|5'
    },
    customFunction: {
        color: 'hexColor'
    },
    customArrayFunction: {
        color: 'hexColor|10'
    },
    fakerFake: {
        fullName: 'fake({{name.lastName}}, {{name.firstName}} {{name.suffix}})'
    },
    invalidFakerFunction: {
        invalid: 'name.doesnt_exist'
    },
    fakerLocale: {
        name: 'name.firstName'
    },
    fakerSeed: {
        number: 'random.number'
    }
}

test('flat object', t => {
    const data = fixtures.flat
    const expectedKeys = Object.keys(data)
    const obj = jaymock().populate(data)
    const actualKeys = Object.keys(obj)
    t.deepEqual(expectedKeys, actualKeys)
    actualKeys.forEach(key => {
        t.true(obj[key] != undefined && obj[key].length > 0)
    })
})

test('nested object', t => {
    const data = fixtures.flat
    const expectedKeys = Object.keys(data)
    const obj = jaymock().populate(data)
    const actualKeys = Object.keys(data)
    t.deepEqual(expectedKeys, actualKeys)
    actualKeys.forEach(key => {
        t.true(obj[key] != undefined && (obj[key].length > 0 || typeof obj[key] === 'object'))
    })
})

test('repeat mother object', t => {
    const data = fixtures.repeat
    const expectedKeys = Object.keys(data).filter(x => x != '_repeat')
    const objects = jaymock().populate(data)
    objects.forEach(obj => {
        const actualKeys = Object.keys(obj)
        t.deepEqual(expectedKeys, actualKeys)
        actualKeys.forEach(key => {
            t.true(obj[key] != undefined && obj[key].length > 0)
        })
    })
})

test('repeat nested object', t => {
    const data = fixtures.repeatNested
    const obj = jaymock().populate(data)
    Object.keys(obj).forEach(key => {
        const value = obj[key]
        t.true(value != undefined && value.length > 0)
        if (key === 'ipAddress') {
            t.true(Array.isArray(value))
            value.forEach(innerObj => {
                const expectedKeys = Object.keys(data.ipAddress).filter(x => x != '_repeat')
                const actualKeys = Object.keys(innerObj)
                t.deepEqual(expectedKeys, actualKeys)
                actualKeys.forEach(innerKey => {
                    t.true(innerObj[innerKey] != undefined && innerObj[innerKey].length > 0)
                })
            })
        }
    })
})

const ipAddressRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
test('{faker function}|{desired array length}', t => {
    const data = fixtures.arrayFunction
    const expectedKeys = Object.keys(data)
    const obj = jaymock().populate(data)
    const actualKeys = Object.keys(obj)
    t.deepEqual(expectedKeys, actualKeys)
    const actualArray = obj['ipAddress']
    t.true(Array.isArray(actualArray) && actualArray.length === parseInt(data.ipAddress.split('|')[1]))
    actualArray.forEach(value => t.true(ipAddressRegex.test(value)))
})

const randomHexColor = () => '#' + ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6)
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
test('custom data generation function', t => {
    const data = fixtures.customFunction
    const expectedKeys = Object.keys(data)
    const jm = jaymock()
    jm.extend('hexColor', () => randomHexColor())
    const obj = jm.populate(data)
    const actualKeys = Object.keys(obj)
    t.deepEqual(expectedKeys, actualKeys)
    t.true(hexColorRegex.test(obj.color))
})

test('{custom function}|{desired array length}', t => {
    const data = fixtures.customArrayFunction
    const expectedKeys = Object.keys(data)
    const jm = jaymock()
    jm.extend('hexColor', () => randomHexColor())
    const obj = jm.populate(data)
    const actualKeys = Object.keys(obj)
    t.deepEqual(expectedKeys, actualKeys)
    const actualArray = obj['color']
    t.true(Array.isArray(actualArray) && actualArray.length === parseInt(data.color.split('|')[1]))
    actualArray.forEach(value => t.true(hexColorRegex.test(value)))
})

test('faker.fake() generation function', t => {
    const data = fixtures.fakerFake
    const expectedKeys = Object.keys(data)
    const obj = jaymock().populate(data)
    const actualKeys = Object.keys(obj)
    t.deepEqual(expectedKeys, actualKeys)
    t.true(obj.fullName.split(' ').length > 1)
})