import test from 'ava'
import supervillains from 'supervillains'
import jaymock from '.'

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
	customFunctionAsObject: {
		unicorn: 'foo'
	},
	customNestedFunction: {
		supervillain: 'supervillains.random'
	},
	customArrayFunction: {
		color: 'hexColor|10'
	},
	customNestedArrayFunction: {
		supervillains: 'supervillains.random|5'
	},
	fakerFake: {
		fullName: 'fake({{name.lastName}}, {{name.firstName}} {{name.suffix}})'
	},
	invalidFakerFunction: {
		invalid: 'name.doesnt_exist'
	},
	invalidCustomFunction: {
		invalid: 'doesnt_exist'
	},
	fakerLocale: {
		name: 'name.firstName'
	},
	fakerSeed: {
		number: 'random.number'
	}
}

const ipAddressRegex = /^(?:\d{1,3}\.){3}\d{1,3}$/
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
const randomHexColor = () => '#' + ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6)

test('flat object', t => {
	const data = fixtures.flat
	const expectedKeys = Object.keys(data)
	const obj = jaymock().populate(data)
	const actualKeys = Object.keys(obj)
	t.deepEqual(expectedKeys, actualKeys)
	actualKeys.forEach(key => {
		t.true(obj[key] !== undefined && obj[key].length > 0)
	})
})

test('nested object', t => {
	const data = fixtures.nested
	const expectedKeys = Object.keys(data)
	const obj = jaymock().populate(data)
	const actualKeys = Object.keys(data)
	t.deepEqual(expectedKeys, actualKeys)
	actualKeys.forEach(key => {
		t.true(obj[key] !== undefined && (obj[key].length > 0 || typeof obj[key] === 'object'))
	})
})

test('repeat mother object', t => {
	const data = fixtures.repeat
	const expectedKeys = Object.keys(data).filter(x => x !== '_repeat')
	const objects = jaymock().populate(data)
	objects.forEach(obj => {
		const actualKeys = Object.keys(obj)
		t.deepEqual(expectedKeys, actualKeys)
		actualKeys.forEach(key => {
			t.true(obj[key] !== undefined && obj[key].length > 0)
		})
	})
})

test('repeat nested object', t => {
	const data = fixtures.repeatNested
	const obj = jaymock().populate(data)
	Object.keys(obj).forEach(key => {
		const value = obj[key]
		t.true(value !== undefined && value.length > 0)
		if (key === 'ipAddress') {
			t.true(Array.isArray(value))
			value.forEach(innerObj => {
				const expectedKeys = Object.keys(data.ipAddress).filter(x => x !== '_repeat')
				const actualKeys = Object.keys(innerObj)
				t.deepEqual(expectedKeys, actualKeys)
				actualKeys.forEach(innerKey => {
					t.true(innerObj[innerKey] !== undefined && innerObj[innerKey].length > 0)
				})
			})
		}
	})
})

test('{faker function}|{desired array length}', t => {
	const data = fixtures.arrayFunction
	const expectedKeys = Object.keys(data)
	const obj = jaymock().populate(data)
	const actualKeys = Object.keys(obj)
	t.deepEqual(expectedKeys, actualKeys)
	const actualArray = obj.ipAddress
	t.true(Array.isArray(actualArray) && actualArray.length === parseInt(data.ipAddress.split('|')[1], 10))
	actualArray.forEach(value => t.regex(value, ipAddressRegex))
})

test('custom data generation function', t => {
	const data = fixtures.customFunction
	const expectedKeys = Object.keys(data)
	const jm = jaymock()
	jm.extend('hexColor', () => randomHexColor())
	const obj = jm.populate(data)
	const actualKeys = Object.keys(obj)
	t.deepEqual(expectedKeys, actualKeys)
	t.regex(obj.color, hexColorRegex)
})

test('custom data generation function passed as object', t => {
	const data = fixtures.customFunctionAsObject
	const jm = jaymock()
	jm.extend({foo: () => 'bar'})
	const obj = jm.populate(data)
	t.is(obj.unicorn, 'bar')
})

test('custom nested, data generation function', t => {
	const data = fixtures.customNestedFunction
	const jm = jaymock()
	jm.extend({supervillains})
	const obj = jm.populate(data)
	t.true(supervillains.all.includes(obj.supervillain))
})

test('{custom function}|{desired array length}', t => {
	const data = fixtures.customArrayFunction
	const expectedKeys = Object.keys(data)
	const jm = jaymock()
	jm.extend('hexColor', () => randomHexColor())
	const obj = jm.populate(data)
	const actualKeys = Object.keys(obj)
	t.deepEqual(expectedKeys, actualKeys)
	const actualArray = obj.color
	t.true(Array.isArray(actualArray) && actualArray.length === parseInt(data.color.split('|')[1], 10))
	actualArray.forEach(value => t.regex(value, hexColorRegex))
})

test('{custom nested function}|{desired array length}', t => {
	const data = fixtures.customNestedArrayFunction
	const jm = jaymock()
	jm.extend({supervillains})
	const obj = jm.populate(data)
	t.true(obj.supervillains.every(element => supervillains.all.includes(element)))
})

test('faker.fake() generation function', t => {
	const data = fixtures.fakerFake
	const expectedKeys = Object.keys(data)
	const obj = jaymock().populate(data)
	const actualKeys = Object.keys(obj)
	t.deepEqual(expectedKeys, actualKeys)
	t.true(obj.fullName.split(' ').length > 1)
})

test('invalid faker function', t => {
	const data = fixtures.invalidFakerFunction
	const error = t.throws(() => {
		jaymock().populate(data)
	}, Error)
	t.is(error.message, `Function ${JSON.stringify(data.invalid)} does not exist`)
})

test('invalid custom function', t => {
	const data = fixtures.invalidCustomFunction
	const error = t.throws(() => {
		jaymock().populate(data)
	}, Error)
	t.is(error.message, `Function ${JSON.stringify(data.invalid)} does not exist`)
})

test('faker locale', t => {
	const data = fixtures.fakerLocale
	const jm = jaymock()
	jm.setFakerLocale('ru')
	const obj = jm.populate(data)
	t.regex(obj[Object.keys(obj)[0]], /[\w\u0430-\u044F]+/)
})

test('faker random seed', t => {
	const data = fixtures.fakerSeed
	const jm = jaymock()
	jm.setFakerSeed(1)
	const obj = jm.populate(data)
	t.is(obj[Object.keys(obj)[0]], 41702)
})
