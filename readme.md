# jaymock

> Minimal fake JSON test data generator.

## Install

```
~ ❯❯❯ npm install @unmock/jaymock
```

## Usage

```js
const jaymock = require('@unmock/jaymock')

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
const jaymock = require('@unmock/jaymock')
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

### .extend(name, body)

Adds a custom data generation function that can be called in the `.populate` `template` using the value of `name`.

#### name

Type: `string`

#### body

Type: `function`

### .extend(functions)

Adds custom data generation functions that can be called in the `.populate` `template` using the value of each object ke.

#### functions

Type: `object`

Each object `key` should be the relevant function's name and `value` the function's body (e.g. `{ 'chance', new require('chance')() }`).

### .setFakerLocale(locale)

Sets [`Faker.js`'s language locale](https://github.com/Marak/Faker.js/#localization).

#### locale

Type: `string`

Any of [`Faker.js`'s locale options](https://github.com/Marak/Faker.js/#localization).

### .setFakerSeed(seed)

Sets [`Faker.js`'s randomness seed](https://github.com/Marak/Faker.js/#setting-a-randomness-seed).

#### seed

Type: `number`

## Contributing

Thanks for wanting to contribute! We will soon have a contributing page
detailing how to contribute. Meanwhile, feel free to star this repository, open issues,
and ask for more features and support.

Please note that this project is governed by the [Unmock Community Code of Conduct](https://github.com/unmock/code-of-conduct). By participating in this project, you agree to abide by its terms.

## License

MIT © [Meeshkan](http://meeshkan.com/)