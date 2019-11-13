# jaymock

> Minimal fake JSON test data generator.

[![Install Size](https://packagephobia.now.sh/badge?p=@unmock/jaymock)](https://packagephobia.now.sh/result?p=@unmock/jaymock)

## Install

```
~ ❯❯❯ npm install jaymock
```

## Usage

```js
const jaymock = require('jaymock')

const data = {
  firstName: 'name.firstName',
  lastName: 'name.lastName',
  ssn: 'ssn',
  address: {
    streetAddress: 'address.streetAddress',
    city: 'address.city',
    zipCode: 'address.zipCode'
  },
  emails: 'internet.email',
  ipAddress: 'internet.ip',
  _repeat: 2
}

const jm = jaymock()

const randExp = require('randexp').randexp
jm.extend('ssn', () => randExp(/^\d{3}-\d{2}-\d{4}$/)) // Add custom functions using `jaymock.extend`

const fakeData = jm.populate(data)
/*
  [
    {
      firstName: 'Marguerite',
      lastName: 'Will',
      ssn: '076-86-6001',
      address: {
        streetAddress: '4509 Abernathy Port',
        city: 'Port Charles',
        zipCode: '26322'
      },
      emails: 'Missouri64@yahoo.com',
      ipAddress: '44.210.55.248'
    },
    {
      firstName: 'Fredrick',
      lastName: 'McClure',
      ssn: '610-42-4980',
      address: {
        streetAddress: '56363 Goyette Station',
        city: 'West Floydmouth',
        zipCode: '73634-6751'
      },
      emails: 'Aurore58@hotmail.com',
      ipAddress: '237.7.221.162'
    }
  ]
*/
```

### Mock API using [express](https://github.com/expressjs/express)

```js
const jaymock = require('jaymock')
const express = require('express')

app = express()
app.use(express.json())

const jm = jaymock()
jm.extend('chance', new require('chance')())

app.post('/', (req, res) => res.json(jm.populate(req.body)))

app.listen(3000)
```

## API

### .populate(template)

Returns an `object`, populated with fake data.

#### template

Type: `object`

Each object's value can be one of [`Faker.js`'s API methods](https://github.com/marak/Faker.js/#api-methods), in the format `'{topic}.{subtopic}'` (e.g. `'name.firstName'`) or a custom method, defined using the `.extend` function, in the format `'{function_name}'` (e.g. `'chance.ssn'` will call `chance.ssn()`).

A fake value can be generated `n` times, into an array of `n` values, by including `|n` at the end of the individual object's method name (e.g. `'name.firstName|5'` will generate an array, populated with `5` fake first names). This also works with custom functions, accordingly.

To use the [`faker.fake()`](https://github.com/marak/Faker.js/#fakerfake) method (which permits the combination of faker API methods), use the format `'fake({mustache_strings})'` (e.g. `'fake({{name.lastName}}, {{name.firstName}} {{name.suffix}})'`).